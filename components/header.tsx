"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Header() {
  const t = useTranslations("Header");
  const [tableMode, setMode] = useState(true);

  return (
    <nav>
      <div className="flex flex-row justify-between items-center">
        <div>
          <button onClick={() => setMode((prev) => !prev)}>
            {tableMode ? t("timeline-toggle") : t("table-toggle")}
          </button>
        </div>

        <div className="flex flex-row items-center justify-between gap-3">
          <button>{t("perfect-toggle")}</button>
          <button>{t("realistic-toggle")}</button>
        </div>

        <div>
          <ul>
            <li>{t("history-btn")}</li>
            <li>{t("settings-btn")}</li>
            <li>{t("about-btn")}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
