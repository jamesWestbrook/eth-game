'use strict';

class GreasyGame {

    play() {
        this.svg['board'] = d3.select('#board').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', '' + -1*this.hexRadius + ' ' + this.hexHeight + ' ' + this.width + ' ' + this.height);

        this.svg['hud'] = d3.select('#hud').append('svg')
            .attr('width', this.hexRadius*4)
            .attr('height', this.height);

        //build out all the hex coordinates
        this.hexes = {};
        var currentCenter = [0,0];

        for(var i=0; i<this.columns; i++) {

            for(var j=0; j<this.rows; j++) {

                var hex = {};

                hex.id = 'x' + i + 'y' + j;
                hex.cc = {
                    x: i,
                    z: j - (i - (i&1)) / 2,
                    y: -i - (j - (i - (i&1)) / 2)
                };


                //set hidden to false
                hex.hidden = false;

                //set the centers
                this._setCenter(hex, this.hexes.length, currentCenter);

                //set the corners
                this._setCorners(hex);

                this._setEdgeCenters(hex);

                //set new center
                currentCenter = Object.assign({}, hex.center);

                //store the hex
                this.hexes[hex.id] = hex;
            }

            this._adjustCenter(i, currentCenter);
        }

        //hide the hexes once they have been created
        this.hideHexes(options.hiddenHexes);

        //draw the map
        this._buildGame(options);

        //draw the hud
        this._buildHud(options);

        this.groupHexesByCubicCoords(this.hexes);
        //console.log(this.hexGroups);
    }

    constructor(options) {

        //object to keep track of all of the svg pieces for ease of access
        this.svg = {};

        this.tiles = ['978','974','973','968','964','963','928','924','923','578','574','573','568','564','563','528','524','523','178','174','173','168','164','163','128','124','123'];
        this.activeTile = undefined;
        this.hudtileId = 'hudtile';
        this.hexGroups = { Xs : {}, Ys : {}, Zs : {} };

        this.columns = options.columns;
        this.rows = options.rows;
        this.width = options.width;
        this.hexRadius = (this.width/(this.columns - 1))/2;
        this.hexHeight = (this.hexRadius*Math.sqrt(3))/2;
        this.height = this.hexHeight*2*this.rows + this.hexHeight;

        this.score = 0;
    }

    hideHexes(array) {
        for(var i = 0; i < array.length; ++i) {
            this.hexes[array[i]].hidden = true;
        }
    }

    groupHexesByCubicCoords(hexes) {
        for(var hexKey in hexes) {

            var hex = hexes[hexKey];

            if(!hex.hidden) {

                if(hex.cc !== undefined) {
                    this.addToHexGroup(this.hexGroups.Xs, hex.cc.x, hex);
                    this.addToHexGroup(this.hexGroups.Ys, hex.cc.y, hex);
                    this.addToHexGroup(this.hexGroups.Zs, hex.cc.z, hex);
                } else {
                    console.error('hex missing cubic coordinates - cannot group: ', hex);
                }
            }
        }
    }

    chooseRandomTile() {
        this.activeTile = this.tiles[Math.floor((Math.random() * this.tiles.length))];
    }

    drawLines(hex) {

        var svg;

        //if the hud hex draw on hud
        if(hex.id === this.hudtileId) {
            this.svg.hud.hudtile['lines'] = this.svg.hud.append('g').attr('class', 'lines');
            svg = this.svg.hud.hudtile.lines;
        } else {
            this.svg.hexes[hex.id]['lines'] = this.svg.board.append('g').attr('class', 'lines');
            svg = this.svg.hexes[hex.id].lines;
        }


        var tile = this.activeTile.split('');
        for(var axis in tile) {

            if(hex.id !== this.hudtileId) {
                this._scoreLine(hex, tile[axis]);
            }


            switch (tile[axis]) {
                case '8': this._drawLine('#6600CC', hex.edge3Center, hex.edge6Center, tile[axis], svg, hex); break;
                case '4': this._drawLine('#FF3399', hex.edge3Center, hex.edge6Center, tile[axis], svg, hex); break;
                case '3': this._drawLine('#CC0000', hex.edge3Center, hex.edge6Center, tile[axis], svg, hex); break;
                case '7': this._drawLine('#990033', hex.edge2Center, hex.edge5Center, tile[axis], svg, hex); break;
                case '6': this._drawLine('#33CC33', hex.edge2Center, hex.edge5Center, tile[axis], svg, hex); break;
                case '2': this._drawLine('#0099FF', hex.edge2Center, hex.edge5Center, tile[axis], svg, hex); break;
                case '9': this._drawLine('#FF9900', hex.edge1Center, hex.edge4Center, tile[axis], svg, hex); break;
                case '5': this._drawLine('#666699', hex.edge1Center, hex.edge4Center, tile[axis], svg, hex); break;
                case '1': this._drawLine('#996600', hex.edge1Center, hex.edge4Center, tile[axis], svg, hex); break;
                default: console.error('drawLines default case shouldn\'t happen');
            }
        }
    }

