// components/ui/Skeleton.tsx
import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle";
  width?: number | string;
  height?: number | string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rect",
  width,
  height,
  count = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-700/50 rounded-md";
  
  const variantClasses = {
    rect: "rounded-md",
    circle: "rounded-full",
  };

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  ));

  return <>{skeletons}</>;
};

export default Skeleton;