import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Logo({ size = 'medium', className }: LogoProps) {
  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 }
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <Image
        src="/klaralyze_icon.svg"
        alt="Klaralyze"
        width={dimensions[size].width}
        height={dimensions[size].height}
        className="object-contain brightness-0 invert"
        priority
      />
    </div>
  );
} 