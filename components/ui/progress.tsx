"use client";

import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, className = "", ...props }, ref) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    return (
      <div
        className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-blue-600 transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
