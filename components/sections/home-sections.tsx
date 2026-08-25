"use client";

import { Fragment, type ReactNode } from "react";
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

function indexLabel(index: number) {
  return String(index).padStart(2, "0");
}

const builtin: Record<
  string,
  (section: SiteSection, index: number) => ReactNode
> = {
  hero: (section) => <Hero section={section} />,
  system: (_section, index) => <SystemOverview index={indexLabel(index)} />,
  work: (_section, index) => <SelectedWork index={indexLabel(index)} />,
  lab: (_section, index) => <DigitalLab index={indexLabel(index)} />,
  about: (section, index) => (
    <About section={section} index={indexLabel(index)} />
  ),
  toolbox: (_section, index) => <Toolbox index={indexLabel(index)} />,
  contact: (section, index) => (
    <Contact section={section} index={indexLabel(index)} />
  ),
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
