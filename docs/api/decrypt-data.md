# 解密

解密应用于支付通知回调场景，decryptData 的参数获取请参考文档[支付通知](https://pay.weixin.qq.com/docs/merchant/apis/native-payment/payment-notice.html)

```ts
const data = wechatPay.decryptData({
  ciphertext: "xxx",
  nonce: "xxx",
  associatedData: "xxx",
});
```
