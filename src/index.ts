import { getCurrentTimestamp, AuthorizationGenerator } from "./utils/index.js";
import type {
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
  /** 微信支付平台证书 */
  private platformCert: string;
  /** 微信支付平台证书序列号 */
  private platformSerialNo: string;
  private v3Key: string;
  private authorizationGenerator: AuthorizationGenerator;

  constructor(options: {
    appid: string;
    mchid: string;
    merchantPrivateKey: string;
    merchantSerialNo: string;
    platformCert: string;
    platformSerialNo: string;
    v3Key: string;
  }) {
    this.appid = options.appid;
    this.mchid = options.mchid;
    this.merchantPrivateKey = options.merchantPrivateKey;
    this.merchantSerialNo = options.merchantSerialNo;
    this.platformCert = options.platformCert;
    this.platformSerialNo = options.platformSerialNo;
    this.v3Key = options.v3Key;

    this.authorizationGenerator = new AuthorizationGenerator({
      mchid: this.mchid,
      merchantPrivateKey: this.merchantPrivateKey,
      merchantSerialNo: this.merchantSerialNo,
    });
  }

  /**
   * Native下单接口：/v3/pay/transactions/native
   * @see https://pay.weixin.qq.com/docs/merchant/apis/native-payment/direct-jsons/native-prepay.html
   */
  async payTransactionsNative(params: PayTransactionsNativeRequestBody) {
    const url = "/v3/pay/transactions/native";

    const body = JSON.stringify(
      Object.assign({}, params, { appid: this.appid, mchid: this.mchid })
    );

    const authorization = this.authorizationGenerator.generate({
      method: "POST",
      url,
      body,
    });

    const response = await fetch(`${this.apiHost}${url}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(responseData);
      throw new Error(responseData.message);
    }

    return responseData as { code_url: string };
  }

  async payTransactionsQueryByOutTradeNo(params: { outTradeNo: string }) {
    const url = `/v3/pay/transactions/out-trade-no/${params.outTradeNo}?mchid=${this.mchid}`;

    const authorization = this.authorizationGenerator.generate({
      method: "GET",
      url,
    });

    const response = await fetch(`${this.apiHost}${url}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(responseData);
      throw new Error(responseData.message);
    }

    return responseData as PayTransactionsQueryByOutTradeNoResponseData;
  }
}
