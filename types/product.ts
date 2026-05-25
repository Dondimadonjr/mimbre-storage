export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  gallery: string[] | null;
  available: boolean;
  featured: boolean;
  stock: number;
  created_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  gallery: string[];
  available: boolean;
  featured: boolean;
  stock: number;
}
