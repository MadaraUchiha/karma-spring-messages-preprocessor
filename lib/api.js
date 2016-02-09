"use strict";

var CONSTANT_PREFIX = "";
var CONSTANT_SUFFIX = "";

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