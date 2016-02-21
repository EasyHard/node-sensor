var fs = require('fs');
var path = require('path');
var Parser = require('../parser');
var ScopeResolver = require('../scope-resolver');
var walkASTSmart = require('../ASTHelper').walkASTSmart;
var async = require('async');

describe("ScopeResolver", function () {
    describe("Fixtures", function () {

        function runFixture(fixturePath, done) {
            var parser = new Parser();
            async.waterfall([
                (cb) => parser.parseFile(fixturePath, {loc: true}, cb),
                (ast, cb) => {
                    var scopeResolver = new ScopeResolver(ast);
                    scopeResolver.solve();
                    var asserts = require("./scope-resolver-fixtures/function-parma.js");
                    var handler = {
                        Identifier: function (node) {
                            if (asserts.constructor === Array) {
                                asserts.forEach(assert => assert(node));
                            } else if (asserts.constructor === Function ){
                                asserts(node);
                            }
                        }
                    };
                    walkASTSmart(ast, handler);
                    cb();
                },
            ], done);
        }
        var fixturesDir = './tests/scope-resolver-fixtures';
        var fixtures = fs.readdirSync(fixturesDir);
        fixtures.forEach(fixture => {
            if (fixture.match(/\.js$/)) {
                it(fixture, function (done) {
                    var fixturePath = path.join("./", fixturesDir, fixture);
                    runFixture(fixturePath, done);
                });
            }
        });
    });
});
