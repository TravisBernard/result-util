/**
 * Represents a successful result with a value.
 */
export type ResultOk<O> = { ok: true; value: O };

/**
 * Represents an error result with an error.
 */
export type ResultErr<E> = { ok: false; error: E };

/**
 * Represents a result that can either be successful or an error.
 */
export type Result<O, E> = ResultOk<O> | ResultErr<E>;

/**
 * Represents any result, with unknown value and error types.
 */
export type AnyResult = Result<unknown, unknown>;

/**
 * Creates a successful result.
 * @returns A ResultOk object with undefined value.
 */
export function Ok(): ResultOk<undefined>;

/**
 * Creates a successful result.
 * @param value - The value to wrap in a successful result.
 * @returns A ResultOk object.
 */
export function Ok<O>(value: O): ResultOk<O>;

export function Ok<O>(value?: O): ResultOk<O | undefined> {
    return { ok: true, value };
}

/**
 * Creates an error result.
 * @returns A ResultErr object with undefined error.
 */
export function Err(): ResultErr<undefined>;

/**
 * Creates an error result.
 * @param error - The error to wrap in an error result.
 * @returns A ResultErr object.
 */
export function Err<E>(error: E): ResultErr<E>;

export function Err<E>(error?: E): ResultErr<E | undefined> {
    return { ok: false, error };
}

/**
 * Checks if a result is a successful result.
 * @param result - The result to check.
 * @returns True if the result is a ResultOk, false otherwise.
 */
export function isOk<O>(result: Result<O, unknown>): result is ResultOk<O> {
    return result.ok === true;
}

/**
 * Checks if a result is an error result.
 * @param result - The result to check.
 * @returns True if the result is a ResultErr, false otherwise.
 */
export function isErr<E>(result: Result<unknown, E>): result is ResultErr<E> {
    return result.ok === false;
}

/**
 * Error thrown by the assert* and unwrap* methods when the input does not match the expected type.
 */
export class ResultMismatchError extends Error {}

/**
 * Asserts that a result is a successful result.
 * @param result - The result to assert.
 * @throws ResultMismatchError if the result is not a ResultOk.
 */
export function assertOk<O>(
    result: Result<O, unknown>,
): asserts result is ResultOk<O> {
    if (!isOk(result)) {
        throw new ResultMismatchError(`Expected Ok result, got Err`);
    }
}

/**
 * Asserts that a result is an error result.
 * @param result - The result to assert.
 * @throws ResultMismatchError if the result is not a ResultErr.
 */
export function assertErr<E>(
    result: Result<unknown, E>,
): asserts result is ResultErr<E> {
    if (!isErr(result)) {
        throw new ResultMismatchError(`Expected Err result, got Ok`);
    }
}

/**
 * Unwraps the value from a successful result.
 * @param result - The result to unwrap.
 * @returns The value of the successful result.
 * @throws ResultMismatchError if the result is not a ResultOk.
 */
export function unwrapOk<O>(result: Result<O, unknown>): O {
    assertOk(result);
    return result.value;
}

/**
 * Unwraps the error from an error result.
 * @param result - The result to unwrap.
 * @returns The error of the error result.
 * @throws ResultMismatchError if the result is not a ResultErr.
 */
export function unwrapErr<E>(result: Result<unknown, E>): E {
    assertErr(result);
    return result.error;
}

/**
 * Unwraps the value from a successful result, or returns undefined if the result is an error.
 *
 * Caution: Do not use this if undefined is a valid OK value, otherwise you won't be able to tell if your test passed or failed
 * @param result - The result to unwrap.
 * @returns The value of the successful result, or undefined.
 */
export function unwrapOkSilently<O>(result: Result<O, unknown>): O | undefined {
    if (isOk(result)) {
        return result.value;
    }
    return undefined;
}

/**
 * Unwraps the error from an error result, or returns undefined if the result is successful.
 *
 * Caution: Do not use this if undefined is a valid Err value, otherwise you won't be able to tell if your test passed or failed
 * @param result - The result to unwrap.
 * @returns The error of the error result, or undefined.
 */
export function unwrapErrSilently<E>(
    result: Result<unknown, E>,
): E | undefined {
    if (isErr(result)) {
        return result.error;
    }
    return undefined;
}
