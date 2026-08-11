import type { CSSProperties, ReactNode } from "react";

export type ContentCardProps = {
  /** Main column — eyebrow, title, description, actions. */
  children: ReactNode;
  /** Second column — usually a MetadataList. Omit for a single column. */
  aside?: ReactNode;
  /** Override the pull-up over the image, e.g. "0px" to sit flush below it. */
  overlap?: string;
  className?: string;
};

/**
 * The block that overlaps the hero image. Pulled up by a negative margin, so
 * the image keeps its full height and only the card moves.
 */
export default function ContentCard({
  children,
  aside,
  overlap,
  className,
}: ContentCardProps) {
  const style: CSSProperties & Record<string, string | undefined> = {};
  if (overlap) style["--ch-overlap"] = overlap;

  return (
    <div className={"chCard" + (className ? ` ${className}` : "")} style={style}>
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
