export type ReviewProduct = {
  image?: string[]; 
  _id: string;
  title: {
    en: string;
    zh?: string;
  };
  slug?: string;
  id?: string;
};

export type Review = {
  _id: string;
  order: string;
  product: ReviewProduct;
  user: string;
  rating: number;
  comment: string;
  userName?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewableOrder = {
  _id: string;
  createdAt: string;
  cart: Array<{
    _id: string;
    title: string;
    image?: string; 
    price: number;
  }>;
};

export type ReviewableItem = {
  orderId: string;
  orderDate: string;
  product: {
    _id: string;
    title: string;
    image?: string;
    price: number;
  };
};


export type ApiListResponse<T> = {
  status: "success" | "error";
  message?: string;
  data: T[];
};