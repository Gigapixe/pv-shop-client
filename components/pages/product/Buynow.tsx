"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CountrySupport from "@/components/pages/product/CountrySupport";
import { useCartStore } from "@/zustand/store";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/zustand/authStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import CurrencyDisplay from "@/components/ui/currency/CurrencyDisplay";
import { useTranslations } from "next-intl";
import { addNotify } from "@/services/notifyService";
import WishlistButton from "@/components/product/WishlistButton";

interface Value {
  _id?: string;
  id: number;
  price: number;
  originalPrice: number;
  discount: number;
  slug: string;
  name?: string;
  image?: string;
  isStock?: boolean;
  region?: {
    id: number;
    name: string;
    image?: string | null;
  };
}

interface Product {
  _id?: string;
  id?: string | number;
  name?: string;
  slug?: string;
  image?: string | string[];
  isStock?: boolean;
  isGiftCard?: boolean;
  countrySupport?: string;
  DigitalPrice?: {
    price: number;
    originalPrice: number;
  };
  TopUpPrice?: {
    price: number;
    originalPrice: number;
  };
  region?: {
    id: number;
    name: string;
    image?: string | null;
  };
  category?: any;
  sortDescription?: string;
}

interface BuyNowProps {
  values?: Product | Value[];
  selectedSlug?: string | null; // For category page
  categoryImage?: string; // Category icon image
  categoryName?: string; // category name for mobile layout
  product?: Product; // Product data when used on product page
  showActivation?: boolean; // show activation/info when true
  showAmount?: boolean; // whether to show amount/price block (default: true)
  showQuantity?: boolean; // whether to show quantity controls (default: true)
  showBuyButton?: boolean; // whether to show the Buy/Notify button (default: true)
  className?: string; // additional class names for container
}

