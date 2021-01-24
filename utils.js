var OrderedActions = require('utils.OrderedActions');

function pickupDroppedResources(creep) {
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (droppedResource) => {
            return droppedResource.amount > 100;
        }
    });
    
    if (target) {
        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    }
    return;
}

function pickupFromEnergyStructures(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_CONTAINER  || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= 50);
        }
    });
    
    if (target) {
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    }
}

var utils = {
    /** @param {Creep} creep **/
    pickUpClosestDroppedEnergy: function(creep) {
        var orderedActions = new OrderedActions();
        orderedActions.add(pickupDroppedResources);
        orderedActions.add(pickupFromEnergyStructures);
        orderedActions.run(creep);
    },
    
    pickupFromClosestEnergyStructure: function(creep) {
        var target;
        if (creep.memory.flagName) {
            target = Game.spawns["Spawn1"].pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy >= 50) || 
                        (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50)
                    );
                }
            });
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy >= 50) || 
                        (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50)
                    );
                }
            });
        }
        
        if (target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },
    
    pickupClosestContainer: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_CONTAINER  || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= 50);
            }
        });
        
        if (target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
    },
    
    pickupFromSpawnOrExtensions: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy >= 50;
            }
        });
        
        if (target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};


module.exports = utils;