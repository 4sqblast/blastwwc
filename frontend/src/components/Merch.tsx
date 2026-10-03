import React from "react";
import Image from "next/image";

import { Merch } from "@/types";

interface MerchCardProps {
  merchItem: Merch;
}

const MerchCard = ({ merchItem }: MerchCardProps) => {
  return (
    <div>
      <Image
        alt="merch-image"
        src={merchItem.image}
        width={300}
        height={300}
      />
      <p>{merchItem.name}</p>
      <p>{merchItem.adult_price}</p>
      <p>{merchItem.child_price}</p>
    </div>
  );
};

export default MerchCard;