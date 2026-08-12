import type { ReactNode } from "react";

export type ContentCardProps = {
  /** Main column — title, description, actions. */
  children: ReactNode;
  /** Second column — usually a MetadataList. Omit for a single column. */
  aside?: ReactNode;
  className?: string;
};

/**
 * Title block for the case hero — centered over the cover.
 */
export default function ContentCard({
  children,
  aside,
  className,
}: ContentCardProps) {
  return (
    <div className={"chCard" + (className ? ` ${className}` : "")}>
      {aside ? (
        <div className="chCardGrid">
          <div className="chLead">{children}</div>
          <div className="chAside">{aside}</div>
        </div>
      ) : (
        <div className="chLead">{children}</div>
      )}
    </div>
  );
}
