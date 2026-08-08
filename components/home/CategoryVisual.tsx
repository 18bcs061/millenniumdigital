import Image from "next/image";

const CATEGORY_IMAGES: Record<string, string> = {
  sensors: "/products/t6743-40k-e-1.webp",
  semiconductors: "/products/24cs256t-e-sm-1.webp",
  "embedded-solutions": "/products/83325-2-500-01-1.webp",
  optoelectronics: "/products/sp350yrgnq-1.webp",
};

const PALETTE: Record<string, [string, string]> = {
  sensors: ["#7c3aed", "#06b6d4"],
  semiconductors: ["#4f46e5", "#a78bfa"],
  "embedded-solutions": ["#0891b2", "#7c3aed"],
  connectors: ["#f59e0b", "#7c3aed"],
  power: ["#f97316", "#f59e0b"],
  optoelectronics: ["#06b6d4", "#f59e0b"],
};

function ConnectorIllustration({ categorySlug }: { categorySlug: string }) {
  const [c1, c2] = PALETTE[categorySlug] ?? ["#f59e0b", "#7c3aed"];
  const id = `connector-grad-${categorySlug}`;
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id})`} opacity="0.12" />
      <g transform="translate(100 100)">
        <rect x="-55" y="-30" width="110" height="60" rx="10" fill={`url(#${id})`} opacity="0.95" />
        <rect x="-45" y="-18" width="90" height="36" rx="4" fill="white" opacity="0.15" />
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <rect x={-40 + i * 20} y="30" width="8" height="20" rx="2" fill={c2} />
            <circle cx={-36 + i * 20} cy="55" r="5" fill={c1} opacity="0.85" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function PowerIllustration({ categorySlug }: { categorySlug: string }) {
  const [c1, c2] = PALETTE[categorySlug] ?? ["#f97316", "#f59e0b"];
  const id = `power-grad-${categorySlug}`;
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id})`} opacity="0.12" />
      <g transform="translate(100 100)">
        <rect x="-34" y="-50" width="68" height="100" rx="14" fill={`url(#${id})`} opacity="0.95" />
        <rect x="-14" y="-62" width="28" height="14" rx="4" fill={c1} />
        <rect x="-24" y="-34" width="48" height="10" rx="2" fill="white" opacity="0.25" />
        <rect x="-24" y="-14" width="30" height="10" rx="2" fill="white" opacity="0.25" />
        <rect x="-24" y="6" width="40" height="10" rx="2" fill="white" opacity="0.25" />
        <path d="M10 -30 L-14 10 L2 10 L-8 42 L22 -2 L4 -2 Z" fill="white" opacity="0.9" />
      </g>
    </svg>
  );
}

export function CategoryVisual({ categorySlug, name }: { categorySlug: string; name: string }) {
  const image = CATEGORY_IMAGES[categorySlug];
  const [c1, c2] = PALETTE[categorySlug] ?? ["#7c3aed", "#06b6d4"];

  if (image) {
    return (
      <div className="relative h-full w-full" style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}22)` }}>
        <Image src={image} alt={name} fill className="object-contain p-6 drop-shadow-xl" sizes="(max-width: 768px) 50vw, 220px" />
      </div>
    );
  }

  if (categorySlug === "connectors") return <ConnectorIllustration categorySlug={categorySlug} />;
  if (categorySlug === "power") return <PowerIllustration categorySlug={categorySlug} />;

  return <ConnectorIllustration categorySlug={categorySlug} />;
}
