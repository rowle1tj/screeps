// want to do a squad based tower drain
function calculateBody(spawn) {
    var numParts = {};
    numParts[MOVE] = 10;
    numParts[HEAL] = 3;
    numParts[TOUGH] = 5;
    var bodyParts = [];
    
    var i;
    _.each([TOUGH, MOVE, HEAL], function(bodyType) {
        for (i = 0; i < numParts[bodyType]; i++) {
            bodyParts.push(bodyType);
        }
    });

    return bodyParts;
}

function calculateBeefyBody(spawn) {
    var numParts = {};
    numParts[MOVE] = 10;
    //numParts[HEAL] = 3;
    numParts[TOUGH] = 15;
    var bodyParts = [];
    
    var i;
    _.each([TOUGH, MOVE, HEAL], function(bodyType) {
        for (i = 0; i < numParts[bodyType]; i++) {
            bodyParts.push(bodyType);
        }
    });

    return bodyParts;
}

function needsHeal(creep) {
    return (creep.hitsMax - creep.hits) > (creep.getActiveBodyparts(HEAL) * 12);
}

var roleDrainSquad = {
    //require('role.scout').spawnScout("Spawn1", "ScoutFlag");
    calculateBody: calculateBody,
    calculateBeefyBody : calculateBeefyBody,
    spawnScout: function(spawnName, flagName) {
        var spawn = Game.spawns[spawnName];
        var body = calculateBody();
        var r = spawn.canCreateCreep(body);
        if (r == OK) {
            spawn.createCreep(body, "Scout", {role: "scout", flagName: flagName});
        } else {
            console.log("Can't create that creep right now: ", r);
        }
    },
    
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

        // determine if this creep needs a heal
        if(needsHeal(creep)) {
            creep.heal(creep);
            if (needsHeal(creep)) {
                creep.memory.needsHeal = true;
            } else {
                creep.memory.needsHeal = false;
            }
        } else {
            creep.memory.needsHeal = false;
        }

        // see if this creep can help a friend
        for(var i = 0; i < creep.memory.squadSize; i++) {
            var member = Game.creeps[creep.memory.squadName + "-" + i];
            if (member) {
                if (needsHeal(member)) {
                    if (creep.heal(member) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(member);
                    }
                }
            }
        }

        if (creep.memory.rollingOut || true) {
            var flag = Game.flags[creep.memory.flagName];
            if (flag) {
                creep.moveTo(flag);
            }
        }
	}
};

module.exports = roleDrainSquad;