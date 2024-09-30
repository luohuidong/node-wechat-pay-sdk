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
