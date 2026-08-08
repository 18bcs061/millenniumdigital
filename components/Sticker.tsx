import { cn } from "@/lib/cn";

const VARIANTS = {
  hot: "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
  new: "bg-gradient-to-br from-brand-secondary to-cyan-400 text-white",
  sale: "bg-gradient-to-br from-brand-primary to-fuchsia-500 text-white",
  bestseller: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
};

export function Sticker({
  children,
  variant = "hot",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "animate-sticker inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg ring-2 ring-white/70",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
