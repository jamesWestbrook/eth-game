let chai = require('chai');
let path = require('path');

//should style assertions
chai.should();

//import game
let GreasyGame = require(path.join(__dirname, '..', 'GreasyGame'));

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

	it('test hex centers were all built', () => {

	});


});
