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
    let decrypted = decipher.update(
      ciphertext.subarray(0, ciphertext.length - 16),
      undefined,
      "utf8"
    );

    return decrypted;
  };
}
