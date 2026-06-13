"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type ScrollLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

export default function ScrollLink({
  href,
  children,
  className,
  ariaLabel,
  onClick,
}: ScrollLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const [path, hash] = href.split("#");

    if (!hash) {
      onClick?.();
      return;
    }

    const targetPath = path || window.location.pathname;
    const currentPath = window.location.pathname;
    const isSamePage = currentPath === targetPath;

    if (!isSamePage) {
      onClick?.();
      return;
    }

    event.preventDefault();

    if (hash === "inicio") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      window.history.replaceState(null, "", `${targetPath}#${hash}`);
      onClick?.();
      return;
    }

    const section = document.getElementById(hash);

    if (!section) {
      onClick?.();
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `${targetPath}#${hash}`);

    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
