import { ThemedImage } from "@/components/ui/themed-image";
import { cn } from "@/lib/utils";

export function SectionMediaStrip({
  src,
  alt,
  caption,
  aspect = "21/9",
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure className={cn("relative w-full", className)}>
      <ThemedImage
        src={src}
        alt={alt}
        className={cn(
          "w-full",
          aspect === "4/3" ? "aspect-[4/3]" : aspect === "16/9" ? "aspect-video" : "aspect-[21/9]",
        )}
        sizes="(max-width: 768px) 100vw, 80rem"
        grade="olive"
      />
      {caption ? (
        <figcaption className="mt-2 text-xs text-[var(--muted)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
