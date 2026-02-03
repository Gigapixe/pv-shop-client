export interface ProductPrice {
  price: number;
  originalPrice: number;
  discount: number;
}

export interface ProductTitle {
  en: string;
  zh?: string;
}

export interface ProductCategory {
  _id: string;
  name: ProductTitle;
  parentId?:
    | string
    | {
        _id: string;
        name: ProductTitle;
      };
  flag?: string;
  countryRestrictions?: string[];
  slug: string;
}

export interface ProductDetails {
  _id: string;
  productId: string;
  barcode: string;
  title: ProductTitle;
  slug: string;
  prices: ProductPrice;
  topupPrice: ProductPrice;
  description: ProductTitle;
  benefits?: ProductTitle;
  termsAndConditions?: ProductTitle;
  howToRedeem?: ProductTitle;
  sortDescription?: string;
  image: string[];
  category: ProductCategory;
  stock: number;
  isStock: boolean;
  isPopular: boolean;
  isTrending: boolean;
  isTopUpProduct: boolean;
  isHot: boolean;
  isBestSale: boolean;
  isGiftCard: boolean;
  countrySupport?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterCategoryItem {
  name: ProductTitle;
  flag?: string;
  icon?: string;
  slug: string;
}

export interface RelatedProduct {
  _id: string;
  productId: string;
  title: ProductTitle;
  slug: string;
  prices: ProductPrice;
  topupPrice: ProductPrice;
  image: string[];
  category: ProductCategory;
  isStock: boolean;
  isHot: boolean;
}

export interface ProductPageData {
  userIp: string;
  product: ProductDetails;
  filterCategory: FilterCategoryItem[];
  relatedProducts: RelatedProduct[];
}
