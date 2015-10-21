'use strict';

var width = $(window).width() - $(window).width()*0.05;
var height = $(window).height() - $(window).height()*0.05;

var options = {
    container       : 'chart',
    id              : 'gameboard',
    hexColor        : '#210B61',
    outlineColor    : '#fff',
    outlineWeight   : '1px',
    width           : width,
    height          : height,
    hiddenHexes     : [0,4,9,19,20,24],
    columns         : 5,
    rows            : 5
}

var game = new GreasyGame(options);
