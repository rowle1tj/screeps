var roleUpgradeRunner = {
    calculateBody: function(spawn) {
        var body = [CARRY,CARRY,MOVE];
        if (spawn.memory.numExtensions >= 4) {
            body.push(MOVE);
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 8) {
            body.push(MOVE);
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 10) {
            body.push(CARRY);
        }
        if (spawn.memory.numExtensions >= 12) {
            body.push(CARRY);
        }
        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // creep.room.controller
        
        var source = Game.getObjectById(creep.memory.sourceId);
        var upgrader = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: (creep) => {
                return (creep.memory.role == "upgrader" && creep.carry.energy < (creep.carryCapacity - 25));
            }
        });
        
        // this block denotes that we are dropping off energy to the upgraders
        if (creep.carry.energy <= creep.carryCapacity && creep.memory.droppingOff) {
            if (upgrader != null) {
                if(creep.transfer(upgrader, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(upgrader);
                }
                
                if (creep.carry.energy == 0) {
                    creep.memory.droppingOff = false;
                }
            }
        } else {
            var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            // picking up energy
            var target;
            if(spawn.memory.needEnergy) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_CONTAINER ||
                             structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0
                        );
                    }
                });
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN) && structure.energy > 0) || 
                            ((structure.structureType == STRUCTURE_CONTAINER ||
                              structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0)
                        );
                    }
                });
            }
            
            if(target!= null) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.droppingOff = true;
                } else {
                    creep.memory.droppingOff = false;
                }
            }
        }
	}
};


module.exports = roleUpgradeRunner;