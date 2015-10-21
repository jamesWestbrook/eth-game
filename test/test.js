let chai = require('chai');
let path = require('path');

//should style assertions
chai.should();

//import HexMap
let HexMap = require(path.join(__dirname, '..', 'GreasyMap'));

describe('GreasyMap', () => {
	let map;

	beforeEach( () => {
		map = new GreasyMap(5,5,100,100);
	});

	// it('test a modified map size', () => {
	// 	var hiddenHexes = [0,4,9,19,20,24];
	// 	hexMap.hideHexes(hiddenHexes);
	// 	hexMap.countHexes().should.equal(25 - hiddenHexes.length);
	// });

	it('test hex radius caluclation', () => {
		map.hexRadius.should.equal(10);
	});

	it('test hex height calculation', () => {
		map.hexHeight.should.equal(8.660254037844386);
	});

	it('test hex centers were all built', () => {

	});


});
