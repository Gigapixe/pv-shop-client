export type WithdrawalMethod = "wallet" | "external";
export type ExternalPayoutType = "paypal" | "crypto";

export type WalletDetails = {
  paypalEmail?: string;
  cryptoAddress?: string;
  cryptoNetwork?: string;
};

export type WithdrawalRow = {
  requestedAt: string;
  amount: number;
  method: string;
  status: string;
  walletDetails?: WalletDetails;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type SortConfig = {
  key: keyof WithdrawalRow;
  direction: "ascending" | "descending";
};

export type WithdrawalFormState = {
  amount: string;
  method: WithdrawalMethod;
  walletDetails: {
    paypalEmail: string;
    cryptoAddress: string;
  };
};
