import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizes = {
    small: { width: 140, height: 35 },
    default: { width: 180, height: 45 },
    large: { width: 240, height: 60 }
  };

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src="/klaralyze_logo.svg"
        alt="Klaralyze"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        className="object-contain transition-all duration-300"
        style={{
          filter: className.includes("white") ? "brightness(0) saturate(100%) invert(100%)" : "none"
        }}
      />
    </Link>
  );
} 