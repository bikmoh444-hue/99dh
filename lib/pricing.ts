import type { Product } from "@/lib/types";

export const FIXED_PRODUCT_PRICE = 199;
export const FIXED_PRODUCT_PRICE_LABEL = `${FIXED_PRODUCT_PRICE} DH`;

export function withFixedProductPrice<T extends Pick<Product, "price">>(product: T): T {
  return { ...product, price: FIXED_PRODUCT_PRICE };
}

export function normalizeFixedPriceText(value: string) {
  return value.replaceAll("99 DH", FIXED_PRODUCT_PRICE_LABEL).replaceAll("99 درهم", `${FIXED_PRODUCT_PRICE} درهم`);
}
