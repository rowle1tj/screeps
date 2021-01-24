var extensionLimits = {
    2: 5,
    3: 10,
    4: 20,
    5: 30,
    6: 40,
    7: 50,
    8: 60,
};

module.exports = function() {
	StructureSpawn.prototype.placeConstructionSitesFromBlueprint = function() {
        var _this = this;
	    _.each(this.memory.blueprint, function(bpNode) {
	        _this.room.createConstructionSite(bpNode.x, bpNode.y, bpNode.buildingType);
	    });
	};

	StructureSpawn.prototype.addPathToBlueprint = function(path, buildingType, buildingTypeVerbose) {
        var _this = this;
	    _.each(path, function(pathNode) {
	        _this.memory.blueprint.push({
	            x: pathNode.x,
	            y: pathNode.y,
	            buildingType: STRUCTURE_ROAD,
	            buildingTypeVerbose: "Road"
	        });
	    });
	};

	StructureSpawn.prototype.initializeSpawnRoads = function() {
        var _this = this;
	    _.each(this.memory.sources, function(source) {
	        var path = _this.pos.findPathTo(source.source.pos.x, source.source.pos.y);
	        path.pop();
	        path.shift();
	        _this.addPathToBlueprint(path, STRUCTURE_ROAD, "Road");

	        PathFinder.use(false);
	        path = _this.pos.findPathTo(source.source.pos.x, source.source.pos.y, {avoid: _this.room.find(FIND_CONSTRUCTION_SITES)});
	        path.pop();
	        path.shift();
	        _this.addPathToBlueprint(path, STRUCTURE_ROAD, "Road");
	        PathFinder.use(true);
	    });

	    // Build a road from spawn to the controller
	    var path = this.pos.findPathTo(this.room.controller.pos.x, this.room.controller.pos.y);
	    path.pop(); path.pop(); path.pop();
	    path.shift();
	    this.addPathToBlueprint(path, STRUCTURE_ROAD, "Road");

	    // Build a road around the spawn
	    _.each([-1, 0, 1], function(xVal) {
	        _.each([-1, 0, 1], function(yVal) {
	            _this.memory.blueprint.push({
	                x: _this.pos.x + xVal,
	                y: _this.pos.y + yVal,
	                buildingType: STRUCTURE_ROAD,
	                buildingTypeVerbose: "Road"
	            });
	        });
	    });

	    this.placeConstructionSitesFromBlueprint();
	};

	StructureSpawn.prototype.initializeSpawnBlueprint = function() {
	    this.memory.blueprint = [];
	    this.initializeSpawnRoads();
	};

	StructureSpawn.prototype.placeExtension = function() {
        var _this = this;
        if(!this.memory.extensionLocation) {
            var numExtensions = this.room.find(FIND_CONSTRUCTION_SITES, { filter: (cs) => { return cs.structureType == STRUCTURE_EXTENSION;}})
                + this.room.find(FIND_MY_STRUCTURES, { filter: (cs) => { return cs.structureType == STRUCTURE_EXTENSION;}});
            if (numExtensions >= extensionLimits[this.room.controller.level]) { return; }
            // find a road that is close to a source and build next to that
            _.each(this.memory.sources, function(s) {
                var source = Game.getObjectById(s.source.id);
                var roadFilter = function(r) { return r.structureType == STRUCTURE_ROAD; };
                // get roads within 3 blocks
                var closeRoads = source.pos.findInRange(FIND_STRUCTURES, 3, { filter: roadFilter });
                var spawnRoads = _this.pos.findInRange(FIND_STRUCTURES, 3, { filter: roadFilter });
                var roads = source.pos.findInRange(FIND_STRUCTURES, 7, { filter: roadFilter });

                //console.log(roads.length, closeRoads.length);

                var usableRoads = _.difference(roads, closeRoads);
                usableRoads = _.difference(usableRoads, spawnRoads);

                _.each(usableRoads, function(r) {
                    //spawn.room.createConstructionSite(bpNode.x, bpNode.y, bpNode.buildingType);
                    _.each([-1, 0, 1], function(xVal) {
                        _.each([-1, 0, 1], function(yVal) {
                            var xCoord = r.pos.x + xVal;
                            var yCoord = r.pos.y + yVal;

                            // see if the space is empty
                            if (numExtensions >= extensionLimits[_this.room.controller.level]) {
                                return;
                            } else {
                                if (_this.room.lookAt(xCoord, yCoord).length == 1) { // lookAt will return a terrain object
                                    var ret = _this.room.createConstructionSite(xCoord, yCoord, STRUCTURE_EXTENSION);
                                    if (ret != OK) {
                                        _this.memory.extensionLocation = {
                                            x: xCoord,
                                            y: yCoord
                                        }
                                        numExtensions += 1;
                                    } else {
                                        _this.memory.extensionLocation = null;
                                    }
                                }
                            }
                        });
                    });
                })
            });
        } else {
            this.room.createConstructionSite(this.memory.extensionLocation.x, this.memory.extensionLocation.y, STRUCTURE_EXTENSION);
            this.memory.extensionLocation = null;
        }
    };
}