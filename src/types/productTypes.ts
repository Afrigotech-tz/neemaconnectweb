export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: ProductCategory[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
  parent_id?: number | null;
  is_active?: boolean;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;



// Product related types
export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  base_price: string;
  weight: number | null;
  image_url: string | null;
  images: string[] | null;
  is_active: boolean;
  stock_quantity: number;
  category_id: number;
  category?: ProductCategory;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  category_id: number;
  base_price: number;
  sku: string;
  stock_quantity: number;
  is_active?: boolean;
  weight?: number;
  images?: File[];
}

export type UpdateProductData = Partial<CreateProductData>;



// Attribute related types
export interface ProductAttribute {
  id: number;
  name: string;
  type: 'select' | 'text' | 'number';
  is_required: boolean;
  values: ProductAttributeValue[];
  created_at: string;
  updated_at: string;
}

export interface ProductAttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAttributeData {
  name: string;
  type: 'select' | 'text' | 'number';
  is_required?: boolean;
}

export interface CreateAttributeValueData {
  attribute_id: number;
  value: string;
}

// Variant related types
export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price?: number;
  stock_quantity: number;
  is_active: boolean;
  attribute_values: ProductAttributeValue[];
  created_at: string;
  updated_at: string;
}

export interface CreateVariantData {
  product_id: number;
  sku: string;
  price?: number;
  stock_quantity: number;
  is_active?: boolean;
  attribute_value_ids: number[];
}

export type UpdateVariantData = Partial<CreateVariantData>;


