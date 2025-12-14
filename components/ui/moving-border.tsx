"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.5rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative h-14 w-fit overflow-hidden bg-transparent p-[2.5px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      {/* Outer moving border */}
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.95]",
              borderClassName,
            )}
            style={{
              background: `radial-gradient(var(--primary-blue-medium-hex) 40%, transparent 60%)`
            }}
          />
        </MovingBorder>
      </div>

      {/* Static inner border layer */}
      <div
        className="absolute inset-0 bg-transparent pointer-events-none"
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
          border: `1.5px solid rgba(96, 165, 250, 0.7)`,
          borderColor: `hsl(var(--primary-blue-hue), var(--primary-blue-sat), var(--primary-blue-medium), 0.7)`,
        }}
      />

      {/* Button content with gradient */}
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center px-8 font-semibold antialiased transition-all",
          "bg-gradient-blue-primary hover:bg-gradient-blue-primary text-white",
          "shadow-lg",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
          boxShadow: `0 8px 16px hsl(var(--primary-blue-hue), var(--primary-blue-sat), var(--primary-blue-medium), 0.3)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
