"use strict";
require("should");
const preprocessor = require('../lib/api');
let preprocessorFactory;

describe("Karma spring messages preprocessor external API", () => {
    describe("structure", () => {
        it("should be as Karma expects", () => {
            preprocessor.should.be.an.Object();
            preprocessor.should.have.property("preprocessor:spring-messages").with.length(2);
        })
    });
    describe("factory", () => {
        before(() => {
            preprocessorFactory = preprocessor["preprocessor:spring-messages"][1];
        });
        it("should have 4 arguments", () => {
            preprocessorFactory.should.be.Function().with.length(4);
        });
        it("should return a function with 3 arguments", () => {
            const args = {};
            const config = {};
            const logger = {create: () => () => true};
            const helper = {
                merge: Object.assign.bind(Object)
            };
            preprocessorFactory(args, config, logger, helper).should.be.a.Function().with.length(3);
        });
    });

    describe("function", () => {
        let preprocessorFunction;
        before(() => {
            const args = {};
            const config = {};
            const logger = {create: () => ({debug: () => true})};
            const helper = {
                merge: Object.assign.bind(Object)
            };

            preprocessorFunction = preprocessorFactory(args, config, logger, helper);
        });

        it("should transform the file path", () => {
            const file = {originalPath: "foo" };
            preprocessorFunction("", file, () => {
                file.path.should.equal("foo.js");
            });
        });
    });
});