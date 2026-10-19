import Link from "next/link";

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Nova Stride home" className={`font-display font-extrabold tracking-tight ${className}`}>
      NOVA <span className="text-volt">STRIDE</span>
    </Link>
  );
}
