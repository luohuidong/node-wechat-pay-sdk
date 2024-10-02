export interface PayTransactionsNativeRequestBody {
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url: string;
  goods_tag?: string;
  support_fapiao?: false;
  amount: {
    total: number;
    currency?: string;
  };
  detail?: {
    cost_price?: number;
    invoice_id?: string;
    goods_detail?: [
      {
        merchant_goods_id: string;
        wechatpay_goods_id?: string;
        goods_name?: string;
        quantity: number;
        unit_price: number;
      },
    ];
  };
  scene_info?: {
    payer_client_ip: string;
    device_id?: string;
    store_info?: {
      id: string;
      name?: string;
      area_code?: string;
      address?: string;
    };
  };
  settle_info?: {
    profit_sharing?: boolean;
  };
}

export interface PayTransactionsQueryByOutTradeNoResponseData {
  amount: {
    currency: string;
    payer_currency: string;
    payer_total: number;
    total: number;
  };
  appid: string;
  attach: string;
  bank_type: string;
  mchid: string;
  out_trade_no: string;
  payer: {
    openid: string;
  };
  promotion_detail: any[];
  success_time: string;
  trade_state: string;
  trade_state_desc: string;
  trade_type: string;
  transaction_id: string;
}
