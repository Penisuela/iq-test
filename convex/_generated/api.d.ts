/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as attempts from "../attempts.js";
import type * as events from "../events.js";
import type * as lib_attempt from "../lib/attempt.js";
import type * as lib_plans from "../lib/plans.js";
import type * as lib_questionBank from "../lib/questionBank.js";
import type * as lib_scoring from "../lib/scoring.js";
import type * as payments from "../payments.js";
import type * as questions from "../questions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  attempts: typeof attempts;
  events: typeof events;
  "lib/attempt": typeof lib_attempt;
  "lib/plans": typeof lib_plans;
  "lib/questionBank": typeof lib_questionBank;
  "lib/scoring": typeof lib_scoring;
  payments: typeof payments;
  questions: typeof questions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
