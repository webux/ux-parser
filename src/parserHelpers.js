function setter(obj, path, setValue, fullExp, options) {
    //needed?
    options = options || {};

    var element = path.split('.'), key;
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
                    promise.then(function(val) { promise.$$v = val; }); }
                    )(obj);
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

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    ensureSafeMemberName(key2, fullExp);
    ensureSafeMemberName(key3, fullExp);
    ensureSafeMemberName(key4, fullExp);

    return !options.unwrapPromises
        ? function cspSafeGetter(scope, locals) {
        var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;

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
    }
        : function cspSafePromiseEnabledGetter(scope, locals) {
        var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope,
            promise;

        if (pathVal == null) return pathVal;

        pathVal = pathVal[key0];
        if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
                promise = pathVal;
                promise.$$v = undefined;
                promise.then(function(val) { promise.$$v = val; });
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
                promise.then(function(val) { promise.$$v = val; });
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
                promise.then(function(val) { promise.$$v = val; });
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
                promise.then(function(val) { promise.$$v = val; });
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
                promise.then(function(val) { promise.$$v = val; });
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
        return ((locals && locals.hasOwnProperty(key0)) ? locals : scope)[key0];
    };
}

function simpleGetterFn2(key0, key1, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);

    return function simpleGetterFn2(scope, locals) {
        if (scope == null) return undefined;
        scope = ((locals && locals.hasOwnProperty(key0)) ? locals : scope)[key0];
        return scope == null ? undefined : scope[key1];
    };
}

function getterFn(path, options, fullExp) {
    // Check whether the cache has this getter already.
    // We can use hasOwnProperty directly on the cache because we ensure,
    // see below, that the cache never stores a path called 'hasOwnProperty'
    if (getterFnCache.hasOwnProperty(path)) {
        return getterFnCache[path];
    }

    var pathKeys = path.split('.'),
        pathKeysLength = pathKeys.length,
        fn;

    // When we have only 1 or 2 tokens, use optimized special case closures.
    // http://jsperf.com/angularjs-parse-getter/6
    if (!options.unwrapPromises && pathKeysLength === 1) {
        fn = simpleGetterFn1(pathKeys[0], fullExp);
    } else if (!options.unwrapPromises && pathKeysLength === 2) {
        fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
    } else if (options.csp) {
        if (pathKeysLength < 6) {
            fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp,
                options);
        } else {
            fn = function(scope, locals) {
                var i = 0, val;
                do {
                    val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++],
                        pathKeys[i++], fullExp, options)(scope, locals);

                    locals = undefined; // clear after first iteration
                    scope = val;
                } while (i < pathKeysLength);
                return val;
            };
        }
    } else {
        var code = 'var p;\n';
        forEach(pathKeys, function(key, index) {
            ensureSafeMemberName(key, fullExp);
            code += 'if(s == null) return undefined;\n' +
                's='+ (index
                // we simply dereference 's' on any .dot notation
                ? 's'
                // but if we are first then we check locals first, and if so read it first
                : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' +
                (options.unwrapPromises
                    ? 'if (s && s.then) {\n' +
                    ' pw("' + fullExp.replace(/(["\r\n])/g, '\\$1') + '");\n' +
                    ' if (!("$$v" in s)) {\n' +
                    ' p=s;\n' +
                    ' p.$$v = undefined;\n' +
                    ' p.then(function(v) {p.$$v=v;});\n' +
                    '}\n' +
                    ' s=s.$$v\n' +
                    '}\n'
                    : '');
        });
        code += 'return s;';

        /* jshint -W054 */
        var evaledFnGetter = new Function('s', 'k', 'pw', code); // s=scope, k=locals, pw=promiseWarning
        /* jshint +W054 */
        evaledFnGetter.toString = valueFn(code);
        fn = options.unwrapPromises ? function(scope, locals) {
            return evaledFnGetter(scope, locals, promiseWarning);
        } : evaledFnGetter;
    }

    // Only cache the value if it's not going to mess up the cache object
    // This is more performant that using Object.prototype.hasOwnProperty.call
    if (path !== 'hasOwnProperty') {
        getterFnCache[path] = fn;
    }
    return fn;
}