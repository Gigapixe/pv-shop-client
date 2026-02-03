"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HiOutlineChartBar } from "react-icons/hi";
import DateRangeFilter, { DateRange } from "../ui/DateRangeFilter";
import { useAuthStore } from "@/zustand/authStore";
import { getOrderOverview } from "@/services/orderService";
import { useTranslations } from "next-intl";

type OverviewRow = {
  month: string;
  orders: number;
  avgValue: number;
};

type OverviewResponse = {
  success: boolean;
  data: OverviewRow[];
  message: string;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

const fmtInt = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

// ---- Tooltip ----
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const rows = payload.map((p) => ({
    name: String(p?.name ?? ""),
    value: Number(p?.value ?? 0),
    key: String(p?.dataKey ?? ""),
    color: String(p?.fill ?? "currentColor"),
  }));

  return (
    <div
      className="min-w-45 p-3 rounded-xl border shadow-lg backdrop-blur-md
      bg-white/95 dark:bg-background-dark/95 border-gray-200 dark:border-border-dark"
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {label}
      </p>

      <div className="mt-2 space-y-1.5">
        {rows.map((r, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: r.color }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-200">
                {r.name}
              </span>
            </div>

            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {r.key === "avgValue" ? `$${fmtMoney(r.value)}` : fmtInt(r.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderChart: React.FC = () => {
  const { token } = useAuthStore();
  const t = useTranslations("dashboard.orderChart");
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<OverviewRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          if (!cancelled) {
            setRows([]);
            setLoading(false);
          }
          return;
        }

        const res = (await getOrderOverview(
          {
            startDate: range?.from ?? undefined,
            endDate: range?.to ?? undefined,
          },
          { token: token ?? undefined },
        )) as OverviewResponse;

        if (!cancelled) {
          setRows(Array.isArray(res?.data) ? res.data : []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load overview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, range?.from, range?.to]);

  const data = useMemo(() => rows, [rows]);

  return (
    <div className="bg-white dark:bg-background-dark p-5 rounded-2xl border border-gray-200 dark:border-border-dark">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HiOutlineChartBar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h3>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
            bg-emerald-50 text-emerald-700 border border-emerald-100
            dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              {t("orders")}
            </span>

            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
            bg-sky-50 text-sky-700 border border-sky-100
            dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              {t("avgOrderValue")}
            </span>

            {range?.from && range?.to ? (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                {t("filtered")}
              </span>
            ) : null}
          </div>
          <div>
            <DateRangeFilter
              value={range}
              onChange={setRange}
              weekStartsOn={1}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="mt-4 h-90 w-full rounded-xl bg-gray-50 dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-border-dark" />
      ) : error ? (
        <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-200">
          {error || t("loadError")}
        </div>
      ) : data.length === 0 ? (
        <div className="mt-4 p-6 rounded-xl border border-gray-200 dark:border-border-dark text-sm text-gray-600 dark:text-gray-300">
          {t("noData")}
        </div>
      ) : (
        <div className="mt-4 h-90 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                opacity={0.12}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 12, opacity: 0.75 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 12, opacity: 0.75 }}
                tickFormatter={(v: number) => fmtInt(v)}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(16,185,129,0.08)" }}
              />

              {/* Orders */}
              <Bar
                dataKey="orders"
                name={t("orders")}
                fill="#10B981"
                radius={[10, 10, 0, 0]}
                maxBarSize={34}
              />

              {/* Avg order value */}
              <Bar
                dataKey="avgValue"
                name={t("avgValue")}
                fill="#0EA5E9"
                radius={[10, 10, 0, 0]}
                maxBarSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OrderChart;
