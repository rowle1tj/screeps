module.exports = {
    calculateBody: function calculateTargetHarvester(spawn) {
        /*var bodyParts = [WORK, WORK, MOVE] // <-- this is the minimum 0 extensions
        if (spawn.room.energyAvailable >= 450) {
            bodyParts.push(WORK);
            bodyParts.push(WORK);
        }
        if (spawn.room.energyAvailable >= 650) {
            bodyParts.push(WORK);
        }
        return bodyParts;*/
        return [WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY];
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, 
            {filter: {structureType: STRUCTURE_WALL}});
        if(target) {
            var r = creep.dismantle(target);
            if(r == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);    
            }
            if (r == OK) {
                var hitsAfter = target.hits;
                var energyAfter = creep.carry.energy;
                console.log(`Hits: ${hitsAfter}  Energy: ${energyAfter}`);
            }
        }
	}
};