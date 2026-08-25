"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { SectionButtons } from "@/components/site/section-buttons";
import {
  pickLocalized,
  type FaqItem,
  type QuoteItem,
  type SiteSection,
  type TimelineItem,
} from "@/lib/cms/layout";

export function ManagedSection({
  section,
  index,
}: {
  section: SiteSection;
  index: number;
}) {
  const { locale } = useLocale();
  const heading =
    pickLocalized(locale, section.heading) || pickLocalized(locale, section.body);
  const body = pickLocalized(locale, section.body);
  const label = String(index).padStart(2, "0");

  return (
    <section
      id={section.id}
      className="scroll-mt-24 border-t border-line"
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        <Reveal>
          <SectionLabel index={label} label={section.type} />
        </Reveal>
        {heading ? (
          <Reveal delay={0.05}>
            <h2
              id={`${section.id}-heading`}
              className="font-display mt-6 max-w-4xl text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.92] tracking-[-0.045em]"
            >
              {heading}
            </h2>
          </Reveal>
        ) : null}
        {body ? (
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-graphite md:text-base">
              {body}
            </p>
          </Reveal>
        ) : null}
        {section.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={section.image}
            alt=""
            className="mt-10 max-h-[28rem] w-full rounded-sm object-cover"
          />
        ) : null}

        {section.type === "faq" ? (
          <dl className="mt-12 border-t border-line">
            {(section.items as FaqItem[]).map((item) => (
              <div key={item.id} className="border-b border-line py-6">
                <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
                  {pickLocalized(locale, item.question)}
                </dt>
                <dd className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
                  {pickLocalized(locale, item.answer)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {section.type === "testimonials" ? (
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {(section.items as QuoteItem[]).map((item) => (
              <li key={item.id} className="border-t border-line pt-6">
                <p className="text-[1.05rem] leading-relaxed text-graphite">
                  {pickLocalized(locale, item.quote)}
                </p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
                  {pickLocalized(locale, item.person)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {section.type === "timeline" ? (
          <ol className="mt-12 border-t border-line">
            {(section.items as TimelineItem[]).map((item) => (
              <li
                key={item.id}
                className="grid gap-3 border-b border-line py-6 md:grid-cols-[8rem_minmax(0,1fr)]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
                  {pickLocalized(locale, item.date)}
                </p>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink">
                    {pickLocalized(locale, item.title)}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite">
                    {pickLocalized(locale, item.body)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {section.type === "gallery" && section.gallery.length ? (
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.gallery.map((url) => (
              <li key={url} className="overflow-hidden border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
              </li>
            ))}
          </ul>
        ) : null}

        <SectionButtons buttons={section.buttons} className="mt-10" />
      </div>
    </section>
  );
}
