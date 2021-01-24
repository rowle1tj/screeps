/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('savedConfigs');
 * mod.thing == 'a thing'; // true
 */
/* Setting up a link
Game.getObjectById('58adcc37542ebe81600637fb').memory.stockpileLinkId = '58b2189970022f4a60b8a555'
Game.getObjectById('58adcc37542ebe81600637fb').memory.sources[''].linkId = '58b223d127750d935b83c664'
*/
 
/*
EXTRA_RUNNERS: {
    '585eb2fabadd41083417d344': [
        {source: { targetType: STRUCTURE_STORAGE, targetId: "5861c341d068fee14d695262"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "StorageRetriever"},
    ],
    // Spawn for room E66S38
    '582d410d1351e5743bf0e6d7': [ 
        //{source: { targetType: 'mainBase', targetId: null}, destination: { targetType: STRUCTURE_CONTAINER, targetId: "582fd071d5ef76c869f5a3b9"}, runnerName: "BaseToUpgraders"}
        //{source: { targetType: STRUCTURE_CONTAINER, targetId: "582fe8349b06676d713399ef"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "LongRangeRunner"},
        //{source: { targetType: STRUCTURE_CONTAINER, targetId: "582fe8349b06676d713399ef"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "LongRangeRunner2"},
        //{source: { targetType: 'mainBase', targetId: null}, destination: { targetType: STRUCTURE_CONTAINER, targetId: "582fd071d5ef76c869f5a3b9"}, runnerName: "BaseToUpgradersRunner"}
        //{source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9ecb86f108ae6e60ff0b"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "LongRangeRunner"},
        //{source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9ecb86f108ae6e60ff0b"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "LongRangeRunner2"},
        {source: { targetType: STRUCTURE_STORAGE, targetId: "58313b29fb6989ce7f9127a6"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "StorageRetriever"},
        {source: { targetType: STRUCTURE_LINK, targetId: "5841e80f63df8c5c6b19ed2a"}, destination: { targetType: STRUCTURE_STORAGE, targetId: "58313b29fb6989ce7f9127a6"}, runnerName: "LinkStorageManager"},
        /*{source: { targetType: STRUCTURE_STORAGE, targetId: "58313b29fb6989ce7f9127a6"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "583b2770b1a4a17f51e2ab8c"}, runnerName: "MarketMule",
            calculateBody: function(spawn) {
                return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
            }
        },*/
        //{source: { targetType: STRUCTURE_STORAGE, targetId: "58313b29fb6989ce7f9127a6"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "583b2770b1a4a17f51e2ab8c"}, runnerName: "MarketMule2"},
        //{source: { targetType: STRUCTURE_STORAGE, targetId: "58313b29fb6989ce7f9127a6"}, destination: { targetType: STRUCTURE_TERMINAL, targetId: "583b2770b1a4a17f51e2ab8c"}, runnerName: "MarketMule3"}
        //{source: { targetType: 'mainBase', targetId: null}, destination:  { targetType: 'mainBase', targetId: null, spawnTarget: "Spawn2"}, runnerName: "ExpansionHelper"}
    ],
    '5836284f1eb46a90488889a3': [
        {source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9edf86f108ae6e6100fb"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "E67S38-Remote-Runner"},
        {source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9edf86f108ae6e6100fb"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "E67S38-Remote-Runner2"},
        {source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9edf86f108ae6e6100fd"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "E67S38-Local-Runner"},
        {source: { targetType: STRUCTURE_STORAGE, targetId: "583a712297b1570114a1d72a"}, destination: { targetType: 'mainBaseOnly', targetId: null}, runnerName: "StorageRetriever-Spawn2"},
        // Runners for the room to the right
        {source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9ef286f108ae6e6102c4"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "E67S38-Remote-Runner-Right"},
        {source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9ef286f108ae6e6102c4"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "E67S38-Remote-Runner-Right2"},
        //{source: { targetType: 'DROPPED_ENERGY_AROUND_SOURCE', sourceId: "57ef9ef286f108ae6e6102c4"}, destination: { targetType: 'mainBase', targetId: null}, runnerName: "E67S38-Remote-Runner2"},
    ]
    },

REMOTE_CREEPS: {
        '585eb2fabadd41083417d344': [
            //{creepName: "Attacker1", calculateBody: roleAttackSquad.calculateBody, memory: {role: "attackSquad", flagId: 'AttackMe'}},
            //{creepName: "ExpansionBuilder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "ExpansionClaimer", calculateBody: roleClaimer.calculateBody, memory: {role: "claimer", flagName: "Expansion2"}},
            //{creepName: "ExpansionBuilder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "ExpansionBuilder2", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "ExpansionBuilder3", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "ExUpgrader", calculateBody: roleUpgrader.calculateBody, memory: {role: "upgrader", flagName: "Expansion2"}},
            //{creepName: "DrainSquad-0", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            //{creepName: "DrainSquad-1", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            //{creepName: "DrainSquad-2", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            //{creepName: "DrainSquad-3", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            //{creepName: "Attacker", calculateBody: roleAttackSquad.calculateBody, memory: {role: "attackSquad", flagId: 'AttackMe'}},
        ],
        // Spawn 1
        '582d410d1351e5743bf0e6d7': [
            /*{creepName: "BeefCakesSquad-0", calculateBody: roleDrainSquad.calculateBeefyBody, memory: {role: "drainSquad", squadSize: 5, flagName: "BeefCakesFlag", squadName: "BeefCakesSquad"}},
            {creepName: "BeefCakesSquad-1", calculateBody: roleDrainSquad.calculateBeefyBody, memory: {role: "drainSquad", squadSize: 5, flagName: "BeefCakesFlag", squadName: "BeefCakesSquad"}},
            {creepName: "BeefCakesSquad-2", calculateBody: roleDrainSquad.calculateBeefyBody, memory: {role: "drainSquad", squadSize: 5, flagName: "BeefCakesFlag", squadName: "BeefCakesSquad"}},
            {creepName: "BeefCakesSquad-3", calculateBody: roleDrainSquad.calculateBeefyBody, memory: {role: "drainSquad", squadSize: 5, flagName: "BeefCakesFlag", squadName: "BeefCakesSquad"}},
            {creepName: "BeefCakesSquad-4", calculateBody: roleDrainSquad.calculateBeefyBody, memory: {role: "drainSquad", squadSize: 5, flagName: "BeefCakesFlag", squadName: "BeefCakesSquad"}},*/
            /*{creepName: "DrainSquad-0", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            {creepName: "DrainSquad-1", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            {creepName: "DrainSquad-2", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            {creepName: "DrainSquad-3", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}}*/
            //{creepName: "PvTScout", calculateBody: roleScout.calculateBody, memory: {role: "scout", flagId: "PvtScoutFlag"}}
            //{creepName: "ExpansionClaimer", calculateBody: roleClaimer.calculateBody, memory: {role: "claimer", flagName: "Expansion3"}},
            //{creepName: "ExpansionBuilder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "ExpansionBuilder2", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "ExpansionBuilder3", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion2", remote: true}},
            //{creepName: "Attacker1", calculateBody: roleAttackSquad.calculateBody, memory: {role: "attackSquad", flagId: 'AttackMe'}},
        ],
        // Spawn 2
        '5836284f1eb46a90488889a3': [
            {creepName: "E67S38-Remote-Harvester", calculateBody: roleHarvester.calculateBody, memory: {role: "remoteHarvester", sourceId: '57ef9edf86f108ae6e6100fb', flagId: 'RemoteMining-1'}},
            {creepName: "E67S38-Remote-Harvester2", calculateBody: roleHarvester.calculateBody, memory: {role: "remoteHarvester", sourceId: '57ef9ef286f108ae6e6102c4', flagId: 'RemoteMining-2'}},
            //{creepName: "Attacker1", calculateBody: roleAttackSquad.calculateBody, memory: {role: "attackSquad", flagId: 'AttackMe'}},
            //{creepName: "RoadBuilder", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "RemoteMining-2", remote: true}},
            /*{creepName: "DrainSquad-0", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            {creepName: "DrainSquad-1", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            {creepName: "DrainSquad-2", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}},
            {creepName: "DrainSquad-3", calculateBody: roleDrainSquad.calculateBody, memory: {role: "drainSquad", squadSize: 4, flagName: "DrainFlag", squadName: "DrainSquad"}}*/
            {creepName: "ExpansionClaimer", calculateBody: roleClaimer.calculateBody, memory: {role: "claimer", flagName: "Expansion3"}},
            {creepName: "ExpansionBuilder1", calculateBody: roleBuilder.calculateBody, memory: {role: "builder", flagName: "Expansion3", remote: true}},
        ]
    }
*/

module.exports = {

};