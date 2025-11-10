"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

type ButtonProps = PropsWithChildren<
  {
    variant?: ButtonVariant;
    glow?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#00f5c4] via-[#00e0ff] to-[#00a8ff] text-black shadow-[0_0_25px_rgba(0,229,175,0.55)] hover:scale-[1.02]",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:border-[#00f5c4]/40 hover:text-[#00f5c4]",
  ghost:
    "text-white/80 hover:text-white hover:bg-white/5 border border-transparent",
  outline:
    "border border-white/20 text-white hover:border-[#00f5c4]/60 hover:text-[#00f5c4]",
};

export const Button = ({
  className,
  variant = "primary",
  glow,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      baseStyles,
      variants[variant],
      glow && "shadow-[0_0_45px_rgba(0,242,255,0.35)]",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
