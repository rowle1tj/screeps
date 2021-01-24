/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.OrderedActions');
 * mod.thing == 'a thing'; // true
 */
 
function OrderedActions() {
    this.actions = [];
}

OrderedActions.prototype.add = function(newFunction) {
    this.actions.push(newFunction);
}

OrderedActions.prototype.run = function(creep) {
    this.actions.reverse();
    var returnedTrue = false;
    while(!returnedTrue) { 
        var f = this.actions.pop();
        if (f) {
            returnedTrue = f(creep);
        } else {
            return;
        }
    }
}

module.exports = OrderedActions;