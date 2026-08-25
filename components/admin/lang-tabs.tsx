"use client";

export function LangTabs({
  locale,
  onChange,
}: {
  locale: "tr" | "en";
  onChange: (locale: "tr" | "en") => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5">
      <button
        type="button"
        className={locale === "tr" ? "admin-tab-active" : "admin-tab"}
        onClick={() => onChange("tr")}
      >
        Türkçe
      </button>
      <button
        type="button"
        className={locale === "en" ? "admin-tab-active" : "admin-tab"}
        onClick={() => onChange("en")}
      >
        English
      </button>
    </div>
  );
}
