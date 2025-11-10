import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatDate = (iso: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(options ?? {}),
  });
