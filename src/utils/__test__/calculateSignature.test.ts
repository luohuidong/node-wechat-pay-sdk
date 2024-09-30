import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { calculateSignature } from "../calculateSignature.js";

test("sum", () => {
  const privateKey = fs.readFileSync(
    new URL("../../../files/apiclient_test_key.pem", import.meta.url).pathname,
    "utf-8"
  );

  assert.equal(
    calculateSignature({
      method: "GET",
      url: "/v3/refund/domestic/refunds/123123123123",
      timestamp: 1554208460,
      nonceStr: "593BEC0C930BF1AFEB40B4A08C8FB242",
      body: "",
      privateKey,
    }),
    "Lc9VXxmeonkdV8Xk9tmigQFLhl0vRWTerdmoRu01aAnYwIrD/5nsSwE1WlmZGLRlAFTNQ3QsMa0+VRDlJp1Wp5p0nO8EK68b5sJBbjouxaFciIfq1zfDWWz+jqhcMoKXI1A6dPm1AW7D4d30WsMTNzp6g23OXakIsh9LO3lUmwvTuE0BY8ncf6tNGk4wKmvXwERd/ZpoQY3MAVKz+Nakwc+2XBmzT66KcUehU5kr4IvGa/lEU5RZb/q00zP9VLdBhC/jQSX3X1UcJLCtEc4gTmib4tnmAT+bHF/e17ZAuxDNcx6rqT8gNEXqaJGG+1OflMSTU2tpyG65G4dMKdFcoA=="
  );
});
