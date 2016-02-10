"use strict";

var Node = require('./Node');

/**
 *
 * @param lines
 * @returns {Node[]}
 */
function process(lines) {
    var listOfRootNodes = [];
    lines = lines
        .filter(function(line) { return !line.match(/^#/); }) // comments
        .filter(Boolean) // empty lines
        .filter(function(line) { return line.indexOf("=") > 0; }) // Lines without =
    ;
    lines.forEach(function(line) {
        var parts = splitWithEscape(line, "\\s*=\\s*", "=", "\\\\");

        var key = parts[0];
        var value = parts[1];

        var tokens = key.replace(/([^\\])\./g, "$1\u000b").replace(/\\\./g, ".").split("\u000b");
        var node = lookupOrCreatePathTo(tokens, listOfRootNodes);
        node.value = value !== undefined ? (value).replace(/"/g, "\\\"") : null;
    });

    return listOfRootNodes;
}

/**
 *
 * @param {string[]} tokens
 * @param {Node[]} listOfRootNodes
 */
function lookupOrCreatePathTo(tokens, listOfRootNodes) {
    var currentNode = listOfRootNodes.filter(function(node) {
        return node.key === tokens[0];
    })[0];
    if (currentNode === undefined) {
        currentNode = new Node(tokens[0], null);
        listOfRootNodes.push(currentNode);
    }
    return tokens.length === 1 ? currentNode : lookupOrCreatePathTo(tokens.slice(1), currentNode.children);
}

function splitWithEscape(str, tokenizePattern, tokenizeSequence, escapeSequence) {
    tokenizePattern = tokenizePattern.replace(new RegExp(tokenizeSequence, "g"), "\u000b");
    return str
        .replace(new RegExp("([^" + escapeSequence + "])" + tokenizeSequence, "g"), "$1\u000b")
        .replace(new RegExp(escapeSequence + tokenizeSequence), tokenizeSequence)
        .split(new RegExp(tokenizePattern));
}

module.exports = {
    process: process
};