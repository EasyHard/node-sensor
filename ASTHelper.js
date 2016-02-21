var logger = require('./utils/logger');
function walkAST(ast, handler, thisForHandler) {
    thisForHandler = thisForHandler || {};
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


function functionHandler(node) {
    var self = this;
    node.params.forEach(param => {
            self.walk(param);
    });
    this.walk(node.body);
}

var defaultHandler = {
    Program: function (node) {
        node.body.forEach(statement => this.walk(statement));
    },
    Function: functionHandler,
    EmptyStatement: function () {},
    BlockStatement: function (node) {
        node.body.forEach(statement => this.walk(statement));
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
        this.walk(node.discriminant);
        node.cases.forEach(acase => {
            self.walk(acase);
        });
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
        node.guardedHandlers.forEach(guardedHandler => this.walk(guardedHandler));
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
        node.head.forEach(decl => self.walk(decl));
        this.walk(node.body);
    },
    DebuggerStatement: function () {},
    FunctionDeclaration: functionHandler,
    VariableDeclaration: function (node) {
        var self = this;
        node.declarations.forEach(decl => self.walk(decl));
    },
    VariableDeclarator: function (node) {
        // TODO: handle `let` correctly
        this.walk(node.id);
        if (this.init) this.walk(node.init);
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
        this.walk(node.left);
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
            this.walk(node.property);
        }
    }
};

function walkASTSmart(ast, handler, thisForHandler) {
    thisForHandler = thisForHandler || {};
    function walk(node) {
        var abortDefault = false;
        if (handler[node.type]) {
            abortDefault = handler[node.type].bind(thisForHandler)(node);
        } else {
            logger.info('No handler for type ', node.type);
        }
        if (!abortDefault && defaultHandler[node.type]) {
            defaultHandler[node.type].bind(thisForHandler)(node);
        }
    }
    thisForHandler.walk = walk;
    walk(ast);
}

exports.walkAST = walkAST;
exports.walkASTSmart = walkASTSmart;
