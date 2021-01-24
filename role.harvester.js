var roleHarvester = {
    calculateBody: function calculateTargetHarvester(spawn, linkId) {
        var bodyParts = [WORK, WORK, MOVE] // <-- this is the minimum 0 extensions
        if (spawn.allHarvestersDead()) { return bodyParts; }
        if (spawn.memory.numExtensions >= 4) {
            bodyParts.push(WORK);
            bodyParts.push(WORK);
        }
        if (spawn.memory.numExtensions >= 6) {
            bodyParts.push(WORK);
        }

        if (linkId) {
            bodyParts.push(CARRY);
        }
        return bodyParts;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.sourceId);
        if (!source && creep.memory.flagId) {
            var flag = Game.flags[creep.memory.flagId];
            creep.moveTo(flag);
        }

        if (creep.memory.containerX != creep.pos.x || creep.memory.containerY != creep.pos.y) {
            creep.moveTo(creep.memory.containerX, creep.memory.containerY);
        }

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }

        var linkId = creep.memory.linkId;
        if (linkId) {
            var link = Game.getObjectById(linkId);
            if (link && creep.carry.energy == creep.carryCapacity) {
                // || link.energy < link.energyCapacity
                if(creep.transfer(link, RESOURCE_ENERGY) != OK) {
                    creep.moveTo(link);
                }
            }
        }
	}
};

module.exports = roleHarvester;