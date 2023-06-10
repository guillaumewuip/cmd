import * as TaskEither from "fp-ts/TaskEither";
import * as Either from "fp-ts/Either";

import { capDelay, exponentialBackoff, limitRetries, Monoid } from "retry-ts";
import { retrying } from "retry-ts/Task";

const taskRetryPolicy = capDelay(
  6000,
  Monoid.concat(exponentialBackoff(300), limitRetries(6))
);

export const retry = <T>(action: () => TaskEither.TaskEither<Error, T>) =>
  retrying<Either.Either<Error, T>>(taskRetryPolicy, action, Either.isLeft);
