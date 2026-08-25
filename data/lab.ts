export type LabStatus = "active" | "building" | "experimental";

export type Experiment = {
  id: "network-monitoring" | "guest-assistant" | "internal-tools";
  status: LabStatus;
  ref: string;
};

export const experiments: Experiment[] = [
  { id: "network-monitoring", status: "active", ref: "01" },
  { id: "guest-assistant", status: "building", ref: "03" },
  { id: "internal-tools", status: "experimental", ref: "04" },
];
