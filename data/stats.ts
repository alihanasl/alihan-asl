export type Stat = {
  id: "servers" | "switches" | "projects" | "problems";
  value: number | null;
  display?: string;
  suffix?: string;
};

export const stats: Stat[] = [
  { id: "servers", value: 20, suffix: "+" },
  { id: "switches", value: 150, suffix: "+" },
  { id: "projects", value: 10, suffix: "+" },
  { id: "problems", value: null, display: "∞" },
];
