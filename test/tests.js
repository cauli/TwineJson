'use strict';

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

var requirejs = require("requirejs");
var expect = require('chai').expect;

requirejs.config({
    "baseUrl": "js/app",
    "paths": {
      "app": "app"
    },
    nodeRequire: require
});

// Test suite
describe('Mocha is running', function () {
	it('should run our tests using npm', function () {
		expect(true).to.be.ok;
	});
});


requirejs(['./treebuilder'],
	function   (treebuilder) {

		describe('Treebuilder \'realTitle\' tests', function () {
   		it('Treebuilder exists', function () {
				expect(treebuilder).to.be.ok;
			});

 			it('\'realTitle\' of \'[[abracadabra]]\' is \'abracadabra\'', function () {
				expect(treebuilder.realTitle('[[abracadabra]]')).to.be.a('string');;
				expect(treebuilder.realTitle('[[abracadabra]]')).to.be.equal('abracadabra');
			});

   		it('\'realTitle\' of \'[[a|b]]\' is \'b\'', function () {
				expect(treebuilder.realTitle('[[a|b]]')).to.be.a('string');;
				expect(treebuilder.realTitle('[[a|b]]')).to.be.equal('b');
			});

  		it('\'realTitle\' of \'[[Open the cage door|Devoured by Lions]]\' is \'Devoured by Lions\'', function () {
				expect(treebuilder.realTitle('[[Open the cage door|Devoured by Lions]]')).to.be.a('string');
				expect(treebuilder.realTitle('[[Open the cage door|Devoured by Lions]]')).to.be.equal('Devoured by Lions');
			});

			it('\'realTitle\' of \'[[Open the cage door->Devoured by Lions]]\' is \'Devoured by Lions\'', function () {
				expect(treebuilder.realTitle('[[Open the cage door->Devoured by Lions]]')).to.be.a('string');
				expect(treebuilder.realTitle('[[Open the cage door->Devoured by Lions]]')).to.be.equal('Devoured by Lions');
			});

   	});

    describe('Treebuilder \'removeChildFromRoot\' tests', function () {
			var nothingToRemove = [
				{
					parentId: 1
				},
				{
					parentId: 2
				}
			];

			var singleObj = [{
				parentId:1
			}]

		  var removeSecond = [
				{
					parentId: 1
				},
				{
					id: 2
				}
			];

			var removeFirst = [
				{
					id: 1
				},
				{
					parentId: 2
				}
			];

			var removeFirstExpected = [
				{
					parentId: 2
				}
			];

 			it('\'removeChildFromRoot\' can handle a simple array of objects', function () {
				expect(treebuilder.removeChildFromRoot(nothingToRemove)).to.have.length(2);
				expect(treebuilder.removeChildFromRoot(nothingToRemove)).to.be.equal(nothingToRemove);
			});

 			it('\'removeChildFromRoot\' removes nothing from single object', function () {
				expect(treebuilder.removeChildFromRoot(singleObj)).to.have.length(1);
				expect(treebuilder.removeChildFromRoot(singleObj)).to.be.equal(singleObj);
			});

			it('\'removeChildFromRoot\' removes second object without parentId', function () {
				expect(JSON.stringify(treebuilder.removeChildFromRoot(removeSecond))).to.be.equal(JSON.stringify(singleObj));
			});

			it('\'removeChildFromRoot\' removes first object without parentId', function () {
				expect(JSON.stringify(treebuilder.removeChildFromRoot(removeFirst))).to.be.equal(JSON.stringify(removeFirstExpected));
			});


   	});
  }
);
