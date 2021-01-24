// want to do a squad based tower drain
function calculateBody(spawn) {
    var numParts = {};
    //numParts[MOVE] = 10;
    //numParts[TOUGH] = 10;
    //numParts[ATTACK] = 10;
    numParts[MOVE] = 4;
    numParts[TOUGH] = 3;
    numParts[ATTACK] = 4;
    var bodyParts = [];
    
    var i;
    _.each([TOUGH, MOVE, HEAL, ATTACK], function(bodyType) {
        for (i = 0; i < numParts[bodyType]; i++) {
            bodyParts.push(bodyType);
        }
    });

    return bodyParts;
}

var roleAttackSquad = {
    calculateBody: calculateBody,
    
    /** @param {Creep} creep **/
    run: function(creep) {
        // creep.memory.squadName
        // creep.memory.squadSize
        // creep.memory.flagName
        // creep.memory.rollingOut

        // see if we need to wait for our squadmates to be spawned
        var numSquad = 0;
        for(var i = 0; i < creep.memory.squadSize; i++) {
            if (Game.creeps[creep.memory.squadName + "-" + i]) { numSquad ++;}
        }
        //console.log(numSquad, creep.memory.squadSize);
        if (numSquad == creep.memory.squadSize) {
            creep.memory.rollingOut = true;
        } else {
            creep.memory.rollingOut = false;
        }

        if (creep.memory.rollingOut || true) {
            var flag = Game.flags[creep.memory.flagId];
            if (flag) {
                // try to attack the object at the flag's location
                if (!flag.room || (flag.room && (flag.room.name != creep.room.name))) {
                    creep.moveTo(flag);
                } else {
                    var attackStructure = creep.room.lookForAt(LOOK_STRUCTURES, flag);
                    if (attackStructure.length > 0) {
                        if (creep.attack(attackStructure[0]) != OK) {
                            creep.moveTo(flag);
                        }
                    } else {
                        // look for other structures to raze
                        var structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                            filter: function(s) {
                                return s.structureType != STRUCTURE_CONTROLLER;
                            }
                        });
                        //console.log(structure.structureType, STRUCTURE_CONTROLLER);
                        if (structure) {
                            if (creep.attack(structure) != OK) {
                                creep.moveTo(structure);
                            }
                        } else {
                            var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                            if (enemy) {
                                if (creep.attack(enemy) != OK) {
                                    creep.moveTo(enemy);
                                }
                            }
                        }
                    }
                }
            }
        }
	}
};

module.exports = roleAttackSquad;