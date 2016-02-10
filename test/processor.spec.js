require('should');
const processor = require('../lib/processor');
const Node = require('../lib/Node');

describe('Processor', () => {
    describe('.process()', () => {
        it("should process single line", () => {
            const expected = [new Node("a", "a")];
            const actual = processor.process(["a = a"]);

            actual.should.deepEqual(expected);
        });
        it("should process multiple, independent lines", () => {
            const expected = [new Node("a", "a"), new Node("b", "b")];
            const actual = processor.process(["a = a", "b = b"]);

            actual.should.deepEqual(expected);
        });
        it("should process multiple, dependent lines", () => {
            const expected = [new Node("a", "a", [new Node("b", "b")])];
            const actual = processor.process(["a = a", "a.b = b"]);

            actual.should.deepEqual(expected);
        });
        it("should process child values without parents", () => {
            const expected = [new Node("a", null, [new Node("b", "b")])];
            const actual = processor.process(["a.b = b"]);

            actual.should.deepEqual(expected);
        });
        it("should process independent line where some have children", () => {
            const expected = [new Node("a", null, [new Node("b", "b")]), new Node("c" ,"c")];
            const actual = processor.process(["a.b = b", "c = c"]);

            actual.should.deepEqual(expected);
        });
        it("should behave the same with different spaces around the = sign", () => {
            const expected = processor.process(["a.b=b", "c         =          c"]);
            const actual = processor.process(["a.b = b", "c = c"]);

            actual.should.deepEqual(expected);
        });
        it("should escape double quotes in values", () => {
            const expected = [new Node("a", "a\\\"")];
            const actual = processor.process(["a = a\""]);

            actual.should.deepEqual(expected);
        });
        it("should pass null when there's no value, and empty string when there's empty value", () => {
            const expected = [new Node("a", ""), new Node("b", null, [new Node("c", "c")])];
            const actual = processor.process(["a =", "b.c = c"]);

            actual.should.deepEqual(expected);
        });
        it("should ignore empty lines", () => {
            const expected = processor.process(["", "a=a", ""]);
            const actual = processor.process(["a=a"]);

            actual.should.deepEqual(expected);
        });
        it("should ignore lines starting with # (comments)", () => {
            const expected = processor.process(["#this is a comment", "a=a"]);
            const actual = processor.process(["a=a"]);

            actual.should.deepEqual(expected);
        });
        it("should ignore lines which are not key=value", () => {
            const expected = processor.process(["has.no.equals.sign", "a=a"]);
            const actual = processor.process(["a=a"]);

            actual.should.deepEqual(expected);
        });
        it("should accept values with escaped . in them", () => {
            const expected = [new Node("a.", "a")];
            const actual = processor.process(["a\\.=a"]);

            actual.should.deepEqual(expected);
        });
        it("should accept values with escaped = in them", () => {
            const expected = [new Node("a=", "a")];
            const actual = processor.process(["a\\==a"]);

            actual.should.deepEqual(expected);
        });
    });
});