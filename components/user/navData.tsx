import DashboardIcon from "@/public/icons/user/DashboardIcon";
import OrderIcon from "@/public/icons/user/OrderIcon";
import ReviewIcon from "@/public/icons/user/ReviewIcon";
import WishListIcon from "@/public/icons/user/WishListIcon";
import WalletIcon from "@/public/icons/user/WalletIcon";
import RedeemGiftCardIcon from "@/public/icons/user/RedeemGiftCardIcon";
import ReferralIcon from "@/public/icons/user/ReferralIcon";
import UpdateProfileIcon from "@/public/icons/user/UpdateProfileIcon";
import SupportTicketIcon from "@/public/icons/user/SupportTicketIcon";
import SecurityIcon from "@/public/icons/user/SecurityIcon";

export type NavItem = {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
};

export type NavGroup = {
  title: string;
  items: Array<{
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
  }>;
};

/**
 * Returns navigation groups using the provided translation function `t`.
 * If `t` is not provided, English defaults are returned.
 */
export function getNavGroups(t?: (key: string) => string): NavGroup[] {
  const tr = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    {
      title: tr("menu", "Menu"),
      items: [
        {
          label: tr("dashboard", "Dashboard"),
          href: "/user/dashboard",
          icon: DashboardIcon,
        },
        {
          label: tr("myOrders", "My Orders"),
          href: "/user/my-orders",
          icon: OrderIcon,
        },
        {
          label: tr("reviews", "Reviews"),
          href: "/user/my-reviews",
          icon: ReviewIcon,
        },
      ],
    },
    {
      title: tr("account", "Account"),
      items: [
        {
          label: tr("wishlist", "Wishlist"),
          href: "/user/wishlist",
          icon: WishListIcon,
        },
        {
          label: tr("myWallet", "My Wallet"),
          href: "/user/my-wallet",
          icon: WalletIcon,
        },
        {
          label: tr("redeemCard", "Redeem Card"),
          href: "/user/redeem-card",
          icon: RedeemGiftCardIcon,
        },
        {
          label: tr("referral", "Referral"),
          href: "/user/affiliate",
          icon: ReferralIcon,
        },
      ],
    },
    {
      title: tr("general", "General"),
      items: [
        {
          label: tr("updateProfile", "Update Profile"),
          href: "/user/update-profile",
          icon: UpdateProfileIcon,
        },
        {
          label: tr("support", "Support"),
          href: "/user/open-ticket",
          icon: SupportTicketIcon,
        },
        {
          label: tr("security", "Security"),
          href: "/user/security",
          icon: SecurityIcon,
        },
      ],
    },
  ];
}

export function getNavItems(t?: (key: string) => string): NavItem[] {
  return getNavGroups(t).flatMap((g) =>
    g.items.map((i) => ({ name: i.label, href: i.href, icon: i.icon })),
  );
}
