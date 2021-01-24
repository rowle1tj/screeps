var utils = require('utils');
var OrderedActions = require('utils.OrderedActions');

function buildTarget(creep, target) {
    var progress = target.progress;
    var progressTotal = target.progressTotal;
    var r = creep.build(target);
    if(r == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (r == OK) {
        // do things
        var numWorkParts = creep.getActiveBodyparts(WORK);
        if(progress + (creep.getActiveBodyparts(WORK) * 5) >= progressTotal) {
            creep.say("Job's done.");
            if (target.structureType == STRUCTURE_TOWER) {
                Game.spawns[creep.memory.spawnName].memory.calculateTowers = 2;
            } else if (target.structureType == STRUCTURE_CONTAINER) {
                Game.spawns[creep.memory.spawnName].memory.calculateContainers = 2;
            } else if (target.structureType == STRUCTURE_STORAGE) {
                Game.spawns[creep.memory.spawnName].memory.calculateStorage = 2;
            }
        }

        // put in a visual
        new RoomVisual(creep.room.name)
	        .text(Math.ceil((progress / progressTotal) * 100) + "%", target.pos.x, target.pos.y - 0.5, {
	            font: "10px"
	        });
    }
}

function upkeepContainers(creep) {
    // only have one builder upkeep containers
    if (!Game.spawns[creep.memory.spawnName].memory.containerUpkeeper) {
        Game.spawns[creep.memory.spawnName].memory.containerUpkeeper = creep.id;
    }
    if (creep.id != Game.spawns[creep.memory.spawnName].memory.containerUpkeeper) { return; }
    var containerTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax && o.structureType == STRUCTURE_CONTAINER;
        }
    });
    if (containerTarget) {
        if (creep.repair(containerTarget) != OK) {
            creep.moveTo(containerTarget);
        }
        return true;
    }
}

function buildSpawnConstructionPriority(creep) {
    var target = Game.getObjectById(Game.spawns[creep.memory.spawnName].memory.constructionPriority);
    //var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if(target) {
        buildTarget(creep, target);
        return true;
    }
} 

function buildClosestConstructionSite(creep) {
    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
        buildTarget(creep, target);
        return true;
    }
}

function repairSomething(creep) {
    var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(o) {
            return o.hits < o.hitsMax && o.hits < creep.memory.wallRepairLimit;
        }
    });
    if (repairTarget) {
        if (creep.repair(repairTarget) != OK) {
            creep.moveTo(repairTarget);
        }
        return true;
    } else {
        creep.memory.wallRepairLimit += 50000;
    }
}

var roleBuilder = {
    calculateBody: function(spawn) {
        var body = [WORK,CARRY,MOVE];
        if (spawn.memory.numExtensions >= 3) {
            body.push(MOVE);
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 6) {
            body.push(WORK);
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 9) {
            body.push(MOVE);
            body.push(MOVE);
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 12) {
            body.push(WORK);
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 15) {
            body.push(CARRY);
        }
        return body;
    },
    
    buildTarget: function() {
        
    },

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('energy');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }
	    if (!creep.memory.wallRepairLimit) {
	        creep.memory.wallRepairLimit = 50000;
	    }

        var flag = Game.flags[creep.memory.flagName];
	    if(creep.memory.building) {
	        if (creep.memory.remote) {
	            
	            // make sure the creep is in the same room as its designated flag
                if (!Game.rooms[flag.pos.roomName] || Game.rooms[flag.pos.roomName].name != creep.room.name) {
                    creep.moveTo(flag);
                    return;
                } 
	        }
    	   
            var orderedActions = new OrderedActions();
            orderedActions.add(upkeepContainers);
            orderedActions.add(buildSpawnConstructionPriority);
            orderedActions.add(buildClosestConstructionSite);
            orderedActions.add(repairSomething);
            orderedActions.run(creep);
	    }
	    else {
	        if (creep.memory.remote && (Game.rooms[flag.pos.roomName] && Game.rooms[flag.pos.roomName].name == creep.room.name)) {
	            if (creep.carry.energy < creep.carryCapacity) {
	                var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (target) {
                        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    } else {
    	                // find the closest source and mine from that
    	                var source = creep.pos.findClosestByPath(FIND_SOURCES);
    	                if (source) {
    	                    if (creep.harvest(source) != OK) {
    	                        creep.moveTo(source);
    	                    }
    	                }
                    }
	            } else {
	                creep.memory.building = true;
	            }
	        } else {
    	        var spawn = Game.spawns[creep.memory.spawnName];
    	        if(spawn.memory.needEnergy) {
    	            utils.pickUpClosestDroppedEnergy(creep);
    	        } else {
    	            utils.pickupFromClosestEnergyStructure(creep);
    	        }
	        }
	    }
	}
};


module.exports = roleBuilder;
