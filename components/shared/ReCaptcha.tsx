"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useMemo, useState } from "react";

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
}

export default function ReCaptchaComponent({ onChange }: ReCaptchaProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    const getIsDark = () => {
      const htmlDark = document.documentElement.classList.contains("dark");
      const bodyDark = document.body?.classList.contains("dark");
      return htmlDark || bodyDark;
    };

    setIsDarkMode(getIsDark());

    const observer = new MutationObserver(() => {
      setIsDarkMode(getIsDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  const recaptchaKey = useMemo(
    () => (isDarkMode ? "dark" : "light"),
    [isDarkMode],
  );

  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      console.error("ReCAPTCHA site key is not configured");
    }
    return null;
  }

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        key={recaptchaKey}
        sitekey={siteKey}
        onChange={onChange}
        theme={isDarkMode ? "dark" : "light"}
        size="normal"
      />
    </div>
  );
}
