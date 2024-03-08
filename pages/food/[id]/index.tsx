import { PlusSquareIcon, StarIcon } from "@components/icons";
import { NumberInput } from "@components/numberInput";
import { FoodContext } from "@context/foodContextProvider";
import { getUserId } from "@hooks/handleAccessToken";
import { handleLocalStorage } from "@hooks/handleLocalStorage";
import { useBasketContext } from "@hooks/useBasketContext";
import { IFood, IUser } from "@interfaces";
import axios from "axios";

import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { CartAction } from "src/enum/cart-enum";
import { formatCurrency } from "src/utils/formatCurrency";

interface FoodProps {
  foods: IFood[];
  users: IUser[];
}
const Food: React.FC<FoodProps> = ({ foods, users }) => {
  const { id } = useParams();
  const food = foods[+id - 1];
  const userId = users[+id];
  const getStars = () => {
    let stars = [];
    for (let i = 0; i < food.star; i++) {
      stars.push(i);
    }
    return stars;
  };
  const [amount, setAmount] = useState(1);
  const { dispatch } = useBasketContext();

  const handlePlusClick = () => {
    dispatch({
      type: "addProduct",
      payload: { id, amount },
    });
    axios
      .post("http://localhost:8080/api/cart/add", {
        userId: userId,
        foodId: food,
        quantity: amount,
      })
      .then((response) => {
        handleLocalStorage(food, amount, CartAction.ADD_TO_CART);
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding item to cart:", error);
      });
  };
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
              <img
                className="w-full h-full object-cover"
                src={food.image}
                alt="Product Image"
              />
            </div>
          </div>
          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {food.food_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
              ante justo. Integer euismod libero id mauris malesuada tincidunt.
            </p>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Price:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {formatCurrency(food.price)}
                </span>
              </div>
              <div className="flex">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Star:
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-300 flex">
                  {getStars().map((star, index) => {
                    return (
                      <div className="w-8" key={index}>
                        <StarIcon />
                      </div>
                    );
                  })}
                </span>
              </div>
            </div>
            {/* <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Select Color:
              </span>
              <div className="flex items-center mt-2">
                <button className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 mr-2"></button>
                <button className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-700 mr-2"></button>
                <button className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-700 mr-2"></button>
                <button className="w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-700 mr-2"></button>
              </div>
            </div> */}
            {/* <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Select Size:
              </span>
              <div className="flex items-center mt-2">
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                  S
                </button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                  M
                </button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                  L
                </button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                  XL
                </button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                  XXL
                </button>
              </div>
            </div> */}
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Product Description:
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {food.description}
              </p>
            </div>
            <div className="flex gap-1 self-end my-4">
              <NumberInput value={amount} setValue={setAmount} />
              {/* <button className="transition-all hover:bg-gray-50 active:scale-95">
                <PlusSquareIcon className="text-primary h-6 w-6" />
              </button> */}
            </div>
            <div className="flex -mx-2 mb-4 my-8">
              <div className="w-1/2 px-2">
                <button
                  onClick={handlePlusClick}
                  className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Add to Cart
                </button>
              </div>
              <div className="w-1/2 px-2">
                {/* <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                  Add to Wishlist
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Food;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch("http://localhost:8080/api/foods");
  const foodData = await response.json();
  const userId = context.req.cookies.userId;
  const userResponse = await fetch(`http://localhost:8080/api/user`);
  const userData = await userResponse.json();

  return {
    props: {
      foods: foodData,
      users: userData, // Corrected prop name
    },
  };
};
