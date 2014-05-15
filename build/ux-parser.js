/*
* uxParser v.0.0.1
* (c) 2014, Obogo
* License: Obogo 2014. All Rights Reserved.
*/
(function(exports, global){
function setter(obj, path, setValue, fullExp, options) {
    options = options || {};
    var element = path.split("."), key;
    for (var i = 0; element.length > 1; i++) {
        key = ensureSafeMemberName(element.shift(), fullExp);
        var propertyObj = obj[key];
        if (!propertyObj) {
            propertyObj = {};
            obj[key] = propertyObj;
        }
        obj = propertyObj;
        if (obj.then && options.unwrapPromises) {
            promiseWarning(fullExp);
            if (!("$$v" in obj)) {
                (function(promise) {
                    promise.then(function(val) {
                        promise.$$v = val;
                    });
                })(obj);
            }
            if (obj.$$v === undefined) {
                obj.$$v = {};
            }
            obj = obj.$$v;
        }
    }
    key = ensureSafeMemberName(element.shift(), fullExp);
    obj[key] = setValue;
    return setValue;
}

var getterFnCache = {};

function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    ensureSafeMemberName(key2, fullExp);
    ensureSafeMemberName(key3, fullExp);
    ensureSafeMemberName(key4, fullExp);
    return !options.unwrapPromises ? function cspSafeGetter(scope, locals) {
        var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
        if (pathVal == null) return pathVal;
        pathVal = pathVal[key0];
        if (!key1) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key1];
        if (!key2) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key2];
        if (!key3) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key3];
        if (!key4) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key4];
        return pathVal;
    } : function cspSafePromiseEnabledGetter(scope, locals) {
        var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope, promise;
        if (pathVal == null) return pathVal;
        pathVal = pathVal[key0];
        if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
                promise = pathVal;
                promise.$$v = undefined;
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }
            pathVal = pathVal.$$v;
        }
        if (!key1) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key1];
        if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
                promise = pathVal;
                promise.$$v = undefined;
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }
            pathVal = pathVal.$$v;
        }
        if (!key2) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key2];
        if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
                promise = pathVal;
                promise.$$v = undefined;
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }
            pathVal = pathVal.$$v;
        }
        if (!key3) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key3];
        if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
                promise = pathVal;
                promise.$$v = undefined;
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }
            pathVal = pathVal.$$v;
        }
        if (!key4) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key4];
        if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
                promise = pathVal;
                promise.$$v = undefined;
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }
            pathVal = pathVal.$$v;
        }
        return pathVal;
    };
}

function simpleGetterFn1(key0, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    return function simpleGetterFn1(scope, locals) {
        if (scope == null) return undefined;
        return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
    };
}

function simpleGetterFn2(key0, key1, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    return function simpleGetterFn2(scope, locals) {
        if (scope == null) return undefined;
        scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
        return scope == null ? undefined : scope[key1];
    };
}

