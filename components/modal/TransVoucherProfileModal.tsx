"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { updateProfile } from "@/services/customerService";
import { useAuthStore } from "@/zustand/authStore";
import toast from "react-hot-toast";
import CountrySelect from "../dashboard/profile/CountrySelect";
import StateSelect from "../dashboard/profile/StateSelect";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { State } from "country-state-city";
import { FiLoader } from "react-icons/fi";
import { toInputDate, toSubmissionDate } from "@/lib/date";

interface TransVoucherProfileModalProps {
  open: boolean;
  missingFields: string[];
  onClose: () => void;
  onProceed?: () => void;
}

export default function TransVoucherProfileModal({
  open,
  missingFields,
  onClose,
  onProceed,
}: TransVoucherProfileModalProps) {
  const { user: authUser, token, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    dob: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [countryStatesList, setCountryStatesList] = useState<Array<any>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    countries.registerLocale(en);
  }, []);

  useEffect(() => {
    if (authUser && open) {
      setFormData({
        address: authUser.address || "",
        city: authUser.city || "",
        country: authUser.country || "",
        state: (authUser as any).state || "",
        zip: (authUser as any).zip || "",
        dob: toInputDate(authUser.dob) || "",
      });

      // Setup country/state
      const countryCode =
        authUser.country && (authUser.country as string).length === 2
          ? (authUser.country as string).toUpperCase()
          : countries.getAlpha2Code(authUser.country || "", "en") || "";

      setSelectedCountry(countryCode);
      setSelectedState((authUser as any).state || authUser.city || "");

      const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
      setCountryStatesList(states);
    }
  }, [authUser, open]);

  if (!open) return null;

  const fieldLabels: Record<string, string> = {
    address: "Address",
    city: "City",
    country: "Country",
    state: "State",
    zip: "ZIP Code",
    dob: "Date of Birth",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getCustomerId = () => {
    if (!authUser) return null;
    return authUser._id ?? String((authUser as any).userId ?? "");
  };

  const handleSave = async () => {
    if (!authUser) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const id = getCustomerId();
      if (!id) {
        throw new Error("User ID not found");
      }

      const selectedCountryName =
        selectedCountry &&
        countries.getName(selectedCountry, "en", { select: "official" })
          ? countries.getName(selectedCountry, "en", { select: "official" })
          : formData.country || undefined;

      const payload: any = {
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: selectedCountryName,
        state: formData.state || undefined,
        zip: formData.zip || undefined,
        dob: (toSubmissionDate(formData.dob) ?? formData.dob) || undefined,
      };

      const res: any = await updateProfile(id, payload);

      // Merge returned fields into existing authenticated user
      const updatedData = res?.data || {};
      const mergedUser = { ...(authUser as any), ...updatedData };

      setAuth({ ...(mergedUser as any), token: token ?? undefined } as any);

      toast.success("Profile updated successfully!");
      onProceed?.();
      onClose();
    } catch (err: any) {
      console.error("Profile update error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isMissing = (field: string) => missingFields.includes(field);

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Complete Your Profile
        </h2>
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            To pay using TransVoucher, please complete the following required
            fields:
          </p>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Address */}
            {missingFields.includes("address") && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {fieldLabels.address}
                  </label>
                  <span className="text-xs text-red-500 font-semibold">*</span>
                </div>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${
                    errors.address || isMissing("address")
                      ? "border-red-500 focus:border-red-500 dark:border-red-500"
                      : ""
                  }`}
                  placeholder="Enter your street address"
                />
                {errors.address && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.address}
                  </span>
                )}
              </div>
            )}

            {/* Country */}
            {missingFields.includes("country") && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {fieldLabels.country}
                  </label>
                  <span className="text-xs text-red-500 font-semibold">*</span>
                </div>
                <CountrySelect
                  value={selectedCountry}
                  onChange={(code) => {
                    setSelectedCountry(code);
                    const friendly =
                      (code &&
                        countries.getName(code, "en", {
                          select: "official",
                        })) ||
                      code ||
                      "";
                    setFormData({ ...formData, country: friendly, state: "" });
                    const states = code ? State.getStatesOfCountry(code) : [];
                    setCountryStatesList(states);
                    setSelectedState("");
                    if (errors.country) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.country;
                        return newErrors;
                      });
                    }
                  }}
                  disabled={loading}
                  className={
                    errors.country || isMissing("country")
                      ? "border-red-500 focus:border-red-500 dark:border-red-500"
                      : ""
                  }
                />
                {errors.country && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.country}
                  </span>
                )}
              </div>
            )}

            {/* City */}
            {missingFields.includes("city") && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {fieldLabels.city}
                  </label>
                  <span className="text-xs text-red-500 font-semibold">*</span>
                </div>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${
                    errors.city || isMissing("city")
                      ? "border-red-500 focus:border-red-500 dark:border-red-500"
                      : ""
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.city}
                  </span>
                )}
              </div>
            )}

            {/* State */}
            {missingFields.includes("state") && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="state"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {fieldLabels.state}
                  </label>
                  <span className="text-xs text-red-500 font-semibold">*</span>
                </div>
                {countryStatesList && countryStatesList.length > 0 ? (
                  <StateSelect
                    countryCode={selectedCountry || undefined}
                    value={selectedState}
                    onChange={(v) => {
                      setSelectedState(v);
                      setFormData({ ...formData, state: v });
                      if (errors.state) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.state;
                          return newErrors;
                        });
                      }
                    }}
                    disabled={loading}
                    className={
                      errors.state || isMissing("state")
                        ? "border-red-500 focus:border-red-500 dark:border-red-500"
                        : ""
                    }
                  />
                ) : (
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={loading}
                    className={`${
                      errors.state || isMissing("state")
                        ? "border-red-500 focus:border-red-500 dark:border-red-500"
                        : ""
                    }`}
                    placeholder="Enter your state"
                  />
                )}
                {errors.state && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.state}
                  </span>
                )}
              </div>
            )}

            {/* ZIP Code */}
            {missingFields.includes("zip") && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="zip"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {fieldLabels.zip}
                  </label>
                  <span className="text-xs text-red-500 font-semibold">*</span>
                </div>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${
                    errors.zip || isMissing("zip")
                      ? "border-red-500 focus:border-red-500 dark:border-red-500"
                      : ""
                  }`}
                  placeholder="Enter ZIP code"
                />
                {errors.zip && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.zip}
                  </span>
                )}
              </div>
            )}

            {/* Date of Birth */}
            {missingFields.includes("dob") && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label htmlFor="dob" className="text-sm font-medium">
                    {fieldLabels.dob}
                  </label>
                  <span className="text-xs text-red-500 font-semibold">
                    (Required)
                  </span>
                </div>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 border-red-500 dark:border-red-500"
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            btnType="outline"
            className="flex-1 text-sm md:text-base"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            btnType="primary"
            className="flex-1 text-sm md:text-base"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader className="animate-spin w-4 h-4" />
                Saving...
              </span>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
