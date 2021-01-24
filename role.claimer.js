var utils = require('utils');
var roleClaimer = {
    calculateBody: function(spawn) {
        var body = [CLAIM,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE];
        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log(creep.room.controller.sign.text);
        // Game.rooms['W58S54'].controller.sign
        //console.log(creep.room);
        
        
        if(creep.memory.claiming && creep.carry.energy == 0) {
            creep.memory.claiming = false;
            creep.say('collecting');
	    }
	    if(!creep.memory.claiming && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.claiming = true;
	        creep.say('claiming');
	    }
	    
	    if (creep.memory.claiming) {
            var flag = Game.flags[creep.memory.flagName];
            if (!Game.rooms[flag.pos.roomName] || Game.rooms[flag.pos.roomName].name != creep.room.name) {
                creep.moveTo(flag);
            } else {
                if (Game.rooms[flag.pos.roomName].controller.sign.username != 'bubbarowley') {
                    if (creep.signController(creep.room.controller, 'Have fun.  Be Happy.') == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                        return;
                    }
                }
                
                if (creep.upgradeController(creep.room.controller) != OK) {
                    if(creep.claimController(creep.room.controller) != OK) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
	    } else {
	        var spawn;
	        if (creep.memory.remote) {
	            spawn = Game.spawns["Spawn1"];
	        } else {
	            spawn = creep.room.find(FIND_MY_SPAWNS)[0];
	        }

	        spawn = Game.spawns["Spawn1"];
	        if(spawn.memory.needEnergy) {
	            utils.pickUpClosestDroppedEnergy(creep);
	        } else {
	            utils.pickupFromClosestEnergyStructure(creep);
	        }
	    }
	}
};

module.exports = roleClaimer;