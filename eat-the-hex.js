'use strict'

class EatTheHex {

    // TODO setting via options vs statically declared is done inconsistently - need to fix
    constructor(options) {

        //object to keep track of all of the svg pieces for ease of access
        this.svg = {}

        this.tiles = ['978','974','973','968','964','963','928','924','923','578','574','573','568','564','563','528','524','523','178','174','173','168','164','163','128','124','123']
        this.activeTile = undefined
        this.hudtileId = 'hudtile'
        this.hexGroups = { Xs : {}, Ys : {}, Zs : {} }
        this.plays = 19
        this.hiddenHexes = options.hiddenHexes

        this.columns = options.columns
        this.rows = options.rows
        this.width = options.width

        this.hudtileColor = options.hudtileColor
        this.hudtileBorderColor = options.hudtileBorderColor
        this.hudtileBorderWeight = options.hudtileBorderWeight
        this.hexColor = options.hexColor
        this.outlineColor = options.outlineColor
        this.outLineWeight = options.outLineWeight


        this.hexRadius = (this.width/(this.columns - 1))/2
        this.hexHeight = (this.hexRadius*Math.sqrt(3))/2
        this.height = this.hexHeight*2*this.rows + this.hexHeight

        this.color9 = '#FF8000'
        this.color8 = '#6600CC'
        this.color7 = '#990033'
        this.color6 = '#33CC33'
        this.color5 = '#666699'
        this.color4 = '#FF3399'
        this.color3 = '#CC0000'
        this.color2 = '#0099FF'
        this.color1 = '#996600'

        this.score = 0
        this.nines = 0
        this.eights = 0
        this.sevens = 0
        this.sixes = 0
        this.fives = 0
        this.fours = 0
        this.threes = 0
        this.twos = 0
        this.ones = 0
    }

    _updateView() {
        $('#total').text(this.getScore())
        return this.getScore()
    }

    onFinish(fn) {
        this.finishFunction = fn;
    }

    gameOver() {
        this.finishFunction();
    }

    play() {

        this.svg['board'] = d3.select('#board').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', '' + -1*this.hexRadius + ' ' + this.hexHeight + ' ' + this.width + ' ' + this.height)

        this.svg['st'] = d3.select('#selectionTile').append('svg')
            .attr('width', this.hexRadius*4)
            .attr('height', this.height/2)

        //build out all the hex coordinates
        this.hexes = {}
        let currentCenter = [0,0]

        for(let i=0; i<this.columns; i++) {

            for(let j=0; j<this.rows; j++) {

                let hex = {}

                hex.id = 'x' + i + 'y' + j
                hex.cc = {
                    x: i,
                    z: j - (i - (i&1)) / 2,
                    y: -i - (j - (i - (i&1)) / 2)
                }

                //set hidden to false
                hex.hidden = false

                //set the centers
                this._setCenter(hex, this.hexes.length, currentCenter)

                //set the corners
                this._setCorners(hex)

                this._setEdgeCenters(hex)

                //set new center
                currentCenter = Object.assign({}, hex.center)

                //store the hex
                this.hexes[hex.id] = hex
            }

            this._adjustCenter(i, currentCenter)
        }

        //hide the hexes once they have been created
        this._hideHexes()

        //draw the map
        this._buildGameBoard()

        //draw the hud
        this._buildHud()

        this._groupHexesByCubicCoords(this.hexes)

    }

    _hideHexes() {
        for(let i = 0; i < this.hiddenHexes.length; ++i) {
            this.hexes[this.hiddenHexes[i]].hidden = true
        }
    }

    _groupHexesByCubicCoords(hexes) {
        for(let hexKey in hexes) {

            let hex = hexes[hexKey]

            if(!hex.hidden) {

                if(hex.cc !== undefined) {
                    this._addToHexGroup(this.hexGroups.Xs, hex.cc.x, hex)
                    this._addToHexGroup(this.hexGroups.Ys, hex.cc.y, hex)
                    this._addToHexGroup(this.hexGroups.Zs, hex.cc.z, hex)
                } else {
                    console.error('hex missing cubic coordinates - cannot group: ', hex)
                }
            }
        }
    }

