"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/checkout", label: "Checkout" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center gap-6">
      {links.map((l) => {
        const isActive =
          l.href === "/"
            ? pathname === "/"
            : pathname.startsWith(l.href);

        return (
          <Link
            key={l.href}
            href={l.href}
            className={`text-base font-medium transition-colors ${
              isActive
                ? "text-primary"
                : "text-text-dark dark:text-background hover:text-primary"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
