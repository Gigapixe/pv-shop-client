"use client";

import Image from "next/image";
import Link from "next/link";

export default function FullLogo() {
  return (
    <Link href="/" className="relative block">
      <Image
        src="/logo/logo.png"
        alt="Gamingty Logo"
        height={400}
        width={400}
        priority
        className="object-contain dark:hidden w-44"
      />
      <Image
        src="/logo/logo.png"
        alt="Gamingty Logo"
        height={400}
        width={400}
        priority
        className="object-contain hidden dark:block w-44"
      />
    </Link>
  );
}
