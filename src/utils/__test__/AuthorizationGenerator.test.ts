import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { AuthorizationGenerator } from "../AuthorizationGenerator.js";

test("AuthorizationGenerator: calculateSignature", () => {
  const authorizationGenerator = new AuthorizationGenerator({
    mchid: "xxx",
    merchantPrivateKey: fs.readFileSync(
      new URL("../../../files/apiclient_test_key.pem", import.meta.url).pathname,
      "utf-8"
    ),
    merchantSerialNo: "xxx",
  });

  assert.equal(
    authorizationGenerator._only_for_test_calculateSignature({
      method: "GET",
      url: "/v3/refund/domestic/refunds/123123123123",
      timestamp: 1554208460,
      nonceStr: "593BEC0C930BF1AFEB40B4A08C8FB242",
      body: "",
    }),
    "Lc9VXxmeonkdV8Xk9tmigQFLhl0vRWTerdmoRu01aAnYwIrD/5nsSwE1WlmZGLRlAFTNQ3QsMa0+VRDlJp1Wp5p0nO8EK68b5sJBbjouxaFciIfq1zfDWWz+jqhcMoKXI1A6dPm1AW7D4d30WsMTNzp6g23OXakIsh9LO3lUmwvTuE0BY8ncf6tNGk4wKmvXwERd/ZpoQY3MAVKz+Nakwc+2XBmzT66KcUehU5kr4IvGa/lEU5RZb/q00zP9VLdBhC/jQSX3X1UcJLCtEc4gTmib4tnmAT+bHF/e17ZAuxDNcx6rqT8gNEXqaJGG+1OflMSTU2tpyG65G4dMKdFcoA=="
  );
});

test("AuthorizationGenerator: generateRandomString", () => {
  const authorizationGenerator = new AuthorizationGenerator({
    mchid: "xxx",
    merchantPrivateKey: "xxx",
    merchantSerialNo: "xxx",
  });

  assert.equal(authorizationGenerator._only_for_test_generateRandomString(32).length, 32);
});

test("AuthorizationGenerator: getAuthorization", () => {
  const authorizationGenerator = new AuthorizationGenerator({
    mchid: "1900007291",
    merchantPrivateKey: fs.readFileSync(
      new URL("../../../files/apiclient_test_key.pem", import.meta.url).pathname,
      "utf-8"
    ),
    merchantSerialNo: "408B07E79B8269FEC3D5D3E6AB8ED163A6A380DB",
  });

  const randomStr = authorizationGenerator._only_for_test_generateAuthorization({
    method: "GET",
    url: "/v3/refund/domestic/refunds/123123123123",
    nonceStr: "593BEC0C930BF1AFEB40B4A08C8FB242",
    body: "",
    timestamp: 1554208460,
  });

  assert.equal(
    randomStr,
    'WECHATPAY2-SHA256-RSA2048 mchid="1900007291",nonce_str="593BEC0C930BF1AFEB40B4A08C8FB242",signature="Lc9VXxmeonkdV8Xk9tmigQFLhl0vRWTerdmoRu01aAnYwIrD/5nsSwE1WlmZGLRlAFTNQ3QsMa0+VRDlJp1Wp5p0nO8EK68b5sJBbjouxaFciIfq1zfDWWz+jqhcMoKXI1A6dPm1AW7D4d30WsMTNzp6g23OXakIsh9LO3lUmwvTuE0BY8ncf6tNGk4wKmvXwERd/ZpoQY3MAVKz+Nakwc+2XBmzT66KcUehU5kr4IvGa/lEU5RZb/q00zP9VLdBhC/jQSX3X1UcJLCtEc4gTmib4tnmAT+bHF/e17ZAuxDNcx6rqT8gNEXqaJGG+1OflMSTU2tpyG65G4dMKdFcoA==",timestamp="1554208460",serial_no="408B07E79B8269FEC3D5D3E6AB8ED163A6A380DB"'
  );
});
