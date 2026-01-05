interface Props {
  factionColor: string;
  progress: number;
}

export default function DualObjectiveProgressBar({
  factionColor,
  progress,
}: Props) {
  const friendlyPercent: string = `${
    4 + progress > 0 && 4 + progress < 8
      ? 4 + progress
      : 4 + progress < 0
      ? 1
      : 8
  }/8`;

  return (
    <div
      className={`w-full relative h-6 before:text-gray-700 before:bottom-1 before:left-0 before:right-0 before:absolute before:text-center before:text-sm before:content-[attr(data-label)]`}
      data-label={progress}
      style={{ backgroundColor: factionColor }}
    >
      <span
        style={{ width: friendlyPercent }}
        className={`inline-block h-full bg-super-earth-blue w-${friendlyPercent}`}
      ></span>
    </div>
  );
}
