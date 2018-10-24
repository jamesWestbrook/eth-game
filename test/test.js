const assert = require('assert');

//import game
const GreasyGame = require('../GreasyGame');

describe('GreasyGame', () => {
	let game;

	beforeEach( () => {
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

        game = new GreasyGame(options);
	});

	it('should be instantiated', () => {
		assert.notEqual(game, undefined);
	});

});
