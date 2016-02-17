var esprima = require('esprima'),
    fs = require('fs'),
    util = require('util'),
    async = require('async'),
    logger = require('./utils/logger');

function Parser() {

}

Parser.prototype.parseString = function parseString(content, cb) {
    try {
        this.ast = esprima.parse(content);
    } catch (e) {
        cb(e);
    } finally {
        cb(null, this.ast);
    }
};

Parser.prototype.parseFile = function parseFile(filename, cb) {
    var self = this;
    async.waterfall([
      fs.readFile.bind(fs, filename),
      self.parseString
    ], cb);
};

Parser.prototype.walk = function walk(handler) {
    if (!this.ast) return;
    var self = this;
    function walkHelper(ast) {
        if (ast.type) {
            if (!handler[ast.type]) {
                logger.error('handler can not handle', ast.type);
            } else {
                handler[ast.type].bind(self)(ast);
            }
            for (var i in ast) {
                if (ast.hasOwnProperty(i)) {
                    walkHelper(ast[i]);
                }
            }
        } else if (ast.constructor === Array) {
            ast.forEach(function (node) {
                walkHelper(node);
            });
        }
    }
    walkHelper(this.ast, handler);
};

module.exports = Parser;