export type OrderStatus = "en_attente" | "en_cours" | "livree" | "annulee";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category_id: string | null;
  category?: string;
  price: number;
  image_url: string;
  images: string[];
  specs: Array<{ label: string; value: string }>;
  rating: number;
  reviews_count: number;
  stock: number;
  is_flash_sale: boolean;
  flash_sale_end?: string | null;
  is_active: boolean;
  created_at?: string;
};

export type FeatureItem = {
  icon: string;
  title: string;
  subtitle: string;
};

export type SiteSettings = {
  id: number;
  shipping_fee: number;
  whatsapp_number: string;
  phone_number: string;
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  whatsapp_message: string;
  show_testimonials: boolean;
  hero_badge_text: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image_url: string;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;
  logo_url: string;
  features: FeatureItem[];
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  message: string;
  rating: number;
  avatar_url?: string | null;
  is_published?: boolean;
  created_at?: string;
};

export type ProductReview = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type CustomerForm = {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
};

export type OrderItem = {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Order = CustomerForm & {
  id: string;
  order_number: number;
  customer_id?: string | null;
  admin_note?: string | null;
  total_amount: number;
  subtotal?: number;
  shipping_fee?: number;
  total?: number;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
};
