"use client";

import { useBasketContext } from "@hooks";
import { IFood } from "@interfaces";
import { RemoveIcon } from "./icons";
import { handleLocalStorage } from "@hooks/handleLocalStorage";
import { CartAction } from "src/enum/cart-enum";

export const OrderModalProductItem: React.FC<{ order: IFood }> = ({
  order,
}) => {
  const { dispatch } = useBasketContext();
  const { products } = useBasketContext();
  const { quantity, id } = order;
  const product = products.find((p) => p.id === id);
  const removeFoodFromStorage = () => {
    dispatch({
      type: "addProduct",
      payload: { id, quantity },
    });
    handleLocalStorage(order, 0, CartAction.REMOVE_FROM_CART);
  };

  return (
    <div className="flex items-center justify-between border-b p-1">
      <div className="flex items-center gap-2">
        <img
          className="h-12 w-12 rounded-full object-cover object-center"
          src={product?.image}
          alt={product?.food_name}
        />
        <p>{product?.food_name}</p>
      </div>
      <div className="flex-none flex">
        <span className="font-semibold">${(product?.price ?? 0) / 100}</span> x{" "}
        {quantity}
        <span
          className="w-4 mx-4 cursor-pointer"
          onClick={removeFoodFromStorage}
        >
          <RemoveIcon />
        </span>
      </div>
    </div>
  );
};
