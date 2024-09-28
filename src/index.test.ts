import test from "node:test";
import assert from "node:assert/strict";

import { sum } from "./index.js";

test("sum", () => {
  assert.equal(sum(1, 2), 3);
});
