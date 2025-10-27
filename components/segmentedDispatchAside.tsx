"use client";

import { DBDispatch } from "@/lib/typeDefinitions";
import { useEffect, useState } from "react";
import "@/styles/sidebar.css";
import { useTranslations } from "next-intl";

export default function SegmentedDispatchAside({
  dispatches,
}: {
  dispatches: DBDispatch[];
}) {
  const t = useTranslations("DispatchAside");
  const [isOpen, setOpen] = useState(false);
  const [isFixed, setFixed] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setFixed(true);
    } else {
      const timeout = setTimeout(() => setFixed(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <div className="absolute right-0">
      <button
        className={`${isFixed ? "fixed" : "relative"} m-4 mb-0 right-0 ${
          isOpen
            ? "-translate-x-[(66.6vw_-_4rem)] lg:-translate-x-[(33.3vw_-_4rem)] xl:-translate-x-[(25vw_-_4rem)]"
            : ""
        } z-6 cursor-pointer text-white transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${
            isOpen ? "scale-x-100" : "-scale-x-100"
          } transition-transform duration-300`}
        >
          <polyline points="8 4 16 12 8 20" />
        </svg>
      </button>
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed h-[94%] right-0 w-2/3 lg:w-1/3 xl:w-1/4 flex flex-col items-end justify-end p-3 gap-6 basis-1/12 z-5 bg-[#344551] rounded-l-2xl ${
          isOpen
            ? "sidebar-enter sidebar-enter-active"
            : "sidebar-exit sidebar-exit-active"
        }`}
      >
        <div className={`flex flex-row justify-end w-full items-center mt-1.5`}>
          <h3 className="font-semibold transition-all duration-200 delay-75">
            {t("title")}
          </h3>
        </div>
        <div
          id="sidebar-scroll"
          className={`flex flex-col gap-4 pr-1 w-full overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-500
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-400`}
        >
          {dispatches.map((dispatch) => (
            <div
              key={dispatch.id}
              className="shadow-lg p-3 gap-4 flex flex-col bg-[#131519]"
            >
              <h4 className="font-semibold">{dispatch.title}</h4>
              <p className="text-pretty text-sm">{dispatch.body}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
