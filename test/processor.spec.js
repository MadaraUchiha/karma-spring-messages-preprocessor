require('should');
const processor = require('../lib/processor');
const Node = require('../lib/Node');

describe('Processor', () => {
    describe('.process()', () => {
        it("should process single line", () => {
            const expected = [new Node("a", "a")];
            const actual = processor.process(["a = a"]);

            expected.should.deepEqual(actual);
        });
        it("should process multiple, independent lines", () => {
            const expected = [new Node("a", "a"), new Node("b", "b")];
            const actual = processor.process(["a = a", "b = b"]);

            expected.should.deepEqual(actual);
        });
        it("should process multiple, dependent lines", () => {
            const expected = [new Node("a", "a", [new Node("b", "b")])];
            const actual = processor.process(["a = a", "a.b = b"]);

            expected.should.deepEqual(actual);
        });
        it("should process child values without parents", () => {
            const expected = [new Node("a", "", [new Node("b", "b")])];
            const actual = processor.process(["a.b = b"]);

            expected.should.deepEqual(actual);
        });
        it("should process independent line where some have children", () => {
            const expected = [new Node("a", "", [new Node("b", "b")]), new Node("c" ,"c")];
            const actual = processor.process(["a.b = b", "c = c"]);

            expected.should.deepEqual(actual);
        });
        it("should behave the same with different spaces around the = sign", () => {
            const expected = processor.process(["a.b=b", "c         =          c"]);
            const actual = processor.process(["a.b = b", "c = c"]);

            expected.should.deepEqual(actual);
        });
        it("should escape double quotes in values", () => {
            const expected = [new Node("a", "a\\\"")];
            const actual = processor.process(["a = a\""]);

            expected.should.deepEqual(actual);
        });
    });
});