import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  // 🎨 warna dinamis berdasarkan progress
  const getColor = () => {
    if (normalizedValue >= 80) return "bg-green-500";
    if (normalizedValue >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={cn(
        "w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300", getColor())}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
