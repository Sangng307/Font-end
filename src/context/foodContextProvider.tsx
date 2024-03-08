import { IFood } from "@interfaces";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

export const FoodContext = createContext<null | any>(null);

export const FoodContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [foods, setFoods] = useState<IFood[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/foods");
        if (response.ok) {
          const data = await response.json();
          setFoods(data);
        } else {
          console.error("Failed to fetch foods");
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <FoodContext.Provider value={{ foods }}>{children}</FoodContext.Provider>
  );
};
