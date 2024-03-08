import React from "react";
// import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import { toast } from 'react-toastify';
import moment from "moment";
import { IFood, IUser, IUserInfo } from "@interfaces";
import {
  getFoodsFromLocalStorage,
  getTotalPriceFromLocalStorage,
  getTotalQuantityFromLocalStorage,
} from "@hooks/handleLocalStorage";
import Link from "next/link";
import { formatCurrency } from "src/utils/formatCurrency";
import { PaymentMethod } from "src/enum/payment-method.enum";
import { GetServerSideProps } from "next";
import { getAccessTokem } from "@hooks/handleAccessToken";

export const Checkout: React.FC = () => {
  //tính khoản cách
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<null | number>(null);
  const [longitude, setLongitude] = useState<null | number>(null);
  const [targetDistance, setTargetDistance] = useState<null | number>(null);
  const totalAmountCurrentcy = formatCurrency(getTotalPriceFromLocalStorage());
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    PaymentMethod.VN_PAY
  );

  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371; // Đường kính trung bình của Trái Đất trong km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Khoảng cách giữa hai điểm theo đường chéo trên bề mặt cầu
    return distance;
  }

  //cart
  //   const location = useLocation();
  const foods = getFoodsFromLocalStorage();
  //   const { orderDetail } =foods
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.VN_PAY
  );
  const [shipping, setShipping] = useState(0);
  const [order, setOrder] = useState({});

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${getAccessTokem()}`,
          },
        });
        setUserInfo(response.data);
        console.log(response.data);
      } catch (err) {
        console.log("error call access ", err);
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    let calculatedShip;
    if (targetDistance) {
      if (targetDistance <= 3) {
        calculatedShip = 15000;
      } else if (targetDistance > 30) {
        // toast.error("We do not yet support delivery to your location !");
        calculatedShip = 5000 * targetDistance;
      } else {
        calculatedShip = 5000 * targetDistance ?? 0;
      }
      setShipping(calculatedShip);
    }
  }, [targetDistance]);

  const handlePaymentChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const totalAmount = getTotalPriceFromLocalStorage();

  const totalQuantity = getTotalQuantityFromLocalStorage();

  const currentDateTime = new Date();
  const reccentTime =
    currentDateTime.getHours().toString() +
    " " +
    currentDateTime.getMinutes().toString() +
    " " +
    currentDateTime.getSeconds().toString();
  const date = currentDateTime.toLocaleDateString();
  const time = currentDateTime.toLocaleTimeString();
  const formattedDateTime =
    moment(date + " " + time, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY") +
    " " +
    reccentTime;
  const newData = {
    user: userInfo?.id,
    address: "ok",
    price: totalAmount,
    status: "Pending",
    foodId: foods.map((li: IFood) => ({
      id: li.id,
      food_name: li.food_name,
      quantity: li.quantity,
      description: li.description,
      price: li.price,
      star: li.star,
      image: li.image,
      discount: li.discount,
      category: null,
    })),
    date: formattedDateTime,
    quantity: totalQuantity,
    payment: paymentMethod,
    // note: (order?.note as string) || "not note",
    note: "not note",
  };

  const createOrder = async () => {
    try {
      console.log(newData); // Log newData
      const response = await axios.post(
        "http://localhost:8080/api/create/order",
        newData
      );
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const newDataArray = Object.values(newData);
  const handleSubmit = async () => {
    {
      const userId = userInfo?.id;
      const amount = totalAmount;
      try {
        if (paymentMethod === PaymentMethod.VN_PAY) {
          const response = await axios.post(
            `http://localhost:8080/api/payment/pay?userId=${userId}&amount=${amount}`
          );
          window.location.href = response.data;
        } else if (paymentMethod === PaymentMethod.MOMO) {
          const response = await axios.post(
            `http://localhost:8080/api/payment/momopay?userId=${userId}&amount=${amount}`
          );
          window.location.href = response.data;
        } else if (paymentMethod === PaymentMethod.SHIP_CODE) {
          // order for youuu
        }
        createOrder();
      } catch (error) {
        console.error("lol", error);
      }
    }
  };

  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  };
  console.log("shipping ", targetDistance, shipping);
  //tính tọa độ
  const getLocationFromAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setLatitude(parseFloat(data[0].lat));
        setLongitude(parseFloat(data[0].lon));

        // cửa hàng đang ở đây
        const targetLatitude = 10.848069;
        const targetLongitude = 106.677045;

        // Tính khoảng cách
        const calculatedDistance = calculateDistance(
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
          targetLatitude,
          targetLongitude
        );

        // Cập nhật state để hiển thị khoảng cách
        setTargetDistance(+calculatedDistance.toFixed(2));
      } else {
        console.error("khong tim thay vi tri");
      }
    } catch (error) {
      console.error("lỗi:", error);
    }
  };

  const handleSubmitTest = async () => {
    const momoData = {
      partnerCode: "MOMOBKUN20180529",
      accessKey: "klm05TvNBzhg7h7j",
      requestId: "1",
      amount: totalAmount,
      orderId: "123",
      returnUrl: "http://localhost:3000",
      notifyUrl: "http://localhost:8080/api/momo/momopay",
      requestType: "payWithATM",
      signature:
        "209abe64e3e9f21650158bff7c282e3998126e2337f27dec12d16897b0e5e822",
      extraData: "success",
    };
    const momodaa = {
      hello: "helloo",
    };
    await axios.post(
      "http://localhost:8080/api/momo/momopay",
      JSON.stringify(momodaa),
      {
        headers: {
          Authorization: `Bearer ${getAccessTokem()}`,
          metadata: JSON.stringify(momoData),
        },
      }
    );
  };

  return (
    <div className="bg-gray-600 pb-4">
      <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <a href="#" className="text-2xl font-bold text-gray-800">
          Checkout
        </a>
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      stroke-linecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </a>
                <span className="font-semibold text-gray-900">Shop</span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  stroke-linecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                  href="#"
                >
                  2
                </a>
                <span className="font-semibold text-gray-900">Shipping</span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  stroke-linecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white"
                  href="#"
                >
                  3
                </a>
                <span className="font-semibold text-gray-500">Payment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium text-white">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable payment method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {foods.map((food) => (
              <div key={food.id}>
                {" "}
                {/* Provide a unique key */}
                <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={food.image}
                    alt=""
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">{food.food_name}</span>
                    <span className="float-right text-gray-400">
                      Amount: {food.quantity}
                    </span>
                    <p className="mt-auto text-lg font-bold">
                      {formatCurrency(food.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-medium">Payment Methods</p>
          <form className="mt-5 grid gap-6">
            <div
              onClick={() => {
                setPaymentMethod(PaymentMethod.VN_PAY);
                console.log("Payment Method:", paymentMethod);
              }}
              className="relative rounded-lg"
              style={{
                background:
                  paymentMethod === PaymentMethod.VN_PAY ? "white" : "",
              }}
            >
              <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4">
                <img
                  src="https://on.net.vn/web/image/3876184-2b57e083/202166185_2021396718013233_8499389898242103910_n.png"
                  alt="VNPAY Logo"
                  style={{ width: "40px", height: "40px" }}
                  className="img-fluid product-thumbnail rounded-full"
                />
                <div className="ml-5 flex justify-end">
                  <span className="mt-2 font-semibold">VN Pay</span>
                </div>
              </label>
            </div>
            <div
              onClick={() => {
                setPaymentMethod(PaymentMethod.MOMO);
                console.log("Payment Method:", paymentMethod);
              }}
              className="relative rounded-lg"
              style={{
                background: paymentMethod === PaymentMethod.MOMO ? "white" : "",
              }}
            >
              <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4">
                <img
                  src="https://developers.momo.vn/v3/vi/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png"
                  alt="Momo Logo"
                  style={{ width: "40px", height: "40px" }}
                  className="img-fluid product-thumbnail rounded-full"
                />
                <div className="ml-5 flex">
                  <span className="mt-2 font-semibold">Momo</span>
                </div>
              </label>
            </div>

            <div
              onClick={() => setPaymentMethod(PaymentMethod.SHIP_CODE)}
              className="relative rounded-lg"
              style={{
                background:
                  paymentMethod === PaymentMethod.SHIP_CODE ? "white" : "",
              }}
            >
              <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/010/371/398/original/icon-direct-payments-suitable-for-education-symbol-line-style-simple-design-editable-design-template-simple-illustration-vector.jpg"
                  alt="directly"
                  style={{ width: "40px", height: "40px" }}
                  className="img-fluid product-thumbnail rounded-full"
                />
                <div className="ml-5 flex">
                  <span className="mt-2 font-semibold">
                    Pay directly upon receipt
                  </span>
                </div>
              </label>
            </div>
          </form>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <div className="">
            <label className="mt-4 mb-2 block text-sm font-medium">Email</label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="your.email@gmail.com"
                value={userInfo?.email ?? ""}
                disabled={true}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
            <label className="mt-4 mb-2 block text-sm font-medium">
              Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="card-holder"
                name="card-holder"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your address here"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => getLocationFromAddress()}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3"></div>
            </div>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">
                  {totalAmountCurrentcy}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Distance</p>
                <p className="font-semibold text-gray-900">
                  {`${targetDistance ?? 0} km`}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(shipping)}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalAmount + shipping)}
              </p>
            </div>
          </div>
          {/* <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
            Place Order
          </button> */}
          <button
            className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            type="button"
            style={{ width: "200px", height: "60px" }}
            onClick={handleSubmit}
            disabled={!paymentMethod || (targetDistance as number) > 30}
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
