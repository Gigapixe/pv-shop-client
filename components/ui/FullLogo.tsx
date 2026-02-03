"use client";

import Image from "next/image";
import Link from "next/link";

export default function FullLogo() {
  return (
    <Link href="/" className="relative block w-44 h-8">
      <Image
        src="/logo/logo-color.png"
        alt="Gamingty Logo"
        height={400}
        width={400}
        priority
        className="object-contain dark:hidden w-44 h-8"
      />
      <Image
        src="/logo/logo-dark.png"
        alt="Gamingty Logo"
        height={400}
        width={400}
        priority
        className="object-contain hidden dark:block w-44 h-8"
      />
    </Link>
  );
}
