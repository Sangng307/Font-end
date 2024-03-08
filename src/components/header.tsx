"use client";

import React, { useState } from "react";
import Link from "next/link";

import { MotorcycleIcon, FinefoodsIcon, BasketIcon } from "@components";
import { useBasketContext, useOrdesModalContext } from "@hooks";
import {
  getFoodsFromLocalStorage,
  getTotalPriceFromLocalStorage,
} from "@hooks/handleLocalStorage";
import { formatCurrency } from "src/utils/formatCurrency";
import { getUsernameFromStorage } from "@hooks/handleAccessToken";
import UserIcon from "./icons/UserIcon";
import AsideToggle from "./asideToggle";

export const Header: React.FC = () => {
  const { setOrdersModalVisible } = useOrdesModalContext();
  const { orders } = useBasketContext();
  const isBasketHaveOrders = orders.length > 0;
  const foods = getFoodsFromLocalStorage();
  const totalPrice = getTotalPriceFromLocalStorage();
  const [userToggle, setUserToggle] = useState(false);

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container flex h-full items-center justify-between px-2 md:px-0">
        <Link href="/" className="flex gap-4">
          <MotorcycleIcon className="hidden md:block" />
          {/* <FinefoodsIcon className="w-32 md:w-48" /> */}
          <span className="text-2xl font-bold text-white">
            Chicken Fast Service
          </span>
        </Link>
        <div className="flex cursor-pointer items-center gap-2">
          {foods.length !== 0 && (
            <div className="text-lg font-semibold text-white">
              {`${foods.length} items / `}
              <span className="text-xl font-extrabold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          )}
          {foods.length === 0 && (
            <div className="text-lg font-semibold text-white">0 items</div>
          )}
          <div onClick={() => setOrdersModalVisible((prev: boolean) => !prev)}>
            <BasketIcon className="h-6 w-6" />
          </div>
          <div
            className="w-6 mx-4 cursor-pointer"
            onClick={() => setUserToggle(!userToggle)}
          >
            <UserIcon />
          </div>
        </div>
      </div>
      {userToggle && <AsideToggle />}
    </header>
  );
};
