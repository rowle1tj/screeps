require('prototype.spawn')();
require('prototype.creep')();

var markets = require('markets');

module.exports.loop = function () {
    // clean up creep memory
    var deadCreeps = [];
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            deadCreeps.push(i);
            delete Memory.creeps[i];
        }
    }

    for(var name in Game.creeps) {
        Game.creeps[name].doRole();
    }
    
    _.each(Game.spawns, function(spawn) {
        spawn.cleanUpDeadCreeps(deadCreeps);
        spawn.doSpawnLoop();
        markets.doMarketCalculations(spawn.memory.terminalId, spawn.room.name, spawn);
    });
    
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
}