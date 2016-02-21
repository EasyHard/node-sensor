function assertSymbol(name, atline, resolvedLine) {
    return function (node) {
        if (node.name === name && node.loc.start.line <= atline && node.loc.end.line >= atline) {
            assert.isTrue(node.scopeRef.loc.start.line <= resolvedLine);
            assert.isTrue(node.scopeRef.loc.end.line >= resolvedLine);
        }
    };
}


exports.assertSymbol = assertSymbol;
