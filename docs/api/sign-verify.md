# 签名验证

签名验证主要应用于 [支付通知](https://pay.weixin.qq.com/docs/merchant/apis/native-payment/payment-notice.html) 场景。

```ts
try {
  const result = await wechatPay.signVerify({
    serialNo: "xxx", // http 头部 Wechatpay-Serial 的值
    timestamp: "xxx", // http 头部 "Wechatpay-Serial" 的值
    nonce: "xxx", // http 头部 "Wechatpay-Nonce" 的值
    signature: "xxx", // http 头部 "Wechatpay-Signature" 的值
    body: "xxx", // 请求体
  });

  // 验证成功之后的逻辑
  // ...
} catch (error) {
  // 验证失败之后的逻辑
  // ...
}
```
