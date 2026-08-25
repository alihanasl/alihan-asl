"use client";

import {
  ArrowUpRight,
  Github,
  Mail,
} from "lucide-react";
import type { SiteButton } from "@/lib/cms/layout";
import { pickLocalized } from "@/lib/cms/layout";
import { useLocale } from "@/components/i18n/locale-provider";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/cn";

function Icon({ name }: { name: SiteButton["icon"] }) {
  if (name === "mail") return <Mail className="h-3.5 w-3.5" />;
  if (name === "github") return <Github className="h-3.5 w-3.5" />;
  if (name === "arrow" || name === "external") {
    return <ArrowUpRight className="h-3.5 w-3.5" />;
  }
  return null;
}

export function SectionButtons({
  buttons,
  className,
}: {
  buttons: SiteButton[];
  className?: string;
}) {
  const { locale } = useLocale();
  const items = buttons.filter((button) => pickLocalized(locale, button.label));
  if (!items.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-x-8 gap-y-3", className)}>
      {items.map((button) => {
        const href = button.href || "#";
        const external = href.startsWith("http");
        return (
          <li key={button.id}>
            <Magnetic strength={16}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-ink transition-opacity duration-300 hover:opacity-50"
              >
                {pickLocalized(locale, button.label)}
                <Icon name={button.icon} />
              </a>
            </Magnetic>
          </li>
        );
      })}
    </ul>
  );
}
