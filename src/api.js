var ex = exports.parser = (function () {
    var lexer = new Lexer({}),
        $filter = {},//TODO: Bake in $filter
        parser = new Parser(lexer, $filter, {unwrapPromises: true});
    return parser;
}());