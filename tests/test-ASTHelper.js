var walkAST = require('../ASTHelper').walkAST;
var assert = require('chai').assert;

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
});