require("should");
const Node = require('../lib/Node');


describe("Node", () => {
    describe(".render()", () => {
        const r = Node.render;
        it("should render Nodes without children", () => {
            const expected = `{"a":p("a")}`;
            const actual = r([
                new Node("a", "a")]);

            expected.should.be.equal(actual);
        });
        it("should render Nodes with one child", () => {
            const expected = `{"a":p("a",{"b":p("b")})}`;
            const actual = r([
                new Node("a", "a", [
                    new Node("b", "b")])]);

            expected.should.be.equal(actual);
        });
        it ("should render Nodes with multiple children", () => {
            const expected = `{"a":p("a",{"b":p("b"),"c":p("c")})}`;
            const actual = r([
                new Node("a", "a", [
                    new Node("b", "b"),
                    new Node("c", "c")])]);

            expected.should.be.equal(actual);
        });
        it ("should render Nodes with multiple levels of children", () => {
            const expected = `{"a":p("a",{"b":p("b"),"c":p("c",{"d":p("d")})})}`;
            const actual = r([
                new Node("a", "a", [
                    new Node("b", "b"),
                    new Node("c", "c", [
                        new Node("d", "d")])])]);

            expected.should.be.equal(actual);
        });
        it("should render multiple Nodes", () => {
            const expected = `{"a":p("a"),"b":p("b")}`;
            const actual = r([
                new Node("a", "a"),
                new Node("b", "b")]);

            expected.should.be.equal(actual);
        });

    });
});