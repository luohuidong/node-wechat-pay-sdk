import crypto from "crypto";

import { getCurrentTimestamp } from "./getCurrentTimestamp.js";

export class AuthorizationGenerator {
  /** 商户号 */
  mchid: string;
  /** 商户私钥 */
  merchantPrivateKey: string;
  /** 商户API证书序列号 */
  merchantSerialNo: string;

  constructor(options: { mchid: string; merchantPrivateKey: string; merchantSerialNo: string }) {
    this.mchid = options.mchid;
    this.merchantPrivateKey = options.merchantPrivateKey;
    this.merchantSerialNo = options.merchantSerialNo;
  }

  private calculateSignature(options: {
    method: "GET" | "POST";
    url: string;
    timestamp: number;
    nonceStr: string;
    body: string;
  }) {
    // 生成签名串
    let signatureString = `${options.method}\n${options.url}\n${options.timestamp}\n${options.nonceStr}\n${options.body}\n`;

    // 使用私钥对签名串进行签名
    const sign = crypto.createSign("SHA256");
    sign.write(signatureString);
    sign.end();
    const signature = sign.sign(this.merchantPrivateKey, "base64");

    return signature;
  }

  private generateRandomString(length: number) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private generateAuthorization(params: {
    method: "GET" | "POST";
    /** 请求地址（绝对路径） */
    url: string;
    /** 请求体 */
    body: string;
    /** 随机串 */
    nonceStr: string;
    timestamp: number;
  }) {
    const mchid = this.mchid;
    const nonceStr = params.nonceStr;
    const timestamp = params.timestamp;
    const signature = this.calculateSignature({
      method: params.method,
      url: params.url,
      timestamp,
      nonceStr: nonceStr,
      body: params.body,
    });
    const serialNo = this.merchantSerialNo;

    return `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${serialNo}"`;
  }

  generate(params: { method: "GET" | "POST"; url: string; body?: string }) {
    const { method, url, body = "" } = params;

    const timestamp = getCurrentTimestamp();
    const nonceStr = this.generateRandomString(32);
    const authorization = this.generateAuthorization({
      method,
      url,
      body,
      nonceStr,
      timestamp,
    });

    return authorization;
  }

  _only_for_test_calculateSignature = this.calculateSignature;
  _only_for_test_generateRandomString = this.generateRandomString;
  _only_for_test_generateAuthorization = this.generateAuthorization;
}
