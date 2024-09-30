import { calculateSignature } from "./calculateSignature.js";

/**
 * 获取请求投 Authorization 值
 * @param params
 * @returns
 */
export function getAuthorization(params: {
  mchid: string;
  method: "GET" | "POST";
  /** 请求地址（绝对路径） */
  url: string;
  /** 请求体 */
  body: string;
  /** 商户私钥 */
  privateKey: string;
  /** 商户API证书序列号 */
  serialNo: string;
  /** 随机串 */
  nonceStr: string;
  timestamp: number;
}) {
  const mchid = params.mchid;
  const nonceStr = params.nonceStr;
  const timestamp = params.timestamp;
  const signature = calculateSignature({
    method: params.method,
    url: params.url,
    timestamp,
    nonceStr: nonceStr,
    body: params.body,
    privateKey: params.privateKey,
  });
  const serialNo = params.serialNo;

  return `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${serialNo}"`;
}
