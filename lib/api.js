"use strict";

var CONSTANT_PREFIX = "var getMessages = function (){\n";
CONSTANT_PREFIX += "    var r = function(val, args){\n";
CONSTANT_PREFIX += "        for(var x = 0;x<args.length;x++){\n";
CONSTANT_PREFIX += "            val = val.replace('{'+x+'}', args[x]);\n";
CONSTANT_PREFIX += "        }\n";
CONSTANT_PREFIX += "        return val;\n";
CONSTANT_PREFIX += "    };\n";
CONSTANT_PREFIX += "    var p = function() {\n";
CONSTANT_PREFIX += "        var val = arguments[0];\n";
CONSTANT_PREFIX += "        var ret;\n";
CONSTANT_PREFIX += "        if(val.indexOf('{0}') != -1)\n";
CONSTANT_PREFIX += "            ret = function(){return r(val,arguments);}\n";
CONSTANT_PREFIX += "        else ret = function(){return val;}\n";
CONSTANT_PREFIX += "        for(var x = 1; x < arguments.length;x++) {\n";
CONSTANT_PREFIX += "            for(var a in arguments[x])\n";
CONSTANT_PREFIX += "                ret[a] = arguments[x][a];\n";
CONSTANT_PREFIX += "        }\n";
CONSTANT_PREFIX += "        return ret;\n";
CONSTANT_PREFIX += "    };\n";
CONSTANT_PREFIX += "    return (";
var CONSTANT_SUFFIX = "    );\n";
CONSTANT_SUFFIX += "};\n";

var Node = require('./Node');
var processor = require('./processor');
var minimatch = require('minimatch');
var os = require('os');


var findFirstMatchingConfig = function(configsMap, fileName) {
    if(typeof configsMap === 'string') { //no map - single config to prepend/append to every processed file
        return configsMap;
    }

    //test if the current processed file matches a glob pattern in the additions map keys.
    //If match is found - use the value as the chosen config. The first match found - wins
    var result = "";
    
    //TODO: this has side effects, prefer Array.prototype.find for newer node versions
    Object.keys(configsMap).some(function(pattern) {
        if(minimatch(fileName, pattern)) {
            result = configsMap[pattern];
            return true;
        }
    });

    return result;
};

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
        var fileName = file.originalPath,
            prefix = findFirstMatchingConfig(options.prefix, fileName),
            suffix = findFirstMatchingConfig(options.suffix, fileName);
        
        log.debug("Processing %s", fileName);
        file.path = transformPath(fileName);

        var lines = content.split(os.EOL);

        var tree = processor.process(lines);

        done(null, prefix + CONSTANT_PREFIX + Node.render(tree) + CONSTANT_SUFFIX + suffix);
    };

};

createSpringMessagesPreprocessor.$inject = ['args', 'config.springMessagesPreprocessor', 'logger', 'helper'];

module.exports = {
    'preprocessor:spring-messages': ["factory", createSpringMessagesPreprocessor]
};
