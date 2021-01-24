var roleRunner = {


    /** @param {Creep} creep **/
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceId);
        var harvester = Game.creeps[creep.memory.harvesterName];
        
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.droppingOff) {
            if (harvester != null) {
                if (harvester.memory.containerX) {
                    var containered = false;
                    var container = creep.room.lookForAt(LOOK_STRUCTURES, harvester.memory.containerX, harvester.memory.containerY);
                    _.each(container, function(s) {
                        if (s.structureType == STRUCTURE_CONTAINER) {
                            var r = creep.withdraw(s, RESOURCE_ENERGY);
                            //console.log(r, ERR_NOT_IN_RANGE);
                            if (r == ERR_NOT_IN_RANGE) {
                                creep.moveTo(s);
                                containered = true;
                            }
                            else if (r == OK) {
                                containered = true;
                            }
                        }
                    });
                    if (containered) {
                        return;
                    } else {
                        var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                        if (spawn.memory.sources[creep.memory.sourceId].linkId) {
                            if (spawn.memory.storages) {
                                var s = Game.getObjectById(spawn.memory.storages[0]); // only one storage per room for now.
                                if(creep.withdraw(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(s);
                                }
                            }
                        }
                    }
                }
                
                

                // go to the associated harvester
                var energy = creep.room.find(FIND_DROPPED_RESOURCES, {
                   filter: function(e) {
                       return e.pos.x == harvester.pos.x && e.pos.y == harvester.pos.y;
                   }
                });
                
                if(energy.length > 0) {
                    if(creep.pickup(energy[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy[0]);
                    }
                }
            }
        } else {
            var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            // drop it off somewhere
            var target;
            if(spawn && spawn.memory.needEnergy) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN ||
                              structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity)
                        );
                    }
                });
                if (!target) {
                    // drop off at an upgrader
                    target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                        filter: (creep) => {
                            return (creep.memory.role == "upgrader" && creep.carry.energy < (creep.carryCapacity - 25));
                        }
                    });
                }
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN ||
                              structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || 
                            ((structure.structureType == STRUCTURE_CONTAINER ||
                              structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                        );
                    }
                });
            }
            
            if(target!= null) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                
                if (creep.carry.energy == 0) {
                    creep.memory.droppingOff = false;
                } else {
                    creep.memory.droppingOff = true;
                }
            }
        }
	}
};


module.exports = roleRunner;