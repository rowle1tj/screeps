/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('markets');
 * mod.thing == 'a thing'; // true
 */
//var targetSpread = 0.1;
// UTRIUM: buyLimit 0.2, sellLimit 0.1
// LEMERGIUM: buyLimit 0.3 sellLimit 0.1
//var buyLimit = 0.1;
//var sellLimit = 0.001;
var targetEnergyCost = 600;
var batchSize = 300;
//var RESOURCE_TYPE = RESOURCE_LEMERGIUM;
//var RESOURCE_TYPE = RESOURCE_UTRIUM;
//var RESOURCE_TYPE =  RESOURCE_KEANIUM;
//var RESOURCE_NAME = 'L';
//var RESOURCE_NAME = 'U';
//var RESOURCE_NAME = 'K';

var tradingData = {
    'K': {
        buyLimit: 0.1,
        sellLimit: 0.001,
        resourceType: RESOURCE_KEANIUM
    },
    'H': {
        buyLimit: 0.25,
        sellLimit: 0.001,
        resourceType: RESOURCE_HYDROGEN
    }
};

var GREEN = '#007A16';
var RED = '#C94D4D';


function getBuyOrders(roomId, resourceType, buyLimit) {
    var buyOrders = Game.market.getAllOrders(order => order.resourceType == resourceType && 
    	order.type == ORDER_BUY && 
    	order.price >= buyLimit &&
        Game.market.calcTransactionCost(batchSize, roomId, order.roomName) < targetEnergyCost
    );
    
    if (buyOrders.length > 0) {
        // sort buyOrders from lowest to highest
        buyOrders = _.sortBy(buyOrders, function(o) {
            return o.price;
        });
    }
    
    return buyOrders;
}

function getSellOrders(roomId, resourceType, sellLimit) {
    var sellOrders = Game.market.getAllOrders(order => order.resourceType == resourceType && 
    	order.type == ORDER_SELL && 
    	order.price <= sellLimit &&
        Game.market.calcTransactionCost(batchSize, roomId, order.roomName) < targetEnergyCost
    );
    
    if (sellOrders.length > 0) {
        // sort sellOrders from lowest to highest
        sellOrders = _.sortBy(sellOrders, function(o) {
            return o.price;
        });
    }
    
    return sellOrders;
}

function buyResource(roomId, resourceType, sellLimit) {
    var sellOrders = getSellOrders(roomId, resourceType, sellLimit);
    if (sellOrders.length > 0) {
        var sellOrder = sellOrders[0];
        
        Game.market.deal(sellOrder.id, batchSize, roomId);
        console.log(`+${batchSize} ${RESOURCE_NAME} @ ${sellOrder.price}/unit. <span style="color:${RED};">-${batchSize * sellOrder.price} credits.</span>`);
        return true;
    }
    return false;
}

function sellResource(roomId, resourceType, buyLimit) {
    var buyOrders = getBuyOrders(roomId, resourceType, buyLimit);
    if (buyOrders.length > 0) {
        var buyOrder = buyOrders[buyOrders.length - 1];
        
        Game.market.deal(buyOrder.id, batchSize, roomId);
        console.log(`-${batchSize} ${resourceType} @ ${buyOrder.price}/unit. <span style="color:${GREEN};">+${batchSize * buyOrder.price} credits.</span>`);
        return true;
    }
    return false;
}

module.exports = {
    doMarketCalculations: function(terminalId, roomId, spawn) {
        if(!roomId) { return; }
        var terminal = Game.getObjectById(terminalId);
        if (!terminal) { return; }
        if(terminal.store.energy < targetEnergyCost) { return; }
        if (!spawn.memory.mineralType) { return; }
        
        if(terminal.store[spawn.memory.mineralType] > batchSize) {
            if(!sellResource(roomId, spawn.memory.mineralType, tradingData[spawn.memory.mineralType].buyLimit)) {
                buyResource(roomId, spawn.memory.mineralType, tradingData[spawn.memory.mineralType].sellLimit);
            }
        } else {
            buyResource(roomId, spawn.memory.mineralType, tradingData[spawn.memory.mineralType].sellLimit);
        }
        
    }
};