'use strict';

let width = Math.min(500, $(window).width() - $(window).width()*0.05)
let height = Math.min(500, $(window).height() - $(window).height()*0.05)

let options = {
    hexColor            : '#444',
    outlineColor        : '#090',
    outlineWeight       : '0.1rem',
    width               : width,
    height              : height,
    hiddenHexes         : ['x0y0', 'x0y4', 'x1y4', 'x3y4', 'x4y0', 'x4y4'],
    columns             : 5,
    rows                : 5,
    hudtileColor        : '#222',
    hudtileBorderColor  : '#0c0',
    hudTileBorderWeight : '0.2rem'
}

let game = new GreasyGame(options)

$('#selectionTile').height(game.hexHeight*4)
$('#selectionTile').width(game.hexRadius*4)
$('#scoreBoard').width(game.hexRadius*2)
$('#scoreBoard').css('margin-left', game.hexRadius)

game.play();