function getterFn(path, options, fullExp) {
    if (getterFnCache.hasOwnProperty(path)) {
        return getterFnCache[path];
    }
    var pathKeys = path.split("."), pathKeysLength = pathKeys.length, fn;
    if (!options.unwrapPromises && pathKeysLength === 1) {
        fn = simpleGetterFn1(pathKeys[0], fullExp);
    } else if (!options.unwrapPromises && pathKeysLength === 2) {
        fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
    } else if (options.csp) {
        if (pathKeysLength < 6) {
            fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
        } else {
            fn = function(scope, locals) {
                var i = 0, val;
                do {
                    val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
                    locals = undefined;
                    scope = val;
                } while (i < pathKeysLength);
                return val;
            };
        }
    } else {
        var code = "var p;\n";
        forEach(pathKeys, function(key, index) {
            ensureSafeMemberName(key, fullExp);
            code += "if(s == null) return undefined;\n" + "s=" + (index ? "s" : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ";\n" + (options.unwrapPromises ? "if (s && s.then) {\n" + ' pw("' + fullExp.replace(/(["\r\n])/g, "\\$1") + '");\n' + ' if (!("$$v" in s)) {\n' + " p=s;\n" + " p.$$v = undefined;\n" + " p.then(function(v) {p.$$v=v;});\n" + "}\n" + " s=s.$$v\n" + "}\n" : "");
        });
        code += "return s;";
        var evaledFnGetter = new Function("s", "k", "pw", code);
        evaledFnGetter.toString = valueFn(code);
        fn = options.unwrapPromises ? function(scope, locals) {
            return evaledFnGetter(scope, locals, promiseWarning);
        } : evaledFnGetter;
    }
    if (path !== "hasOwnProperty") {
        getterFnCache[path] = fn;
    }
    return fn;
}

"use strict";

var OPERATORS = {
    "null": function() {
        return null;
    },
    "true": function() {
        return true;
    },
    "false": function() {
        return false;
    },
    undefined: noop,
    "+": function(self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        if (isDefined(a)) {
            if (isDefined(b)) {
                return a + b;
            }
            return a;
        }
        return isDefined(b) ? b : undefined;
    },
    "-": function(self, locals, a, b) {
        a = a(self, locals);
        b = b(self, locals);
        return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
    },
    "*": function(self, locals, a, b) {
        return a(self, locals) * b(self, locals);
    },
    "/": function(self, locals, a, b) {
        return a(self, locals) / b(self, locals);
    },
    "%": function(self, locals, a, b) {
        return a(self, locals) % b(self, locals);
    },
    "^": function(self, locals, a, b) {
        return a(self, locals) ^ b(self, locals);
    },
    "=": noop,
    "===": function(self, locals, a, b) {
        return a(self, locals) === b(self, locals);
    },
    "!==": function(self, locals, a, b) {
        return a(self, locals) !== b(self, locals);
    },
    "==": function(self, locals, a, b) {
        return a(self, locals) == b(self, locals);
    },
    "!=": function(self, locals, a, b) {
        return a(self, locals) != b(self, locals);
    },
    "<": function(self, locals, a, b) {
        return a(self, locals) < b(self, locals);
    },
    ">": function(self, locals, a, b) {
        return a(self, locals) > b(self, locals);
    },
    "<=": function(self, locals, a, b) {
        return a(self, locals) <= b(self, locals);
    },
    ">=": function(self, locals, a, b) {
        return a(self, locals) >= b(self, locals);
    },
    "&&": function(self, locals, a, b) {
        return a(self, locals) && b(self, locals);
    },
    "||": function(self, locals, a, b) {
        return a(self, locals) || b(self, locals);
    },
    "&": function(self, locals, a, b) {
        return a(self, locals) & b(self, locals);
    },
    "|": function(self, locals, a, b) {
        return b(self, locals)(self, locals, a(self, locals));
    },
    "!": function(self, locals, a) {
        return !a(self, locals);
    }
};

function ensureSafeMemberName(name, fullExpression) {
    if (name === "constructor") {
        throw $parseMinErr("isecfld", 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
    }
    return name;
}

function ensureSafeObject(obj, fullExpression) {
    if (obj) {
        if (obj.constructor === obj) {
            throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
        } else if (obj.document && obj.location && obj.alert && obj.setInterval) {
            throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
        } else if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
            throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
        }
    }
    return obj;
}

var ESCAPE = {
    n: "\n",
    f: "\f",
    r: "\r",
    t: "	",
    v: "",
    "'": "'",
    '"': '"'
};

function valueFn(value) {
    return function() {
        return value;
    };
}

var promiseWarning = function promiseWarningFn(fullExp) {
    if (!$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp)) return;
    promiseWarningCache[fullExp] = true;
    $log.warn("[$parse] Promise found in the expression `" + fullExp + "`. " + "Automatic unwrapping of promises in Angular expressions is deprecated.");
};

function noop() {}

function isDefined(value) {
    return typeof value !== "undefined";
}

function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === "string" && key.charAt(0) === "$") {
        val = undefined;
    } else if (isWindow(value)) {
        val = "$WINDOW";
    } else if (value && document === value) {
        val = "$DOCUMENT";
    } else if (isScope(value)) {
        val = "$SCOPE";
    }
    return val;
}

function isWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}

function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
}

