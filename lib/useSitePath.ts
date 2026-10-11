"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { baseOf, toSite } from "@/lib/sitePath";

/** `(publicPath) => href` under the current root; safe during SSR. */
export function useSiteHref() {
  const base = baseOf(usePathname() ?? "/");
  return useCallback((path: string) => toSite(path, base), [base]);
}