    _scoreLine(hex, line) {
        if( line === '8' || line === '4' || line === '3') {
            if(hex.zScore === undefined) {
                hex.zScore = parseInt(line);
            } else {
                console.error('zScore being overridden!');
            }
        }
        if( line === '7' || line === '6' || line === '2') {
            if(hex.yScore === undefined) {
                hex.yScore = parseInt(line);
            } else {
                console.error('yScore being overridden!');
            }
        }
        if( line === '9' || line === '5' || line === '1') {
            if(hex.xScore === undefined) {
                hex.xScore = parseInt(line);
            } else {
                console.error('xScore being overridden!');
            }
        }
    }



    _drawLine(color, point1, point2, axis, svg, hex) {

        svg.append('path')
            .attr('d',
            ' M ' + point1[0] + ' ' + point1[1] +
            ' L ' + point2[0] + ' ' + point2[1])
            .attr('stroke', color)
            .attr('stroke-width', '1.4em');

        svg.append('text')
            .attr('x', () => {
                if( axis === '8' || axis === '4' || axis === '3') { return point1[0]-20; }
                if( axis === '7' || axis === '6' || axis === '2') { return point1[0]-20; }
                if( axis === '9' || axis === '5' || axis === '1') { return point1[0]-5; }
            })
            .attr('y', () => {
                if( axis === '8' || axis === '4' || axis === '3') { return point1[1]; }
                if( axis === '7' || axis === '6' || axis === '2') { return point1[1]+15; }
                if( axis === '9' || axis === '5' || axis === '1') { return point1[1]+20; }
            })
            .text(axis)
            .style('fill', 'white')
            .attr('font-size', '1.3em')
            .attr("font-family", "sans-serif");
    }

    _setCenter(hex, hexCount, currentCenter) {
        //sets the initial center
        if(hexCount === 0) {
            hex['center'] = [
                currentCenter[0]+this.hexRadius,    //x
                currentCenter[1]+this.hexHeight     //y
            ]
        }

        //creates hex below current hex
        else {
            hex['center'] = [
                currentCenter[0],                   //x
                currentCenter[1]+this.hexHeight*2   //y
            ]
        }
    }

    _setCorners(hex) {
        hex['corner1'] = [ hex.center[0] - this.hexRadius/2, hex.center[1] - this.hexHeight];
        hex['corner2'] = [ hex.center[0] + this.hexRadius/2, hex.center[1] - this.hexHeight];
        hex['corner3'] = [ hex.center[0] + this.hexRadius, hex.center[1]];
        hex['corner4'] = [ hex.center[0] + this.hexRadius/2, hex.center[1] + this.hexHeight];
        hex['corner5'] = [ hex.center[0] - this.hexRadius/2, hex.center[1] + this.hexHeight];
        hex['corner6'] = [ hex.center[0] - this.hexRadius, hex.center[1]];
    }

    _setEdgeCenters(hex) {
        hex['edge1Center'] = this._midpoint(hex.corner1, hex.corner2);
        hex['edge2Center'] = this._midpoint(hex.corner2, hex.corner3);
        hex['edge3Center'] = this._midpoint(hex.corner3, hex.corner4);
        hex['edge4Center'] = this._midpoint(hex.corner4, hex.corner5);
        hex['edge5Center'] = this._midpoint(hex.corner5, hex.corner6);
        hex['edge6Center'] = this._midpoint(hex.corner6, hex.corner1);
    }

    _midpoint(coordinate1, coordinate2) {
        return [
            (coordinate1[0] + coordinate2[0])/2,
            (coordinate1[1] + coordinate2[1])/2
        ];
    }

    _adjustCenter(i, currentCenter) {
        //adjust center for next column
        if((i+1)%2 === 0) {
            currentCenter[0] = currentCenter[0] + this.hexRadius + this.hexRadius/2;
            currentCenter[1] = currentCenter[1] - this.hexHeight*2*this.rows - this.hexHeight;
        } else {
            currentCenter[0] = currentCenter[0] + this.hexRadius + this.hexRadius/2;
            currentCenter[1] = currentCenter[1] - this.hexHeight*2*this.rows + this.hexHeight;
        }
    }

