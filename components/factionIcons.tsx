import { FactionIDs } from "@/lib/typeDefinitions";
import { useId } from "react";

export type IconProperties = {
  pathD: string;
  pathFill: string;
  pathStroke: string;
  pathWidth: string;
  pathTransform: string;
  factionName: string;
};

const iconPropertyMap = new Map<FactionIDs, IconProperties>();

iconPropertyMap.set(FactionIDs.HUMANS, {
  pathD:
    "M945 450v-3l-60-48a396 396 0 0 0-18-53v-2L715 223l49 59a342 342 0 0 1 78 218c0 170-127 315-295 339l-24 5-35-2-35-3c-168-24-295-170-295-339a342 342 0 0 1 78-218l49-59-151 121v2a396 396 0 0 0-18 53l-61 47v3a456 456 0 0 0-3 50 448 448 0 0 0 322 431c-8 13-12 22-18 42l-2 6 45 22 4-6c13-20 25-38 38-49h16l43 2a456 456 0 0 0 60-4l6 6c9 9 14 15 24 31l8 13 4 6 45-22-2-6c-6-19-12-29-19-41a448 448 0 0 0 322-430 456 456 0 0 0-3-50M623 926c1 0 1 0 0 1Zm96-645a310 310 0 1 0 91 219 308 308 0 0 0-91-219M505 627c-13 10-22 4-40-13-7-7-15-15-25-19 9-4 17-7 23-5s12 9 16 22l4 13 9-10 7-7c0 7 0 15 6 18Zm60-253a193 193 0 0 0-4 25c-2 17-3 31-16 43-3-3-10-6-24-7s-22-1-29 2-7 3-25 30-18 33-18 35a9 9 0 0 0 7 7h6l-6 3c-7 1-16-8-22-25l-5-12-9 9-26 27-6 6 6 6c2 2 6 3 10 4s11 3 12 6 1 4-4 13a26 26 0 0 0-4 12l-18-7-13-5 2 13a77 77 0 0 1-2 9c-2 11-5 23-2 33-28 9-47 28-53 51s7 55 36 76c12 8 26 11 40 13s22 3 31 9 9 8 12 13c-120-26-211-136-211-263a267 267 0 0 1 20-102c10 13 25 11 33 10h2c0 3 0 7 1 12 2 20 4 21 6 23a8 8 0 0 0 11-1c12-13 20-28 27-40s16-28 26-35l44-16-4 4c-38 36-55 54-49 66s7 11 18 12 39-8 56-15 34-18 40-25c23-33 9-53-3-69s-15-21-12-35 15-31 35-33c36-3 82 26 92 57 2 5-5 48-8 61m90 347c12-17 15-27 11-34s-5-6-10-6 12-14 19-21 25-23 22-36-6-10-10-13c22-18 41-20 62-6a269 269 0 0 1-94 116m-44-541-15-95-43-17-7-52-45-15h-2l-45 15-7 51-43 17-15 96c35-13 72-19 112-19s76 6 110 19",
  pathFill: "#6bb7ea",
  pathStroke: "#6bb7ea",
  pathWidth: "7.200000000000006",
  pathTransform: "translate(0 0) scale(1)",
  factionName: "Super Earth",
});

iconPropertyMap.set(FactionIDs.AUTOMATONS, {
  pathD:
    "M467 60L183 940L469 737L467 60z M533 60L531 737L817 940L533 60z M0 328L247 532L316 328L0 328z M684 328L753 532L1000 328L684 328z",
  pathFill: "#fe6d6a",
  pathStroke: "#fe6d6a",
  pathWidth: "7.560000000000007",
  pathTransform: "translate(-25.00000000000002 -35.00000000000002) scale(1.05)",
  factionName: "Automatons",
});

iconPropertyMap.set(FactionIDs.ILLUMINATE, {
  pathD:
    "M505,463c128,0,231-104,231-231S632,0,505,0,273,104,273,231,377,463,505,463Z M833,222c0,184-148,333-331,333S171,406,171,222a336,336,0,0,1,11-84A492,492,0,0,0,14,509c0,271,218,491,486,491S986,780,986,509A492,492,0,0,0,824,143,336,336,0,0,1,833,222Z",
  pathFill: "#cf64f8",
  pathStroke: "#cf64f8",
  pathWidth: "0",
  pathTransform: "translate(39.99999999999998 39.99999999999998) scale(0.92)",
  factionName: "Illuminate",
});

iconPropertyMap.set(FactionIDs.TERMINIDS, {
  pathD:
    "M511,178C334,197,119,422,177,704,288,604,398,569,497,552,361,383,455,238,511,178Z M784,0c40,101,39,158,39,208-2,203-188,380-323,404C299,648,83,809,0,1000c71-56,167-99,286-99H784c139-135,216-263,216-457C1000,323,929,129,784,0Z",
  pathFill: "#ff9900",
  pathStroke: "#ff9900",
  pathWidth: "0",
  pathTransform: "translate(20.000000000000018 20.000000000000018) scale(0.96)",
  factionName: "Terminids",
});

export function FactionIcon({ factionId }: { factionId: FactionIDs }) {
  const reactId = useId();
  const iconProperties = iconPropertyMap.get(factionId);
  const iconId = `icon-${factionId}-${reactId}`;
  return (
    <i>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        role="img"
        aria-labelledby={iconId}
        className="block m-1 ml-2 w-7.5 h-7.5 align-[-0.125em]"
      >
        <title id={iconId}>{iconProperties?.factionName}</title>{" "}
        <g opacity={1}>
          <g transform="scale(1)">
            <g transform="translate(500 500) scale(1) ">
              <g opacity="1" transform="translate(-500 -500)  ">
                <g>
                  <g>
                    <path
                      className="pointer-events-none"
                      d={iconProperties!.pathD}
                      fill={iconProperties?.pathFill}
                      stroke={iconProperties?.pathStroke}
                      strokeWidth={iconProperties?.pathWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform={iconProperties?.pathTransform}
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </i>
  );
}
