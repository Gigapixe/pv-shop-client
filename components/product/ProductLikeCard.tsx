import Image from "next/image";
import Link from "next/link";
import CurrencyDisplay from "../ui/currency/CurrencyDisplay";
import { Tooltip } from "react-tooltip";

interface ProductLikeCardProps {
  product: {
    _id: string;
    slug: string;
    title: {
      en: string;
    };
    image: string[];
    countrySupport?: string;
    prices: {
      price: number;
    };
  };
}

export default function ProductLikeCard({ product }: ProductLikeCardProps) {
  const { title, image, countrySupport, prices, slug } = product;

  return (
    <div className="group hover:-translate-y-1 transition-all duration-200 rounded-xl bg-background-light dark:bg-white/5 max-w-50.5">
      {/* Product Image */}
      <Link href={`/product/${slug}`}>
        <div className="relative pt-[100%]">
          <Image
            src={image?.[0]}
            alt={title?.en}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center rounded-t-xl"
            loading="eager"
          />
        </div>
      </Link>

      <div className="p-4">
        {/* Title & Region */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 w-full">
          <Link
            id={`product-title-${product.slug}`}
            data-tooltip-content={title?.en}
            href={`/product/${slug}`}
            className="text-sm font-bold leading-5 hover:text-emerald-500 line-clamp-1"
          >
            {title?.en}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {countrySupport}
          </p>
        </div>

          <Tooltip
          anchorSelect={`#product-title-${product.slug}`}
          place="top"
          className="z-50 bg-background-light dark:bg-background-dark! !rounded-full px-3 py-1 !text-[10px] dark:text-white shadow-lg max-w-xs"
        />

        {/* Price & icon */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-base font-bold text-gray-800 dark:text-gray-200">
            <CurrencyDisplay amount={prices.price} showCurrency />
          </span>
          <Link
            href={`/product/${slug}`}
            className="border border-gray-200 rounded-full p-2"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.88156 6.17773H15.0931V14.3893M14.5229 6.74799L6.19727 15.0736"
                stroke="#333333"
                className="dark:stroke-white"
                strokeWidth="1.58358"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
