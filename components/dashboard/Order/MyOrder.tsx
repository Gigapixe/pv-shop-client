"use client";

import AllOrders from "@/components/dashboard/Order/AllOrders";
import DateRangeFilter, { DateRange } from "@/components/ui/DateRangeFilter";
import Select, { SelectOption } from "@/components/ui/Select";
import OrderIcon from "@/public/icons/user/OrderIcon";
import { getPaymentMethods } from "@/services/orderService";
import { useAuthStore } from "@/zustand/authStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

const getStatusOptions = (t: (key: string) => string): SelectOption[] => [
  { value: "", label: t("allStatus") },
  { value: "PENDING", label: t("pending") },
  { value: "PROCESSING", label: t("processing") },
  { value: "DELIVERED", label: t("delivered") },
  { value: "FAILED", label: t("failed") },
  { value: "CANCELLED", label: t("cancelled") },
  { value: "ON_HOLD", label: t("onHold") },
  { value: "REFUNDED", label: t("refunded") },
];

type PaymentMethod = {
  name: string;
  image: string;
  slug: string;
};

export default function MyOrders() {
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
  const t = useTranslations("orders");
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  const [payment, setPayment] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const statusOptions = useMemo(() => getStatusOptions(t), [t]);

  useEffect(() => {
    if (!token) {
      setPayments([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const payload = await getPaymentMethods({ token });

        const methods =
          payload?.data?.paymentMethods ??
          payload?.data?.methods ??
          payload ??
          [];

        if (!cancelled) setPayments(Array.isArray(methods) ? methods : []);
      } catch (e: any) {
        if (!cancelled) toast.error(e?.message ?? t("loadPaymentError"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const statusFromUrl = searchParams.get("status") ?? "";
    const paymentFromUrl = searchParams.get("payment") ?? "";
    const searchFromUrl = searchParams.get("search") ?? "";

    setStatus(statusFromUrl);
    setPayment(paymentFromUrl);
    setSearch(searchFromUrl);
  }, [searchParams]);

  const paymentOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: t("allPaymentMethods") },
      ...payments.map((p) => ({
        value: p.slug,
        label: p.name,
      })),
    ],
    [payments, t],
  );

  return (
    <div>
      {/* --- Header --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-10 ">
        <h1 className="flex items-center gap-1.5 text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#FFFFFF]">
          <OrderIcon className="" /> {t("title")}
        </h1>

        <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
          <div className="w-full lg:w-[320px] relative">
            <IoSearchOutline
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full h-11 pl-10 pr-3 rounded-full border border-gray-200 
               dark:border-gray-700 bg-white dark:bg-[#111] 
               text-gray-900 dark:text-white outline-none 
               focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center w-full lg:w-auto">
            {/* status */}
            <div className="w-full">
              <Select
                value={status}
                onChange={(v) => setStatus(v)}
                options={statusOptions}
                placeholder={t("allStatus")}
                searchable={false}
                className="min-w-full lg:w-52!"
              />
            </div>

            {/* payment */}
            <div className="w-full">
              <Select
                value={payment}
                onChange={(v) => setPayment(v)}
                options={paymentOptions}
                placeholder={t("allPaymentMethods")}
                searchable
                className="min-w-full"
              />
            </div>

            {/* date range */}
            <div className="w-full">
              <DateRangeFilter
                value={range}
                onChange={setRange}
                weekStartsOn={1}
                className="min-w-50"
              />
            </div>
          </div>
        </div>
      </div>

      <AllOrders
        search={search}
        status={status}
        paymentMethod={payment}
        range={range}
      />
    </div>
  );
}