    _buildGame() {

        //draws the hexes
        this.svg.board
            .append('g')
            .selectAll('.hexagon')
            .data(this._objToArray(this.hexes))
            .enter().append('path')
            .attr('class', 'hexagon')
            .attr('id', (hex) => { return hex.id })
            .attr('d', (hex) => {

                //forced to declare this before returning for some reason...?
                var path =
                ' M ' + hex.corner1[0] + ' ' + hex.corner1[1] +
                ' L ' + hex.corner2[0] + ' ' + hex.corner2[1] +
                ' L ' + hex.corner3[0] + ' ' + hex.corner3[1] +
                ' L ' + hex.corner4[0] + ' ' + hex.corner4[1] +
                ' L ' + hex.corner5[0] + ' ' + hex.corner5[1] +
                ' L ' + hex.corner6[0] + ' ' + hex.corner6[1] +
                ' Z';

                return path;
            })

            .style('fill', options.hexColor)
            .style('visibility', (hex) => { return hex.hidden ? 'hidden' : 'visible'; })
            .attr('stroke', options.outlineColor)
            .attr('stroke-width', options.outlineWeight)
            .on('click', (hex) => {
                this.clickHex(hex);
            });

            //saves ref of the hex's svg in the svg map
            var hexes = d3.selectAll('.hexagon')[0];

            //create obj to group hexes
            this.svg['hexes'] = {};

            for(var i=0; i<hexes.length; i++) {
                this.svg.hexes[hexes[i].id] = hexes[i];
            }
    }

    //element to the right of the game map
    _buildHud(options) {

        var hex = { center : [this.hexRadius*2, this.hexHeight*2] };
        hex.id = this.hudtileId;

        this._setCorners(hex);
        this._setEdgeCenters(hex);
        this.activeHex = hex;

        //save ref to hud tile
        this.svg.hud.hudtile = this.svg.hud.append('path')
        .attr('class', 'hexagon')
        .attr('id', 'hudtile')
        .attr('d', () => {

            var path =
            ' M ' + hex.corner1[0] + ' ' + hex.corner1[1] +
            ' L ' + hex.corner2[0] + ' ' + hex.corner2[1] +
            ' L ' + hex.corner3[0] + ' ' + hex.corner3[1] +
            ' L ' + hex.corner4[0] + ' ' + hex.corner4[1] +
            ' L ' + hex.corner5[0] + ' ' + hex.corner5[1] +
            ' L ' + hex.corner6[0] + ' ' + hex.corner6[1] +
            ' Z';

            return path;
        })

        .style('fill', '#fff')
        .attr('stroke', options.hexColor)
        .attr('stroke-width', '1px')
        .on('click', () => {

            if(this.activeTile === undefined) {
                this.chooseRandomTile();
                this.drawLines(hex);
            }

        });

    }

    _objToArray(obj) {
        return Object.keys(obj).map((key) => {return obj[key]});
    }

    clickHex(hex) {

        if(this.activeTile !== undefined) {

            this.drawLines(hex);
            this.svg.hud.hudtile.lines.remove();
            this.activeTile = undefined;
            this.svg.hud.hudtile.on('click', (hex)=> {
                this.chooseRandomTile();
                this.drawLines(this.activeHex);
            });
        }

    }

    calculateScore() {
        this._scoreAxes(this.hexGroups.Xs, 'xScore');
        this._scoreAxes(this.hexGroups.Ys, 'yScore');
        this._scoreAxes(this.hexGroups.Zs, 'zScore');
    }

    _scoreAxes(axisGroup, scoreKey) {

        //iterates over each unique axis
        for(var axisKey in axisGroup) {

            var axis = axisGroup[axisKey];

            //holds the first score encountered so we can make sure they all match
            var firstScore = undefined;
            var allMatch = true;
            var undefinedFound = false;

            if(!axis.allFilled) {

                var i = 0;
                while(i < axis.hexes.length) {

                    //get the hex
                    var hex = axis.hexes[i];

                    //if any score is undefined there is no point in continuing to count
                    if(hex[scoreKey] === undefined) {
                        undefinedFound = true;
                        break;
                    }

                    //if this is the first score - record for comparison to following scores
                    if(i === 0) {
                        firstScore = hex[scoreKey];
                    } else {
                        if(firstScore !== hex[scoreKey]) {
                            allMatch = false;
                        }
                    }

                    i++; //iterate i
                }

                //see if all of our hexes have had a game tiled played on them
                if(!undefinedFound) {
                    axis.allFilled = true;
                }

                //if all the hexes match score the points and we didn't break early add up the score
                if(allMatch && i === axis.hexes.length) {
                    for(var hexKey in axis.hexes) {
                        var hex = axis.hexes[hexKey];
                        this.score = this.score + hex[scoreKey];
                    }
                }
            }
        }
    }

    addToHexGroup(hexGroup, cubicIndex, hex) {
        if(hexGroup[cubicIndex] !== undefined) {
            hexGroup[cubicIndex].hexes.push(hex);
        } else {
            hexGroup[cubicIndex] = { hexes: [hex], allFilled: false };
        }
    }

}

try {
    module.exports = GreasyGame;
} catch(error) {
    //this throws errors in the browser but is required for testing
}
