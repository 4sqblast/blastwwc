export interface Merch {
  id: number;
  name: string;
  adult_price_normal: number;
  adult_price_stonewash: number;
  child_price_1_5: number;
  child_price_6_10: number;
  image: string;
  color: string;
}

export interface CartItem {
  id: number;
  product: Merch;
  size: string;
  audience: "Adult" | "Child";
  finish: "Normal" | "Stonewash";
  childAge: "1-5" | "6-10";
  quantity: number;
  color: string;
}