var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUpgradeRunner = require('role.upgradeRunner');
var roleClaimer = require('role.claimer');
var roleScout = require('role.scout');
var roleDrainSquad = require('role.drainSquad');
var roleAttackSquad = require('role.attackSquad');
var roleDismantler = require('role.dismantler');
var roleReserver = require('role.reserver');
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */
 
var SPAWN_1_ID = '600b0c40cbca2623f72d27e2';
var SPAWN_2_ID = '5b41c181128bc4515b583ac0';
var SPAWN_3_ID = '58adcc37542ebe81600637fb';
var SPAWN_4_ID = '58ae10fdc55c2d443852d3ec';
var SPAWN_5_ID = '58aef8e763b905d34b7cb4bd';

var targets = {};
targets[SPAWN_1_ID] = {
    "upgrader": { count: 3, calculateBody: roleUpgrader.calculateBody },
    "builder": { count:2, calculateBody: roleBuilder.calculateBody },
    "upgradeRunner": { count: 2, calculateBody: roleUpgradeRunner.calculateBody }
};

targets[SPAWN_2_ID] = {
    "upgrader": { count: 2, calculateBody: roleUpgrader.calculateBody },
    "builder": { count:1, calculateBody: roleBuilder.calculateBody },
    "upgradeRunner": { count: 1, calculateBody: roleUpgradeRunner.calculateBody },
};
/*
targets[SPAWN_3_ID] = {
    "upgrader": { count: 3, calculateBody: roleUpgrader.calculateBody },
    "builder": { count:1, calculateBody: roleBuilder.calculateBody },
    "upgradeRunner": { count: 2, calculateBody: roleUpgradeRunner.calculateBody },
};
targets[SPAWN_4_ID] = {
    "upgrader": { count: 1, calculateBody: roleUpgrader.calculateBody },
    "builder": { count:1, calculateBody: roleBuilder.calculateBody },
    "upgradeRunner": { count: 1, calculateBody: roleUpgradeRunner.calculateBody },
};
targets[SPAWN_5_ID] = {
    "upgrader": { count: 2, calculateBody: roleUpgrader.calculateBody },
}
*/

var extraRunners = {};

extraRunners[SPAWN_1_ID] = [
    //{source: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "S1-StorageRetriever"},  
    //{source: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "586eb3af05254d17606a15ca"}, runnerName: "S1-MarketMule"},
    //{source: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "586eb3af05254d17606a15ca"}, runnerName: "S1-MarketMule2"},
    //{source: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "586eb3af05254d17606a15ca"}, runnerName: "S1-MarketMule3"},
    //{source: { targetType: STRUCTURE_CONTAINER, targetId: "5861a178f73dba5374bba570"}, destination: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, runnerName: "S1-TopSourceRunner1"},
    //{source: { targetType: STRUCTURE_LINK, targetId: "58b21f053e9e3ce216dcc58a"}, destination: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, runnerName: "S1-LinkStorageManager"},
    {source: { targetType: STRUCTURE_CONTAINER, targetId: "600b679b60661132175768d5"}, destination: { targetType: STRUCTURE_CONTAINER, targetId: "600b6fedc68eb00a8e8f336a"}, runnerName: "S1-ContainerMule"}
];
/*
extraRunners[SPAWN_2_ID] = [
    {source: { targetType: STRUCTURE_STORAGE, targetId: "5864de5f3df2f46d20070722"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "S2-StorageRetriever"},
    //{source: { targetType: STRUCTURE_STORAGE, targetId: "5864de5f3df2f46d20070722"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "586ff15de3b91dd63856b4b5"}, runnerName: "S2-MarketMule"},
];
extraRunners[SPAWN_3_ID] = [
    {source: { targetType: STRUCTURE_STORAGE, targetId: "5865e060fa71eddc656f1863"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "S3-StorageRetriever"},
    {source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "5836b77f8b8b9619519f07bb"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "Spawn3-Remote-Runner"},
    {source: { targetType: STRUCTURE_LINK, targetId: "58b2189970022f4a60b8a555"}, destination: { targetType: STRUCTURE_STORAGE, targetId: "5865e060fa71eddc656f1863"}, runnerName: "S3-LinkStorageManager"},
    {source: { targetType: STRUCTURE_STORAGE, targetId: "5865e060fa71eddc656f1863"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "S3-StorageRetriever"},
];
*/

var remoteCreeps = {};
remoteCreeps[SPAWN_1_ID] = [
    //{creepName: "Attacker1", calculateBody: roleAttackSquad.calculateBody, memory: {role: "attackSquad", flagId: 'AttackMe'}},
    //{creepName: "Spawn1Defender", calculateBody: roleAttackSquad.calculateBody, memory: {role: "attackSquad", flagId: 'DefendMe'}},
    //{creepName: "ExpansionClaimer", calculateBody: roleClaimer.calculateBody, memory: {role: "claimer", flagName: "Expansion1"}},
    //{creepName: "Expansion1Upgrader", calculateBody: roleUpgrader.calculateBody, memory: {role: "upgrader", flagName: "Expansion1"}},
    //{creepName: "Expansion1Builder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion1", remote: true}},
    //{creepName: "Spawn1-Remote-Harvester", calculateBody: roleHarvester.calculateBody, memory: {role: "remoteHarvester", sourceId: '579fa8810700be0674d2db6a', flagId: 'Spawn1-RemoteMining'}},
    //{creepName: "Expansion1Builder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", remoteRoomName: "W16S53", remote: true}}
];
remoteCreeps[SPAWN_2_ID] = [

];
remoteCreeps[SPAWN_3_ID] = [
    //{creepName: "Spawn3-Remote-Harvester", calculateBody: roleHarvester.calculateBody, memory: {role: "remoteHarvester", sourceId: '5836b77f8b8b9619519f07bb', flagId: 'Spawn3-RemoteMining'}},
    //{creepName: "S3RoadBuilder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Spawn3-RemoteMining", remote: true}},
    //{creepName: "S3-RemoteReserver", calculateBody: roleReserver.calculateBody, memory: {role: "reserver", flagName: "Spawn3-RemoteMining", remote: true}},
];

module.exports = {
    TICKS_TO_SAVE_ENERGY_BEFORE_DEATH: 20,
    TARGETS: targets,
    EXTRA_RUNNERS: extraRunners,
    REMOTE_CREEPS: remoteCreeps
};