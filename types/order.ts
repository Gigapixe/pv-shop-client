type CredentialItem = { _id: string; value: string; usedAt?: string | null };

export type Order = {
  _id: string;
  invoice: number;
  status: string;
  createdAt: string;
  total: number;
  discount: number;
  paymentMethod: string;
  paymentMethodImage?: string;
  cart: Array<{
    _id: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  user_info?: {
    name?: string;
    email?: string;
    contact?: string;
    address?: string;
    country?: string;
  };
  
  deliveredCredentials?: Array<{
    _id: string;
    productTitle: string;
    credentials: CredentialItem[];
  }>;
};