# Native 下单接口

body 参数和返回值参考[Native下单](https://pay.weixin.qq.com/docs/merchant/apis/native-payment/direct-jsons/native-prepay.html)，参数 `appid` 和 `mchid` 不需要传，SDK 内部会自行处理，其他 body 参数和返回值与官方文档保持一致。

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
