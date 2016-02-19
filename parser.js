var esprima = require('esprima'),
    fs = require('fs'),
    util = require('util'),
    async = require('async'),
    logger = require('./utils/logger');

function Parser() {

}

Parser.prototype.parseString = function parseString(content, options, cb) {
    if (options.constructor === Function) {
        cb = options;
        options = undefined;
    }
    try {
        this.ast = esprima.parse(content, options);
    } catch (e) {
        cb(e);
    } finally {
        cb(null, this.ast);
    }
};

Parser.prototype.parseFile = function parseFile(filename, options, cb) {
    if (options.constructor === Function) {
        cb = options;
        options = undefined;
    }
    var self = this;
    async.waterfall([
      fs.readFile.bind(fs, filename),
      (content, cb) => self.parseFile(content, options, cb)
    ], cb);
};


module.exports = Parser;