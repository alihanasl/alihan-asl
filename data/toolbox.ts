export type Tool = {
  id:
    | "nextjs"
    | "typescript"
    | "react"
    | "tailwind"
    | "supabase"
    | "electron"
    | "python"
    | "git"
    | "vercel"
    | "networking";
  name: string;
};

export const toolbox: Tool[] = [
  { id: "nextjs", name: "Next.js" },
  { id: "typescript", name: "TypeScript" },
  { id: "react", name: "React" },
  { id: "tailwind", name: "Tailwind" },
  { id: "supabase", name: "Supabase" },
  { id: "electron", name: "Electron" },
  { id: "python", name: "Python" },
  { id: "git", name: "Git" },
  { id: "vercel", name: "Vercel" },
  { id: "networking", name: "Networking" },
];
