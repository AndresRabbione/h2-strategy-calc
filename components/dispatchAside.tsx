"use client";

import { DBDispatch } from "@/lib/typeDefinitions";
import { useState } from "react";

export default function DispatchAside({
  dispatches,
}: {
  dispatches: DBDispatch[];
}) {
  const [isOpen, setOpen] = useState(false);

  if (!isOpen) {
    return (
      <aside className="flex w-full items-start p-3 justify-end basis-1/12">
        <button className="text-white bg-white">
          <svg
            width="48"
            height="24"
            viewBox="0 0 48 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="8,6 0,12 8,18" fill="none" />
            <line
              x1="8"
              y1="12"
              x2="48"
              y2="12"
              stroke="none"
              strokeWidth="3"
            />
            <rect x="200" y="123" width="150" height="500" fill="red"></rect>
          </svg>
        </button>
      </aside>
    );
  }
  return (
    <aside className="flex flex-col items-end justify-end p-3 basis-1/12">
      <div className={`flex flex-row justify-between items-center`}>
        <button></button>
        <h3 className="font-semibold transition-all duration-200 delay-75">
          Dispatch
        </h3>
      </div>
      <div className="flex flex-col gap-5 w-full h-full ">
        {dispatches.map((dispatch) => (
          <div key={dispatch.id}>
            <h4 className="font-semibold">{dispatch.title}</h4>
            <p className="text-pretty text-sm">{dispatch.body}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