function toJson(obj, pretty) {
    if (typeof obj === "undefined") return undefined;
    return JSON.stringify(obj, toJsonReplacer, pretty ? "  " : null);
}

var $parseMinErr = minErr("$parse");

function minErr(module) {
    return function() {
        var code = arguments[0], prefix = "[" + (module ? module + ":" : "") + code + "] ", template = arguments[1], templateArgs = arguments, stringify = function(obj) {
            if (typeof obj === "function") {
                return obj.toString().replace(/ \{[\s\S]*$/, "");
            } else if (typeof obj === "undefined") {
                return "undefined";
            } else if (typeof obj !== "string") {
                return JSON.stringify(obj);
            }
            return obj;
        }, message, i;
        message = prefix + template.replace(/\{\d+\}/g, function(match) {
            var index = +match.slice(1, -1), arg;
            if (index + 2 < templateArgs.length) {
                arg = templateArgs[index + 2];
                if (typeof arg === "function") {
                    return arg.toString().replace(/ ?\{[\s\S]*$/, "");
                } else if (typeof arg === "undefined") {
                    return "undefined";
                } else if (typeof arg !== "string") {
                    return toJson(arg);
                }
                return arg;
            }
            return match;
        });
        message = message + "\nhttp://errors.angularjs.org/1.3.0-beta.8/" + (module ? module + "/" : "") + code;
        for (i = 2; i < arguments.length; i++) {
            message = message + (i == 2 ? "?" : "&") + "p" + (i - 2) + "=" + encodeURIComponent(stringify(arguments[i]));
        }
        return new Error(message);
    };
}

var lowercase = function(string) {
    return isString(string) ? string.toLowerCase() : string;
};

function isString(value) {
    return typeof value === "string";
}

function toArray(obj) {
    var result = [], i = 0, len = obj.length;
    if (obj.length !== undefined) {
        while (i < len) {
            result.push(obj[i]);
            i += 1;
        }
    } else {
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                result.push(obj[i]);
            }
        }
    }
    return result;
}

function forEach(list, method, data) {
    var i = 0, len, result, extraArgs;
    if (arguments.length > 2) {
        extraArgs = toArray(arguments);
        extraArgs.splice(0, 2);
    }
    if (list && list.length) {
        len = list.length;
        while (i < len) {
            result = method.apply(null, [ list[i], i, list ].concat(extraArgs));
            if (result !== undefined) {
                return result;
            }
            i += 1;
        }
    } else if (!(list instanceof Array)) {
        for (i in list) {
            if (list.hasOwnProperty(i)) {
                result = method.apply(null, [ list[i], i, list ].concat(extraArgs));
                if (result !== undefined) {
                    return result;
                }
            }
        }
    }
    return list;
}

function setHashKey(obj, h) {
    if (h) {
        obj.$$hashKey = h;
    } else {
        delete obj.$$hashKey;
    }
}

function extend(dst) {
    var h = dst.$$hashKey;
    forEach(arguments, function(obj) {
        if (obj !== dst) {
            forEach(obj, function(value, key) {
                dst[key] = value;
            });
        }
    });
    setHashKey(dst, h);
    return dst;
}

var Lexer = function(options) {
    this.options = options;
};

