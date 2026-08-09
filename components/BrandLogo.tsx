import Image from "next/image";
import { cn } from "@/lib/cn";

const MONOGRAM_COLORS = [
  ["#9b1b5c", "#6e1240"],
  ["#e0508c", "#9b1b5c"],
  ["#75787b", "#54575a"],
  ["#c9578f", "#9b1b5c"],
  ["#54575a", "#2e2f30"],
];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return MONOGRAM_COLORS[hash % MONOGRAM_COLORS.length];
}

export function BrandLogo({
  name,
  logoUrl,
  className,
  size = 40,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
  size?: number;
}) {
  if (logoUrl) {
    return (
      <div
        className={cn("relative flex items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200", className)}
        style={{ width: size, height: size }}
      >
        <Image src={logoUrl} alt={`${name} logo`} fill className="object-contain p-1" sizes={`${size}px`} />
      </div>
    );
  }

  const [from, to] = colorFor(name);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn("flex items-center justify-center rounded-xl font-heading font-bold text-white shadow-sm", className)}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${from}, ${to})`, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
