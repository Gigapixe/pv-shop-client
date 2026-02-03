"use client";

import Image, { StaticImageData } from "next/image";
import mapIcon from "@/public/icons/Location.svg";
import callerIcon from "@/public/icons/Caller.svg";
import messageIcon from "@/public/icons/Message.svg";
import telegramIcon from "@/public/icons/Telegram.svg";
import timeIcon from "@/public/icons/Time.svg";
import { JSX } from "react";
import { useTranslations } from "next-intl";

interface ContactMethod {
  icon: StaticImageData;
  title: string;
  value: string;
  href?: string;
}

export default function ContactInfo(): JSX.Element {
  const t = useTranslations();

  const contactMethods: ContactMethod[] = [
    {
      icon: callerIcon,
      title: t("contact.methods.whatsapp.title"),
      value: t("contact.methods.whatsapp.value"),
      href: t("contact.methods.whatsapp.href"),
    },
    {
      icon: telegramIcon,
      title: t("contact.methods.telegram.title"),
      value: t("contact.methods.telegram.value"),
      href: t("contact.methods.telegram.href"),
    },
    {
      icon: messageIcon,
      title: t("contact.methods.email.title"),
      value: t("contact.methods.email.value"),
      href: t("contact.methods.email.href"),
    },
    {
      icon: mapIcon,
      title: t("contact.methods.location.title"),
      value: t("contact.methods.location.value"),
    },
    {
      icon: timeIcon,
      title: t("contact.methods.hours.title"),
      value: t("contact.methods.hours.value"),
    },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
        {t("contact.needHelpTitle")}
      </h1>

      <div className="space-y-8">
        {contactMethods.map((method) => (
          <div key={method.title} className="flex items-start space-x-4">
            <Image
              src={method.icon}
              alt={`${method.title} icon`}
              className="w-12 h-12"
            />

            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-[#E5E5E5]">
                {method.title}
              </h3>

              {method.href ? (
                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 font-semibold dark:text-[#E5E5E5] hover:text-emerald-500 transition"
                >
                  {method.value}
                </a>
              ) : (
                <p className="text-gray-600 font-semibold dark:text-[#E5E5E5]">
                  {method.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
