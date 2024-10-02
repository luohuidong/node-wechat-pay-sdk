import { getCurrentTimestamp, generateRandomString, getAuthorization } from "./utils/index.js";
import type {
  PayTransactionsNativeRequestBody,
  PayTransactionsQueryByOutTradeNoResponseData,
} from "./types.js";

export class WeChatPay {
  private apiHost = "https://api.mch.weixin.qq.com";
  private appid: string;
  private mchid: string;
  /** 商户私钥 */
  private privateKey: string;
  /** 商户API证书序列号 */
  private serialNo: string;

  constructor(options: { appid: string; mchid: string; privateKey: string; serialNo: string }) {
    this.appid = options.appid;
    this.mchid = options.mchid;
    this.privateKey = options.privateKey;
    this.serialNo = options.serialNo;
  }

  private authorizationGenerator(params: { method: "GET" | "POST"; url: string; body?: string }) {
    const timestamp = getCurrentTimestamp();
    const nonceStr = generateRandomString(32);
    const authorization = getAuthorization({
      mchid: this.mchid,
      method: params.method,
      privateKey: this.privateKey,
      serialNo: this.serialNo,
      url: params.url,
      body: params.body ?? "",
      nonceStr,
      timestamp,
    });

    return authorization;
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

    const authorization = this.authorizationGenerator({
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

    const authorization = this.authorizationGenerator({
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
