import type { ReactNode } from "react";

export type PrimaryButtonProps = {
  children: ReactNode;
  /** Renders an anchor when set, a button otherwise. */
  href?: string;
  onClick?: () => void;
  /** Outlined instead of filled — for a secondary action beside the primary. */
  variant?: "solid" | "ghost";
  /** Trailing glyph. Pass null to drop it. */
  icon?: ReactNode;
  className?: string;
};

/** Relative hrefs stay in-tab; anything off-site opens safely in a new one. */
function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  variant = "solid",
  icon = null,
  className,
}: PrimaryButtonProps) {
  const cls =
    "chBtn" +
    (variant === "ghost" ? " chBtnGhost" : "") +
    (className ? ` ${className}` : "");

  const body = (
    <>
      <span>{children}</span>
      {icon ? (
        <span className="chBtnIcon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (href) {
    const external = isExternal(href);
    return (
      <a
        className={cls}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {body}
      </a>
    );
  }

  return (
    <button className={cls} type="button" onClick={onClick}>
      {body}
    </button>
  );
}
