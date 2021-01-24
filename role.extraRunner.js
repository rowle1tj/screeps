var utils = require('utils');

function getEnergyFromTarget(creep, source) {
    if (source.targetType == 'mainBase') {
        var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
	    if(!spawn.memory.needEnergy) {
            utils.pickupFromSpawnOrExtensions(creep);
	    } else {
	        utils.pickupClosestContainer(creep);
	    }
    } else if (source.targetType == STRUCTURE_CONTAINER || source.targetType == STRUCTURE_STORAGE || source.targetType == STRUCTURE_LINK) {
        var target = Game.getObjectById(source.targetId);
        if (target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
     }else if (source.targetType == 'DROPPED_ENERGY_AROUND_SOURCE') {
        var source = Game.getObjectById(source.sourceId);
        var target;
        if (source) {
            target = source.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        } else {
            var flag = Game.flags[creep.memory.flagId];
            if (flag) {
                creep.moveTo(flag);
            }
        }
        
        if (target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

function dropOffEnergyToTarget(creep, targetType, targetId) {
    var target;
    if (targetType == 'mainBase') {
        //var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        var spawn;
        if (creep.memory.spawnTarget) {
            spawn = Game.spawns[creep.memory.spawnTarget];
        } else {
            spawn = Game.spawns[creep.memory.spawnName];
        }
        if (!spawn) {
            spawn = creep.room.find(FIND_MY_SPAWNS)[0]; // this will need to be fixed once everyone has died.
        }
        if (creep.room.name != spawn.room.name) {
            creep.moveTo(spawn);
        } else {
            if(spawn.memory.needEnergy) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                             structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity
                        );
                    }
                });
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity) || 
                            ((structure.structureType == STRUCTURE_CONTAINER ||
                              structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                        );
                    }
                });
            }
        }
    } else if (targetType == 'mainBaseOnly') {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_EXTENSION ||
                         structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity
                    );
                }
            });
    } else if (targetType == STRUCTURE_CONTAINER || targetType == STRUCTURE_CONTAINER || targetType == STRUCTURE_TERMINAL || targetType == STRUCTURE_STORAGE) {
        target = Game.getObjectById(targetId);
    }
    
    if(target!= null) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
    
    if (creep.carry.energy == 0) {
        creep.memory.droppingOff = false;
    } else {
        creep.memory.droppingOff = true;
    }
}

var roleExtraRunner = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //{source: { targetType: STRUCTURE_CONTAINER, targetId: "theId"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "SOMETHING"}
        
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.droppingOff) {
            // get energy from the source
            getEnergyFromTarget(creep, creep.memory.source);
            
        } else {
            // drop off energy at the destination
            dropOffEnergyToTarget(creep, creep.memory.destination.targetType, creep.memory.destination.targetId);
        }
	}
};


module.exports = roleExtraRunner;