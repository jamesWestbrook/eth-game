let assert = require('assert');

//import game
let GreasyGame = require('../GreasyGame');

describe('GreasyGame', () => {
	let game;

	beforeEach( () => {
		var options = {
		    hexColor        : '#444',
		    outlineColor    : '#fff',
		    outlineWeight   : '1px',
		    width           : 500,
		    height          : 500,
		    hiddenHexes     : [0,4,9,19,20,24],
		    columns         : 5,
		    rows            : 5
		}

		game = new GreasyGame(options);
	});

	it('should be instantiated', () => {
		assert.notEqual(game, undefined);
	});


});
