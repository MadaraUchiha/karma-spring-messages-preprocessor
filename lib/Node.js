"use strict";

/**
 * @param {string} key
 * @param {string} value
 * @param {Node[]=} children
 * @constructor
 */
function Node(key, value, children) {
    this.key = key;
    this.value = value;
    this.children = children || [];
}

/*
let tree = new Node("a", "a", [
  new Node("b", "b"),
  new Node("c", "c", [
    new Node("d", "d")
  ])
]);

to

{"a": p("a", {
  "b": p("b"),
  "c": p("c", {
    "d": p("d")
  })
})
 */

function renderSingle(node) {
    var result = '"' + node.key + '":' + (node.value ? 'p("' + node.value + '"' : '');
    if (node.children.length > 0) {
        if (node.value) { result += ',' }
        result += '{';
        result += node.children.map(renderSingle).join(',');
        result += '}';
    }
    if (node.value) { result += ')'; }

    return result;
}

Node.render = function(nodes) {
    return '{' + nodes.map(renderSingle).join(',') + '}';
};

module.exports = Node;