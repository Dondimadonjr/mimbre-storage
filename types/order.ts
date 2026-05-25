export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_commune: string | null;
  customer_region: string | null;
  customer_comment: string | null;
  total: number;
  status: 'pendiente' | 'pagado' | 'rechazado' | 'cancelado';
  buy_order: string | null;
  session_id: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  order_id: string;
  token: string | null;
  buy_order: string | null;
  session_id: string | null;
  amount: number | null;
  status: string | null;
  authorization_code: string | null;
  payment_type_code: string | null;
  response_code: number | null;
  installments_number: number | null;
  transaction_date: string | null;
  raw_response: Record<string, unknown> | null;
  created_at: string;
}

export interface WebpayCreateRequest {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    commune: string;
    region: string;
    comment?: string;
  };
}

export interface WebpayCreateResponse {
  url: string;
  token: string;
  buy_order: string;
  session_id: string;
}

export interface WebpayConfirmRequest {
  token_ws: string;
}
