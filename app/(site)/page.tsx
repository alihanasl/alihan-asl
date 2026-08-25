import { Hero } from "@/components/sections/hero";
import { SystemOverview } from "@/components/sections/system-overview";
import { SelectedWork } from "@/components/sections/selected-work";
import { DigitalLab } from "@/components/sections/digital-lab";
import { About } from "@/components/sections/about";
import { Toolbox } from "@/components/sections/toolbox";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <main id="content">
      <Hero />
      <SystemOverview />
      <SelectedWork />
      <DigitalLab />
      <About />
      <Toolbox />
      <Contact />
    </main>
  );
}
