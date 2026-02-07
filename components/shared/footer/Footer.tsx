"use client";

import Button from "@/components/ui/Button";
import EmailIcon from "@/public/icons/EmailIcon";
import MasterIcon from "@/public/icons/MasterIcon";
import PaypalIcon from "@/public/icons/PaypalIcon";
import PhoneIcon from "@/public/icons/PhoneIcon";
import SendIcon from "@/public/icons/SendIcon";
import FacebookIcon from "@/public/icons/social/FacebookIcon";
import InstagramIcon from "@/public/icons/social/InstagramIcon";
import LinkedInIcon from "@/public/icons/social/LinkedInIcon";
import TwitterIcon from "@/public/icons/social/TwitterIcon";
import VisaIcon from "@/public/icons/VisaIcon";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const otherLinks = [
  { label: "My Account", href: "/account" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms Of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socials = [
  { name: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
  { name: "Facebook", href: "#", icon: <FacebookIcon /> },
  { name: "X", href: "#", icon: <TwitterIcon /> },
  { name: "Instagram", href: "#", icon: <InstagramIcon /> },
];

export default function Footer() {
  return (
    <footer
      className="w-full"
    >
      <div className="w-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/footerbg.png)" }}>
        <div className="container mx-auto px-4 pb-5 pt-20">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Logo */}
            <div className="max-w-md">
              <Link href="/" className="inline-flex items-center gap-3">
                {/* Replace with your logo file */}
                <Image
                  src="/logo/logo.png"
                  alt="Pvaeshop"
                  width={220}
                  height={70}
                  className="h-auto w-[326px]  md:w-[512px] lg:w-[528px]"
                  priority
                />
              </Link>
            </div>

            {/* CTA + text */}
            <div className="max-w-[435px]">
              <div className="flex flex-wrap lg:justify-end gap-3">
                <Link
                  href="/packages"

                >
                  <Button size="lg" variant="primary" arrowIcon className="hover:bg-primary"> Explore Our Packages
                  </Button>
                </Link>

                <Link
                  href="/contact"

                >

                  <Button arrowIcon variant="outline" size="lg" className="text-black dark:text-background">Contact Us</Button>
                </Link>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-background/70 leading-relaxed">
                pvaeshop.com provides PVA, Accounts & Much More Services For Different Popular Social Networks Such As Facebook, Instagram, Twitter & Etc.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px w-full bg-black/10 dark:bg-white/10" />

          {/* Middle columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Quick links */}
            <div>
              <h4 className="text-sm font-bold tracking-wide text-text-dark dark:text-background">
                QUICK LINKS
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-background/70">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-primary transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Others */}
            <div>
              <h4 className="text-sm font-bold tracking-wide text-text-dark dark:text-background">
                OTHERS
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-background/70">
                {otherLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-primary transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold tracking-wide text-text-dark dark:text-background">
                CONTACT US
              </h4>

              <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-background/70">
                <li className="flex items-center gap-2">
                  <span className="text-[#DE5A2E]">
                    <EmailIcon />
                  </span>
                  <a href="mailto:support@pvaeshop.com" className="hover:text-primary transition">
                    support@pvaeshop.com
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#DE5A2E]">
                    <SendIcon fill="none" />
                  </span>
                  <span>Pvaeshop</span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#DE5A2E]">
                    <PhoneIcon fill="none" />
                  </span>
                  <a href="tel:+12135109004" className="hover:text-primary transition">
                    +12135109004
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="my-8 h-px w-full bg-black/10 dark:bg-white/10" />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Payment methods */}
            <div>
              <h4 className="text-sm font-bold tracking-wide text-text-dark dark:text-background">
                PAYMENT METHODS
              </h4>

              <div className="mt-4 flex items-center gap-3">
                {/* Replace with your real icons */}
                <VisaIcon />
                <PaypalIcon />
                <MasterIcon />
                <Image src="/assets/stripe.png" alt="Stripe" width={44} height={28} className="h-6 w-auto" />
              </div>
            </div>

            {/* Follow us */}
            <div>
              <h4 className="text-sm font-bold tracking-wide text-text-dark dark:text-background">
                FOLLOW US
              </h4>

              <div className="mt-4 flex md:justify-end items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    className="
                      h-9 w-9 rounded-full
                      flex items-center justify-center
                      bg-[#DE5A2E] text-white
                      hover:opacity-90 transition
                      dark:text-black
                    "
                    aria-label={s.name}
                  >
                    {/* simple text icons; swap with svg if you want */}
                    <span >{s.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          {/* <div className="mt-10 text-center text-xs text-gray-600 dark:text-background/60">
            © {new Date().getFullYear()} Pvaeshop. All rights reserved.
          </div> */}
        </div>
      </div>
    </footer>
  );
}
