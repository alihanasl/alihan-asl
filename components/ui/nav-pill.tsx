"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export type NavPillItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

export function NavPill({
  items,
  className,
  "aria-label": ariaLabel,
}: {
  items: NavPillItem[];
  className?: string;
  "aria-label"?: string;
}) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.active),
  );
  const count = Math.max(items.length, 1);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative flex h-12 items-center rounded-[24px] border border-white/10 bg-white/[0.05] px-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.15)] backdrop-blur-[15px] transition-[border-color,background-color,box-shadow] duration-500 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1.5 h-9 rounded-[18px] bg-white/[0.08] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          width: `calc((100% - 12px) / ${count})`,
          left: 6,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {items.map((item) => {
        const shared =
          "relative z-10 flex h-9 min-w-[4.5rem] flex-1 items-center justify-center rounded-[18px] px-3 text-[13px] font-medium tracking-[0.02em] text-ink sm:min-w-[80px]";

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              role="tab"
              aria-selected={Boolean(item.active)}
              className={shared}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={Boolean(item.active)}
            className={shared}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
