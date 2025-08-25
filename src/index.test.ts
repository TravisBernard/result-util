import { strict as assert } from "node:assert";
import { suite, test } from "node:test";
import {
    assertErr,
    assertOk,
    Err,
    isErr,
    isOk,
    Ok,
    ResultMismatchError,
    unwrapErr,
    unwrapErrSilently,
    unwrapOk,
    unwrapOkSilently,
} from "./index.js";

suite("Ok", () => {
    test("creates a ResultOk object", () => {
        const result = Ok({ data: 42 });
        assert.strictEqual(result.ok, true);
        assert.strictEqual(result.value.data, 42);
    });

    test("can have an empty argument list", () => {
        const result = Ok();
        assert.strictEqual(result.ok, true);
        assert.strictEqual(result.value, undefined);
    });
});

suite("Err", () => {
    test("creates a ResultErr object", () => {
        const result = Err({ message: "Error occurred" });
        assert.strictEqual(result.ok, false);
        assert.strictEqual(result.error.message, "Error occurred");
    });

    test("can have an empty argument list", () => {
        const result = Err();
        assert.strictEqual(result.ok, false);
        assert.strictEqual(result.error, undefined);
    });
});

suite("isOk/isErr", () => {
    test("correctly identify ResultOk", () => {
        const result = Ok({});
        assert.strictEqual(isOk(result), true);
        assert.strictEqual(isErr(result), false);
    });

    test("correctly identify ResultErr", () => {
        const result = Err({});
        assert.strictEqual(isOk(result), false);
        assert.strictEqual(isErr(result), true);
    });
});

suite("assertOk", () => {
    test("throws on ResultErr", () => {
        const result = Err({});
        assert.throws(() => assertOk(result), ResultMismatchError);
    });

    test("does not throw on ResultOk", () => {
        const result = Ok({});
        assert.doesNotThrow(() => assertOk(result));
    });
});

suite("assertErr", () => {
    test("throws on ResultOk", () => {
        const result = Ok({});
        assert.throws(() => assertErr(result), ResultMismatchError);
    });

    test("does not throw on ResultErr", () => {
        const result = Err({});
        assert.doesNotThrow(() => assertErr(result));
    });
});

suite("unwrapOk", () => {
    test("returns value for ResultOk", () => {
        const result = Ok({ data: 42 });
        const value = unwrapOk<{ data: number }>(result);
        assert.strictEqual(value.data, 42);
    });

    test("throws on ResultErr", () => {
        const result = Err({ message: "Error occurred" });
        assert.throws(
            () => unwrapOk<{ data: number }>(result),
            ResultMismatchError,
        );
    });
});

suite("unwrapErr", () => {
    test("returns error for ResultErr", () => {
        const result = Err({ message: "Error occurred" });
        const error = unwrapErr<{ message: string }>(result);
        assert.strictEqual(error.message, "Error occurred");
    });

    test("throws on ResultOk", () => {
        const result = Ok({ data: 42 });
        assert.throws(
            () => unwrapErr<{ message: string }>(result),
            ResultMismatchError,
        );
    });
});

suite("unwrapOkSilently", () => {
    test("returns value for ResultOk", () => {
        const result = Ok({ data: 42 });
        const value = unwrapOkSilently<{ data: number }>(result);
        assert.strictEqual(value?.data, 42);
    });

    test("returns undefined for ResultErr", () => {
        const result = Err({ message: "Error occurred" });
        const value = unwrapOkSilently<{ data: number }>(result);
        assert.strictEqual(value, undefined);
    });
});

suite("unwrapErrSilently", () => {
    test("returns error for ResultErr", () => {
        const result = Err({ message: "Error occurred" });
        const error = unwrapErrSilently<{ message: string }>(result);
        assert.strictEqual(error?.message, "Error occurred");
    });

    test("returns undefined for ResultOk", () => {
        const result = Ok({ data: 42 });
        const error = unwrapErrSilently<{ message: string }>(result);
        assert.strictEqual(error, undefined);
    });
});
