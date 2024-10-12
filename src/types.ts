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
  promotion_detail: unknown[];
  success_time: string;
  trade_state: string;
  trade_state_desc: string;
  trade_type: string;
  transaction_id: string;
}

/** 支付成功结果通知请求体 */
export interface NotifyBody {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: {
    original_type: string;
    algorithm: string;
    ciphertext: string;
    associated_data: string;
    nonce: string;
  };
}

/** 支付成功结果通知请求体 resource 解密后字段类型 */
export interface NotifyResource {
  transaction_id: string;
  amount: {
    payer_total: number;
    total: number;
    currency: string;
    payer_currency: string;
  };
  mchid: string;
  trade_state: "SUCCESS" | "REFUND" | "NOTPAY" | "CLOSED" | "REVOKED" | "USERPAYING" | "PAYERROR";
  bank_type: string;
  promotion_detail: {
    amount: number;
    wechatpay_contribute: number;
    coupon_id: string;
    scope: "GLOBAL" | "SINGLE";
    merchant_contribute: number;
    name: string;
    other_contribute: number;
    currency: string;
    stock_id: string;
    goods_detail: {
      goods_remark: string;
      quantity: number;
      discount_amount: number;
      goods_id: string;
      unit_price: number;
    }[];
  }[];
  success_time: string;
  payer: {
    openid: string;
  };
  out_trade_no: string;
  AppID: string;
  trade_state_desc: string;
  trade_type: string;
  attach: string;
  scene_info: {
    device_id: string;
  };
}

export type Certificates = {
  serial_no: string;
  effective_time: string;
  expire_time: string;
  encrypt_certificate: {
    algorithm: string;
    nonce: string;
    associated_data: string;
    ciphertext: string;
  };
}[];
