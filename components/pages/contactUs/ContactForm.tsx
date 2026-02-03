"use client";

import ReCaptchaComponent from "@/components/shared/ReCaptcha";
import Input from "@/components/ui/Input";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import toast from "react-hot-toast";
import { FiArrowRight, FiLink } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm(): JSX.Element {
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(t("contact.form.invalidFile"));
      e.target.value = "";
      return;
    }

    setAttachment(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error(t("contact.form.verifyCaptcha"));
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error(t("contact.form.fillAllFields"));
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (attachment) data.append("attachment", attachment);

    data.append("captchaToken", captchaToken);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-us`,
        { method: "POST", body: data },
      );

      const result: { message?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(result?.message || t("contact.form.failedSend"));
        return;
      }

      toast.success(result.message || t("contact.form.sentSuccess"));
      setFormData({ name: "", email: "", subject: "", message: "" });
      setAttachment(null);
      setCaptchaToken(null);

      const input = document.getElementById(
        "attachment-input",
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    } catch {
      toast.error(t("contact.form.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] dark:bg-background-dark p-5 lg:p-8 rounded-2xl dark:border dark:border-border-dark">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t("contact.form.name")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("contact.form.placeholderName")}
          className="rounded-lg bg-white dark:bg-[#1F1F1F]!"
        />
        <Input
          label={t("contact.form.email")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("contact.form.placeholderEmail")}
          className="rounded-lg bg-white dark:bg-[#1F1F1F]!"
        />
        <Input
          label={t("contact.form.subject")}
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t("contact.form.placeholderSubject")}
          className="rounded-lg bg-white dark:bg-[#1F1F1F]!"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#E5E5E5] mb-1">
            {t("contact.form.attachment")}
          </label>

          <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 dark:text-gray-400 rounded-lg border-2 border-dashed border-gray-300 dark:border-border-dark cursor-pointer hover:bg-gray-100 dark:bg-[#1F1F1F] dark:hover:bg-[#2a2a2a] transition">
            <FiLink className="w-8 h-8 mb-2" />
            <span className="text-base leading-normal">
              {attachment?.name || t("contact.form.uploadImage")}
            </span>

            <input
              id="attachment-input"
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-[#E5E5E5] mb-1"
          >
            {t("contact.form.message")}
          </label>

          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder={t("contact.form.messagePlaceholder")}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-border-dark rounded-lg text-sm text-gray-800 dark:text-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="flex justify-center">
          <ReCaptchaComponent onChange={(token) => setCaptchaToken(token)} />
        </div>

        <button
          disabled={loading}
          type="submit"
          className=" flex items-center justify-center px-6 gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? t("contact.form.sending") : t("contact.form.sendMessage")}
          <span className="bg-white text-black p-2 rounded-full -rotate-45">
            <FiArrowRight />
          </span>
        </button>
      </form>
    </div>
  );
}
