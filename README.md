# @travbern/result-util

Creates a Result type for gracefully returning from methods that may fail. Resembles Rust's Result trait.

# Usage

```shell
npm install @travbern/result-util
```

To return Result types from your functions wrap the return value with the `Ok()` or `Err()` functions

```typescript
import { Ok, Err, type Result } from "@travbern/result-util";

/**
 * The Result type takes 2 generic parameters, the first generic is the type that is returned
 * when the result is OK, the second generic is the error type
 */

function mayFail(success: boolean): Result<string, Error> {
    if (success) {
        return Ok("Success!");
    } else {
        return Err(new Error("Failure")); // Err can be any type, it does not have to extend Error
    }
}
```

To conditionally check if a result is Ok or an Err use the `isOk()` and `isErr()` functions

```typescript
import { isOk, isErr, type AnyResult } from "@travbern/result-util";

/**
 * The AnyResult convenience-type is equivalent to Result<unknown, unknown>
 * Use it when you don't want to capture the result value or when you don't care what the result value's type is
 */

function checkResult(result: AnyResult): string {
    if (isOk(result)) {
        return result.value; // Ok types have a value field with the result data
    }
    if (isErr(result)) {
        return result.error; // Err tyeps have an error field with the error data
    }
}

/**
 * Result types have an ok field you can also check directly if you hate utility functions and semantic code
 */

function checkResultManually(result: AnyResult): string {
    if (result.ok) {
        return result.value;
    }
    if (!result.ok) {
        return result.error;
    }
}
```

To expect either an Ok or an Err and to throw otherwise use the `assertOk()` or `assertErr()` functions. The `assert*` functions throw a `ResultMismatchError`

```typescript
import {assertOk, assertErr, ResultMismatchError, type AnyResult} = "@travbern/result-util"

function mustBeOk(result: AnyResult): string {
    try {
        assertOk(result);
        return "Everything's Ok";
    } catch(e) {
        if (e instanceof ResultMismatchError) {
            return "Everything's NOT OK!";
        }
        return "How'd we even get here";
    }
}

function mustBeErr(result: AnyResult): string {
    try {
        assertErr(result);
        return "Oh goody an error";
    } catch(e) {
        if (e instanceof ResultMismatchError) {
            return "It worked!... wait... it worked!?!"
        }
        return "This is the twilight zone"
    }
}
```

If you don't care about handling the Result type directly and just want to get to the data you can use the `unwrapOk()`, `unwrapErr()`, `unwrapOkSilently()` and `unwrapErrSilently()` functions.  The `unwrapOk()` and `unwrapErr()` functions will return the value or the error respectively otherwise they will throw a `ResultMismatchError` if Result is of the wrong type.  The `...Silently` variants don't throw but instead return undefined.

```typescript
import {unwrapOk, unwrapErr, unwrapOkSilently, unwrapErrSilently, type Result} = "@travbern/result-util"

function getValueOrScream<T>(result: Result<T>): T {
    try {
        return unwrapOk(result);
    } catch(e) {
        console.error("AHHHHHHHHHHHHHHHH!");
    }
}

function getErrorOrPanic<E>(result: Result<unknown, E>): E {
    try {
        return unwrapErr(result);
    } catch(e) {
        console.error("ohno ohno ohno ohno");
    }
}

/**
 * Don't use the ...Silently variants when undefined is a valid return or error type
 * otherwise you won't have any way to tell if your result actually passed or failed
 */

function getValueOrChill<T>(result: Result<T>): T | undefined {
    return unwrapOkSilently(result); 
}

function getErrorOrChill<E>(result: Result<unknown, E>): E | undefined {
    return unwrapErrSilently(result):
}
```

# Development

## Clone and set up

```shell
git clone https://github.com/TravisBernard/result-util.git
cd result-util
npm install
```

## Testing

```shell
npm run test
```

## Linting / Formatting

Linting and formatting are performed at the same time.

To run the formatter/linter and report any errors:

```shell
npm run check
```

to run the formatter/linter and automatically fix issues:

```shell
npm run fix
```

Whenever `git commit` is used the `fix` script will automatically be run as a pre-commit hook and the fixes are automatically commited as well.  To skip the precommit hook use the `--no-verify` flag on your commit.
