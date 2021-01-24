var utils = require('utils');
var roleReserver = {
    calculateBody: function(spawn) {
        var body = [CLAIM,WORK,MOVE,MOVE];
        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.reserving && creep.carry.energy == 0) {
            creep.memory.reserving = false;
            creep.say('collecting');
	    }
	    if(!creep.memory.reserving && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.reserving = true;
	        creep.say('reserving');
	    }
	    
	    if (creep.memory.reserving) {
            var flag = Game.flags[creep.memory.flagName];
            if (!Game.rooms[flag.pos.roomName] || Game.rooms[flag.pos.roomName].name != creep.room.name) {
                creep.moveTo(flag);
            } else {
                if (creep.reserveController(creep.room.controller) != OK) {
                    creep.moveTo(creep.room.controller);
                }
            }
	    } else {
            var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        
            if (target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
	    }
	}
};

module.exports = roleReserver;