"use client";

import React, { useState } from "react";

import { NumberInput, PlusSquareIcon } from "@components";
import { useBasketContext } from "@hooks";
import Link from "next/link";
import { IFood } from "@interfaces";
import { CartAction } from "src/enum/cart-enum";
import { handleLocalStorage } from "@hooks/handleLocalStorage";
import { formatCurrency } from "src/utils/formatCurrency";

export type ProductCardProps = {
  productImg: string;
  badgeTitle?: string;
  title: string;
  description: string;
  price: number;
  badgeBgColor?: string;
  productId?: number;
  food?: IFood; // Making `food` optional
};

export const ProductCard: React.FC<ProductCardProps> = ({
  productImg,
  badgeTitle,
  title,
  description,
  price,
  badgeBgColor,
  productId,
  food,
}) => {
  const { dispatch } = useBasketContext();
  const [amount, setAmount] = useState(1);
  const handlePlusClick = () => {
    dispatch({
      type: "addProduct",
      payload: { productId, amount },
    });
    food && handleLocalStorage(food, amount, CartAction.ADD_TO_CART); // Check if food exists before calling handleLocalStorage
  };
  return (
    <div className="h-full p-2">
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-gray-200 p-2 pt-0 shadow-md md:pt-8 lg:pt-2">
        <div className="flex flex-row items-center justify-center md:flex-col lg:flex-row">
          <span
            className="bg-primary absolute top-0 right-0 z-10 rounded-bl-2xl py-0.5 px-3 font-bold uppercase text-white"
            style={{ backgroundColor: badgeBgColor }}
          >
            {badgeTitle}
          </span>
          <div className="shrink-0">
            <Link href={`food/${productId}`}>
              <img
                className="h-36 w-36 rounded-full object-cover"
                src={productImg}
                alt={title}
              />
            </Link>
          </div>
          <div className="h-full flex-auto px-2 pt-8">
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm">{description}</p>
            <span className="text-lg font-bold text-gray-800">
              {formatCurrency(price)}
            </span>
          </div>
        </div>
        <div className="flex gap-1 self-end">
          <NumberInput value={amount} setValue={setAmount} />
          <button
            className="transition-all hover:bg-gray-50 active:scale-95"
            onClick={handlePlusClick}
          >
            <PlusSquareIcon className="text-primary h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
