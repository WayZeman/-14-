import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  /** Uniform documentary color grade overlay */
  grade?: "olive" | "graphite" | "none";
  /** next/image quality 1–100 (default 75 is too low for full-screen hero) */
  quality?: number;
  /** Subtle SVG noise overlay — off for sharp hero photos */
  filmGrain?: boolean;
};

const gradeClass = {
  olive: "bg-[#2a3224]/25 mix-blend-multiply",
  graphite: "bg-[var(--graphite)]/35 mix-blend-multiply",
  none: "",
};

export function ThemedImage({
  src,
  alt,
  priority = false,
  className,
  imageClassName,
  sizes = "100vw",
  fill = true,
  width,
  height,
  grade = "olive",
  quality,
  filmGrain = true,
}: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-[var(--graphite)]", className)}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={quality}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width!}
          height={height!}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      )}
      {grade !== "none" ? (
        <div className={cn("pointer-events-none absolute inset-0", gradeClass[grade])} aria-hidden />
      ) : null}
      {filmGrain ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}

/** Decorative background — empty alt, aria-hidden wrapper */
export function SectionBackdrop({
  src,
  className,
  opacity = 0.22,
}: {
  src: string;
  className?: string;
  opacity?: number;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        loading="lazy"
        sizes="100vw"
        className="object-cover"
        style={{ opacity }}
      />
      <div className="absolute inset-0 bg-[var(--graphite)]/75" />
    </div>
  );
}
