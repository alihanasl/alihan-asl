"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function ClipReveal({
  children,
  className,
  delay = 0,
}: Omit<RevealProps, "y">) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="clip-rise" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </div>
  );
}
