"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import FullLogo from "@/components/ui/FullLogo";

// Define types for link sections
interface FooterLink {
  label?: string; // optional direct label
  labelKey?: string; // translation key to use instead of label
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  titleKey: string;
  links: FooterLink[];
}

// Centralized link data (labels use translation keys)
const footerSections: FooterSection[] = [
  {
    titleKey: "footer.company.title",
    links: [
      { labelKey: "footer.company.aboutUs", href: "/about-us" },
      { labelKey: "footer.company.securityTips", href: "/security-tips" },
      { labelKey: "footer.company.contactUs", href: "/contact-us" },
    ],
  },
  {
    titleKey: "footer.legal.title",
    links: [
      { labelKey: "footer.legal.privacyPolicy", href: "/privacy-policy" },
      { labelKey: "footer.legal.terms", href: "/terms-and-conditions" },
      { labelKey: "footer.legal.refund", href: "/refund-and-returns-policy" },
    ],
  },
  {
    titleKey: "footer.important.title",
    links: [
      { labelKey: "footer.important.kyc", href: "/kyc-&-aml-policy" },
      { labelKey: "footer.important.support", href: "/support-ticket" },
      { labelKey: "footer.important.partnership", href: "/partnership" },
    ],
  },
  {
    titleKey: "footer.quick.title",
    links: [
      { labelKey: "footer.quick.blog", href: "/blog" },
      { labelKey: "footer.quick.faq", href: "/faq" },
      {
        labelKey: "footer.quick.affiliate",
        href: "/gamingty-affiliate-program",
      },
    ],
  },
];

// Reusable LinkItem component
const LinkItem: React.FC<{ link: FooterLink }> = ({ link }) => {
  const t = useTranslations();
  const Icon = link.icon;
  const content = (
    <div className="hover:text-primary-dark flex items-center gap-2 lg:max-w-60">
      {Icon && (
        <div className="bg-primary p-2 rounded-full">
          <Icon className="w-4 h-4 text-text dark:text-text-light" />
        </div>
      )}
      {link.labelKey ? (
        <span>{t(link.labelKey)}</span>
      ) : (
        <span>{link.label}</span>
      )}
    </div>
  );

  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={link.href}>{content}</Link>
  );
};

const FooterLinks: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="container mx-auto pb-10 text-text dark:text-text-light">
      <div className="border-border-light dark:border-border-dark my-4" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left column: logo + description */}
        <div>
          <FullLogo />
          <p className="text-sm text-left mt-4 leading-relaxed max-w-[320px] text-text dark:text-text-light">
            {t("footer.description")}
          </p>
        </div>

        {/* Link columns */}
        {footerSections.map((section) => (
          <div key={section.titleKey}>
            <h3 className="font-semibold mb-3 lg:mb-5 text-lg text-text dark:text-text-light">
              {t(section.titleKey)}
            </h3>
            <ul className="space-y-2 text-sm text-text dark:text-text-light">
              {section.links.map((link, index) => (
                <li key={index}>
                  <LinkItem link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterLinks;
