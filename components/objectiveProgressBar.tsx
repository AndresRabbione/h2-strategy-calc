interface Props {
  factionColor: string;
  progress: number;
  totalAmount: number | null;
}

export default function ObjectiveProgressBar({
  factionColor,
  progress,
  totalAmount,
}: Props) {
  const percentage =
    totalAmount === null ? progress : (progress / totalAmount) * 100;
  const innerText = `${progress.toLocaleString("en-US")}${
    totalAmount !== null
      ? ` / ${totalAmount.toLocaleString("en-US")} (${percentage.toFixed(2)}%)`
      : "%"
  }`;

  return (
    <div
      className={`bg-[${factionColor}] w-4/5 before:text-gray-700 before:top-0.5 before:left-0 relative h-6 before:absolute before:pl-2 before:text-sm before:content-[attr(data-label)]`}
      data-label={innerText}
    >
      <span
        className="inline-block h-full bg-super-earth-blue"
        style={{ width: `${percentage}%` }}
      ></span>
    </div>
  );
}
