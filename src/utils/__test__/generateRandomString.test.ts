import test from "node:test";
import assert from "node:assert/strict";

import { generateRandomString } from "../generateRandomString.js";

test("sum", () => {
  assert.equal(generateRandomString(32).length, 32);
});
