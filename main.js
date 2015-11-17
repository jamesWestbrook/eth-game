'use strict';

var width = Math.min(500, $(window).width() - $(window).width()*0.05);
var height = Math.min(500, $(window).height() - $(window).height()*0.05);

var options = {
    hexColor        : '#444',
    outlineColor    : '#fff',
    outlineWeight   : '1px',
    width           : width,
    height          : height,
    hiddenHexes     : ['x0y0', 'x0y4', 'x1y4', 'x3y4', 'x4y0', 'x4y4'],
    columns         : 5,
    rows            : 5
};

var game = new GreasyGame(options);
game.play();
