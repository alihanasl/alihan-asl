"use client";

import { createContext, useContext } from "react";
import type { PublicCms } from "@/lib/cms/types";

export const emptyPublicCms: PublicCms = {
  configured: false,
  profile: {
    id: "",
    name: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
  },
  copy: {},
  projects: [],
  experiences: [],
  skills: [],
  experiments: [],
  stats: [],
  layout: {
    menu: [],
    footer: { links: [] },
    pages: [],
    sections: [],
  },
};

const CmsContext = createContext<PublicCms>(emptyPublicCms);

export function CmsProvider({
  value,
  children,
}: {
  value: PublicCms;
  children: React.ReactNode;
}) {
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
