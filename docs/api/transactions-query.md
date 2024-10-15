# 查询订单

## 通过商户订单号查询订单

请求参数只需传商户订单号即可，接口返回内容参考[商户订单号查询订单](https://pay.weixin.qq.com/docs/merchant/apis/native-payment/query-by-out-trade-no.html)“应答参数”内容。

```ts
const result = wechatPay.payTransactionsQueryByOutTradeNo({
  outTradeNo, // 商户订单号
});
```
