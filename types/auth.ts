export interface User {
  _id: string;
  userId: number;
  email: string;
  name: string;
  phone: string;
  address?: string;
  address2?: string;
  country?: string;
  state?: string | null;
  city?: string;
  zip?: string;
  postCode?: string;
  image?: string;
  balance: number;
  kycStatus: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  membershipTier: string;
  provider: string;
  otpByPass: boolean;
  referralCode: string;
  referralEarning: number;
  totalSpent: number;
  providerId?: string;
  dob?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  requiredOTP: boolean;
}

export interface VerifyOTPResponse extends User {
  status: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  tempToken: string | null; // For OTP flow
  tempEmail: string | null; // For OTP flow
  // Accept the API payload directly (response contains user fields at top level plus token)
  setAuth: (payload: VerifyOTPResponse) => void;
  setTempAuth: (email: string, token: string) => void;
  clearTempAuth: () => void;
  logout: () => void;
  /** Merge partial user fields into current user (local only) */
  updateUserProfile?: (patch: Partial<User>) => void;
}
