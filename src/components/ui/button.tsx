import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center rounded-[var(--radius-sm)] text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--ink-inverse)] hover:bg-[var(--accent-hover)] focus-visible:ring-offset-[var(--paper)]",
        secondary:
          "border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 focus-visible:ring-offset-[var(--graphite)]",
        ghost: "text-white hover:bg-white/10 focus-visible:ring-offset-[var(--graphite)]",
        dark: "bg-[var(--graphite)] text-white hover:bg-[var(--graphite-soft)] focus-visible:ring-offset-[var(--paper)]",
        outline:
          "border border-[var(--line)] bg-transparent text-[var(--graphite)] hover:border-[var(--olive)] hover:bg-[var(--olive)]/5 focus-visible:ring-offset-[var(--paper)]",
        outlineOnDark:
          "border border-white/25 bg-transparent text-white hover:border-[var(--accent)]/60 hover:bg-white/5 focus-visible:ring-offset-[var(--graphite)]",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