    _chooseRandomTile() {
        let index = Math.floor((Math.random() * this.tiles.length))
        let tile = this.tiles[index]
        this.activeTile = tile

        //remove selected tile
        if (index > -1) {
            this.tiles.splice(index, 1)
        }
        
    }

    _drawLines(hex) {

        let svg

        //if the hud hex draw on hud
        if(hex.id === this.hudtileId) {
            this.svg.st.hudtile['lines'] = this.svg.st.append('g').attr('class', 'lines')
            svg = this.svg.st.hudtile.lines
        } else {

            this.svg.hexes[hex.id]['lines'] = this.svg.board.append('g').attr('class', 'lines')
            svg = this.svg.hexes[hex.id].lines
        }


        let tile = this.activeTile.split('')
        for(let axis in tile) {

            if(hex.id !== this.hudtileId) {
                this._scoreLine(hex, tile[axis])
            }


            switch (tile[axis]) {
                case '8': this._drawLine(this.color8, hex.edge3Center, hex.edge6Center, tile[axis], svg, hex) 
                break
                case '4': this._drawLine(this.color4, hex.edge3Center, hex.edge6Center, tile[axis], svg, hex) 
                break
                case '3': this._drawLine(this.color3, hex.edge3Center, hex.edge6Center, tile[axis], svg, hex) 
                break
                case '7': this._drawLine(this.color7, hex.edge2Center, hex.edge5Center, tile[axis], svg, hex) 
                break
                case '6': this._drawLine(this.color6, hex.edge2Center, hex.edge5Center, tile[axis], svg, hex) 
                break
                case '2': this._drawLine(this.color2, hex.edge2Center, hex.edge5Center, tile[axis], svg, hex) 
                break
                case '9': this._drawLine(this.color9, hex.edge1Center, hex.edge4Center, tile[axis], svg, hex) 
                break
                case '5': this._drawLine(this.color5, hex.edge1Center, hex.edge4Center, tile[axis], svg, hex) 
                break
                case '1': this._drawLine(this.color1, hex.edge1Center, hex.edge4Center, tile[axis], svg, hex) 
                break
                default: console.error('_drawLines default case shouldn\'t happen')
            }
        }

        this._updateView()
    }

    _scoreLine(hex, line) {
        if( line === '8' || line === '4' || line === '3') {
            if(hex.zScore === undefined) {
                hex.zScore = parseInt(line)
            } else {
                console.error('zScore being overridden!')
            }
        }
        if( line === '7' || line === '6' || line === '2') {
            if(hex.yScore === undefined) {
                hex.yScore = parseInt(line)
            } else {
                console.error('yScore being overridden!')
            }
        }
        if( line === '9' || line === '5' || line === '1') {
            if(hex.xScore === undefined) {
                hex.xScore = parseInt(line)
            } else {
                console.error('xScore being overridden!')
            }
        }
    }

    _drawLine(color, point1, point2, axis, svg, hex) {

        svg.append('path')
            .attr('d',
            ' M ' + point1[0] + ' ' + point1[1] +
            ' L ' + point2[0] + ' ' + point2[1])
            .attr('stroke', color)
            .attr('stroke-width', '1.4em')

        svg.append('text')
            .attr('x', () => {
                if( axis === '8' || axis === '4' || axis === '3') { return point1[0]-20 }
                if( axis === '7' || axis === '6' || axis === '2') { return point1[0]-15 }
                if( axis === '9' || axis === '5' || axis === '1') { return point1[0]-5 }
            })
            .attr('y', () => {
                if( axis === '8' || axis === '4' || axis === '3') { return point1[1]-5 }
                if( axis === '7' || axis === '6' || axis === '2') { return point1[1]+15 }
                if( axis === '9' || axis === '5' || axis === '1') { return point1[1]+20 }
            })
            .text(axis)
            .style('fill', 'white')
            .attr('font-size', '1.3rem')
            .attr("font-family", "Consolas, monaco, monospace")
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
        hex['corner1'] = [ hex.center[0] - this.hexRadius/2, hex.center[1] - this.hexHeight]
        hex['corner2'] = [ hex.center[0] + this.hexRadius/2, hex.center[1] - this.hexHeight]
        hex['corner3'] = [ hex.center[0] + this.hexRadius, hex.center[1]]
        hex['corner4'] = [ hex.center[0] + this.hexRadius/2, hex.center[1] + this.hexHeight]
        hex['corner5'] = [ hex.center[0] - this.hexRadius/2, hex.center[1] + this.hexHeight]
        hex['corner6'] = [ hex.center[0] - this.hexRadius, hex.center[1]]
    }

