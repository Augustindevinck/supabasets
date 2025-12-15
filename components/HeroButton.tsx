"use client";

import Link from "next/link";

interface HeroButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function HeroButton({ href, children }: HeroButtonProps) {
  return (
    <Link href={href} className="hero-button">
      <span>{children}</span>
    </Link>
  );
}
