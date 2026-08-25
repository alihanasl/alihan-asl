import { FitImage } from "@/components/site/fit-image";

type ProjectVisualProps = {
  project: { slug: string };
  caption: string;
  src?: string;
  className?: string;
};

export function ProjectVisual({
  project,
  caption,
  src,
  className,
}: ProjectVisualProps) {
  return (
    <FitImage src={src} ratio="16/10" className={className}>
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        role="presentation"
      >
        {project.slug === "ping-alert-v2" && <PingAlertMark caption={caption} />}
        {project.slug === "it-asset-management" && <AssetMark caption={caption} />}
        {project.slug === "guest-assist-ai" && (
          <GuestAssistMark caption={caption} />
        )}
        {project.slug === "it-toolkit" && <ToolkitMark caption={caption} />}
        {project.slug !== "ping-alert-v2" &&
          project.slug !== "it-asset-management" &&
          project.slug !== "guest-assist-ai" &&
          project.slug !== "it-toolkit" && <DefaultMark caption={caption} />}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/[0.04] to-transparent" />
    </FitImage>
  );
}

function VisualCaption({ caption }: { caption: string }) {
  return (
    <text
      x="56"
      y="64"
      fill="#8A867E"
      stroke="none"
      fontFamily="ui-monospace, monospace"
      fontSize="12"
      letterSpacing="2"
    >
      {caption}
    </text>
  );
}

function PingAlertMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="#161615" strokeWidth="1">
      <rect x="40" y="36" width="720" height="428" opacity="0.18" />
      <circle cx="400" cy="250" r="42" opacity="0.9" />
      <circle cx="400" cy="250" r="8" fill="#161615" stroke="none" />
      <circle cx="400" cy="250" r="110" opacity="0.45" />
      <circle cx="400" cy="250" r="180" opacity="0.28" />
      <circle cx="400" cy="250" r="250" opacity="0.16" />
      <line x1="400" y1="48" x2="400" y2="452" opacity="0.18" />
      <line x1="70" y1="250" x2="730" y2="250" opacity="0.18" />
      <circle cx="548" cy="168" r="5" fill="#B8432A" stroke="none" />
      <circle cx="292" cy="318" r="4" fill="#161615" stroke="none" opacity="0.7" />
      <circle cx="520" cy="340" r="3.5" fill="#161615" stroke="none" opacity="0.45" />
      <path d="M400 250 L548 168" opacity="0.35" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function AssetMark({ caption }: { caption: string }) {
  const cells = Array.from({ length: 24 }, (_, index) => index);

  return (
    <g fill="none" stroke="#161615" strokeWidth="1">
      <rect x="40" y="36" width="720" height="428" opacity="0.18" />
      {cells.map((cell) => {
        const col = cell % 6;
        const row = Math.floor(cell / 6);
        const x = 92 + col * 108;
        const y = 78 + row * 96;
        const filled = [0, 3, 7, 11, 14, 18, 22].includes(cell);
        return (
          <rect
            key={cell}
            x={x}
            y={y}
            width="86"
            height="74"
            fill={filled ? "#161615" : "none"}
            opacity={filled ? 0.12 : 0.55}
          />
        );
      })}
      <VisualCaption caption={caption} />
    </g>
  );
}

function GuestAssistMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="#161615" strokeWidth="1">
      <rect x="40" y="36" width="720" height="428" opacity="0.18" />
      <rect x="118" y="110" width="340" height="210" opacity="0.7" />
      <rect x="340" y="186" width="340" height="210" opacity="0.4" />
      <line x1="148" y1="168" x2="328" y2="168" opacity="0.35" />
      <line x1="148" y1="196" x2="392" y2="196" opacity="0.22" />
      <line x1="148" y1="224" x2="286" y2="224" opacity="0.22" />
      <line x1="372" y1="244" x2="620" y2="244" opacity="0.28" />
      <line x1="372" y1="272" x2="574" y2="272" opacity="0.18" />
      <circle cx="640" cy="132" r="18" opacity="0.5" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function ToolkitMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="#161615" strokeWidth="1">
      <rect x="40" y="36" width="720" height="428" opacity="0.18" />
      <rect x="110" y="120" width="170" height="260" opacity="0.7" />
      <rect x="310" y="120" width="170" height="150" fill="#161615" opacity="0.08" />
      <rect x="310" y="290" width="170" height="90" opacity="0.45" />
      <rect x="510" y="120" width="170" height="90" opacity="0.45" />
      <rect x="510" y="230" width="170" height="150" opacity="0.7" />
      <line x1="132" y1="168" x2="258" y2="168" opacity="0.3" />
      <line x1="132" y1="196" x2="220" y2="196" opacity="0.2" />
      <line x1="532" y1="278" x2="648" y2="278" opacity="0.3" />
      <VisualCaption caption={caption} />
    </g>
  );
}

function DefaultMark({ caption }: { caption: string }) {
  return (
    <g fill="none" stroke="#161615" strokeWidth="1">
      <rect x="40" y="36" width="720" height="428" opacity="0.18" />
      <rect x="140" y="120" width="520" height="260" opacity="0.45" />
      <line x1="180" y1="180" x2="520" y2="180" opacity="0.28" />
      <line x1="180" y1="220" x2="460" y2="220" opacity="0.18" />
      <line x1="180" y1="260" x2="400" y2="260" opacity="0.18" />
      <circle cx="600" cy="300" r="12" opacity="0.5" />
      <VisualCaption caption={caption} />
    </g>
  );
}
