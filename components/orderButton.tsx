"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderButton({
  disabled,
  searchParamsString,
}: {
  disabled: boolean;
  searchParamsString: string;
}) {
  const router = useRouter();

  const cleanParams = new URLSearchParams(searchParamsString);

  const order = cleanParams.has("order") ? cleanParams.get("order") : "desc";

  const [orderState, setOrder] = useState(order === "asc");

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(cleanParams.toString());
      newParams.set("order", orderState ? "asc" : "desc");
      newParams.set("page", "0");
      router.push(`?${newParams.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [orderState]);

  const changeHandler = (checked: boolean) => {
    setOrder(checked);
  };

  return (
    <div className="flex flex-row items-center justify-center p-3 pb-1.5 md:pb-3 gap-3">
      <input
        type="checkbox"
        id="orderToggle"
        name="order"
        disabled={disabled}
        checked={orderState}
        onChange={(e) => changeHandler(e.target.checked)}
      ></input>
      <label htmlFor="orderToggle">Oldest</label>
    </div>
  );
}