Lexer.prototype = {
    constructor: Lexer,
    lex: function(text) {
        this.text = text;
        this.index = 0;
        this.ch = undefined;
        this.lastCh = ":";
        this.tokens = [];
        var token;
        var json = [];
        while (this.index < this.text.length) {
            this.ch = this.text.charAt(this.index);
            if (this.is("\"'")) {
                this.readString(this.ch);
            } else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) {
                this.readNumber();
            } else if (this.isIdent(this.ch)) {
                this.readIdent();
                if (this.was("{,") && json[0] === "{" && (token = this.tokens[this.tokens.length - 1])) {
                    token.json = token.text.indexOf(".") === -1;
                }
            } else if (this.is("(){}[].,;:?")) {
                this.tokens.push({
                    index: this.index,
                    text: this.ch,
                    json: this.was(":[,") && this.is("{[") || this.is("}]:,")
                });
                if (this.is("{[")) json.unshift(this.ch);
                if (this.is("}]")) json.shift();
                this.index++;
            } else if (this.isWhitespace(this.ch)) {
                this.index++;
                continue;
            } else {
                var ch2 = this.ch + this.peek();
                var ch3 = ch2 + this.peek(2);
                var fn = OPERATORS[this.ch];
                var fn2 = OPERATORS[ch2];
                var fn3 = OPERATORS[ch3];
                if (fn3) {
                    this.tokens.push({
                        index: this.index,
                        text: ch3,
                        fn: fn3
                    });
                    this.index += 3;
                } else if (fn2) {
                    this.tokens.push({
                        index: this.index,
                        text: ch2,
                        fn: fn2
                    });
                    this.index += 2;
                } else if (fn) {
                    this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        fn: fn,
                        json: this.was("[,:") && this.is("+-")
                    });
                    this.index += 1;
                } else {
                    this.throwError("Unexpected next character ", this.index, this.index + 1);
                }
            }
            this.lastCh = this.ch;
        }
        return this.tokens;
    },
    is: function(chars) {
        return chars.indexOf(this.ch) !== -1;
    },
    was: function(chars) {
        return chars.indexOf(this.lastCh) !== -1;
    },
    peek: function(i) {
        var num = i || 1;
        return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function(ch) {
        return "0" <= ch && ch <= "9";
    },
    isWhitespace: function(ch) {
        return ch === " " || ch === "\r" || ch === "	" || ch === "\n" || ch === "" || ch === " ";
    },
    isIdent: function(ch) {
        return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || ch === "$";
    },
    isExpOperator: function(ch) {
        return ch === "-" || ch === "+" || this.isNumber(ch);
    },
    throwError: function(error, start, end) {
        end = end || this.index;
        var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
        throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
    },
    readNumber: function() {
        var number = "";
        var start = this.index;
        while (this.index < this.text.length) {
            var ch = lowercase(this.text.charAt(this.index));
            if (ch == "." || this.isNumber(ch)) {
                number += ch;
            } else {
                var peekCh = this.peek();
                if (ch == "e" && this.isExpOperator(peekCh)) {
                    number += ch;
                } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == "e") {
                    number += ch;
                } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == "e") {
                    this.throwError("Invalid exponent");
                } else {
                    break;
                }
            }
            this.index++;
        }
        number = 1 * number;
        this.tokens.push({
            index: start,
            text: number,
            json: true,
            fn: function() {
                return number;
            }
        });
    },
    readIdent: function() {
        var parser = this;
        var ident = "";
        var start = this.index;
        var lastDot, peekIndex, methodName, ch;
        while (this.index < this.text.length) {
            ch = this.text.charAt(this.index);
            if (ch === "." || this.isIdent(ch) || this.isNumber(ch)) {
                if (ch === ".") lastDot = this.index;
                ident += ch;
            } else {
                break;
            }
            this.index++;
        }
        if (lastDot) {
            peekIndex = this.index;
            while (peekIndex < this.text.length) {
                ch = this.text.charAt(peekIndex);
                if (ch === "(") {
                    methodName = ident.substr(lastDot - start + 1);
                    ident = ident.substr(0, lastDot - start);
                    this.index = peekIndex;
                    break;
                }
                if (this.isWhitespace(ch)) {
                    peekIndex++;
                } else {
                    break;
                }
            }
        }
        var token = {
            index: start,
            text: ident
        };
        if (OPERATORS.hasOwnProperty(ident)) {
            token.fn = OPERATORS[ident];
            token.json = OPERATORS[ident];
        } else {
            var getter = getterFn(ident, this.options, this.text);
            token.fn = extend(function(self, locals) {
                return getter(self, locals);
            }, {
                assign: function(self, value) {
                    return setter(self, ident, value, parser.text, parser.options);
                }
            });
        }
        this.tokens.push(token);
        if (methodName) {
            this.tokens.push({
                index: lastDot,
                text: ".",
                json: false
            });
            this.tokens.push({
                index: lastDot + 1,
                text: methodName,
                json: false
            });
        }
    },
    readString: function(quote) {
        var start = this.index;
        this.index++;
        var string = "";
        var rawString = quote;
        var escape = false;
        while (this.index < this.text.length) {
            var ch = this.text.charAt(this.index);
            rawString += ch;
            if (escape) {
                if (ch === "u") {
                    var hex = this.text.substring(this.index + 1, this.index + 5);
                    if (!hex.match(/[\da-f]{4}/i)) this.throwError("Invalid unicode escape [\\u" + hex + "]");
                    this.index += 4;
                    string += String.fromCharCode(parseInt(hex, 16));
                } else {
                    var rep = ESCAPE[ch];
                    if (rep) {
                        string += rep;
                    } else {
                        string += ch;
                    }
                }
                escape = false;
            } else if (ch === "\\") {
                escape = true;
            } else if (ch === quote) {
                this.index++;
                this.tokens.push({
                    index: start,
                    text: rawString,
                    string: string,
                    json: true,
                    fn: function() {
                        return string;
                    }
                });
                return;
            } else {
                string += ch;
            }
            this.index++;
        }
        this.throwError("Unterminated quote", start);
    }
};

