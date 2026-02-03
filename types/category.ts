export type CategoryName = { en: string } & Record<string, string | undefined>;

export interface Category {
  _id: string;
  name: CategoryName;
  slug: string;
  parentId?: string | null;
  icon?: string | null;
  flag?: string | null;
  image?: string | null;
  // API returns false when there are no children, otherwise an array of Category
  children: false | Category[];
}

export interface ApiResponse<T> {
  categoryList: any;
  data: T;
  // Optional parent category returned by some endpoints
  parentCategory?: any;
  success?: boolean;
  message?: string;
}

export interface CategoryCardProps {
  category: Category;
}

// Category Products Page Types
export interface CategoryData {
  _id: string;
  name: { en: string };
  slug: string;
  icon?: string;
  flag?: string;
  parentId?: {
    _id: string;
    name: { en: string };
  };
  parentName?: string;
}

export interface CategoryProduct {
  _id: string;
  title: { en: string };
  slug: string;
  image: string[];
  prices: {
    price: number;
    originalPrice: number;
    discount: number;
  };
  isStock: boolean;
  isHot: boolean;
  category: {
    _id: string;
    name: { en: string };
    slug: string;
  };
}

export interface FilterCategory {
  name: { en: string };
  slug: string;
  icon?: string;
  flag?: string;
}

export interface BreadcrumbItem {
  _id: string;
  name: { en: string };
  slug: string;
}

export interface CategoryProductsResponse {
  category: CategoryData;
  products: CategoryProduct[];
  filterCategory: FilterCategory[];
  categoryList: BreadcrumbItem[];
  parentCategory?: any;
}
