"use client";

import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import type { MessageKey } from "@/lib/i18n/translate";
import type { SiteSection } from "@/lib/cms/layout";
import { SectionButtons } from "@/components/site/section-buttons";
import { pickLocalized } from "@/lib/cms/layout";

export function Contact({
  section,
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
      ].filter((item): item is { id: string; href: string } => Boolean(item));

  return (
    <section
      id="contact"
      className="scroll-mt-24"
      aria-labelledby="contact-heading"
    >
      <div className="site-pad mx-auto flex min-h-[100svh] max-w-[1680px] flex-col justify-end py-20 md:py-28">
        <Reveal>
          <h2
            id="contact-heading"
            className="font-display max-w-[12ch] text-[clamp(3.2rem,11vw,9.5rem)] leading-[0.82] tracking-[-0.06em]"
          >
            {t("contact.titleLine1")}
            <span className="block">{t("contact.titleLine2")}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-16 md:mt-24">
            {managed.length ? (
              <SectionButtons buttons={section?.buttons ?? []} />
            ) : (
              <ul className="flex flex-col gap-3 sm:flex-row sm:gap-10">
                {socials.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="text-[15px] tracking-[-0.02em] text-ink transition-opacity duration-300 hover:opacity-40"
                    >
                      {t(`contact.${item.id}` as MessageKey)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
