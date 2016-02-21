var walkAST = require('../ASTHelper').walkAST;
var walkASTSmart = require('../ASTHelper').walkASTSmart;
var assert = require('chai').assert;
var async = require('async');

describe("ASTHelper", function () {
    it("walkAST", function (done) {
        var ast = {
            type: "A",
            contents: [
              {type: "B", count: 1},
              {type: "B", count: 2},
              {type: "B", count: 3},
            ]
        };
        var result = 0;
        var handler = {
            A: function (node) {
                node.contents.forEach(content => this.walk(content));
            },
            B: function (node) {
                result += node.count;
            }
        };
        walkAST(ast, handler);
        assert.equal(result, 6);
        done();
    });

    it("walkAST thisForHandler", function (done) {
        var handler = {
            A: function (node) {
                assert.equal(this.mark, 100);
                done();
            }
        };
        var ast = {type: "A"};
        var thisForHandler = {mark: 100};
        walkAST(ast, handler, thisForHandler);
    });

    it("walkASTSmart", function (done) {
        var Parser = require('../parser');
        var parser = new Parser();
        async.waterfall([
            (cb) => parser.parseString("var i = 100;i = i + 1;", cb),
            (ast, cb) => {
                var count = 0;
                walkASTSmart(ast, {
                    Identifier: function (node) {
                        assert.equal(node.name, "i");
                        count += 1;
                    }
                });
                assert.equal(count, 3);
                cb();
            }], done);
    });
});
