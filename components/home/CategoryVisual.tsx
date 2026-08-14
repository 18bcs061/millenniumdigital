import Image from "next/image";

const CATEGORY_IMAGES: Record<string, string> = {
  sensors: "/products/t6743-40k-e-1.webp",
  semiconductors: "/products/24cs256t-e-sm-1.webp",
  "embedded-solutions": "/products/83325-2-500-01-1.webp",
  optoelectronics: "/products/sp350yrgnq-1.webp",
  connectors: "/products/edge-iot-nrf52840-1.webp",
  power: "/products/power-converter-modules-1.jpg",
};

const PALETTE: Record<string, [string, string]> = {
  sensors: ["#9b1b5c", "#e0508c"],
  semiconductors: ["#6e1240", "#c9578f"],
  "embedded-solutions": ["#75787b", "#9b1b5c"],
  connectors: ["#e0508c", "#54575a"],
  power: ["#b83b71", "#e0508c"],
  optoelectronics: ["#9b1b5c", "#75787b"],
};

/** Defensive fallback only — every current category has a real photo above. */
function GenericIllustration({ categorySlug }: { categorySlug: string }) {
  const [c1, c2] = PALETTE[categorySlug] ?? ["#e0508c", "#54575a"];
  const id = `generic-grad-${categorySlug}`;
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

export function CategoryVisual({ categorySlug, name }: { categorySlug: string; name: string }) {
  const image = CATEGORY_IMAGES[categorySlug];
  const [c1, c2] = PALETTE[categorySlug] ?? ["#9b1b5c", "#e0508c"];

  if (image) {
    return (
      <div className="relative h-full w-full" style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}22)` }}>
        <Image src={image} alt={name} fill className="object-contain p-6 drop-shadow-xl" sizes="(max-width: 768px) 50vw, 220px" />
      </div>
    );
  }

  return <GenericIllustration categorySlug={categorySlug} />;
}
