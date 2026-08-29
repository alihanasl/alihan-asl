type ProjectVisualProps = {
  project: { slug: string };
  caption: string;
  src?: string;
  className?: string;
};

function visualKind(slug: string) {
  if (slug.includes("ping")) return "ping";
  if (slug.includes("asset")) return "asset";
  if (slug.includes("guest") || slug === "yeni-is") return "guest";
  if (slug.includes("tool")) return "toolkit";
  return "default";
}

export function ProjectVisual({
  project,
  caption,
  className,
}: ProjectVisualProps) {
  const kind = visualKind(project.slug);

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden bg-paper-2 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 h-full w-full text-ink"
        aria-hidden
        role="presentation"
      >
        {kind === "ping" && <PingAlertMark caption={caption} />}
        {kind === "asset" && <AssetMark caption={caption} />}
        {kind === "guest" && <GuestAssistMark caption={caption} />}
        {kind === "toolkit" && <ToolkitMark caption={caption} />}
        {kind === "default" && <DefaultMark caption={caption} />}
      </svg>
    </div>
  );
}

function VisualCaption({ caption }: { caption: string }) {
  if (!caption) return null;
  return (
    <text
      x="48"
      y="56"
      fill="#8a8a8a"
      stroke="none"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fontSize="11"
      letterSpacing="2.4"
    >
      {caption}
    </text>
  );
}

function PingAlertMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <circle className="pulse-ring" cx="400" cy="250" r="168" opacity="0.28" />
      <circle cx="400" cy="250" r="118" opacity="0.35" />
      <circle cx="400" cy="250" r="58" opacity="0.7" />
      <circle cx="400" cy="250" r="7" fill="currentColor" stroke="none" />
      <circle cx="186" cy="168" r="5" fill="currentColor" stroke="none" />
      <circle cx="612" cy="146" r="4" fill="currentColor" stroke="none" opacity="0.7" />
      <circle cx="640" cy="318" r="4.5" fill="currentColor" stroke="none" />
      <circle cx="214" cy="342" r="3.5" fill="currentColor" stroke="none" opacity="0.45" />
      <path d="M400 250 L186 168" opacity="0.28" />
      <path d="M400 250 L612 146" opacity="0.2" />
      <path d="M400 250 L640 318" opacity="0.28" />
      <path d="M400 250 L214 342" opacity="0.16" />
      <line x1="48" y1="250" x2="752" y2="250" opacity="0.1" />
      <line x1="400" y1="36" x2="400" y2="464" opacity="0.1" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function AssetMark({ caption }: { caption: string }) {
  const cells = Array.from({ length: 18 }, (_, index) => index);

  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      {cells.map((cell) => {
        const col = cell % 6;
        const row = Math.floor(cell / 6);
        const x = 70 + col * 114;
        const y = 92 + row * 118;
        const filled = [1, 4, 8, 11, 13, 16].includes(cell);
        return (
          <rect
            key={cell}
            x={x}
            y={y}
            width="96"
            height="96"
            fill={filled ? "currentColor" : "none"}
            opacity={filled ? 0.1 : 0.55}
          />
        );
      })}
      <line x1="70" y1="92" x2="730" y2="92" opacity="0.18" />
      <line x1="70" y1="446" x2="730" y2="446" opacity="0.18" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function GuestAssistMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="88" y="96" width="310" height="168" opacity="0.7" />
      <rect x="392" y="176" width="310" height="168" opacity="0.35" />
      <line x1="118" y1="148" x2="318" y2="148" opacity="0.4" />
      <line x1="118" y1="176" x2="268" y2="176" opacity="0.22" />
      <line x1="118" y1="204" x2="292" y2="204" opacity="0.18" />
      <line x1="422" y1="228" x2="642" y2="228" opacity="0.35" />
      <line x1="422" y1="256" x2="598" y2="256" opacity="0.18" />
      <circle cx="638" cy="118" r="22" opacity="0.45" />
      <circle cx="638" cy="118" r="4" fill="currentColor" stroke="none" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function ToolkitMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="90" y="110" width="180" height="280" opacity="0.7" />
      <rect x="310" y="110" width="180" height="150" fill="currentColor" opacity="0.08" />
      <rect x="310" y="280" width="180" height="110" opacity="0.4" />
      <rect x="530" y="110" width="180" height="90" opacity="0.4" />
      <rect x="530" y="220" width="180" height="170" opacity="0.7" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function DefaultMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="120" y="110" width="560" height="280" opacity="0.4" />
      <line x1="160" y1="180" x2="500" y2="180" opacity="0.28" />
      <line x1="160" y1="220" x2="430" y2="220" opacity="0.16" />
      <circle cx="600" cy="300" r="14" opacity="0.45" />
      <VisualCaption caption={caption} />
    </g>
  );
}
