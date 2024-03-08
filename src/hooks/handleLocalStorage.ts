import { IFood } from "@interfaces";
import { CartAction } from "src/enum/cart-enum";
export function handleLocalStorage(
  foodToAdd: IFood,
  amount: number,
  action: CartAction
) {
  let cartStorage = localStorage.getItem("cart");
  if (!cartStorage) {
    const food = [
      {
        ...foodToAdd,
        quantity: amount,
      },
    ];
    localStorage.setItem("cart", JSON.stringify({ food }));
  } else {
    const listFood: IFood[] = JSON.parse(cartStorage).food;
    switch (action) {
      case CartAction.ADD_TO_CART:
        return addToCardAction(listFood, foodToAdd, amount);
      case CartAction.REMOVE_FROM_CART:
        return removeFromCardAction(listFood, foodToAdd.id);
    }
  }
}

const addToCardAction = (
  listFood: IFood[],
  foodToAdd: IFood,
  amount: number
) => {
  let isExistedFood = false;
  listFood.map((food: IFood) => {
    if (food.id === foodToAdd.id) {
      food.quantity = food.quantity + amount;
      isExistedFood = true;
      return food;
    }
  });
  if (!isExistedFood) {
    foodToAdd.quantity = amount;
    listFood.push(foodToAdd);
  }
  localStorage.setItem("cart", JSON.stringify({ food: listFood }));
};

const removeFromCardAction = (listFood: IFood[], foodId: number) => {
  listFood = listFood.filter((food: IFood) => food.id !== foodId);
  console.log("listFood ", listFood);
  localStorage.setItem("cart", JSON.stringify({ food: listFood }));
};

export const getFoodsFromLocalStorage: () => IFood[] = () => {
  if (typeof localStorage === "undefined") {
    return []; // Return an empty array or handle the lack of localStorage appropriately
  }
  const cartStorage = localStorage.getItem("cart");
  if (cartStorage) return JSON.parse(cartStorage).food;
  return [];
};

export const getTotalPriceFromLocalStorage: () => number = () => {
  const foods = getFoodsFromLocalStorage();
  return foods.reduce(
    (total: number, food: IFood) => total + food.price * food.quantity,
    0
  );
};

export const getTotalQuantityFromLocalStorage: () => number = () => {
  const foods = getFoodsFromLocalStorage();
  return foods.reduce((total: number, food: IFood) => total + food.quantity, 0);
};
