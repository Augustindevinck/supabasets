"use client";

import React from "react";

export const BackgroundGrid = ({
  dotSize = 1,
  dotOpacity = 0.3,
}: {
  dotSize?: number;
  dotOpacity?: number;
} = {}) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="20"
              cy="20"
              r={dotSize}
              fill="currentColor"
              opacity={dotOpacity}
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          className="text-slate-400"
        />
      </svg>
    </div>
  );
};
