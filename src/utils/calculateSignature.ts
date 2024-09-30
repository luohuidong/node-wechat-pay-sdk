import crypto from "crypto";

export function calculateSignature(options: {
  method: "GET" | "POST";
  url: string;
  timestamp: number;
  nonceStr: string;
  body: string;
  /** 商户私钥 */
  privateKey: string;
}) {
  // 生成签名串
  let signatureString = `${options.method}\n${options.url}\n${options.timestamp}\n${options.nonceStr}\n${options.body}\n`;

  // 使用私钥对签名串进行签名
  const sign = crypto.createSign("SHA256");
  sign.write(signatureString);
  sign.end();
  const signature = sign.sign(options.privateKey, "base64");

  return signature;
}
