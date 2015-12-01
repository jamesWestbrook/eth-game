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
$('#selectionTile').height(game.hexHeight*4);
$('#selectionTile').width(game.hexRadius*4);
$('#scoreBoard').width(game.hexRadius*2);
$('#scoreBoard').css('margin-left', game.hexRadius);
$('#label9').css('background-color', game.color9);
$('#label8').css('background-color', game.color8);
$('#label7').css('background-color', game.color7);
$('#label6').css('background-color', game.color6);
$('#label5').css('background-color', game.color5);
$('#label4').css('background-color', game.color4);
$('#label3').css('background-color', game.color3);
$('#label2').css('background-color', game.color2);
$('#label1').css('background-color', game.color1);
game.play();
