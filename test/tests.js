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
			var removeEverything = [
				{
					parentId: 1
				},
				{
					parentId: 2
				}
			];

			var emptyArray = []

			var singleObj = [{
				id:1
			}]

		  var removeSecond = [
				{
					id: 1
				},
				{
					parentId: 2
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
				expect(treebuilder.removeChildFromRoot(removeEverything)).to.have.length(0);
				expect(JSON.stringify(treebuilder.removeChildFromRoot(removeEverything))).to.be.equal('[]');
			});

 			it('\'removeChildFromRoot\' removes nothing from single object', function () {
				expect(treebuilder.removeChildFromRoot(singleObj)).to.have.length(1);
				expect(treebuilder.removeChildFromRoot(singleObj)).to.be.equal(singleObj);
			});

			it('\'removeChildFromRoot\' removes second object with parentId', function () {
				expect(JSON.stringify(treebuilder.removeChildFromRoot(removeSecond))).to.be.equal(JSON.stringify(singleObj));
			});
   	});


   	describe('Treebuilder \'build\' tests', function () {

			var testStoryPlain = [
			  {
			    "pid": 1,
			    "position": {
			      "x": 702,
			      "y": 326
			    },
			    "name": "Night",
			    "tags": [
			      ""
			    ],
			    "content": "[[test|Another Passage]]",
			    "childrenNames": [
			      "[[test|Another Passage]]"
			    ]
			  },
			  {
			    "pid": 2,
			    "position": {
			      "x": 891,
			      "y": 452
			    },
			    "name": "Another Passage",
			    "tags": [
			      ""
			    ],
			    "content": "test \t\t[[Well!|Ending Passage]] \t\t",
			    "childrenNames": [
			      "[[Well!|Ending Passage]]"
			    ]
			  },
			  {
			    "pid": 3,
			    "position": {
			      "x": 1057,
			      "y": 574
			    },
			    "name": "Ending Passage",
			    "tags": [
			      ""
			    ],
			    "content": "THE END \t\t",
			    "childrenNames": []
			  }
			]

 			it('\'build\' properly creates a simple hierarchical story', function () {
				expect(treebuilder.build(testStoryPlain)).to.have.length(1);
				expect(treebuilder.build(testStoryPlain)[0].pid).to.be.equal(1);
			});
   	});
  }
);
