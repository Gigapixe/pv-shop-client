"use client";

import { useTranslations } from "next-intl";
import AffiliateStatCard from "./AffiliateStatCard";

export default function StatsGrid({
  stats,
  loading,
}: {
  stats: any;
  loading: boolean;
}) {
  const t = useTranslations("referral");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AffiliateStatCard
        title={t("pendingReferrals")}
        value={stats.pendingCount}
        change="+1.03%"
        loading={loading}
      />
      <AffiliateStatCard
        title={t("completedReferrals")}
        value={stats.completedCount}
        change="+1.03%"
        loading={loading}
      />
      <AffiliateStatCard
        title={t("cancelledReferrals")}
        value={stats.cancelledCount}
        change="+1.03%"
        loading={loading}
      />
      <AffiliateStatCard
        title={t("totalReferrals")}
        value={stats.totalReferrals}
        change="+1.03%"
        loading={loading}
      />
      <AffiliateStatCard
        title={t("totalEarningsLifetime")}
        value={`$${stats.totalEarningsLifetime.toFixed(2)}`}
        change={t("lifetime")}
        isLifetime
        loading={loading}
      />
      <AffiliateStatCard
        title={t("totalPayouts")}
        value={`$${stats.totalPayoutsLifetime.toFixed(2)}`}
        change={t("lifetime")}
        isLifetime
        loading={loading}
      />
      <AffiliateStatCard
        title={t("totalLinkVisits")}
        value={stats.totalVisits}
        change="+1.03%"
        loading={loading}
      />
      <AffiliateStatCard
        title={t("conversionRate")}
        value={`${stats.conversionRate}%`}
        change="+1.03%"
        loading={loading}
      />
    </div>
  );
}
