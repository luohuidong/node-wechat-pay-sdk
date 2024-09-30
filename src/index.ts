import { getCurrentTimestamp, generateRandomString, getAuthorization } from "./utils/index.js";
import type { PayTransactionsNativeRequestBody } from "./types.js";

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

  private authorizationGenerator(params: { method: "GET" | "POST"; url: string; body: string }) {
    const timestamp = getCurrentTimestamp();
    const nonceStr = generateRandomString(32);
    const authorization = getAuthorization({
      mchid: this.mchid,
      method: params.method,
      privateKey: this.privateKey,
      serialNo: this.serialNo,
      url: params.url,
      body: params.body,
      nonceStr,
      timestamp,
    });

    return authorization;
  }

  /**
   * Native下单接口：/v3/pay/transactions/native
   * @see https://pay.weixin.qq.com/docs/merchant/apis/native-payment/direct-jsons/native-prepay.html
   */
  async payTransactionsNative(params: PayTransactionsNativeRequestBody): Promise<{
    code_url: string;
  }> {
    const url = "/v3/pay/transactions/native";

    const body = JSON.stringify(
      Object.assign({}, params, { appid: this.appid, mchid: this.mchid })
    );

    const authorization = this.authorizationGenerator({
      method: "POST",
      url,
      body,
    });
    console.log("🚀 ~ WeChatPay ~ payTransactionsNative ~ authorization:", authorization);

    const response = await fetch(`${this.apiHost}${url}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });
    console.log("🚀 ~ WeChatPay ~ payTransactionsNative ~ response:", response);
    return response.json();
  }
}
