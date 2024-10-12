import crypto from "node:crypto";

import { getCurrentTimestamp, AuthorizationGenerator } from "./utils/index.js";
import type {
  Certificates,
  PayTransactionsNativeRequestBody,
  PayTransactionsQueryByOutTradeNoResponseData,
} from "./types.js";

export class WeChatPay {
  private apiHost = "https://api.mch.weixin.qq.com";
  private appid: string;
  private mchid: string;
  /** 商户私钥 */
  private merchantPrivateKey: string;
  /** 商户API证书序列号 */
  private merchantSerialNo: string;
  private v3Key: string;
  /** 平台证书序列号 */
  private platformSerialNo: string;
  /** 微信支付平台证书 */
  private platformCert: Record<string, string> = {};

  private authorizationGenerator: AuthorizationGenerator;

  constructor(options: {
    appid: string;
    mchid: string;
    merchantPrivateKey: string;
    merchantSerialNo: string;
    platformSerialNo: string;
    v3Key: string;
  }) {
    this.appid = options.appid;
    this.mchid = options.mchid;
    this.merchantPrivateKey = options.merchantPrivateKey;
    this.merchantSerialNo = options.merchantSerialNo;
    this.platformSerialNo = options.platformSerialNo;
    this.v3Key = options.v3Key;

    this.authorizationGenerator = new AuthorizationGenerator({
      mchid: this.mchid,
      merchantPrivateKey: this.merchantPrivateKey,
      merchantSerialNo: this.merchantSerialNo,
    });
  }

  private request = async <T>(params: { url: string; method: "GET" | "POST"; body?: object }) => {
    const body = params.body ? JSON.stringify(params.body) : undefined;

    const authorization = this.authorizationGenerator.generate({
      method: params.method,
      url: params.url,
      body,
    });

    const response = await fetch(`${this.apiHost}${params.url}`, {
      method: params.method,
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "zh-CN",
      },
      body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(responseData);
      throw new Error(responseData.message);
    }

    return responseData as T;
  };

  /**
   * Native下单接口：/v3/pay/transactions/native
   * @see https://pay.weixin.qq.com/docs/merchant/apis/native-payment/direct-jsons/native-prepay.html
   */
  payTransactionsNative = async (params: PayTransactionsNativeRequestBody) => {
    const data = await this.request<{ code_url: string }>({
      url: "/v3/pay/transactions/native",
      method: "POST",
      body: Object.assign({}, params, { appid: this.appid, mchid: this.mchid }),
    });
    return data;
  };

  payTransactionsQueryByOutTradeNo = async (params: { outTradeNo: string }) => {
    return await this.request<PayTransactionsQueryByOutTradeNoResponseData>({
      url: `/v3/pay/transactions/out-trade-no/${params.outTradeNo}?mchid=${this.mchid}`,
      method: "GET",
    });
  };

  /**
   * 获取平台证书
   */
  private downloadPlatformCert = async () => {
    const url = "/v3/certificates";
    const { data } = await this.request<{ data: Certificates }>({ url, method: "GET" });

    data.forEach((item) => {
      const { serial_no, encrypt_certificate } = item;
      const { nonce, associated_data, ciphertext } = encrypt_certificate;
      this.platformCert[serial_no] = this.decryptData({
        ciphertext,
        nonce,
        associatedData: associated_data,
      });
    });
  };

  /**
   * 签名验证
   * @param params
   * @see https://pay.weixin.qq.com/docs/merchant/development/interface-rules/signature-verification.html
   */
  signVerify = async (params: {
    /** HTTP 头 Wechatpay-Signature。应答的微信支付签名*/
    signature: string;
    /** HTTP 头 Wechatpay-Serial。微信支付平台证书的序列号，验签必须使用序列号对应的微信支付平台证书 */
    serialNo: string;
    /** HTTP 头 Wechatpay-Nonce。签名中的随机数 */
    nonce: string;
    /** HTTP 头 Wechatpay-Timestamp。签名中的时间戳 */
    timestamp: number;
    /** body: 应答的原始报文主体 */
    body: string;
  }) => {
    // 1. 检查平台证书序列号
    if (params.serialNo !== this.platformSerialNo) {
      throw new Error("serialNo not match");
    }

    // 2. 防止重放攻击，检查时间戳是否已过期
    if (params.timestamp + 5 * 60 < getCurrentTimestamp()) {
      throw new Error("timestamp expired");
    }

    // 3. 下载平台证书
    if (!this.platformCert[this.platformSerialNo]) {
      await this.downloadPlatformCert();
    }

    // 4. 验证签名
    const x509 = new crypto.X509Certificate(this.platformCert[this.platformSerialNo]);
    const publicKey = x509.publicKey.export({ type: "spki", format: "pem" });
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(`${params.timestamp}\n${params.nonce}\n${params.body}\n`);
    const result = verify.verify(publicKey, params.signature, "base64");

    if (!result) {
      throw new Error("signature verify failed");
    }
  };

  /**
   * 解密
   * @param params
   * @returns
   */
  decryptData = (params: { ciphertext: string; nonce: string; associatedData: string }) => {
    if (this.v3Key.length !== 32) {
      throw new Error("v3Key length must be 32");
    }

    const ciphertext = Buffer.from(params.ciphertext, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", this.v3Key, params.nonce);
    decipher.setAAD(Buffer.from(params.associatedData));
    decipher.setAuthTag(ciphertext.subarray(ciphertext.length - 16));
    const decrypted = decipher.update(
      ciphertext.subarray(0, ciphertext.length - 16),
      undefined,
      "utf8"
    );

    return decrypted;
  };
}
