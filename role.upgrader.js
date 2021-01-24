var utils = require('utils');
var roleUpgrader = {
    calculateBody: function(spawn) {
        var body = [WORK,WORK,CARRY,MOVE];
        if (spawn.memory.numExtensions >= 3) {
            body.push(WORK);
        }
        if (spawn.memory.numExtensions >= 6) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        if (spawn.memory.numExtensions >= 9) {
            body.push(WORK);
            body.push(CARRY);
        }

        if (spawn.room.energyAvailable >= 2000) {
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(CARRY);
            body.push(CARRY);
        }
        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.flagName) {
            var flag = Game.flags[creep.memory.flagName];
            // make sure the creep is in the same room as its designated flag
            if (!Game.rooms[flag.pos.roomName] || Game.rooms[flag.pos.roomName].name != creep.room.name) {
                creep.moveTo(flag);
                return;
            } 
            
            // if creep is out of energy, find some and pick it up.
            if (creep.carry.energy == 0) {
                var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (target) {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        return;
                    }
                }
            }
        }
        if (!creep.room.controller.sign || creep.room.controller.sign.username != 'bubbarowley') {
            if (creep.signController(creep.room.controller, 'Have fun.  Be Happy.') == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                return;
            }
        }
        
        if (creep.pos.inRangeTo(creep.room.controller, 3)) {
            // if my energy is zero, see if i can share with my neighbor
            if (creep.carry.energy > 100) {
                var adjacentCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: (creep) => {
                        return (creep.memory.role == "upgrader" && creep.carry.energy < 25);
                    }
                });
                if (adjacentCreeps.length > 0) {
                    creep.transfer(adjacentCreeps[0], RESOURCE_ENERGY, 50);
                }
            }
            creep.upgradeController(creep.room.controller);
        } else {
            creep.moveTo(creep.room.controller);
        }
	}
};


module.exports = roleUpgrader;
