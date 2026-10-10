"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Word-stagger reveal — inspired by Aceternity Text Generate / Motion Primitives. */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "p" | "h1" | "h2" | "span";
}) {
  const reduce = useReducedMotion();
  const lines = text.split("\n");
  /** Readable string for a11y (spaces preserved; newlines → space) */
  const accessible = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn(className)} aria-label={accessible}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ").filter(Boolean);
        return (
          <span key={lineIndex} className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
            {words.map((word, i) => (
              <motion.span
                key={`${lineIndex}-${i}-${word}`}
                className="mr-[0.28em] inline-block last:mr-0"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: delay + lineIndex * 0.12 + i * 0.045,
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