    _setEdgeCenters(hex) {
        hex['edge1Center'] = this._midpoint(hex.corner1, hex.corner2)
        hex['edge2Center'] = this._midpoint(hex.corner2, hex.corner3)
        hex['edge3Center'] = this._midpoint(hex.corner3, hex.corner4)
        hex['edge4Center'] = this._midpoint(hex.corner4, hex.corner5)
        hex['edge5Center'] = this._midpoint(hex.corner5, hex.corner6)
        hex['edge6Center'] = this._midpoint(hex.corner6, hex.corner1)
    }

    _midpoint(coordinate1, coordinate2) {
        return [
            (coordinate1[0] + coordinate2[0])/2,
            (coordinate1[1] + coordinate2[1])/2
        ]
    }

    _adjustCenter(i, currentCenter) {
        //adjust center for next column
        if((i+1)%2 === 0) {
            currentCenter[0] = currentCenter[0] + this.hexRadius + this.hexRadius/2
            currentCenter[1] = currentCenter[1] - this.hexHeight*2*this.rows - this.hexHeight
        } else {
            currentCenter[0] = currentCenter[0] + this.hexRadius + this.hexRadius/2
            currentCenter[1] = currentCenter[1] - this.hexHeight*2*this.rows + this.hexHeight
        }
    }

