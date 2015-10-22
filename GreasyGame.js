'use strict';

class GreasyGame {

    constructor(options) {
        this.tiles = ['978','974','973','968','964','963','928','924','923','578','574','573','568','564','563','528','524','523','178','174','173','168','164','163','128','124','123'];
        this.activeTile = undefined;

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

        this.svgGameHud = d3.select('#hud').append('svg')
            .attr('width', this.hexRadius*4)
            .attr('height', this.height)
            //.style('border', '1px solid black');

        //build out all the hex coordinates
        this.hexes = [];
        var hexCount = 0;
        var currentCenter = [0,0];

        for(var i=0; i<this.columns; i++) {

            for(var j=0; j<this.rows; j++) {

                //create the hex obj
                this.hexes.push({});

                //set hidden to false
                this.hexes[hexCount]['hidden'] = false;

                //set the cetners
                this._setCenter(this.hexes[hexCount], hexCount, currentCenter);

                //set the corners
                this._setCorners(this.hexes[hexCount]);

                this._setEdgeCenters(this.hexes[hexCount]);

                //set new center
                currentCenter = Object.assign({}, this.hexes[hexCount].center);

                hexCount++; //increment
            }

            this._adjustCenter(i, currentCenter);
        }

        //hide the hexes once they have been created
        this.hideHexes(options.hiddenHexes);

        //draw the map
        this._buildGame(options);

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

    drawRandomTile(svg, tiles, d) {

        this.chooseRandomTile();
        var tile = this.activeTile.split('');
        for(var axis in tile) {
            switch (tile[axis]) {
                case '8': this._drawLine('#6600CC', d.edge3Center, d.edge6Center, tile[axis], svg); break;
                case '4': this._drawLine('#FF3399', d.edge3Center, d.edge6Center, tile[axis], svg); break;
                case '3': this._drawLine('#CC0000', d.edge3Center, d.edge6Center, tile[axis], svg); break;
                case '7': this._drawLine('#990033', d.edge2Center, d.edge5Center, tile[axis], svg); break;
                case '6': this._drawLine('#33CC33', d.edge2Center, d.edge5Center, tile[axis], svg); break;
                case '2': this._drawLine('#0099FF', d.edge2Center, d.edge5Center, tile[axis], svg); break;
                case '9': this._drawLine('#FF9900', d.edge1Center, d.edge4Center, tile[axis], svg); break;
                case '5': this._drawLine('#666699', d.edge1Center, d.edge4Center, tile[axis], svg); break;
                case '1': this._drawLine('#996600', d.edge1Center, d.edge4Center, tile[axis], svg); break;
                default: console.error('drawRandomTile default case shouldn\'t happen');
            }
        }
    }

    _drawLine(color, point1, point2, axis, svg) {
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
            .attr("font-family", "sans-serif")
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
        this.svgHexBoard.append('g')
            .selectAll('.hexagon')
            .data(this.hexes)
            .enter().append('path')
            .attr('class', 'hexagon')
            .attr('d', (d) => {

                //forced to declare this before returning for some reason...?
                var path =
                ' M ' + d.corner1[0] + ' ' + d.corner1[1] +
                ' L ' + d.corner2[0] + ' ' + d.corner2[1] +
                ' L ' + d.corner3[0] + ' ' + d.corner3[1] +
                ' L ' + d.corner4[0] + ' ' + d.corner4[1] +
                ' L ' + d.corner5[0] + ' ' + d.corner5[1] +
                ' L ' + d.corner6[0] + ' ' + d.corner6[1] +
                ' Z';

                return path;
            })

            .style('fill', options.hexColor)
            .style('visibility', (d) => { return d.hidden ? 'hidden' : 'visible'; })
            .attr('stroke', options.outlineColor)
            .attr('stroke-width', options.outlineWeight)
            .on('click', (d) => { this.drawRandomTile(this.svgHexBoard, this.tiles, d) })
            .on('mouseover', () => {
            });
    }

    _buildHud(options) {

        var hex = { center : [this.hexRadius*2, this.hexHeight*2] }
        this._setCorners(hex);
        this._setEdgeCenters(hex);


        this.svgGameHud.append('path')
        .attr('class', 'hexagon')
        .attr('d', () => {

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

        .style('fill', '#fff')
        .attr('stroke', options.hexColor)
        .attr('stroke-width', '1px')
        .on('click', () => { this.drawRandomTile(this.svgGameHud,this.tiles, hex) })
        .on('mouseover', () => {
        });
    }

}

try {
    module.exports = GreasyGame;
} catch(error) {
    //this throws errors in the browser but is required for testing
}
