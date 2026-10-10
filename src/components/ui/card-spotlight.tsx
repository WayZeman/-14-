"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Card with restrained cursor spotlight — Aceternity Card Spotlight pattern. */
export function CardSpotlight({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [reduce],
  );

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "group relative h-full overflow-hidden border border-white/10 bg-white/[0.03] p-6",
        "transition-[border-color,background-color] duration-300",
        "hover:border-[var(--accent)]/40 hover:bg-white/[0.05]",
        className,
      )}
    >
      {!reduce && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: active
              ? `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(92,107,74,0.22), transparent 55%)`
              : undefined,
          }}
          aria-hidden
        />
      )}
      <div className="relative z-[1]">
        {index ? (
          <div className="font-mono text-xs text-[var(--accent)]">{index}</div>
        ) : null}
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent)]/70 transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </motion.article>
  );
}
