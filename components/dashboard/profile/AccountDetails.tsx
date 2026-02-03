"use client";
import React, { useState, useEffect, useRef } from "react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { Country, State } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
import CountrySelect from "@/components/dashboard/profile/CountrySelect";
import StateSelect from "@/components/dashboard/profile/StateSelect";
import {
  toInputDate,
  toSubmissionDate,
  formatIsoToAsian,
  formatLongWithOrdinal,
} from "@/lib/date";

import { updateProfile, updateCustomerImage } from "@/services/customerService";
import { useAuthStore } from "@/zustand/authStore";
import { User } from "@/types/auth";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import {
  FiCamera,
  FiLoader,
  FiEdit,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AccountDetails() {
  const t = useTranslations("profile");
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser, token, setAuth } = useAuthStore();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    dob: "",
    image: null as string | null,
    country: "",
    zip: "",
  });

  // Image upload / cloudinary states
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Country / state dropdown helpers
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [countryStatesList, setCountryStatesList] = useState<Array<any>>([]);

  // Utility: all countries list (name, isoCode)
  const allCountries = React.useMemo(() => Country.getAllCountries(), []);

  // Helper: get ISO code from country name (or return code if already 2 letters)
  const getIsoByName = (name?: string) => {
    if (!name) return "";
    if (name.length === 2) return name.toUpperCase();
    const found = allCountries.find(
      (c) => c.name && c.name.toLowerCase() === name.toLowerCase(),
    );
    return found?.isoCode || "";
  };

  useEffect(() => {
    // sync local state from the auth store
    setCurrentUser(authUser ?? null);
    if (authUser) {
      setAddress({
        address: authUser.address || "",
        city: authUser.city || "",
        state: (authUser as any).state || "",
        dob: toInputDate(authUser.dob) || "",
        image: authUser.image || null,
        country: authUser.country || "",
        zip: (authUser as any).zip || "",
      });

      // setup country/state dropdowns (store ISO code in selector, keep readable name in address)
      const countryCode =
        authUser.country && (authUser.country as string).length === 2
          ? (authUser.country as string).toUpperCase()
          : countries.getAlpha2Code(authUser.country || "", "en") || "";

      setSelectedCountry(countryCode);
      setSelectedState((authUser as any).state || authUser.city || "");

      const friendlyName =
        countryCode &&
        countries.getName(countryCode, "en", { select: "official" })
          ? countries.getName(countryCode, "en", { select: "official" })
          : authUser.country || "";

      setAddress((s) => ({ ...s, country: friendlyName || "" }));

      const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
      setCountryStatesList(states);
    }
  }, [authUser, allCountries]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ensure the i18n package is registered once (do this on mount)
  useEffect(() => {
    countries.registerLocale(en);
  }, []);

  // Compute human-friendly country name for display in view mode
  const countryFullName = React.useMemo(() => {
    const code = currentUser?.country;
    if (!code) return null;
    try {
      // try official name first, fallback to common name or the code
      return (
        countries.getName(code, "en", { select: "official" }) ||
        countries.getName(code, "en") ||
        code
      );
    } catch {
      return code;
    }
  }, [currentUser?.country]);

  // Clear state when country changes so user can select from dropdown
  useEffect(() => {
    if (!editMode) return;
    // This effect is intentionally minimal - state clearing happens in CountrySelect onChange
  }, [editMode]);

  // Helper to build customer id for API calls
  const getCustomerId = (u?: User | null) => {
    if (!u) return null;
    return u._id ?? String((u as any).userId ?? "");
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setAddress({
      address: currentUser?.address || "",
      city: currentUser?.city || "",
      state: currentUser?.state || "",
      dob: toInputDate(currentUser?.dob) || "",
      image: currentUser?.image || null,
      country: currentUser?.country || "",
      zip: (currentUser as any)?.zip || "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const id = getCustomerId(currentUser) as string;
      const selectedCountryName =
        selectedCountry &&
        countries.getName(selectedCountry, "en", { select: "official" })
          ? countries.getName(selectedCountry, "en", { select: "official" })
          : address.country || undefined;

      const payload: any = {
        address: address.address,
        city: address.city,
        dob: (toSubmissionDate(address.dob) ?? address.dob) || undefined,
        image: address.image || undefined,
        country: selectedCountryName,
        state: selectedState || address.state,
        zip: address.zip,
      };

      const res: any = await updateProfile(id, payload);

      // Merge returned fields into existing authenticated user so we don't remove other details
      const updatedData = res?.data || {};
      const mergedUser = { ...(authUser as any), ...updatedData };

      setAuth({ ...(mergedUser as any), token: token ?? undefined } as any);
      setCurrentUser(mergedUser as any);

      toast.success(t("updateSuccess"));
      setEditMode(false);
    } catch (err: any) {
      toast.error(err.message || t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !currentUser) {
    return (
      <div className="text-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 ">
        <FiSettings className="text-2xl text-gray-700 dark:text-[#FFFFFF]" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-[#FFFFFF]">
          {t("pageTitle")}
        </h1>
      </div>
      <div className="p-8 rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark mt-6">
        <h2 className="text-2xl font-semibold mb-4">{t("accountDetails")}</h2>
        <div className="flex items-start gap-6">
          {/* Simple Profile Image preview + file uploader (replaces missing ProfileImageUpload component) */}
          <div className="relative shrink-0">
            {address.image ? (
              <Image
                src={address.image}
                width={600}
                height={600}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                {String(currentUser.name ?? "U")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file || !currentUser) return;

                // local preview
                const reader = new FileReader();
                reader.onloadend = () => {
                  setAddress((s) => ({
                    ...s,
                    image: reader.result as string,
                  }));
                };
                reader.readAsDataURL(file);

                // upload to Cloudinary (if env config present) else send data URL
                setImageLoading(true);
                try {
                  const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
                  const uploadPreset =
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
                  let imageUrl: string | null = null;

                  if (uploadUrl && uploadPreset) {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", uploadPreset);

                    const cloudRes = await fetch(uploadUrl, {
                      method: "POST",
                      body: formData,
                    });
                    const cloudJson = await cloudRes.json();
                    imageUrl = cloudJson?.secure_url || null;
                  } else {
                    // fallback to data URL already read
                    imageUrl =
                      (await new Promise<string | null>((resolve) => {
                        const r = new FileReader();
                        r.onloadend = () => resolve(r.result as string);
                        r.readAsDataURL(file);
                      })) || null;
                  }

                  if (!imageUrl) throw new Error("Failed to upload image.");

                  // send to backend
                  const id = getCustomerId(currentUser) as string;
                  const res: any = await updateCustomerImage(id, {
                    image: imageUrl,
                  });

                  // prefer server returned data if available
                  const updatedUser =
                    res && res.data
                      ? res.data
                      : { ...(authUser as any), image: imageUrl };

                  setAuth({
                    ...(updatedUser as any),
                    token: token ?? undefined,
                  } as any);
                  setCurrentUser(updatedUser as any);
                  toast.success(t("imageUpdateSuccess"));
                } catch (err: any) {
                  const message = err?.message || t("imageUpdateError");
                  toast.error(message);
                  // revert image preview
                  setAddress((s) => ({
                    ...s,
                    image: currentUser?.image || null,
                  }));
                } finally {
                  setImageLoading(false);
                }
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-secondary/80 hover:bg-secondary dark:bg-warning/80 dark:hover:bg-warning text-white p-1.5 rounded-full shadow-md"
              aria-label="Change profile photo"
            >
              {imageLoading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiCamera className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            <div>
              <p className="text-gray-500">{t("name")}</p>
              <p className="font-medium mt-1 capitalize">{currentUser?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">{t("phone")}</p>
              <p className="font-medium mt-1">{currentUser?.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">{t("email")}</p>
              <p className="font-medium mt-1 flex items-center gap-2">
                <span>{currentUser?.email}</span>
                {currentUser?.isEmailVerified && (
                  <FiCheckCircle className="text-emerald-500 w-4 h-4" />
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">{t("id")}</p>
              <p className="font-medium mt-1">{currentUser?.userId}</p>
            </div>
          </div>
        </div>
        <hr className="my-8 border-border-light dark:border-border-dark" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{t("addressInfo")}</h3>
            {!editMode && (
              <button
                className="text-sm bg-primary/20 px-3 py-1 rounded flex items-center gap-1"
                onClick={handleEdit}
                aria-label="Edit address"
              >
                <FiEdit className="text-emerald-500 w-4 h-4" />
              </button>
            )}
          </div>
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {editMode ? (
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              <Input
                id="address"
                name="address"
                label={t("street")}
                value={address.address}
                onChange={(e) =>
                  setAddress({ ...address, address: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
              <Input
                id="city"
                name="city"
                label={t("city")}
                value={address.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddress({ ...address, city: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />

              <div className="flex flex-col mt-2">
                <label htmlFor="country" className="text-sm font-medium mb-1">
                  {t("country")}
                </label>
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
                    setAddress({ ...address, country: friendly, city: "" });
                    const states = code ? State.getStatesOfCountry(code) : [];
                    setCountryStatesList(states);
                    setSelectedState("");
                  }}
                  disabled={loading}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label htmlFor="state" className="text-sm font-medium mb-1">
                  {t("stateRegion")}
                </label>
                {countryStatesList && countryStatesList.length > 0 ? (
                  <StateSelect
                    countryCode={selectedCountry || undefined}
                    value={selectedState}
                    onChange={(v) => {
                      setSelectedState(v);
                      setAddress({ ...address, state: v });
                    }}
                    disabled={loading}
                    className="mt-0.5 rounded-full"
                  />
                ) : (
                  <Input
                    id="state"
                    name="state"
                    label={t("stateRegion")}
                    value={address.state}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    disabled={loading}
                    className="mt-1"
                  />
                )}
              </div>

              <div className="flex flex-col mt-2">
                <label htmlFor="dob" className="text-sm font-medium mb-1">
                  {t("dateOfBirth")}
                </label>
                <Input
                  id="dob"
                  name="dob"
                  label={undefined}
                  type="date"
                  value={address.dob}
                  onChange={(e) =>
                    setAddress({ ...address, dob: e.target.value })
                  }
                  disabled={loading}
                  className="mt-1"
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <Input
                id="zip"
                name="zip"
                label={t("zipCode")}
                value={address.zip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddress({ ...address, zip: e.target.value })
                }
                disabled={loading}
                className="mt-1"
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm mt-2">
              <div>
                <p className="text-gray-500">{t("street")}</p>
                <p className="font-medium mt-1">
                  {currentUser?.address
                    ? currentUser.address
                    : t("notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">{t("city")}</p>
                <p className="font-medium mt-1">
                  {currentUser?.city ? currentUser.city : t("notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">{t("country")}</p>
                <p className="font-medium mt-1 flex items-center gap-2">
                  {currentUser?.country ? (
                    <>
                      <ReactCountryFlag
                        countryCode={getIsoByName(currentUser.country)}
                        svg
                        style={{ width: "1.2em", height: "1.2em" }}
                        title={countryFullName ?? currentUser.country}
                      />
                      <span title={countryFullName ?? currentUser.country}>
                        {countryFullName ?? currentUser.country}
                      </span>
                    </>
                  ) : (
                    t("notAvailable")
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-500">{t("stateRegion")}</p>
                <p className="font-medium mt-1">
                  {currentUser?.state ? currentUser.state : t("notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">{t("dateOfBirth")}</p>
                <p className="font-medium mt-1">
                  {currentUser?.dob
                    ? formatLongWithOrdinal(currentUser.dob)
                    : t("notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">{t("zipCode")}</p>
                <p className="font-medium mt-1">
                  {currentUser?.zip ? currentUser.zip : t("notAvailable")}
                </p>
              </div>
            </div>
          )}
          {editMode && (
            <div className="flex gap-2 mt-4">
              <Button
                btnType="primary"
                className="px-12!"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="animate-spin w-4 h-4" /> {t("saving")}
                  </span>
                ) : (
                  <span>{t("save")}</span>
                )}
              </Button>
              <Button
                btnType="outline"
                className="px-12!"
                onClick={handleCancel}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
