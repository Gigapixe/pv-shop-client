"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { MdArrowOutward } from "react-icons/md";
import { subscribeToNewsletter } from "@/services/customerService";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t("footer.newsletter.invalidEmail"));
      return;
    }

    setLoading(true);

    // keeps a single toast and updates it
    const toastId = toast.loading("Submitting...");

    try {
      const resp: any = await subscribeToNewsletter(email);

      const ok =
        resp?.success === true ||
        resp?.statusCode === 200 ||
        resp?.status === true;

      if (ok) {
        toast.success(resp?.message || "Subscribed successfully!", {
          id: toastId,
        });
        setEmail("");
      } else {
        toast.error(resp?.message || "Something went wrong!", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.message || t("genericError"), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 container mx-auto">
      <div className="bg-primary text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-3xl font-medium">
            {t("footer.newsletter.title")}
          </h1>
          <p className="text-sm lg:text-base mt-1 lg:max-w-2xl">
            {t("footer.newsletter.description")}
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="flex items-center gap-2 w-full md:w-auto relative"
        >
          <div className="relative w-full md:min-w-96">
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              required
              className="py-4.5! rounded-full"
              disabled={loading}
            />
          </div>

          {/* Keep the SAME design in loading state */}
          <Button
            type="submit"
            btnType="primary"
            disabled={loading}
            className={`absolute right-1 top-1.25 bg-black/90 dark:bg-white text-white dark:text-text-dark px-0! pr-2! pl-4! dark:hover:text-white! ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Subscribe"}

            <span className="bg-white dark:bg-black p-2 rounded-full grid place-items-center">
              {loading ? (
                <span className="w-5 h-5 rounded-full border-2 border-black/30 dark:border-white/30 border-t-black dark:border-t-white animate-spin" />
              ) : (
                <MdArrowOutward className="w-5 h-5 text-black dark:text-text-light transition-transform duration-300" />
              )}
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
}
