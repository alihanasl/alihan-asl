"use client";

import { Fragment } from "react";
import { Hero } from "@/components/sections/hero";
import { SystemOverview } from "@/components/sections/system-overview";
import { SelectedWork } from "@/components/sections/selected-work";
import { DigitalLab } from "@/components/sections/digital-lab";
import { About } from "@/components/sections/about";
import { Toolbox } from "@/components/sections/toolbox";
import { Contact } from "@/components/sections/contact";
import { ManagedSection } from "@/components/sections/managed-section";
import { useCms } from "@/components/cms/cms-provider";
import type { SiteSection } from "@/lib/cms/layout";

const builtin: Record<string, (section: SiteSection) => React.ReactNode> = {
  hero: (section) => <Hero section={section} />,
  system: () => <SystemOverview />,
  work: () => <SelectedWork />,
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
          return <Fragment key={section.id}>{render(section)}</Fragment>;
        }
        return <ManagedSection key={section.id} section={section} index={index} />;
      })}
    </>
  );
}
