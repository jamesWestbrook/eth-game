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

// var columns = 5;
// var rows = 5;
// var hiddenHexes = new Set([0,4,9,19,20,24]);
// var hexes = {};
//
// var windowWidth = $(window).width();
// var windowHeight = $(window).height();
// var margin = { top: 50, right: 50, bottom: 50, left: 50 };
// var width = windowWidth - margin.left - margin.right;
// var height = windowHeight - margin.top - margin.bottom;
//
//
// var coordinates = {};
// var hexIndex = 0;
// for (var y = 0; y < rows; ++y) {
//     for(var x = 0; x < columns; x++) {
//         coordinates[hexIndex] = { 'x' : x, 'y' : y };
//         hexIndex++;
//     }
// }
//
//     // var hexIndex = 0;
//     // for (var y = 0; y < rows; ++y) {
//     //     for(var x = 0; x < columns; x++) {
//     //         hexes[hexIndex] = { coordinates : { 'x' : x, 'y' : y } };
//     //         hexIndex++;
//     //     }
//     // }
//     //
//
//
// // function buildHexes(windowHeight, windowWidth) {
// //
// //     var columns = 5;
// //     var rows = 5;
// //     var hiddenHexes = new Set([0,4,9,19,20,24]);
// //     var hexes = {};
// //
// //     var margins = { top: 50, right: 50, bottom: 50, left: 50 };
// //     var width = windowWidth - margin.left - margin.right;
// //     var height = windowHeight - margin.top - margin.bottom;
// //
// //     var hexIndex = 0;
// //     for (var y = 0; y < rows; ++y) {
// //         for(var x = 0; x < columns; x++) {
// //             hexes[hexIndex] = { coordinates : { 'x' : x, 'y' : y } };
// //             hexIndex++;
// //         }
// //     }
// //
// //     hexes = { size : hexIndex + 1 }
// //
// //
// //
// //     //TODO build return obj
// //     return {
// //         'hexes' : hexes
// //     };
// // }
//
//
//
//
// //The maximum radius the hexagons can have to still fit the screen
// var hexRadius = d3.min([width/((columns + 0.5) * Math.sqrt(3)),
// 			height/((rows + 1/3) * 1.5)]);
//
// var edgeHeight = Math.sqrt(Math.pow(hexRadius,2) - Math.pow((hexRadius/2),2));
//
// // //Set the new height and width of the SVG based on the max possible
// // width = MapColumns*hexRadius*Math.sqrt(3);
// // heigth = MapRows*1.5*hexRadius+0.5*hexRadius;
//
// //Set the hexagon radius
// var hexbin = d3.hexbin().radius(hexRadius);
//
// //Calculate the center positions of each hexagon
// var points = [];
// for (var i = 0; i < rows; i++) {
//     for (var j = 0; j < columns; j++) {
//         points.push([hexRadius * j * Math.sqrt(3), hexRadius * i * 1.5]);
//     }//for j
// }//for i
//
//
// //build out the hexes as objects
// var hexes = {};
// for(var i = 0; i < points.length; ++i) {
//
//     var center;
//     if(coordinates[i].y % 2 === 1) {
//         center = { x : points[i][0] + edgeHeight, y : points[i][1] }
//     } else {
//         center = { x : points[i][0], y : points[i][1] }
//     }
//
//     var xLeft =  center.x - edgeHeight/2;
//     var xRight = center.x + edgeHeight/2;
//     var yUp = center.y - 0.75*hexRadius;   //Y AXIS APPEARS REVERESED
//     var yDown = center.y + 0.75*hexRadius; //Y AXIS APPEARS REVERESED
//
//     var edge1Center = { x : xLeft, y : yUp };
//     var edge2Center = { x : xRight, y : yUp };
//     var edge3Center = { x : center.x + edgeHeight, y : center.y };
//     var edge4Center = { x : xRight, y : yDown };
//     var edge5Center = { x : xLeft, y : yDown };
//     var edge6Center = { x : center.x - edgeHeight, y : center.y };
//
//     hexes[i] = {
//         'center' : center,
//         'edge1Center' : edge1Center,
//         'edge2Center' : edge2Center,
//         'edge3Center' : edge3Center,
//         'edge4Center' : edge4Center,
//         'edge5Center' : edge5Center,
//         'edge6Center' : edge6Center
//     }
// }
//
// function drawLine(hexIndex, point1Name, point2Name, color, lineWidth) {
//     if(!hiddenHexes.has(hexIndex)) {
//         svg.append('path')
//             .attr('d',  'M ' +
//                 hexes[hexIndex][point1Name].x + ' ' +
//                 hexes[hexIndex][point1Name].y + ' L ' +
//                 hexes[hexIndex][point2Name].x + ' ' +
//                 hexes[hexIndex][point2Name].y)
//
//             .attr('stroke', color)
//             .attr('stroke-width', lineWidth)
//     }
// }
//
// //Create SVG element
// var svg = d3.select('#chart').append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .attr('id', 'gameboard')
//     .append('g')
//     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//
// ///////////////////////////////////////////////////////////////////////////
// ////////////////////// Draw hexagons and color them ///////////////////////
// ///////////////////////////////////////////////////////////////////////////
//
// svg.append('g')
//     .selectAll('.hexagon')
//     .data(hexbin(points))
//     .enter().append('path')
//     .attr('class', 'hexagon')
//     .attr('d', function (d) {
// 		return 'M' + d.x + ',' + d.y + hexbin.hexagon();
// 	})
//     .attr('stroke', function (d,i) {
// 		return '#fff';
// 	})
//     .attr('stroke-width', '1px')
//     .attr('id', function(d,i) {
//         return hexIdToString(i);
//     })
//     .style('fill', function (d,i) {
//         if(hiddenHexes.has(i)) {
//             return '#fff';
//         } else {
//             return '#999';
//         }
//
// 	})
//     .on('click', click);
// 	//.on('mouseover', mover)
// 	//.on('mouseout', mout);
//
// for(var i = 0; i < points.length; ++i) {
//     //drawLine(i, 'edge1Center', 'edge4Center', 'blue', 8);
//     //drawLine(i, 'edge2Center', 'edge5Center', 'red', 8);
//     // drawLine(i, 'edge3Center', 'edge6Center', 'yellow', 8);
// }
//
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].center.x; })
// //             .attr('cy', function() { return hexes[i].center.y; })
// //             .attr('r', '3')
// //             .style('fill','white');
// //     }
// // }
// //
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].edge1Center.x; })
// //             .attr('cy', function() { return hexes[i].edge1Center.y; })
// //             .attr('r', '3')
// //             .style('fill','blue');
// //     }
// // }
// //
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].edge2Center.x; })
// //             .attr('cy', function() { return hexes[i].edge2Center.y; })
// //             .attr('r', '3')
// //             .style('fill','green');
// //     }
// // }
// //
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].edge3Center.x; })
// //             .attr('cy', function() { return hexes[i].edge3Center.y; })
// //             .attr('r', '3')
// //             .style('fill','red');
// //     }
// // }
// //
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].edge4Center.x; })
// //             .attr('cy', function() { return hexes[i].edge4Center.y; })
// //             .attr('r', '3')
// //             .style('fill','purple');
// //     }
// // }
// //
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].edge5Center.x; })
// //             .attr('cy', function() { return hexes[i].edge5Center.y; })
// //             .attr('r', '3')
// //             .style('fill','yellow');
// //     }
// // }
// //
// // for(var i = 0; i < points.length; ++i) {
// //     if(!hiddenHexes.has(i)) {
// //         svg.append('circle')
// //             .attr('cx', function() { return hexes[i].edge6Center.x; })
// //             .attr('cy', function() { return hexes[i].edge6Center.y; })
// //             .attr('r', '3')
// //             .style('fill','orange');
// //     }
// // }
//
// /////////////////////////////////////////////////////////////////////////
// //////////// Initiate SVG and create hexagon centers ////////////////////
// /////////////////////////////////////////////////////////////////////////
//
// // //Function to call when you mouseover a node
// // function mover(d) {
// //   var el = d3.select(this)
// //      .transition()
// //      .duration(10)
// //      .style('fill-opacity', 0.3);
// // }
// //
// // //Mouseout function
// // function mout(d) {
// //  var el = d3.select(this)
// //     .transition()
// //     .duration(1000)
// //     .style('fill-opacity', 1);
// // };
// //
// // //click
// function click(d, i) {
//     console.log(hexIdToString(i))
// }
// //
// // //hex id to string
// function hexIdToString(i) {
//     return coordinates[i].x + '.' + coordinates[i].y;
// }
