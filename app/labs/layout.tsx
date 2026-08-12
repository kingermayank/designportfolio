import type { ReactNode } from "react";

/** Minimal chrome for iframeable design-engineering labs. */
export default function LabsLayout({ children }: { children: ReactNode }) {
  return <div className="labRoot">{children}</div>;
}