    _buildGameBoard() {

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
                let path =
                ' M ' + hex.corner1[0] + ' ' + hex.corner1[1] +
                ' L ' + hex.corner2[0] + ' ' + hex.corner2[1] +
                ' L ' + hex.corner3[0] + ' ' + hex.corner3[1] +
                ' L ' + hex.corner4[0] + ' ' + hex.corner4[1] +
                ' L ' + hex.corner5[0] + ' ' + hex.corner5[1] +
                ' L ' + hex.corner6[0] + ' ' + hex.corner6[1] +
                ' Z'

                return path
            })

            .style('fill', this.hexColor)
            .style('visibility', (hex) => { return hex.hidden ? 'hidden' : 'visible' })
            .attr('stroke', this.outlineColor)
            .attr('stroke-width', this.outlineWeight)
            .on('click', (hex) => {
                this._clickHex(hex)
            })

            //saves ref of the hex's svg in the svg map
            let hexes = d3.selectAll('.hexagon')[0]

            //create obj to group hexes
            this.svg['hexes'] = {}

            for(let i=0; i<hexes.length; i++) {
                this.svg.hexes[hexes[i].id] = hexes[i]
            }
    }

    //element to the right of the game map
    _buildHud() {

        let hex = { center : [this.hexRadius*2, this.hexHeight*2] }
        hex.id = this.hudtileId

        this._setCorners(hex)
        this._setEdgeCenters(hex)

        //save ref to hud tile
        this.svg.st.hudtile = this.svg.st.append('path')
        .attr('class', 'hexagon')
        .attr('id', this.hudtileId)
        .attr('d', () => {

            let path =
            ' M ' + hex.corner1[0] + ' ' + hex.corner1[1] +
            ' L ' + hex.corner2[0] + ' ' + hex.corner2[1] +
            ' L ' + hex.corner3[0] + ' ' + hex.corner3[1] +
            ' L ' + hex.corner4[0] + ' ' + hex.corner4[1] +
            ' L ' + hex.corner5[0] + ' ' + hex.corner5[1] +
            ' L ' + hex.corner6[0] + ' ' + hex.corner6[1] +
            ' Z'

            return path
        })
        .style('fill', this.hudtileColor)
        .attr('stroke', this.hudtileBorderColor)
        .attr('stroke-width', this.hudtileBorderWeight)
        .on('click', () => {

            if(this.activeTile === undefined) {
                this._chooseRandomTile()
                this._drawLines(hex)
            }

        })

    }

    _objToArray(obj) {
        return Object.keys(obj).map((key) => {return obj[key]})
    }

    _clickHex(hex) {

        if(this.activeTile !== undefined && !hex.played) {

            hex.played = true
            this.plays = this.plays - 1
            this._drawLines(hex)
            this.svg.st.hudtile.lines.remove()
            this.activeTile = undefined

        }

        if (this.plays === 0) {
            this.gameOver()
        }

    }

    getScore() {
        this._scoreAxes(this.hexGroups.Xs, 'xScore')
        this._scoreAxes(this.hexGroups.Ys, 'yScore')
        this._scoreAxes(this.hexGroups.Zs, 'zScore')

        return this.score
    }

    _scoreAxes(axisGroup, scoreKey) {

        //iterates over each unique axis
        for(let axisKey in axisGroup) {

            let axis = axisGroup[axisKey]

            //holds the first score encountered so we can make sure they all match
            let firstScore = undefined
            let allMatch = true
            let undefinedFound = false

            if(!axis.allFilled) {

                let i = 0
                while(i < axis.hexes.length) {

                    //get the hex
                    let hex = axis.hexes[i]

                    //if any score is undefined there is no point in continuing to count
                    //tile has NOT been placed === undefined 
                    if(hex[scoreKey] === undefined) {
                        undefinedFound = true
                        break
                    }

                    //if this is the first score - record for comparison to following scores
                    if(i === 0) {
                        firstScore = hex[scoreKey]
                    } else {
                        if(firstScore !== hex[scoreKey]) {
                            allMatch = false
                        }
                    }

                    i++ //iterate i
                }

                //see if all of our hexes have had a game tiled played on them
                if(!undefinedFound) {
                    axis.allFilled = true
                }

                //TODO fix this break early nonsense
                //if all the hexes match score the points and we didn't break early add up the score
                if(allMatch && i === axis.hexes.length) {
                    for(let hexKey in axis.hexes) {
                        let hex = axis.hexes[hexKey]

                        this.score = this.score + hex[scoreKey]

                        //updates view - needs to be made into function
                        switch (hex[scoreKey]) {
                                case 9:  
                                    this.nines = this.nines + 1 
                                    $('#nine').text(this.nines)
                                    break
                                case 8: 
                                    this.eights = this.eights + 1
                                    $('#eight').text(this.eights)
                                    break
                                case 7: 
                                    this.sevens = this.sevens + 1
                                    $('#seven').text(this.sevens)
                                    break
                                case 6: 
                                    this.sixes = this.sixes + 1
                                    $('#six').text(this.sixes)
                                    break
                                case 5: 
                                    this.fives = this.fives + 1
                                    $('#five').text(this.fives)
                                    break
                                case 4: 
                                    this.fours = this.fours + 1
                                    $('#four').text(this.fours)
                                    break
                                case 3: 
                                    this.threes = this.threes + 1
                                    $('#three').text(this.threes)
                                    break
                                case 2: 
                                    this.twos = this.twos + 1
                                    $('#two').text(this.twos)
                                    break
                                case 1: 
                                    this.ones = this.ones + 1
                                    $('#one').text(this.ones)
                                    break
                                default: break
                        }

                    }
                }
            }
        }
    }

    _addToHexGroup(hexGroup, cubicIndex, hex) {
        if(hexGroup[cubicIndex] !== undefined) {
            hexGroup[cubicIndex].hexes.push(hex)
        } else {
            hexGroup[cubicIndex] = { hexes: [hex], allFilled: false }
        }
    }
}

try {
    module.exports = EatTheHex
} catch(error) {

    //TODO fix this
    //this throws errors in the browser but is required for testing
}
