// koto's text entrance: lines rise from one line-height below, behind an
// overflow-hidden mask — 650ms cubic-bezier(0.36,0.54,0,0.99), staggered.
// Shared by the case studies, the about page and the case hero so every
// title in the site enters the same way.
export default function Rise({
  show,
  delay = 0,
  children,
}: {
  show: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="riseMask">
      <div
        className="riseInner"
        style={{
          transform: show ? "translateY(0%)" : "translateY(110%)",
          transition: show
            ? `transform 650ms cubic-bezier(0.36, 0.54, 0, 0.99) ${delay}ms`
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
