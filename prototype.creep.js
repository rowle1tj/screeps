var builderFunctions = require('role.builder');
var harvesterFunctions = require('role.harvester');
var minerFunctions = require('role.miner');

var upgraderFunctions = require('role.upgrader');
var upgradeRunnerFunctions = require('role.upgradeRunner');
var scoutFunctions = require('role.scout');
var drainSquadFunctions = require('role.drainSquad');
var dismantlerFunctions = require('role.dismantler');
var attackSquadFunctions = require('role.attackSquad');
var claimerFunctions = require('role.claimer');
var extraRunnerFunctions = require('role.extraRunner');
var runnerFunctions = require('role.runner');
var reserverFunctions = require('role.reserver');

module.exports = function() {
	Creep.prototype.roleFunctions = {
		builder: function(c) {
			builderFunctions.run(c);
		},
		harvester: function(c) {
			harvesterFunctions.run(c);
		},
		miner: function(c) {
			minerFunctions.run(c);
		},
		upgrader: function(c) {
			upgraderFunctions.run(c);
		},
		upgradeRunner: function(c) {
			upgradeRunnerFunctions.run(c);
		},
		scout: function (c) {
			scoutFunctions.run(c);
		},
		drainSquad: function(c) {
			drainSquadFunctions.run(c);
		},
		dismantler: function(c) {
			dismantlerFunctions.run(c);
		},
		attackSquad: function(c) {
			attackSquadFunctions.run(c);
		},
		claimer: function(c) {
			claimerFunctions.run(c);
		},
		extraRunner: function(c) {
			extraRunnerFunctions.run(c);
		},
		runner: function(c) {
			runnerFunctions.run(c);
		},
		remoteHarvester: function(c) {
			harvesterFunctions.run(c);
		},
		reserver: function(c) {
		    reserverFunctions.run(c);
		}
	};

	Creep.prototype.doRole = function() {
		if (this.roleFunctions[this.memory.role]) {
			this.roleFunctions[this.memory.role](this);
		} else {
			console.log(`Missing the ${this.memory.role} role.`);
		}
	};
};