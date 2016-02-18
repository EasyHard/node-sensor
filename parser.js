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


module.exports = Parser;