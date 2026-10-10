"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "blur-up" | "fade";

const variants: Record<
  RevealVariant,
  { initial: Record<string, number | string>; animate: Record<string, number | string> }
> = {
  "fade-up": {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
  },
  "blur-up": {
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

/** Scroll reveal — Magic UI BlurFade + Motion Primitives style. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "blur-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const reduce = useReducedMotion();
  const v = variants[variant];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
