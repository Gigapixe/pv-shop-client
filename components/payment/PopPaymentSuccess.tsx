"use client";

import Link from "next/link";
import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

const PopPaymentSuccess: React.FC = () => {
  return (
    <div title="Payment Successful">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100 dark:bg-gray-900">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg max-w-md w-full dark:bg-gray-800 dark:border dark:border-gray-700">
          <IoCheckmarkCircle className="text-emerald-600 w-16 h-16 mx-auto my-6 dark:text-emerald-500" />
          <div className="text-center">
            <h3 className="md:text-2xl text-xl text-gray-800 font-semibold text-center dark:text-white">
              Payment Successful!
            </h3>
            <p className="text-gray-600 my-2 dark:text-gray-300">
              Thank you for completing your payment.
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              We are processing your order and will send a confirmation email
              shortly.
            </p>
            <div className="py-10 text-center">
              <Link
                href="/user/dashboard"
                className="px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                View Orders in Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopPaymentSuccess;
