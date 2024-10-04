# 开始使用

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
