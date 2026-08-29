"use client";

import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { SectionButtons } from "@/components/site/section-buttons";
import { FitImage } from "@/components/site/fit-image";
import {
  pickLocalized,
  type FaqItem,
  type QuoteItem,
  type SiteSection,
  type TimelineItem,
} from "@/lib/cms/layout";

export function ManagedSection({
  section,
}: {
  section: SiteSection;
  index: number;
}) {
  const { locale } = useLocale();
  const heading =
    pickLocalized(locale, section.heading) || pickLocalized(locale, section.body);
  const body = pickLocalized(locale, section.body);

  return (
    <section
      id={section.id}
      className="scroll-mt-24"
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-32">
        {heading ? (
          <Reveal>
            <h2
              id={`${section.id}-heading`}
              className="font-display max-w-4xl text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.88] tracking-[-0.05em]"
            >
              {heading}
            </h2>
          </Reveal>
        ) : null}
        {body ? (
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-graphite">
              {body}
            </p>
          </Reveal>
        ) : null}
        {section.image ? (
          <FitImage src={section.image} ratio="16/10" className="mt-10" />
        ) : null}

        {section.type === "faq" ? (
          <dl className="mt-16 max-w-3xl space-y-10">
            {(section.items as FaqItem[]).map((item) => (
              <div key={item.id}>
                <dt className="font-display text-[clamp(1.4rem,3vw,2rem)] tracking-[-0.04em] text-ink">
                  {pickLocalized(locale, item.question)}
                </dt>
                <dd className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-graphite">
                  {pickLocalized(locale, item.answer)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {section.type === "testimonials" ? (
          <ul className="mt-16 max-w-3xl space-y-12">
            {(section.items as QuoteItem[]).map((item) => (
              <li key={item.id}>
                <p className="font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.2] tracking-[-0.03em] text-ink">
                  {pickLocalized(locale, item.quote)}
                </p>
                <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-stone">
                  {pickLocalized(locale, item.person)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {section.type === "timeline" ? (
          <ol className="mt-16 max-w-3xl space-y-10">
            {(section.items as TimelineItem[]).map((item) => (
              <li key={item.id}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
                  {pickLocalized(locale, item.date)}
                </p>
                <p className="font-display mt-3 text-[clamp(1.4rem,3vw,2rem)] tracking-[-0.04em] text-ink">
                  {pickLocalized(locale, item.title)}
                </p>
                <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-graphite">
                  {pickLocalized(locale, item.body)}
                </p>
              </li>
            ))}
          </ol>
        ) : null}

        {section.type === "gallery" && section.gallery.length ? (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {section.gallery.map((url) => (
              <li key={url}>
                <FitImage src={url} alt="" ratio="4/3" />
              </li>
            ))}
          </ul>
        ) : null}

        <SectionButtons buttons={section.buttons} className="mt-10" />
      </div>
    </section>
  );
}
