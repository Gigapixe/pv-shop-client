"use client";

import React from "react";
import Link from "next/link";
import { IoCloseCircle } from "react-icons/io5";

const PaymentCancel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white p-6 md:mx-auto rounded-lg shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
        <IoCloseCircle className="text-red-600 w-16 h-16 mx-auto my-6 dark:text-red-500" />
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold dark:text-white">
            Payment Cancelled
          </h3>
          <p className="text-gray-600 my-2 dark:text-gray-300">
            Your payment has been cancelled.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            You can try again or contact support if you need assistance.
          </p>

          <div className="py-10 text-center space-y-4">
            <Link
              href="/checkout"
              className="px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg block dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              Try Again
            </Link>
            <Link
              href="/user/dashboard"
              className="px-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg block dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