var Parser = function(lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
};

Parser.ZERO = extend(function() {
    return 0;
}, {
    constant: true
});

Parser.prototype = {
    constructor: Parser,
    parse: function(text, json) {
        this.text = text;
        this.json = json;
        this.tokens = this.lexer.lex(text);
        if (json) {
            this.assignment = this.logicalOR;
            this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function() {
                this.throwError("is not valid json", {
                    text: text,
                    index: 0
                });
            };
        }
        var value = json ? this.primary() : this.statements();
        if (this.tokens.length !== 0) {
            this.throwError("is an unexpected token", this.tokens[0]);
        }
        value.literal = !!value.literal;
        value.constant = !!value.constant;
        return value;
    },
    primary: function() {
        var primary;
        if (this.expect("(")) {
            primary = this.filterChain();
            this.consume(")");
        } else if (this.expect("[")) {
            primary = this.arrayDeclaration();
        } else if (this.expect("{")) {
            primary = this.object();
        } else {
            var token = this.expect();
            primary = token.fn;
            if (!primary) {
                this.throwError("not a primary expression", token);
            }
            if (token.json) {
                primary.constant = true;
                primary.literal = true;
            }
        }
        var next, context;
        while (next = this.expect("(", "[", ".")) {
            if (next.text === "(") {
                primary = this.functionCall(primary, context);
                context = null;
            } else if (next.text === "[") {
                context = primary;
                primary = this.objectIndex(primary);
            } else if (next.text === ".") {
                context = primary;
                primary = this.fieldAccess(primary);
            } else {
                this.throwError("IMPOSSIBLE");
            }
        }
        return primary;
    },
    throwError: function(msg, token) {
        throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    peekToken: function() {
        if (this.tokens.length === 0) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
        return this.tokens[0];
    },
    peek: function(e1, e2, e3, e4) {
        if (this.tokens.length > 0) {
            var token = this.tokens[0];
            var t = token.text;
            if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
                return token;
            }
        }
        return false;
    },
    expect: function(e1, e2, e3, e4) {
        var token = this.peek(e1, e2, e3, e4);
        if (token) {
            if (this.json && !token.json) {
                this.throwError("is not valid json", token);
            }
            this.tokens.shift();
            return token;
        }
        return false;
    },
    consume: function(e1) {
        if (!this.expect(e1)) {
            this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
        }
    },
    unaryFn: function(fn, right) {
        return extend(function(self, locals) {
            return fn(self, locals, right);
        }, {
            constant: right.constant
        });
    },
    ternaryFn: function(left, middle, right) {
        return extend(function(self, locals) {
            return left(self, locals) ? middle(self, locals) : right(self, locals);
        }, {
            constant: left.constant && middle.constant && right.constant
        });
    },
    binaryFn: function(left, fn, right) {
        return extend(function(self, locals) {
            return fn(self, locals, left, right);
        }, {
            constant: left.constant && right.constant
        });
    },
    statements: function() {
        var statements = [];
        while (true) {
            if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]")) statements.push(this.filterChain());
            if (!this.expect(";")) {
                return statements.length === 1 ? statements[0] : function(self, locals) {
                    var value;
                    for (var i = 0; i < statements.length; i++) {
                        var statement = statements[i];
                        if (statement) {
                            value = statement(self, locals);
                        }
                    }
                    return value;
                };
            }
        }
    },
    filterChain: function() {
        var left = this.expression();
        var token;
        while (true) {
            if (token = this.expect("|")) {
                left = this.binaryFn(left, token.fn, this.filter());
            } else {
                return left;
            }
        }
    },
    filter: function() {
        var token = this.expect();
        var fn = this.$filter(token.text);
        var argsFn = [];
        while (true) {
            if (token = this.expect(":")) {
                argsFn.push(this.expression());
            } else {
                var fnInvoke = function(self, locals, input) {
                    var args = [ input ];
                    for (var i = 0; i < argsFn.length; i++) {
                        args.push(argsFn[i](self, locals));
                    }
                    return fn.apply(self, args);
                };
                return function() {
                    return fnInvoke;
                };
            }
        }
    },
    expression: function() {
        return this.assignment();
    },
    assignment: function() {
        var left = this.ternary();
        var right;
        var token;
        if (token = this.expect("=")) {
            if (!left.assign) {
                this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token);
            }
            right = this.ternary();
            return function(scope, locals) {
                return left.assign(scope, right(scope, locals), locals);
            };
        }
        return left;
    },
    ternary: function() {
        var left = this.logicalOR();
        var middle;
        var token;
        if (token = this.expect("?")) {
            middle = this.ternary();
            if (token = this.expect(":")) {
                return this.ternaryFn(left, middle, this.ternary());
            } else {
                this.throwError("expected :", token);
            }
        } else {
            return left;
        }
    },
    logicalOR: function() {
        var left = this.logicalAND();
        var token;
        while (true) {
            if (token = this.expect("||")) {
                left = this.binaryFn(left, token.fn, this.logicalAND());
            } else {
                return left;
            }
        }
    },
    logicalAND: function() {
        var left = this.equality();
        var token;
        if (token = this.expect("&&")) {
            left = this.binaryFn(left, token.fn, this.logicalAND());
        }
        return left;
    },
    equality: function() {
        var left = this.relational();
        var token;
        if (token = this.expect("==", "!=", "===", "!==")) {
            left = this.binaryFn(left, token.fn, this.equality());
        }
        return left;
    },
    relational: function() {
        var left = this.additive();
        var token;
        if (token = this.expect("<", ">", "<=", ">=")) {
            left = this.binaryFn(left, token.fn, this.relational());
        }
        return left;
    },
    additive: function() {
        var left = this.multiplicative();
        var token;
        while (token = this.expect("+", "-")) {
            left = this.binaryFn(left, token.fn, this.multiplicative());
        }
        return left;
    },
    multiplicative: function() {
        var left = this.unary();
        var token;
        while (token = this.expect("*", "/", "%")) {
            left = this.binaryFn(left, token.fn, this.unary());
        }
        return left;
    },
    unary: function() {
        var token;
        if (this.expect("+")) {
            return this.primary();
        } else if (token = this.expect("-")) {
            return this.binaryFn(Parser.ZERO, token.fn, this.unary());
        } else if (token = this.expect("!")) {
            return this.unaryFn(token.fn, this.unary());
        } else {
            return this.primary();
        }
    },
    fieldAccess: function(object) {
        var parser = this;
        var field = this.expect().text;
        var getter = getterFn(field, this.options, this.text);
        return extend(function(scope, locals, self) {
            return getter(self || object(scope, locals));
        }, {
            assign: function(scope, value, locals) {
                return setter(object(scope, locals), field, value, parser.text, parser.options);
            }
        });
    },
    objectIndex: function(obj) {
        var parser = this;
        var indexFn = this.expression();
        this.consume("]");
        return extend(function(self, locals) {
            var o = obj(self, locals), i = indexFn(self, locals), v, p;
            if (!o) return undefined;
            v = ensureSafeObject(o[i], parser.text);
            if (v && v.then && parser.options.unwrapPromises) {
                p = v;
                if (!("$$v" in v)) {
                    p.$$v = undefined;
                    p.then(function(val) {
                        p.$$v = val;
                    });
                }
                v = v.$$v;
            }
            return v;
        }, {
            assign: function(self, value, locals) {
                var key = indexFn(self, locals);
                var safe = ensureSafeObject(obj(self, locals), parser.text);
                return safe[key] = value;
            }
        });
    },
    functionCall: function(fn, contextGetter) {
        var argsFn = [];
        if (this.peekToken().text !== ")") {
            do {
                argsFn.push(this.expression());
            } while (this.expect(","));
        }
        this.consume(")");
        var parser = this;
        return function(scope, locals) {
            var args = [];
            var context = contextGetter ? contextGetter(scope, locals) : scope;
            for (var i = 0; i < argsFn.length; i++) {
                args.push(argsFn[i](scope, locals));
            }
            var fnPtr = fn(scope, locals, context) || noop;
            ensureSafeObject(context, parser.text);
            ensureSafeObject(fnPtr, parser.text);
            var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
            return ensureSafeObject(v, parser.text);
        };
    },
    arrayDeclaration: function() {
        var elementFns = [];
        var allConstant = true;
        if (this.peekToken().text !== "]") {
            do {
                if (this.peek("]")) {
                    break;
                }
                var elementFn = this.expression();
                elementFns.push(elementFn);
                if (!elementFn.constant) {
                    allConstant = false;
                }
            } while (this.expect(","));
        }
        this.consume("]");
        return extend(function(self, locals) {
            var array = [];
            for (var i = 0; i < elementFns.length; i++) {
                array.push(elementFns[i](self, locals));
            }
            return array;
        }, {
            literal: true,
            constant: allConstant
        });
    },
    object: function() {
        var keyValues = [];
        var allConstant = true;
        if (this.peekToken().text !== "}") {
            do {
                if (this.peek("}")) {
                    break;
                }
                var token = this.expect(), key = token.string || token.text;
                this.consume(":");
                var value = this.expression();
                keyValues.push({
                    key: key,
                    value: value
                });
                if (!value.constant) {
                    allConstant = false;
                }
            } while (this.expect(","));
        }
        this.consume("}");
        return extend(function(self, locals) {
            var object = {};
            for (var i = 0; i < keyValues.length; i++) {
                var keyValue = keyValues[i];
                object[keyValue.key] = keyValue.value(self, locals);
            }
            return object;
        }, {
            literal: true,
            constant: allConstant
        });
    }
};

var ex = exports.parser = function() {
    var lexer = new Lexer({}), $filter = {}, parser = new Parser(lexer, $filter, {
        unwrapPromises: true
    });
    return parser;
}();
}(this.ux = this.ux || {}, function() {return this;}()));
