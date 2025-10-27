"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AssignmentFilter({
  disabled,
  searchParamsString,
}: {
  disabled: boolean;
  searchParamsString: string;
}) {
  const router = useRouter();

  const cleanParams = new URLSearchParams(searchParamsString);

  const filter = cleanParams.has("filter") ? cleanParams.get("filter")! : "all";

  const [filterState, setFilter] = useState(filter);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (filterState.length > 2 || filterState.length === 0) {
        const newParams = new URLSearchParams(cleanParams.toString());
        newParams.set("filter", filterState);
        newParams.set("page", "0");
        router.push(`?${newParams.toString()}`);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [filterState]);

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilter(event.target.value);
  };

  return (
    <div className="p-3 pt-1.5 md:pt-6 md:p-6 md:pr-3 rounded-xl justify-center items-center">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-3">
        <div className="relative w-full sm:w-auto">
          <select
            disabled={disabled}
            id="search"
            className="rounded-sm border border-[#545454b7] w-full p-4 py-2 bg-gray-900"
            onChange={changeHandler}
            value={filterState}
          >
            <option value="all">All Major Orders</option>
            <option value="won">Successful Orders</option>
            <option value="lost">Unsuccessful Orders</option>
            <option value="grouped">Grouped Orders</option>
            <option value="ungrouped">Ungrouped Orders</option>
          </select>
        </div>
      </div>
    </div>
  );
}
