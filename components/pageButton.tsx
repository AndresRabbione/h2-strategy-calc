export default function PageButton({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <>
      <button
        className="rounded-xl py-1 px-2 border border-transparent text-center text-sm text-white transition-all 
            shadow-sm hover:shadow-lg bg-slate-800 focus:bg-slate-900 focus:shadow-none active:bg-slate-900 hover:bg-slate-900 active:shadow-none 
            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:bg-inherit"
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </>
  );
}
