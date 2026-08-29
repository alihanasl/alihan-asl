import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const ratios = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
} as const;

export function FitImage({
  src,
  alt = "",
  ratio = "16/10",
  className,
  children,
}: {
  src?: string;
  alt?: string;
  ratio?: keyof typeof ratios;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        className="relative w-full overflow-hidden bg-paper-2",
        ratios[ratio],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain object-center"
        />
      ) : (
        children
      )}
    </div>
  );
}
