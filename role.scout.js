function calculateBody(spawn) {
    var numParts = {
        MOVE: 10,
        HEAL: 4,
        TOUGH: 4
    }
    var bodyParts = [];
    
    var i;
    for (var partType in numParts) {
        for (i = 0; i < numParts[partType]; i++) {
            bodyParts.push(partType);
        }
    }
    return bodyParts;
}

var roleScout = {
    //require('role.scout').spawnScout("Spawn1", "ScoutFlag");
    calculateBody: calculateBody,
    spawnScout: function(spawnName, flagName) {
        var spawn = Game.spawns[spawnName];
        var body = calculateBody();
        var r = spawn.canCreateCreep(body);
        if (r == OK) {
            spawn.createCreep(body, "Scout", {role: "scout", flagId: flagName});
        } else {
            console.log("Can't create that creep right now: ", r);
        }
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if((creep.hitsMax - creep.hits) > (creep.getActiveBodyparts(HEAL) * 12)) {
            creep.heal(creep);
            if (!creep.memory.damageReported) {
                Game.notify(`Creep ${creep.name} has been shot in room ${creep.room.name} while scouting the ${creep.memory.flagId} location.`);
                creep.memory.damageReported = true;
            }
        }

        if (creep.memory.flagId) {
            var flag = Game.flags[creep.memory.flagId];

            if (creep.pos.roomName != flag.pos.roomName || creep.pos.y == 49 || creep.pos.y == 0) {
                creep.moveTo(flag);
            }
        }
	}
};

module.exports = roleScout;