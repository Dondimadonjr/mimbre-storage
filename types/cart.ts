export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  stock?: number;
  available?: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_commune: string;
  customer_region: string;
  customer_comment?: string;
}
