require("should");
var helpers = require('./helpers');

describe("Helper functions", () => {
    describe("Stripping function", () => {
        it("should strip prefix", () => {
            helpers.stripPrefixAndSuffix("foo", "", "foobar").should.be.exactly("bar");
        });
        it("should strip suffix", () => {
            helpers.stripPrefixAndSuffix("", "bar", "foobar").should.be.exactly("foo");
        });
        it("should strip both prefix and suffix", () => {
            helpers.stripPrefixAndSuffix("foo", "bar", "foobazbar").should.be.exactly("baz");
        });
    });
});