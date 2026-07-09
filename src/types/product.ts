export type ProductCategory =
  | "course"
  | "book"
  | "audiobook"
  | "download"
  | "membership"
  | "coaching"
  | "consulting"
  | "certification"
  | "merchandise"
  | "bundle";

export type ProductStatus = "active" | "draft" | "archived";

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  sku?: string;
  stock?: number; // undefined = unlimited (digital)
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  credentials: string[];
  productCount: number;
  averageRating: number;
  totalStudents: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ProductCategory;
  tags: string[];
  instructor?: Instructor;
  vendorName?: string;
  price: number;
  compareAtPrice?: number; // original price for discounts
  currency: string;
  variants?: ProductVariant[];
  imageUrl?: string;
  previewUrl?: string;
  featured: boolean;
  recommended: boolean;
  digital: boolean;
  stock?: number; // undefined = unlimited
  sku?: string;
  status: ProductStatus;
  reviewCount: number;
  averageRating: number;
  totalSales: number;
  membershipDiscount?: {
    tier: "basic" | "premium" | "enterprise";
    discountPercent: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  title: string;
  price: number;
  imageUrl?: string;
  digital: boolean;
  slug: string;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  couponDiscount?: number; // dollar amount
}

export interface Order {
  id: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: "stripe" | "paypal" | "square";
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  fulfillmentStatus: "pending" | "processing" | "fulfilled" | "cancelled";
  createdAt: string;
  downloadLinks?: Record<string, string>;
}

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minimumOrder?: number;
  expiresAt?: string;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableCategories?: ProductCategory[];
}
