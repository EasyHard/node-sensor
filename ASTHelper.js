var logger = require('./utils/logger');
function walkAST(ast, handler) {
    var thisForHandler = {};
    function walk(node) {
        if (handler[node.type]) {
            handler[node.type].bind(thisForHandler)(node);
        } else {
            logger.info('No handler for type ', node.type);
        }
    }
    thisForHandler.walk = walk;
    walk(ast);
}

exports.walkAST = walkAST;