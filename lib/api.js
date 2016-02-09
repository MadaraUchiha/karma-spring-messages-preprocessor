"use strict";

var CONSTANT_PREFIX = "var getMessages = function (){\n";
CONSTANT_PREFIX += "var r = function(val, args){\n";
CONSTANT_PREFIX += "    for(var x = 0;x<args.length;x++){\n";
CONSTANT_PREFIX += "        val = val.replace('{'+x+'}', args[x]);\n";
CONSTANT_PREFIX += "    }\n";
CONSTANT_PREFIX += "    return val;\n";
CONSTANT_PREFIX += "};\n";
CONSTANT_PREFIX += "var p = function() {\n";
CONSTANT_PREFIX += "    var val = arguments[0];\n";
CONSTANT_PREFIX += "    var ret;\n";
CONSTANT_PREFIX += "    if(val.indexOf('{0}') != -1)\n";
CONSTANT_PREFIX += "        ret = function(){return r(val,arguments);}\n";
CONSTANT_PREFIX += "    else ret = function(){return val;}\n";
CONSTANT_PREFIX += "    for(var x = 1; x < arguments.length;x++) {\n";
CONSTANT_PREFIX += "        for(var a in arguments[x])\n";
CONSTANT_PREFIX += "            ret[a] = arguments[x][a];\n";
CONSTANT_PREFIX += "    }\n";
CONSTANT_PREFIX += "    return ret;\n";
CONSTANT_PREFIX += "};\n";
CONSTANT_PREFIX += "return (";
var CONSTANT_SUFFIX = "); }";

var Node = require('./Node');
var processor = require('./processor');

var createSpringMessagesPreprocessor = function(args, config, logger, helper) {
    config = config || {};
    var log = logger.create("preprocessor.spring-messages");
    var defaultOptions = {
        prefix: "", // Used for boilerplate, for example wrap in a define() call
        suffix: ""  // Used for boilerplate, for example, close function calls with );
    };

    var options = helper.merge(defaultOptions, args.options || {}, config.options || {});

    var transformPath = args.transformPath || config.transformPath || function(filepath) {
            return filepath + ".js";
        };

    return function(content, file, done) {
        log.debug("Processing %s", file.originalPath);
        file.path = transformPath(file.originalPath);

        var lines = content.split("\n");

        var tree = processor.process(lines);

        done(null, options.prefix + CONSTANT_PREFIX + Node.render(tree) + CONSTANT_SUFFIX + options.suffix);
    };

};

createSpringMessagesPreprocessor.$inject = ['args', 'config.springMessagesPreprocessor', 'logger', 'helper'];

module.exports = {
    'preprocessor:spring-messages': ["factory", createSpringMessagesPreprocessor]
};