"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment } from "@/services/paymentService";
import { useCartStore } from "@/zustand/store";
import { useAuthStore } from "@/zustand/authStore";

import Link from "next/link";

import Spinner from "@/components/ui/Spinner";
import {
  IoCheckmarkCircle,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import CurrencyDisplay from "../ui/currency/CurrencyDisplay";
import PremiumLoader from "../ui/PremiumLoader";
import Button from "../ui/Button";

type VerificationStatus = "loading" | "success" | "pending_approval" | "failed";

const PaymentSuccess = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tradeNo = params?.get("tradeNo");
  const type = (params?.get("type") || "purchase") as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("loading");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [paidVia, setPaidVia] = useState<string | null>(null);

  const { clearCart } = useCartStore();
  const { user } = useAuthStore();

  // ensure cart is cleared exactly once after a confirmed purchase
  const hasClearedCartRef = useRef(false);
  const clearCartOnce = useCallback(() => {
    if (hasClearedCartRef.current) return;
    hasClearedCartRef.current = true;
    try {
      clearCart();
    } catch (e) {
      console.warn("clearCart failed:", e);
    }
  }, [clearCart]);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!tradeNo) {
        setIsLoading(true);
        setVerificationStatus("loading");
        return;
      }

      if (user === undefined) {
        setIsLoading(true);
        setVerificationStatus("loading");
        return;
      }

      setIsLoading(true);
      setError(null);
      setOrderId(null);
      setVerificationStatus("loading");
      setRequestStatus(null);

      try {
        const response = await verifyPayment({ tradeNo, type });

        if (response?.status === "success") {
          const responseData = response.data || {};

          if (type === "purchase") {
            setVerificationStatus("success");
            setOrderId(responseData.orderId);
            clearCartOnce();
          } else if (type === "wallet") {
            setVerificationStatus("pending_approval");
            setRequestStatus(responseData.requestStatus);
          }
          // Try common backend fields (adjust if your API uses different names)
          const amount =
            responseData.amount ??
            responseData.paidAmount ??
            responseData.total ??
            responseData.paymentAmount ??
            null;

          const via =
            responseData.paymentMethod ??
            responseData.method ??
            responseData.via ??
            type; // fallback to query type

          setPaidAmount(
            typeof amount === "number" ? amount : Number(amount) || null,
          );
          setPaidVia(typeof via === "string" ? via : String(via));
        } else {
          setVerificationStatus("failed");
          throw new Error(
            response?.message ||
              response?.data?.message ||
              "Payment verification failed.",
          );
        }
      } catch (err: any) {
        console.error("Error verifying payment:", err);
        setVerificationStatus("failed");
        const specificError =
          err.response?.data?.message ||
          err.message ||
          "Failed to verify payment status.";
        setError(specificError);

        const transactionStatus = err.response?.data?.data?.transactionStatus;
        if (
          transactionStatus &&
          ["Failed", "Cancelled", "Expired"].includes(transactionStatus)
        ) {
          setError(
            `Payment ${transactionStatus.toLowerCase()}. Please try again or contact support.`,
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [tradeNo, type, user, router, clearCart, clearCartOnce]);

  // fallback: ensure cart cleared if verificationStatus becomes `success` later
  useEffect(() => {
    if (verificationStatus === "success" && type === "purchase") {
      clearCartOnce();
    }
  }, [verificationStatus, type, clearCartOnce]);

  // Loading State
  if (isLoading) {
    return (
      <div title="Verifying Payment">
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex justify-center mb-8 scale-75 sm:scale-100">
              <PremiumLoader />
            </div>
            <p className="text-lg font-medium text-center text-gray-600 dark:text-gray-300 max-w-sm px-4">
              Verifying payment status, please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failure State
  if (verificationStatus === "failed" && error) {
    return (
      <div title="Payment Error">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100 dark:bg-gray-900">
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg max-w-md w-full dark:bg-gray-800 dark:border dark:border-gray-700">
            <IoWarningOutline className="text-red-500 w-16 h-16 mx-auto my-6 dark:text-red-400" />
            <h3 className="md:text-2xl text-xl text-gray-800 font-semibold mb-3 dark:text-white">
              Payment Verification Failed
            </h3>
            <p className="text-gray-600 my-2 dark:text-gray-300">
              There was an issue verifying your payment:
            </p>
            <p className="text-red-600 bg-red-100 p-3 rounded text-sm mb-6 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
            <p className="text-gray-600 text-sm mb-4 dark:text-gray-300">
              If the payment was deducted from your account, please contact
              support with your transaction details (Trade No: {tradeNo}).
            </p>
            <div className="py-6 space-y-3">
              <Link
                href="/user/dashboard"
                className="block w-full px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              >
                Go to Dashboard
              </Link>
              <Link
                href={type === "purchase" ? "/checkout" : "/user/my-wallet"}
                className="block w-full px-8 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                {type === "purchase"
                  ? "Try Checkout Again"
                  : "Try Top-up Again"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State (Purchase)
  if (verificationStatus === "success" && type === "purchase") {
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
                {paidAmount ? (
                  <>
                    Your payment of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      <CurrencyDisplay amount={paidAmount} showCurrency />
                    </span>{" "}
                    via{" "}
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                      {paidVia || "wallet"}
                    </span>{" "}
                    has been processed successfully.
                  </>
                ) : (
                  <>Your payment was successful!</>
                )}
              </p>

              {orderId && (
                <p className="text-gray-700 bg-gray-100 p-3 rounded text-sm my-4 dark:bg-gray-700 dark:text-gray-200">
                  Your Order ID is:{" "}
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    {orderId}
                  </span>
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-300">
                We are processing your order and will send a confirmation email
                shortly.
              </p>
              <div className="py-10 text-center">
                <Button href="/user/dashboard" className="w-full">
                  View Orders in Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending Approval State (Wallet Top-up)
  if (verificationStatus === "pending_approval" && type === "wallet") {
    return (
      <div title="Top-up Pending Approval">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100 dark:bg-gray-900">
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg max-w-md w-full dark:bg-gray-800 dark:border dark:border-gray-700">
            <IoTimeOutline className="text-blue-500 w-16 h-16 mx-auto my-6 dark:text-blue-400" />
            <div className="text-center">
              <h3 className="md:text-2xl text-xl text-gray-800 font-semibold text-center dark:text-white">
                Top-up Request Submitted
              </h3>
              <p className="text-gray-600 my-2 dark:text-gray-300">
                Your payment was successful!
              </p>
              <p className="text-gray-700 bg-blue-50 p-3 rounded text-sm my-4 dark:bg-blue-900/20 dark:text-blue-200">
                Your top-up request (Trade No:{" "}
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  {tradeNo}
                </span>
                ) is now{" "}
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  pending approval
                </span>
                .
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Your balance will be updated once the request is approved by an
                administrator. This usually takes a few minutes to a few hours.
              </p>
              <div className="py-10 text-center">
                <Link
                  href="/user/my-wallet"
                  className="px-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Back to My Wallet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for any unexpected state
  return (
    <div title="Payment Status">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Checking payment status...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
