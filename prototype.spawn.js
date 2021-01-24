require('prototype.spawn.spawning')();
require('prototype.spawn.building')();
var harvesterFunctions = require('role.harvester');
var roleRepairTower = require('role.repairTower');
var constants = require('constants');

module.exports = function() {
	StructureSpawn.prototype.initializeSpawnSources = function() {
	    this.memory.sources = {};
	    var sources = this.room.find(FIND_SOURCES);
	    var source;
	    for (var sourceIndex in sources) {
	        source = sources[sourceIndex];
	        this.memory.sources[source.id] = {
	            source: source
	        }
	    }
	};

	StructureSpawn.prototype.calculateTowers = function() {
		this.memory.towers = [];
		var towers = this.room.find(
	        FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}
	    });

	    for (var i = 0; i < towers.length; i++) {
	    	this.memory.towers.push(towers[i].id);
	    }

	    this.memory.calculateTowers = -1;
	};
	
	StructureSpawn.prototype.calculateStorage = function() {
		this.memory.storages = [];
		var storages = this.room.find(
	        FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}
	    });

	    for (var i = 0; i < storages.length; i++) {
	    	this.memory.storages.push(storages[i].id);
	    }

	    this.memory.calculateStorages = -1;
	};

	StructureSpawn.prototype.calculateContainers = function() {
		var containers = this.room.find(
	        FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}
	    });

	    for (var i = 0; i < containers.length; i++) {
	    	var container = containers[i];
	    	var closeSources = container.pos.findInRange(FIND_SOURCES, 1);
	    	if (closeSources.length == 0) { return; }
	    	var closeSource = closeSources[0];

	    	if (true || this.memory.sources[closeSource.id].containerId != container.id) {
	    		this.memory.sources[closeSource.id].containerId = container.id;
	    		this.memory.sources[closeSource.id].containerX = container.pos.x;
	    		this.memory.sources[closeSource.id].containerY = container.pos.y;


	    		if (this.memory.sources[closeSource.id].harvesterName) {
	    			var harvester = Game.creeps[this.memory.sources[closeSource.id].harvesterName];
	    			harvester.memory.containerId = container.id;
	    			harvester.memory.containerX = container.pos.x;
	    			harvester.memory.containerY = container.pos.y;
	    		}
	    	}
	    }

	    this.memory.calculateContainers = -1;
	};

	StructureSpawn.prototype.doTowerRoles = function() {
		for (var i in this.memory.towers) {
			var tower = Game.getObjectById(this.memory.towers[i])
			if (tower) {
				roleRepairTower.run(tower);
			}
		}
	};
	
	StructureSpawn.prototype.allHarvestersDead = function() {
	    for (var i in this.memory.sources) {
	        if (this.memory.sources[i].harvesterName != null) {
	            return false;
	        }
	    }
	    return true;
	};

	StructureSpawn.prototype.doSpawnLoop = function() {
	    var extensions = this.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION; } });
	    this.memory.numExtensions = extensions.length;
	    // I would like for this to be moved over to an amount saved based on the tier of creep I want to spawn.
	    if ((this.room.energyAvailable / this.room.energyCapacityAvailable) < 1.0) {
	        this.memory.needEnergy = true;
	    } else {
	        this.memory.needEnergy = false
	    }
	    
	    // report room's energy
	    new RoomVisual(this.room.name)
	        .text("Energy: " + this.room.energyAvailable + " / " + this.room.energyCapacityAvailable, this.pos.x + 2, this.pos.y, {
	            align: "left"
	        });
	    
	    /*if (extensions.length >= 8) {
	        if (this.room.energyAvailable <= 600) {
	            this.memory.needEnergy = true;
	        } else {
	            this.memory.needEnergy = false;
	        }
	    }*/
	    
	    // initialize if necessary
	    if (this.memory.sources == null) {
	        this.initializeSpawnSources();
	    }
	    if (this.memory.blueprint == null) {
	        this.initializeSpawnBlueprint();
	    }
	    if (this.memory.calculateTowers > 0) {
	    	this.memory.calculateTowers -= 1;
	    	if (this.memory.calculateTowers == 0) {
		    	this.calculateTowers();
		    }
	    }

	    if (this.memory.calculateContainers > 0) {
	    	this.memory.calculateContainers -= 1;
	    	if (this.memory.calculateContainers == 0) {
	    		this.calculateContainers();
	    	}
	    }
	    
	    if (this.memory.calculateStorage > 0) {
	    	this.memory.calculateStorage -= 1;
	    	if (this.memory.calculateStorage == 0) {
	    		this.calculateStorage();
	    	}
	    }
	    
	    // if my memory doesn't have a building priority or if the building is done, pick a new building to make.
	    if (!this.memory.constructionPriority || !Game.getObjectById(this.memory.constructionPriority)) {
	        var closestSite = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
	        if (closestSite) {
	            this.memory.constructionPriority = closestSite.id;
	        }
	    }
	    

	    //this.placeExtension();
	    
	    // check to see if harvesters need to be made
	    for (var i in this.memory.sources) {
	        
	        if (this.memory.sources[i].harvesterName == null) {
	            var creepBody = harvesterFunctions.calculateBody(this, this.memory.sources[i].linkId);
	            if (this.canCreateCreep(creepBody) == OK) {
	                var creepName = this.createCreep(creepBody, {
	                    sourceId: i,
	                    role: "harvester",
	                    linkId: this.memory.sources[i].linkId,
	                    containerX: this.memory.sources[i].containerX,
	                    containerY: this.memory.sources[i].containerY
	                });
	                this.memory.sources[i].harvesterName = creepName;
	                console.log('Spawning new harvester, ' + creepName + ', bound to source ' + i);
	                
	                var runner = Game.creeps[this.memory.sources[i].runnerName];
	                if (runner != null) {
	                    runner.memory.harvesterName = creepName;
	                }
	                this.memory.needEnergy = false;
	            } else {
	                this.memory.needEnergy = true;
	            }
	            return;
	        } else if (this.memory.sources[i].runnerName == null) {
	            var creepBody = this.calculateTargetRunner();
	            if (this.canCreateCreep(creepBody) == OK) {
	                var creepName = this.createCreep(creepBody, {
	                    sourceId: i,
	                    role: "runner",
	                    harvesterName: this.memory.sources[i].harvesterName
	                });
	                this.memory.sources[i].runnerName = creepName;
	                console.log('Spawning new runner, ' + creepName + ', bound to source ' + i);
	                
	                var harvester = Game.creeps[this.memory.sources[i].harvesterName];
	                if (harvester != null) {
	                    harvester.memory.runnerName = creepName;
	                }
	                this.memory.needEnergy = false;
	            } else {
	                this.memory.needEnergy = true;
	            }
	            return;
	        }
	        
	        // Check to see if the harvester or runner for this source is close to dying
	        var harvester = Game.creeps[this.memory.sources[i].harvesterName];
	        var runner = Game.creeps[this.memory.sources[i].runnerName];
	        if (harvester != null && harvester.ticksToLive < constants.TICKS_TO_SAVE_ENERGY_BEFORE_DEATH) {
	            this.memory.needEnergy = true;
	        }
	        if (runner != null && runner.ticksToLive < constants.TICKS_TO_SAVE_ENERGY_BEFORE_DEATH) {
	            this.memory.needEnergy = true;
	        }

	        if (this.memory.sources[i].linkId && this.memory.stockpileLinkId) {
	            var sourceLink = Game.getObjectById(this.memory.sources[i].linkId);
	            var stockpileLink = Game.getObjectById(this.memory.stockpileLinkId);
	            if (sourceLink && stockpileLink && sourceLink.energy > 200 && (stockpileLink.energyCapacity - stockpileLink.energy) >= 200) {
	                sourceLink.transferEnergy(stockpileLink);
	            }
	        }
	    }

	    if (!this.spawnBuilder()) { return; }
	    if (!this.spawnUpgrader()) { return; }
	    if (!this.spawnUpgradeRunner()) { return; }
	    
	    if (this.spawnCreeps()) {
	        return;
	    }
	    this.spawnExtras();
	    this.spawnRemoteCreeps();
	    
	    this.spawnMiner();

	    this.doTowerRoles();
	    
	    /*
	        new RoomVisual(this.room.name)
	        .circle(10,20, {
	            radius: 1
	        })
	        .line(0,0,10,20);
	    */
	    // this.room.energyAvailable / this.room.energyCapacityAvailable
	}
};