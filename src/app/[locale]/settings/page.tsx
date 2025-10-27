import LocaleSwitcher from "../../../../components/localeSwitcher";

export default function SettingsPage() {
  return (
    <main className="p-5 flex-1 w-1/2 self-center mt-7 mx-15 flex flex-col justify-start items-center gap-5 bg-slate-600">
      <h1 className="font-semibold text-2xl">Settings</h1>
      <div className="flex flex-col h-full">
        <LocaleSwitcher></LocaleSwitcher>
      </div>
    </main>
  );
}
