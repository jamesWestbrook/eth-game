'use strict';

class GreasyGame {

    play(options) {
        console.log(this.activeTile);

        // this.chooseRandomTile();
        //
        //
        // var count = 0;
        // this.hexes.map((hex) => {
        //     if( count % 7 === 0) {
        //         this.chooseRandomTile();
        //     }
        //
        //
        //     if(hex.hidden !== true ) {
        //         this.drawLines(hex, this.svgHexBoard);
        //     }
        //
        //     count++;
        // });
        //
        // this._buildHud(options);
    }

    constructor(options) {

        this.tiles = ['978','974','973','968','964','963','928','924','923','578','574','573','568','564','563','528','524','523','178','174','173','168','164','163','128','124','123'];
        this.activeTile = undefined;
        this.activeTileId = [-1,-1];

        this.gamePiecies = {};
        this.svgActiveTile = undefined;

        this.columns = options.columns;
        this.rows = options.rows;
        this.width = options.width;
        this.hexRadius = (this.width/(this.columns - 1))/2;
        this.hexHeight = (this.hexRadius*Math.sqrt(3))/2;
        this.height = this.hexHeight*2*this.rows + this.hexHeight;

        this.svgHexBoard = d3.select('#board').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            //.style('border', '1px solid black');

        this.svgGameHud = d3.select('#displaytile').append('svg')
            .attr('width', this.hexRadius*4)
            .attr('height', this.height)
            //.style('border', '1px solid black');

        //build out all the hex coordinates
        this.hexes = [];
        var currentCenter = [0,0];

        for(var i=0; i<this.columns; i++) {

            for(var j=0; j<this.rows; j++) {

                var hex = {};

                hex['id'] = [j,i];

                //set hidden to false
                hex['hidden'] = false;

                //set the cetners
                this._setCenter(hex, this.hexes.length, currentCenter);

                //set the corners
                this._setCorners(hex);

                this._setEdgeCenters(hex);

                //set new center
                currentCenter = Object.assign({}, hex.center);

                //store the hex
                this.hexes.push(hex);
            }

            this._adjustCenter(i, currentCenter);
        }

        //hide the hexes once they have been created
        this.hideHexes(options.hiddenHexes);

        //draw the map
        this._buildGame(options);

        //draw the hud
        this._buildHud(options);

    }

    hideHexes(array) {
        for(var i = 0; i < array.length; ++i) {
            this.hexes[array[i]].hidden = true;
        }
    }

    chooseRandomTile() {
        this.activeTile = this.tiles[Math.floor((Math.random() * this.tiles.length))];
    }

    drawLines(hex, svg) {

        if(hex.id[0] === -1) {
            this.svgActivePiece = svg.append('g').attr('class', this.lineClass(hex));
            svg = this.svgActivePiece;
        } else {
            svg.append('g').attr('class', this.lineClass(hex));
        }


        var tile = this.activeTile.split('');
        for(var axis in tile) {
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

        d3.select('#' + this.idToString(hex)).on('click', () => {});

        //TODO give ID to the lines that you draw so that you can remove them all at once from the
    }

    _drawLine(color, point1, point2, axis, svg, hex) {

        svg.append('path')
            .attr('d',
            ' M ' + point1[0] + ' ' + point1[1] +
            ' L ' + point2[0] + ' ' + point2[1])
            .attr('stroke', color)
            .attr('stroke-width', '1.4em');

        //catch
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
        var midpoint = [
            (coordinate1[0] + coordinate2[0])/2,
            (coordinate1[1] + coordinate2[1])/2
        ];
        return midpoint;
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
        this.svgHexBoard
            .selectAll('.hexagon')
            .data(this.hexes)
            .enter().append('path')
            .attr('class', 'hexagon')
            .attr('id', (hex) => { return this.idToString(hex) })
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
                if(this.activeTile !== undefined) {
                    this.drawLines(hex, this.svgHexBoard);
                    this.svgActivePiece.remove();
                    this.activeTile = undefined;
                    this.svgActiveTile.on('click', (hex)=> {
                        this.chooseRandomTile();
                        this.drawLines(this.activeHex, this.svgGameHud);
                    });
                }
            });
    }

    //element to the right/? of the game map
    _buildHud(options) {

        var hex = { center : [this.hexRadius*2, this.hexHeight*2] }
        hex.id=this.activeTileId;

        this._setCorners(hex);
        this._setEdgeCenters(hex);
        this.activeHex = hex;
        this.svgActiveTile = this.svgGameHud.append('path')
        .attr('class', 'hexagon')
        .attr('id', this.idToString(hex))
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

            this.chooseRandomTile();

            //removes click event
            this.drawLines(hex, this.svgGameHud);

        });

    }

    idToString(hex) {
        return 'x' + hex.id[0] + 'y' + hex.id[1];
    }

    lineClass(hex) {
        return 'lines.' + this.idToString(hex);
    }

}

try {
    module.exports = GreasyGame;
} catch(error) {
    //this throws errors in the browser but is required for testing
}
