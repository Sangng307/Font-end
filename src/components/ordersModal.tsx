"use client";

import { useRef } from "react";
import { useCreate, useGo } from "@refinedev/core";

import {
  useBasketContext,
  useOrdesModalContext,
  useOnClickOutside,
} from "@hooks";

import {
  OrderModalProductItem,
  OrderIcon,
  CloseIcon,
  RemoveIcon,
} from "@components";
import { IOrder } from "@interfaces";
import Link from "next/link";
import {
  getFoodsFromLocalStorage,
  getTotalPriceFromLocalStorage,
} from "@hooks/handleLocalStorage";

export const OrdersModal: React.FC = () => {
  const ref = useRef(null);
  const go = useGo();
  const { setOrdersModalVisible } = useOrdesModalContext();
  const { orders, totalPrice, products, dispatch } = useBasketContext();
  const { mutate } = useCreate<IOrder>();
  const foods = getFoodsFromLocalStorage();
  const totalPriceFromStorage = getTotalPriceFromLocalStorage();

  const handleClickOutside = () => {
    setOrdersModalVisible(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black opacity-40" />
      <div className="fixed inset-0 z-50 flex items-center">
        <div
          ref={ref}
          className="mx-auto max-h-[95%] w-[500px] overflow-auto rounded-lg bg-white shadow-lg"
        >
          <div className="bg-primary relative p-2">
            <button
              className="absolute right-2 top-2 p-1 transition-all hover:bg-orange-500 active:scale-90"
              onClick={() => setOrdersModalVisible(false)}
            >
              <CloseIcon className="h-6 w-6 text-white" />
            </button>
            <OrderIcon />
          </div>
          <div className="p-4">
            <div className="flex flex-col gap-2">
              {foods.length ? (
                foods.map((food, index) => (
                  <OrderModalProductItem key={index} order={food} />
                ))
              ) : (
                <p className="flex h-48 items-center justify-center text-xl font-bold text-gray-500">
                  No have any items.
                </p>
              )}
            </div>
            <div className="mt-2 flex flex-col items-end gap-2">
              <div className="flex items-center justify-center gap-2">
                Total:
                <span className="text-lg font-bold text-gray-800">
                  {foods.length} items / ${totalPriceFromStorage / 100}
                </span>
              </div>
              {/* <button
                onClick={() =>
                  mutate(
                    {
                      resource: "orders",
                      values: {
                        products,
                        amount: totalPrice,
                      },
                      successNotification: false,
                    },
                    {
                      onSuccess: (data) => {
                        go({
                          to: `/order/${data.data.id}`,
                          type: "replace",
                        });
                        setOrdersModalVisible(false);
                        dispatch({
                          type: "resetBasket",
                        });
                      },
                    }
                  )
                }
                className="bg-primary border-primary rounded-md border px-4 text-lg font-bold text-white transition-all hover:bg-orange-500 active:scale-95"
              >
                Order
              </button> */}

              <Link
                href={`/checkout`}
                onClick={() => setOrdersModalVisible(false)}
                className="bg-primary border-primary rounded-md border px-4 text-lg font-bold text-white transition-all hover:bg-orange-500 active:scale-95"
              >
                <button>Order</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
