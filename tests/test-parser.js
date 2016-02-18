var Parser = require('../parser');
var assert = require('chai').assert;

describe('Parser', function () {
    beforeEach(function (done) {
        this.defaultParser = new Parser();
        done();
    });

    it('parseString parses expression', function (done) {
        var self = this;
        this.defaultParser.parseString('var n = 100;', function (ast) {
            assert.isDefined(ast);
            assert.isDefined(self.defaultParser.ast);
            done();
        });
    });
    it('parseString parses illegal expression', function (done) {
        assert.throws(
          function () {
              this.defaultParser.parseString('var &n = 100;', function () {
                  done();
              });
          }, '');
        done();
    });

});