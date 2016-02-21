function f(x) {
    var t = x + 1;
    var z = 2 + x;
    var m = t + t;
}



var assertSymbol = require('../test-scope-resolver-utils').assertSymbol;

module.exports = function () {
    return [assertSymbol('x', 2, 1), assertSymbol('x', 3, 1)];
};
