"use client";

import SupportIcon from "@/public/icons/SupportIcon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaComments,
  FaEnvelope,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    LiveChatWidget?: {
      call?: (method: string, ...args: any[]) => void;
    };
  }
}

const Support = () => {
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleModal = () => setIsModalOpen((v) => !v);

  const openChat = () => {
    if (typeof window !== "undefined") {
      const widget = window.LiveChatWidget;

      if (widget?.call) {
        try {
          widget.call("maximize");
        } catch {
          try {
            widget.call("open_chat");
          } catch (err2) {
            console.error("LiveChat open failed", err2);
            alert(t("unableToOpenChat"));
          }
        }
      } else {
        console.error("Chat widget not loaded (no LiveChatWidget).");
        alert(t("unableToOpenChat"));
      }
    }

    toggleModal();
  };

  const ModalContent = () => (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      {/* <div
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 backdrop-blur-sm"
        onClick={toggleModal}
      /> */}
      <div
        className="fixed left-0 right-0 top-0 bottom-0 bg-black/50 backdrop-blur-xs z-10 transition-opacity duration-200"
        onClick={toggleModal}
        // aria-hidden="true"
      />

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative z-1001 dark:bg-background-dark dark:backdrop-blur-xl dark:border dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-content-default dark:text-white">
            {t("contactSupport")}
          </h3>

          <button
            onClick={toggleModal}
            className="inline-flex text-base items-center justify-center text-content-subtle p-2 focus:outline-none transition-colors hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 dark:hover:text-red-400"
            aria-label="Close support modal"
            type="button"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="space-y-3">
          <a
            href="https://wa.me/971568346414"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-background hover:border-default rounded-lg transition-colors text-content-default dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 dark:border dark:border-white/5 dark:hover:border-white/20"
          >
            <FaWhatsapp
              size={28}
              className="text-green-500 text-2xl dark:text-green-400"
            />
            <span>{t("whatsapp")}</span>
          </a>

          <a
            href="https://t.me/fleximart"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-background hover:border-default rounded-lg transition-colors text-content-default dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 dark:border dark:border-white/5 dark:hover:border-white/20"
          >
            <FaTelegramPlane
              size={28}
              className="text-blue-500 text-2xl dark:text-blue-400"
            />
            <span>{t("telegram")}</span>
          </a>

          <button
            onClick={openChat}
            className="flex items-center gap-3 p-3 bg-background hover:border-default rounded-lg transition-colors w-full text-left text-content-default dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 dark:border dark:border-white/5 dark:hover:border-white/20"
            type="button"
          >
            <FaComments className="text-primary text-2xl dark:text-primary-400" />
            <span>{t("chatWithOperator")}</span>
          </button>

          <Link
            href="/contact-us"
            onClick={toggleModal}
            className="flex items-center gap-3 p-3 bg-background hover:border-default rounded-lg transition-colors text-content-default dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 dark:border dark:border-white/5 dark:hover:border-white/20"
          >
            <FaEnvelope className="text-primary text-2xl dark:text-primary-400" />
            <span>{t("sendAnEmail")}</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative z-50 h-6 w-6">
        <button
          onClick={toggleModal}
          className="transition-transform active:scale-95 hover:scale-[1.02] pt-px"
          type="button"
          aria-label="Open support modal"
        >
          <SupportIcon className="dark:text-white" />
        </button>
      </div>

      {mounted && isModalOpen && createPortal(<ModalContent />, document.body)}
    </>
  );
};

export default Support;
