"use client";

import { Fragment, type ReactNode } from "react";
import { Hero } from "@/components/sections/hero";
import { Positioning } from "@/components/sections/positioning";
import { SystemOverview } from "@/components/sections/system-overview";
import { TransformationApproach } from "@/components/sections/transformation-approach";
import { SelectedWork } from "@/components/sections/selected-work";
import { HowIThink } from "@/components/sections/how-i-think";
import { DigitalLab } from "@/components/sections/digital-lab";
import { About } from "@/components/sections/about";
import { Toolbox } from "@/components/sections/toolbox";
import { Contact } from "@/components/sections/contact";
import { ManagedSection } from "@/components/sections/managed-section";
import { useCms } from "@/components/cms/cms-provider";
import type { SiteSection } from "@/lib/cms/layout";

const builtin: Record<
  string,
  (section: SiteSection, index: number) => ReactNode
> = {
  hero: (section) => <Hero section={section} />,
  position: () => <Positioning />,
  system: () => <SystemOverview />,
  approach: () => <TransformationApproach />,
  work: () => <SelectedWork />,
  think: () => <HowIThink />,
  lab: () => <DigitalLab />,
  about: (section) => <About section={section} />,
  toolbox: () => <Toolbox />,
  contact: (section) => <Contact section={section} />,
};

export function HomeSections() {
  const { layout } = useCms();
  const sections = layout.sections.filter((section) => section.visible);

  return (
    <>
      {sections.map((section, index) => {
        const render = builtin[section.type];
        if (render) {
          return (
            <Fragment key={section.id}>{render(section, index)}</Fragment>
          );
        }
        return (
          <ManagedSection key={section.id} section={section} index={index} />
        );
      })}
    </>
  );
}