export default function BuyNow({
  values,
  selectedSlug,
  categoryImage,
  product,
  showActivation = false,
  showAmount = true,
  showQuantity = true,
  showBuyButton = true,
  categoryName,
  className,
}: BuyNowProps) {
  const t = useTranslations("product");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openCart, addToCart, metaType } = useCartStore();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Use selectedSlug prop if provided (for category page), otherwise extract from pathname
  const currentSlug = selectedSlug || pathname.split("/").pop();
  const tab =
    searchParams.get("tab") === "topup-pin" ? "topup-pin" : "digital-pin";
  // persisted cart types — keep in sync with zustand/store.ts
  const selectedProductType =
    tab === "digital-pin" ? "DIGITAL_PINS" : "TOPUP_PINS";

  const [quantityInput, setQuantityInput] = useState(String(quantity));

  const increaseQuantity = () => {
    setQuantity((prev) => {
      const next = prev + 1;
      setQuantityInput(String(next));
      return next;
    });
  };

  const decreaseQuantity = () =>
    setQuantity((prev) => {
      const next = prev > 1 ? prev - 1 : 1;
      setQuantityInput(String(next));
      return next;
    });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // allow empty so user can clear to type
    if (val === "") {
      setQuantityInput(val);
      return;
    }
    const num = parseInt(val, 10);
    if (!Number.isNaN(num) && num >= 1) {
      setQuantity(num);
      setQuantityInput(String(num));
    } else {
      // keep the typed value but don't update quantity until blur
      setQuantityInput(val);
    }
  };

  const handleQuantityBlur = () => {
    const num = parseInt(quantityInput, 10);
    if (isNaN(num) || num < 1) {
      setQuantity(1);
      setQuantityInput("1");
    } else {
      setQuantity(num);
      setQuantityInput(String(num));
    }
  };

  // Keep input in sync if quantity changes by other effects
  useEffect(() => {
    setQuantityInput(String(quantity));
  }, [quantity]);

  // Determine the selected product and prices
  let selectedProduct: Product | Value | null = null;
  let currentPrice = 0;
  let originalPrice = 0;
  let isOutOfStock = false;

  if (Array.isArray(values)) {
    // CategoryPage or ProductCustomPage: values is an array of Value
    const valuesArray = values as Value[];
    selectedProduct =
      valuesArray.find((value) => value.slug === currentSlug) || null;
    if (selectedProduct) {
      const valueSelected = selectedProduct as Value;
      currentPrice = valueSelected.price;
      originalPrice = valueSelected.originalPrice;
      isOutOfStock = valueSelected.isStock === false;
    }
  } else {
    // ProductPage: values is a single Product
    const product = values as Product;
    selectedProduct = product || null;
    if (product) {
      if (tab === "digital-pin" && product.DigitalPrice) {
        currentPrice = product.DigitalPrice.price;
        originalPrice = product.DigitalPrice.originalPrice;
      } else if (tab === "topup-pin" && product.TopUpPrice) {
        currentPrice = product.TopUpPrice.price;
        originalPrice = product.TopUpPrice.originalPrice;
      } else {
        // Fallback: use DigitalPrice if available, otherwise TopUpPrice
        currentPrice =
          product.DigitalPrice?.price || product.TopUpPrice?.price || 0;
        originalPrice =
          product.DigitalPrice?.originalPrice ||
          product.TopUpPrice?.originalPrice ||
          0;
      }
      // Check stock status for Product type
      isOutOfStock = product.isStock === false;
    }
  }

  // Calculate discount dynamically
  const discountPercent =
    originalPrice && originalPrice !== 0
      ? ((originalPrice - currentPrice) / originalPrice) * 100
      : 0;

  const handleBuyNow = () => {
    if (!selectedProduct) {
      toast.error(t("selectProduct"));
      return;
    }

    // block when cart already locked to a different metaType
    if (metaType && metaType !== selectedProductType) {
      toast.error(
        metaType === "WALLET_LOAD"
          ? "Please complete or remove the wallet topup."
          : "Your cart contains a different product type — remove existing items before adding this product.",
      );
      openCart();
      return;
    }

    const itemId = (selectedProduct as any)?.id
      ? String((selectedProduct as any).id)
      : (selectedProduct as Product)?._id || "";

    const imageSrc = Array.isArray((selectedProduct as Product).image)
      ? ((selectedProduct as Product).image as string[])[0]
      : (selectedProduct as any).image || "";

    const paymentMethodsSet = new Set<string>();

    // Helper to add IDs
    const addIds = (list: any[]) => {
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        if (typeof item === "string") paymentMethodsSet.add(item);
        else if (item?._id) paymentMethodsSet.add(item._id);
      });
    };

    // Add from selected product or main product root
    const sp = selectedProduct as any;
    const p = product as any;
    if (sp?.paymentMethods) addIds(sp.paymentMethods);
    if (p?.paymentMethods) addIds(p.paymentMethods);

    const categorySource = sp?.category || p?.category;

    if (categorySource) {
      if (categorySource.paymentMethods) {
        addIds(categorySource.paymentMethods);
      }
      if (categorySource.parentId?.paymentMethods) {
        addIds(categorySource.parentId.paymentMethods);
      }
    }

    const item = {
      _id: (selectedProduct as Product)?._id,
      productId: (selectedProduct as Product)?._id || itemId,
      title: (selectedProduct as any)?.name || t("unknownProduct"),
      price: currentPrice,
      image: imageSrc,
      slug: (selectedProduct as any)?.slug || "",
      isGiftCard: (selectedProduct as Product).isGiftCard || false,
      type: selectedProductType,
      topupInputValues: {},
      paymentMethods: Array.from(paymentMethodsSet),
    } as any;

    // Try to add `quantity` times — addToCart will increment existing item's quantity.
    let addedCount = 0;
    for (let i = 0; i < quantity; i++) {
      const ok = addToCart(item);
      if (!ok) {
        // stop on first rejection and surface a clear message
        toast.error(
          t("mixTypeError") ||
            "Cannot add item: cart contains a different product type. Remove existing items to proceed.",
        );
        break;
      }
      addedCount++;
    }

    if (addedCount > 0) {
      toast.success(
        `${selectedProduct.name || t("product")} ${t("addedToCart")}`,
      );
      openCart();
    }
  };

  const handleNotifyMe = () => {
    if (!selectedProduct) {
      toast.error(t("selectProduct"));
      return;
    }

    // // Pre-fill email if user is logged in
    // if (user?.email) {
    //   setEmail(user.email);
    // }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const handleSubmitNotifyMe = async () => {
    if (!selectedProduct) {
      toast.error(t("selectProduct"));
      return;
    }

    const finalEmail = (email || user?.email || "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!finalEmail || !emailRegex.test(finalEmail)) {
      toast.error(t("enterValidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response: any = await addNotify({
        email: finalEmail,
        productId: selectedProduct?._id,
      });

      if (response?.success) {
        toast.success(
          `${t("notifyWhenAvailable")}: ${selectedProduct.name || t("thisProduct")}`,
        );
        setIsModalOpen(false);
        setEmail("");
      } else {
        toast.error(response?.message || "Failed to set up notification");
      }
    } catch (error: any) {
      toast.error(error?.message || t("errorOccurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
  };

  return (
    <>
      {/* Product Image Section */}
      <div
        className={`bg-[#F8F8F8] dark:bg-background-dark sm:rounded-2xl lg:shadow-sm p-0 md:p-4 w-full border border-border-light dark:border-border-dark ${className || ""}`}
      >
        {(selectedProduct?.image || categoryImage) && (
          <div className="relative mb-4 rounded-2xl overflow-hidden">
            <Image
              src={
                Array.isArray((selectedProduct as Product)?.image)
                  ? ((selectedProduct as Product).image as string[])[0]
                  : (selectedProduct as any)?.image ||
                    categoryImage ||
                    "/placeholder.png"
              }
              alt={selectedProduct?.name || "Category"}
              width={800}
              height={800}
              className="h-50 w-50 lg:w-full lg:h-68 lg:object-fill hidden lg:block"
            />
            <Image
              src={
                Array.isArray((selectedProduct as Product)?.image)
                  ? ((selectedProduct as Product).image as string[])[0]
                  : (selectedProduct as any)?.image ||
                    categoryImage ||
                    "/placeholder.png"
              }
              alt={selectedProduct?.name || "Category"}
              width={400}
              height={400}
              className="h-50 w-50 lg:w-full lg:h-44.5 lg:object-fill absolute m-auto top-0 left-0 right-0 bottom-0 lg:hidden"
            />
            <Image
              src="/assets/product-bg.png"
              alt="Category"
              width={200}
              height={200}
              className="rounded w-full h-57.5 lg:hidden"
            />
          </div>
        )}
        <h1 className="text-xl font-semibold hidden lg:block">
          {t("productSummary")}
        </h1>
        <h1 className="text-lg md:text-xl font-semibold lg:hidden">
          {categoryName || selectedProduct?.name || t("selectAProduct")}
        </h1>

        <div className="flex lg:hidden items-center gap-4 mt-3 mb-2">
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            {t("noReviews")}
          </span>
          {/* Wishlist Button */}
          {product && (
            <WishlistButton product={product as any} iconSize="w-6 h-6" />
          )}
        </div>
        {/* Product Description */}
        {product && product.sortDescription && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 block lg:hidden">
            {product.sortDescription}
          </p>
        )}

        <hr className="border border-border-light dark:border-border-dark my-4 hidden lg:block" />

        {showActivation && (
          <CountrySupport
            slug={(product as any)?.slug || currentSlug || undefined}
          />
        )}
        <div className="fixed lg:static bottom-0 left-0 right-0 z-30 bg-white dark:bg-background-dark lg:bg-transparent">
          {selectedProduct ? (
            <>
              {showAmount && (
                <>
                  <hr className="border border-border-light dark:border-border-dark my-4 hidden lg:block" />
                  <div className="bg-white dark:bg-primary/5 p-2 lg:p-4 rounded-2xl mb-2 lg:mb-4 ">
                    {isOutOfStock ? (
                      <>
                        <div className="text-red-600 dark:text-red-400 font-medium text-center">
                          {t("outOfStock")}
                        </div>
                        <p className="text-center text-sm font-semibold">
                          <CurrencyDisplay amount={currentPrice * quantity} />
                        </p>
                      </>
                    ) : (
                      <div className="text-sm text-center flex flex-col gap-2">
                        <h1>
                          {t("amount")} (x{quantity})
                        </h1>
                        <div className="flex items-center justify-center lg:justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="line-through text-gray-400">
                              <CurrencyDisplay amount={originalPrice} />
                            </span>
                            {discountPercent !== 0 && (
                              <span
                                className={`font-medium bg-primary rounded-full text-xs px-2 py-0.5 ${
                                  discountPercent > 0
                                    ? "text-green-500 bg-secondary"
                                    : "text-white"
                                }`}
                              >
                                {discountPercent > 0
                                  ? `-${discountPercent.toFixed(0)}%`
                                  : `+${Math.abs(discountPercent).toFixed(0)}%`}
                              </span>
                            )}
                          </div>
                          <p className="text-end font-semibold">
                            <CurrencyDisplay amount={currentPrice * quantity} />
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center p-2 lg:p-3 bg-[#FAAE4B] rounded-lg mb-4 mx-4 lg:mx-0 mt-4 lg:mt-0">
              <h1 className="font-bold text-white text-sm sm:text-base">
                {t("selectAProduct")}
              </h1>
            </div>
          )}

          <div className="flex items-center flex-col sm:flex-row lg:flex-col gap-2 md:gap-4 text-background-dark dark:text-gray-200 px-4 lg:px-0">
            {showQuantity && (
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:max-w-40 md:min-w-80 lg:min-w-full lg:w-full justify-between ">
                <button
                  onClick={decreaseQuantity}
                  disabled={!selectedProduct || quantity === 1 || isOutOfStock}
                  className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50 rounded-l-lg"
                >
                  -
                </button>

                <input
                  type="text"
                  value={quantityInput}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  disabled={!selectedProduct || isOutOfStock}
                  className="w-16 text-center font-medium bg-white dark:bg-gray-700 h-full border-0 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                  aria-label="Quantity"
                />

                <button
                  onClick={increaseQuantity}
                  disabled={!selectedProduct || isOutOfStock}
                  className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50 rounded-r-lg"
                >
                  +
                </button>
              </div>
            )}

            {showBuyButton && (
              <Button
                disabled={!selectedProduct}
                onClick={
                  isOutOfStock
                    ? user?.email
                      ? handleSubmitNotifyMe
                      : handleNotifyMe
                    : handleBuyNow
                }
                className={`w-full  ${
                  isOutOfStock
                    ? "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                    : ""
                }`}
              >
                {!selectedProduct
                  ? t("selectAProduct")
                  : isOutOfStock
                    ? isSubmitting
                      ? t("sending")
                      : t("notifyMe")
                    : t("buyNow")}
              </Button>
            )}

            <div className="hidden lg:flex items-center justify-center gap-1 my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="21"
                fill="none"
              >
                <path
                  fill="#66BB6A"
                  d="m6.067 17.817 6.375-7.65H8.108l.842-6.659-5.758 8.325h3.725l-.85 5.984ZM4 20.5l1-7H0l9-13h2l-1 8h6l-10 12H4Z"
                ></path>
              </svg>
              <h2 className="text-gray-700 dark:text-gray-300 font-bold">
                {t("instantDelivery")}
              </h2>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Activation (visible on product page only) */}
      {/* <div className="bg-[#F8F8F8] dark:bg-primary/5 sm:rounded-2xl sm:shadow-sm p-4 w-full border border-border-light dark:border-border-dark mt-6 overflow-hidden">
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              <div className="text-[10px]">{feature.icon}</div>
              <h1 className="text-[10px] font-bold text-center">
                {feature.title}
              </h1>
            </div>
          ))}
        </div>
      </div> */}
      {/* Notify Me Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {t("notifyWhenAvailableTitle")}
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Product Name */}
          {selectedProduct && (
            <h3 className="font-medium text-lg">{selectedProduct?.name}</h3>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("notifyDescription")}
          </p>

          {/* Email Input */}
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("enterEmail")}
            disabled={isSubmitting}
          />

          {/* Send Button */}
          <Button
            className="w-full"
            onClick={handleSubmitNotifyMe}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("sending") : t("send")}
          </Button>

          {/* Cancel Button */}
          <Button
            onClick={handleCloseModal}
            disabled={isSubmitting}
            btnType="outline"
            className="w-full"
          >
            {t("cancel")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
