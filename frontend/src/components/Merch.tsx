import React from "react";
import Image from "next/image";
import { Merch } from "@/types";

interface MerchCardProps {
  merchItem: Merch;
}

const naira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const MerchCard = ({ merchItem }: MerchCardProps) => {
  return (
    <div>
      <Image
        alt={merchItem.name}
        src={merchItem.image}
        width={300}
        height={300}
      />

      <p>{merchItem.name}</p>
      <p>Adult (Normal): {naira(merchItem.adult_price_normal)}</p>
      <p>Adult (Stonewash): {naira(merchItem.adult_price_stonewash)}</p>
      <p>Child (Ages 1–5): {naira(merchItem.child_price_1_5)}</p>
      <p>Child (Ages 6–10): {naira(merchItem.child_price_6_10)}</p>
    </div>
  );
};

export default MerchCard;
