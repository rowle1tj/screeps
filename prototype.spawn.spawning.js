var constants = require('constants');
var minerFunctions = require('role.miner');
var builderFunctions = require('role.builder');
var upgraderFunctions = require('role.upgrader');
var upgradeRunnerFunctions = require('role.upgradeRunner');

module.exports = function() {
    StructureSpawn.prototype.cleanUpDeadCreeps = function(deadCreeps) {
	    for (var i in this.memory.sources) {
	        // CHECKING FOR DEAD
	        if(_.includes(deadCreeps, this.memory.sources[i].harvesterName)) {
	            var rip = this.memory.sources[i].harvesterName;
	            this.memory.sources[i].harvesterName = null;
	            
	            var runner = Game.creeps[this.memory.sources[i].runnerName];
	            if (runner != null) {
	                runner.memory.harvesterName = null;
	            }
	        }
	        
	        if(_.includes(deadCreeps, this.memory.sources[i].runnerName)) {
	            var rip = this.memory.sources[i].runnerName;
	            this.memory.sources[i].runnerName = null;
	            
	            var harvester = Game.creeps[this.memory.sources[i].harvesterName];
	            if (harvester != null) {
	                harvester.memory.runnerName = null;
	            }
	        }
	    }
	};

	StructureSpawn.prototype.calculateTargetExtraRunner = function() {
	    return [MOVE, MOVE, CARRY, CARRY, CARRY];
	};

	StructureSpawn.prototype.calculateTargetRunner = function() {
	    var bodyParts = [MOVE, MOVE, CARRY, CARRY];
        if (this.room.energyAvailable >= 450) {
            bodyParts.push(MOVE);
            bodyParts.push(CARRY);
        }
        if (this.room.energyAvailable >= 650) {
            bodyParts.push(MOVE);
            bodyParts.push(CARRY);
            bodyParts.push(MOVE);
            bodyParts.push(CARRY);
        }

        return bodyParts;
	};

	StructureSpawn.prototype.spawnCreeps = function() {
	    var spawnTargets = constants.TARGETS[this.id];
	    for (var creepType in spawnTargets) {
	        var existingCreeps = _.filter(Game.creeps, (creep) => {
	            return creep.memory.role == creepType && this.room.name == creep.room.name && !creep.memory.remote; 
	        });
	        //console.log(spawn.name, existingCreeps.length);
	        if (existingCreeps.length < spawnTargets[creepType].count) {
	            var body = spawnTargets[creepType].calculateBody(this);

	            if (this.canCreateCreep(body) == OK) {
	                var newCreep = this.createCreep(body, null, {role: creepType, spawnName: this.name});
	                console.log('Spawning new ' + creepType + ': ' + newCreep);
	                this.memory.needEnergy = false;
	                return;
	            } else {
	                this.memory.needEnergy = true;
	                return;
	            }
	        }
	    }
	};

	StructureSpawn.prototype.spawnExtras = function() {
		var _this = this;
	    var EXTRA_RUNNERS = constants.EXTRA_RUNNERS;
	    if (EXTRA_RUNNERS[_this.id]) {
	        _.forEach(EXTRA_RUNNERS[_this.id], function(data) {
	            //{source: { targetType: STRUCTURE_CONTAINER, targetId: "theId"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "SOMETHING"}
	            var runner = Game.creeps[data.runnerName];
	            if (!runner) {
	                var body;
	                if (data.calculateBody) {
	                    body = data.calculateBody(_this);
	                } else {
	                    body = _this.calculateTargetExtraRunner();
	                }
	                if (_this.canCreateCreep(body) == OK) {
	                    var newCreep = _this.createCreep(body, data.runnerName, {role: "extraRunner", source: data.source, destination: data.destination, runnerName: data.runnerName, spawnName: _this.name});
	                    console.log('Spawning an extra runner: ' + newCreep);
	                    _this.memory.needEnergy = false;
	                    return true;
	                } else {
	                    _this.memory.needEnergy = true;
	                    return false;
	                }
	            }
	        });
	    }
	};

	StructureSpawn.prototype.spawnRemoteCreeps = function() {
		var _this = this;
	    var REMOTE_CREEPS = constants.REMOTE_CREEPS;
	    if (REMOTE_CREEPS[this.id]) {
	        _.forEach(REMOTE_CREEPS[_this.id], function(data) {
	            var creep = Game.creeps[data.creepName];
	            if (!creep) {
	                var body = data.calculateBody(_this);
	                var r = _this.canCreateCreep(body);
	                if (r == OK) {
	                    data.memory['spawnName'] = _this.name;
	                    var newCreep = _this.createCreep(body, data.creepName, data.memory);
	                    console.log('Spawning a remote creep: ' + newCreep);
	                    _this.memory.needEnergy = false;
	                    return true;
	                } else {
	                    _this.memory.needEnergy = true;
	                    return false;
	                }
	            }
	        });
	    }
	};

	StructureSpawn.prototype.spawnMiner = function() {
	    var minerName = this.name + "-Miner";
	    if (!Game.creeps[minerName]) {
	        // If there is a terminal and an extractor in the room
	        var terminal = this.room.find(FIND_MY_STRUCTURES, {
	            filter: (structure) => { 
	                return structure.structureType == STRUCTURE_TERMINAL;
	            }
	        });
	        
	        var minerals = this.room.find(FIND_MINERALS);
	        
	        if (terminal.length == 1 && minerals.length == 1) {
	            terminal = terminal[0];
	            minerals = minerals[0];
	            // don't spawn a miner if there aren't any minerals left.
	            if (minerals.mineralAmount == 0) {
	                return;
	            }
	            this.memory.terminalId = terminal.id;
	            this.memory.mineralType = minerals.mineralType;
	            
	            if (minerals.mineralType in terminal.store) {
	                if (terminal.store[minerals.mineralType] >= 250000) {
	                    return;
	                }
	            }
	            
	            var body = minerFunctions.calculateBody(this);
	            if (this.canCreateCreep(body) == OK) {
	                var mem = {
	                    role: "miner", 
	                    spawnName: this.name,
	                    mineralId: minerals.id,
	                    terminalId: terminal.id
	                }
	                
	                var newCreep = this.createCreep(body, minerName, mem);
	                console.log('Spawning a miner: ' + newCreep);
	                
	                this.memory.needEnergy = false;
	                return true;
	            } else {
	                this.memory.needEnergy = true;
	                return false;
	            }
	        }
	    }
	};

	StructureSpawn.prototype.spawnBuilder = function() {
		return this.spawnRequiredCreep("-Builder", "builder", builderFunctions.calculateBody);
	};

	StructureSpawn.prototype.spawnUpgrader = function() {
		return this.spawnRequiredCreep("-Upgrader", "upgrader", upgraderFunctions.calculateBody);
	};

	StructureSpawn.prototype.spawnUpgradeRunner = function() {
		return this.spawnRequiredCreep("-UpgradeRunner", "upgradeRunner", upgradeRunnerFunctions.calculateBody);
	};

	StructureSpawn.prototype.spawnRequiredCreep = function(creepNameExtra, creepRole, calculateBody) {
		if (!Game.creeps[this.name + creepNameExtra]) {
	        var creepBody = calculateBody(this);
	        if (this.canCreateCreep(creepBody) == OK) {
	            var creepName = this.createCreep(creepBody, this.name + creepNameExtra, {
	                role: creepRole,
	                spawnName: this.name
	            });
	            console.log(`Spawning required creep: ${creepRole}: ${creepName}`);
	            this.memory.needEnergy = false;
	            return true;
	        } else {
	            this.memory.needEnergy = true;
	            return false;
	        }
	    }
	    return true;
	};
}