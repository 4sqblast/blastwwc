export interface Merch {
  id: number;
  name: string;
  adult_price: number;
  child_price: number;
  image: string;
  color: string;
}

export interface CartItem {
  id: number;
  product: Merch;
  size: string;
  audience: "Adult" | "Child";
  quantity: number;
  color: string;
}
