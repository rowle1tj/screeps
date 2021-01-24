var roleMiner = {
    calculateBody: function(spawn) {
        var bodyParts = [WORK, WORK, CARRY, CARRY, MOVE] // <-- this is the minimum 0 extensions
        if (spawn.room.energyAvailable >= 450) {
            bodyParts.push(WORK);
            bodyParts.push(WORK);
        }
        if (spawn.room.energyAvailable >= 650) {
            bodyParts.push(WORK);
            bodyParts.push(CARRY);
        }
        return bodyParts;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        // memory.droppingOff
        if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.droppingOff = true;
        } else {
            creep.memory.droppingOff = false;
        }
        
        var terminal = Game.getObjectById(creep.memory.terminalId);
        
        if (RESOURCE_HYDROGEN in terminal.store && terminal.store[RESOURCE_HYDROGEN] > 250000) {
            if (creep.memory.droppingOff) {
                creep.drop(RESOURCE_HYDROGEN);
            } else {
                creep.withdraw(terminal, RESOURCE_HYDROGEN);
            }
        } else {
            if (creep.memory.droppingOff) {
                // find the closest terminal and drop off the goods
                
                if (terminal) {
                    for(var resourceType in creep.carry) {
                    	if(creep.transfer(terminal, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                            return;
                        }
                    }
                }
            } else {
                var extractor = Game.getObjectById(creep.memory.mineralId);
                if(creep.harvest(extractor) != OK) {
                    creep.moveTo(extractor);
                }
            }
        }
	}
};

module.exports = roleMiner;