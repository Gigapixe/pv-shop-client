"use client";
import { useThemeStore } from "@/zustand/store";
import { useTranslations } from "next-intl";
import Image from "next/image";

const paymentImagesWhite = [
  { id: 1, src: "/payments/visa.png", alt: "Visa" },
  { id: 2, src: "/payments/mastercard.png", alt: "MasterCard" },
  { id: 5, src: "/payments/amex.png", alt: "American Express" },
  { id: 6, src: "/payments/discover.png", alt: "Discover" },
  { id: 4, src: "/payments/bitcoin.png", alt: "Bitcoin" },
  { id: 3, src: "/payments/paypal.png", alt: "PayPal" },
  { id: 7, src: "/payments/apple-pay-dark.png", alt: "Apple-Pay" },
  { id: 8, src: "/payments/g-pay.png", alt: "Google-Pay" },
  { id: 9, src: "/payments/kucoin.png", alt: "KuCoin" },
  { id: 10, src: "/payments/binance.png", alt: "Binance" },
  { id: 11, src: "/payments/skrill.png", alt: "Skrill" },
  { id: 12, src: "/payments/neteller.png", alt: "Neteller" },
  { id: 13, src: "/payments/paysafe-dark.png", alt: "paysafe" },
  { id: 14, src: "/payments/paydo.png", alt: "paydo" },
];
const paymentMethodsDark = [
  { id: 1, src: "/payments/visa-dark.png", alt: "Visa-dark" },
  { id: 2, src: "/payments/mastercard-dark.png", alt: "MasterCard-dark" },
  { id: 5, src: "/payments/amex.png", alt: "American Express-dark" },
  { id: 6, src: "/payments/discover-dark.png", alt: "Discover-dark" },
  { id: 4, src: "/payments/bitcoin-dark.png", alt: "Bitcoin-dark" },
  { id: 3, src: "/payments/paypal-dark.png", alt: "PayPal-dark" },
  { id: 7, src: "/payments/apple-pay.png", alt: "Apple-Pay-dark" },
  { id: 8, src: "/payments/g-pay.png", alt: "Google-Pay-Dark" },
  { id: 9, src: "/payments/kucoin.png", alt: "KuCoin-dark" },
  { id: 10, src: "/payments/binance.png", alt: "Binance-dark" },
  { id: 11, src: "/payments/skrill.png", alt: "Skrill-dark" },
  { id: 12, src: "/payments/neteller.png", alt: "Neteller-dark" },
  { id: 13, src: "/payments/paysafe.png", alt: "paysafe-dark" },
  { id: 14, src: "/payments/paydo.png", alt: "paydo-dark" },
];

const PaymentMethods = () => {
  const t = useTranslations();
  const theme = useThemeStore((state) => state.theme);

  const paymentImages =
    theme === "dark" ? paymentMethodsDark : paymentImagesWhite;

  return (
    <div className="flex lg:flex-row flex-col w-full lg:items-center lg:justify-between flex-wrap container mx-auto">
      <h2 className="font-bold text-lg lg:mb-0 whitespace-nowrap">
        {t("footer.paymentMethodsTitle")}
      </h2>
      <div className="flex flex-wrap items-center space-x-2">
        {paymentImages.map((payment) => (
          <div key={payment.id} className="flex flex-col items-center">
            <Image
              src={payment.src}
              alt={payment.alt}
              width={100}
              height={100}
              className="w-16 h-16 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
