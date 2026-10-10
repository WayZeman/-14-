import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";

type LinkButtonProps = Omit<React.ComponentProps<typeof Link>, "className"> &
  Pick<ButtonProps, "variant" | "size"> & {
    className?: string;
  };

export function LinkButton({
  href,
  className,
  variant,
  size,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}
