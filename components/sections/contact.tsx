"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import type { MessageKey } from "@/lib/i18n/translate";
import type { SiteSection } from "@/lib/cms/layout";
import { SectionButtons } from "@/components/site/section-buttons";
import { pickLocalized } from "@/lib/cms/layout";

export function Contact({
  section,
  index = "06",
}: {
  section?: SiteSection;
  index?: string;
}) {
  const { t, locale } = useLocale();
  const { profile } = useCms();
  const email = profile.email;
  const managed = (section?.buttons ?? []).filter((button) =>
    pickLocalized(locale, button.label),
  );
  const socials = managed.length
    ? []
    : [
        email ? { id: "email", href: `mailto:${email}` } : null,
        profile.linkedinUrl
          ? { id: "linkedin", href: profile.linkedinUrl }
          : null,
        profile.githubUrl ? { id: "github", href: profile.githubUrl } : null,
        profile.youtubeUrl ? { id: "youtube", href: profile.youtubeUrl } : null,
      ].filter((item): item is { id: string; href: string } => Boolean(item));

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-line"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        <Reveal>
          <SectionLabel index={index} label={t("contact.index")} />
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id="contact-heading"
            className="font-display mt-6 max-w-5xl text-[clamp(3.2rem,12vw,9rem)] leading-[0.84] tracking-[-0.05em]"
          >
            {t("contact.titleLine1")}
            <span className="block">{t("contact.titleLine2")}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col justify-between gap-10 border-t border-line pt-10 md:mt-16 md:flex-row md:items-end">
            <p className="max-w-sm text-sm leading-relaxed text-graphite">
              {t("contact.copy")}
            </p>
            {managed.length ? (
              <SectionButtons buttons={section?.buttons ?? []} />
            ) : (
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
              {socials.map((item) => (
                <li key={item.id}>
                  <Magnetic strength={16}>
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="font-mono text-[12px] uppercase tracking-[0.2em] text-ink transition-opacity duration-300 hover:opacity-50"
                    >
                      {t(`contact.${item.id}` as MessageKey)}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
            )}
          </div>
        </Reveal>

        {email ? (
          <Reveal delay={0.14}>
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-block font-mono text-[12px] uppercase tracking-[0.16em] text-stone transition-colors duration-300 hover:text-ink"
            >
              {email}
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
