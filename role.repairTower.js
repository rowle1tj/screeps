var constants = require('constants');
var roleRepairTower = {
    
    run: function(tower) {
        var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            if (username != "Invader") {
                Game.notify(`User ${username} spotted in room ${tower.room.name}`);
            }

            if (username != "blast_o_rama" && username != "Tsungen") {
                tower.attack(hostiles[0]);
            }
        } else {
            var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType != STRUCTURE_WALL;
                }
            });
            if (structure) {
                tower.repair(structure);
            }
        }
	}
};

module.exports = roleRepairTower;