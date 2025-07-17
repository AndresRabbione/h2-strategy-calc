import { MajorOrder } from "@/app/lib/typeDefinitions";
import { getLatestMajorOrder } from "../src/app/API/orders/route";
import { expect, jest } from "@jest/globals";
import { expectTypeOf } from "expect-type";

jest.mock("@/app/lib/typeDefinitions");

describe("getLatestMajorOrder", () => {
  it("should expose a function", () => {
    expect(getLatestMajorOrder).toBeDefined();
  });

  it("getLatestMajorOrder should return a MajorOrder", async () => {
    const retValue = await getLatestMajorOrder();
    expectTypeOf(retValue).toEqualTypeOf<MajorOrder>();
  });
});
