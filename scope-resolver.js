// TODO: handle default, rest and generator.
var FunctionLevel = 'FunctionLevel';
var BlockLevel = 'BlockLevel';

function functionHandler(node) {
    var self = this;
    if (node.id)
      this.currentScope.add(node.id, node);
    this.currentScope = this.currentScope.overlay({level: FunctionLevel});
    this.params.forEach(param => {
        if (param.type === 'Identifier') {
            self.currentScope.add(param.name, param);
        } else {
            self.walk(param);
        }
    });
    this.walk(node.body);
    this.currentScope = this.currentScope.exit();
}

var handler = {
    Program: function () {},
    Function: functionHandler,
    Identifier: function (node) {
        this.resolve(node);
    },
    EmptyStatement: function () {},
    BlockStatement: function (node) {
        this.currentScope = this.currentScope.overlay({level: BlockLevel});
        this.body.forEach(node.statement => {
            this.walk(node.statement);
        });
        this.currentScope = this.currentScope.exit();
    },
    ExpressionStatement: function (node) {
        this.walk(node.expression);
    },
    IfStatement: function (node) {
        this.walk(node.test);
        this.walk(node.consequent);
        this.walk(node.alternate);
    },
    LabeledStatement: function (node) {
        this.walk(node.body);
    },
    BreakStatement: function (node) {
    },
    ContinueStatement: function () {},
    WithStatement: function (node) {
        this.walk(node.object);
        this.walk(node.body);
    },
    SwitchStatement: function (node) {
        var self = this;
        // TODO: semantic of let-switch
        if (node.lexical) {
            this.currentScope = this.currentScope.overlay({level: BlockLevel});
        }

        this.walk(node.discriminant);
        node.cases.forEach(acase => {
            self.walk(acase);
        });

        if (node.lexical) {
            this.currentScope = this.currentScope.exit();
        }
    },
    ReturnStatement: function (node) {
        this.walk(node.argument);
    },
    ThrowStatement: function (node) {
        this.walk(node.argument);
    },
    TryStatement: function (node) {
        this.walk(node.block);
        if (node.handler) {
            this.walk(node.handler);
        }
        node.guardedHandlers.forEach(guardedHandler => {
            this.walk(guardedHandler);
        })
        this.walk(node.finalizer);
    },
    WhileStatement: function (node) {
        this.walk(node.test);
        this.walk(node.body);
    },
    DoWhileStatement: function (node) {
        this.walk(node.body);
        this.walk(node.test);
    },
    ForStatement: function (node) {
        this.walk(node.init);
        this.walk(node.test);
        this.walk(node.body);
        this.walk(node.update);
    },
    ForInStatement: function (node) {
        this.walk(node.left);
        this.walk(node.right);
        this.walk(node.body);
    },
    ForOfStatement: function (node) {
        this.walk(node.left);
        this.walk(node.right);
        this.walk(node.body);
    },

    // e.g. for (let i = 0; i < 5; i++;)
    LetStatement: function (node) {
        var self = this;
        this.currentScope = this.currentScope.overlay({level: BlockLevel});
        node.head.forEach(decl => self.walk(decl));
        this.walk(node.body);
        this.currentScope = this.currentScope.exit();
    },
    DebuggerStatement: function () {},
    FunctionDeclaration: functionHandler,
    VariableDeclaration: function (node) {
        var self = this;
        this.currentDeclKind = node.kind;
        node.declarations.forEach(decl => self.walk(decl));
    },
    VariableDeclarator: function (node) {
        // TODO: handle `let` correctly
        if (id.type === 'identifier') {
            this.currentScope.add(id, node, this.currentDeclKind);
        }
        if (this.init) this.walk(init);
    },
    ThisExpression: function (node) {},
    ArrayExpression: function (node) {
        var self = this;
        node.elements.forEach(element => self.walk(element));
    },
    ObjectExpression: function (node) {
        // TODO: field-sensitive
    },
    FunctionExpression: functionHandler,
    ArrowExpression: functionHandler,
    SequenceExpression: function (node) {
        var self = this;
        node.expressions.forEach(expr => self.walk(expr));
    },
    UnaryExpression: function (node) {
        this.walk(node.argument);
    },
    BinaryExpression: function (node) {
        this.walk(node.left);
        this.walk(node.right);
    },
    AssignmentExpression: function (node) {
        this.walk(node.right);
    },
    UpdateExpression: function (node) {
        this.walk(node.argument);
    },
    LogicalExpression: function (node) {
        this.walk(node.left);
        this.walk(node.rigth);
    },
    ConditionalExpression: function (node) {
        this.walk(node.test);
        this.walk(node.alternate);
        this.walk(node.consequent);
    },
    NewExpression: function (node) {
        tihs.walk(node.callee);
        var self = this;
        node.arguments.forEach(argu => self.walk(argu));
    },
    CallExpression: function (node) {
        this.walk(node.callee);
        var self = this;
        node.arguments.forEach(argu => self.walk(argu));
    },
    MemberExpression: function (node) {
        // TODO: field-sensitive
        if (!node.computed) {
            node.scopeRef = this.resolve(node.object);
            this.walk(node.property);
        }
    }


};

function Scope(parent, options) {
    options = options || {};
    options.level = options.level || FunctionLevel;
    this.level = options.level;
    this.scope = {};
    this.parent = parent;
}

Scope.prototype.overlay = function (options) {
    var scope = new Scope(this, options);
    return scope;
}

Scope.prototype.add = function (name, node) {
    this.currentScope.add(name, node);
}

Scope.prototype.resolve = function (name) {
    var curr = this;
    while (curr != null && !curr.scope.hasOwnProperty(name)) {
        curr = curr.exit();
    }
    if (curr === null) return null;
    else return curr.scope[name];
}

Scope.prototype.exit = function () {
    return this.parent;
}

// TODO: LetStatement's scope should be statements
// after it instead of whole block.
function ScopeResolver(ast) {
    this.ast = parser.ast;
    this.currentScope = new Scope(null);
}


module.exports = ScopeResolver;