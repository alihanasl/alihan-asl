import { cn } from "@/lib/cn";

type SectionLabelProps = {
  index: string;
  label: string;
  className?: string;
  tone?: "paper" | "lab";
};

export function SectionLabel({
  index,
  label,
  className,
  tone = "paper",
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]",
        tone === "paper" ? "text-stone" : "text-lab-muted",
        className,
      )}
    >
      <span>{index}</span>
      <span
        className={cn(
          "h-px w-8",
          tone === "paper" ? "bg-line-strong" : "bg-lab-line",
        )}
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
