"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const t = useTranslations("Header");
  const [isHamburgerOpen, setHamburgerOpen] = useState(false);
  const [hamburgerTimeoutId, setHamburgerTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  const handleHamburgerMouseEnter = () => {
    if (hamburgerTimeoutId) {
      clearTimeout(hamburgerTimeoutId);
      setHamburgerTimeoutId(null);
    }
    setHamburgerOpen(true);
  };

  const handleHamburgerMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      setHamburgerOpen(false);
    }, 150);
    setHamburgerTimeoutId(timeoutId);
  };

  return (
    <nav className="p-3 bg-gray-800">
      <div className="flex flex-row justify-between items-center">
        <div id="modeToggle"></div>

        <div className="flex flex-row items-center justify-between gap-3">
          <Link className="cursor-pointer" href={"/"}>
            {t("perfect-toggle")}
          </Link>
          <Link className="cursor-pointer" href={"/realistic"}>
            {t("realistic-toggle")}
          </Link>
        </div>

        <div
          onMouseEnter={handleHamburgerMouseEnter}
          onMouseLeave={handleHamburgerMouseLeave}
          className="flex flex-col items-center justify-center"
        >
          <button
            className="space-y-2"
            aria-label="Toggle hamburger menu"
            aria-expanded={isHamburgerOpen}
          >
            <span className="block h-0.5 w-8 bg-gray-600"></span>
            <span className="block h-0.5 w-8 bg-gray-600"></span>
            <span className="block h-0.5 w-8 bg-gray-600"></span>
          </button>

          {isHamburgerOpen && (
            <ul className="right-1 top-9 mt-2 bg-[#001225] rounded p-3 absolute w-3xs z-50">
              <li>
                <Link
                  href="/history"
                  className="hover:bg-[#041b3d] block p-2 rounded text-sm transition-colors"
                  onClick={() => {
                    setHamburgerOpen(false);
                  }}
                >
                  {t("history-btn")}
                </Link>
              </li>

              <li>
                <Link
                  href={`/about`}
                  className="hover:bg-[#041b3d] block p-2 rounded text-sm transition-colors"
                  onClick={() => {
                    setHamburgerOpen(false);
                  }}
                >
                  {t("about-btn")}
                </Link>
              </li>

              <li>
                <Link
                  href={`/settings`}
                  className="hover:bg-[#041b3d] block p-2 rounded text-sm transition-colors"
                  onClick={() => {
                    setHamburgerOpen(false);
                  }}
                >
                  {t("settings-btn")}
                </Link>
              </li>

              <li>
                <Link
                  href={`/feedback`}
                  className="hover:bg-[#041b3d] block p-2 rounded text-sm transition-colors"
                  onClick={() => {
                    setHamburgerOpen(false);
                  }}
                >
                  {t("feedback-btn")}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
