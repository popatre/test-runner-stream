// https://github.com/nearform/node-test-parser#node-test-parser
const { test: tester } = require("node:test");
const assert = require("node:assert/strict");

tester("im pass tester 1", () => {
    assert.equal(true, true);
});
tester("im test 2 fail 1", () => {
    const err = new Error("HELLLLO FROM FAIL 111");
    assert.equal(true, false, err);
});
tester("im pass tester 2", () => {
    assert.equal(true, true);
});
tester("im fail 2", () => {
    assert.equal(true, false, "HELLLLO FROM FAIL2");
});
tester("im pass tester 3", () => {
    assert.equal(true, true);
});
tester("im fail test 3", () => {
    assert.equal(true, false, "HELLLLO FROM FAIL3");
});
