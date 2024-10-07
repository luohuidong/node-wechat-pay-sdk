# Node WeChatPay SDK

Node WechatPay SDK 适配微信支付 API v3，封装了大量调用微信支付需要实现的技术细节，让 Node 项目接入微信支付更便捷。

::: warning 注意

1. 该库针对微信支付 Native 支付的场景
2. 该库的使用是假设你已经读过[微信支付官方文档](https://pay.weixin.qq.com/)，知道什么是 API v3、API v3 密钥、商户 API 证书、商户 API 私钥、微信支付平台证书、签名，并且了解 Native 支付场景有什么 api。
3. SDK 基于 Node v20 的版本进行开发，依赖 Node.js crypto 模块，为了确保 SDK 的正常使用，请确保项目的 Node.js 版本大于等于 v20。

:::

## 安装

```bash
npm install node-wechatpay-api-v3-sdk
# or
pnpm add node-wechatpay-api-v3-sdk
```

## 使用

初始化对象：

```ts
import { WeChatPay } from "node-wechatpay-api-v3-sdk";

const wechatPay = new WeChatPay({
  appid: "xxx",
  mchid: "xxx",
  privateKey: "xxx", // 商户私钥
  serialNo: "xxx", // 商户API证书序列号
});
```

调用 api 接口

```ts
const result = await wechatPay.payTransactionsNative({
  out_trade_no: "xxx",
  time_expire: "xxx",
  description: "xxx",
  notify_url: "xxx",
  amount: {
    total: 100, // 根据自己实际情况传递
  },
  // ...
});
```
