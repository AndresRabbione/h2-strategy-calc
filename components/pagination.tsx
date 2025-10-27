"use client";

import { useRouter } from "next/navigation";
import PageButton from "./pageButton";

export default function Pagination({
  hasNext,
  searchParamsString,
}: {
  hasNext: boolean;
  searchParamsString: string;
}) {
  const router = useRouter();

  const cleanParams = new URLSearchParams(searchParamsString);

  const page = cleanParams.has("page")
    ? parseInt(cleanParams.get("page") as string, 10)
    : 0;

  const pageChange = (pageNumber: number) => {
    const newParams = new URLSearchParams(cleanParams.toString());
    newParams.set("page", pageNumber.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-between p-3 pb-1.5 md:pb-3 gap-3">
      <div>
        {
          <PageButton
            text={"←"}
            onClick={() => pageChange(page - 1)}
            disabled={page <= 0}
          />
        }
      </div>

      <div>Page {page + 1}</div>

      <div>
        <PageButton
          text={"→"}
          onClick={() => pageChange(page + 1)}
          disabled={!hasNext}
        />
      </div>
    </div>
  );
}
