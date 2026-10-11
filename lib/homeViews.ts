// Homepage layouts offered by the top-right view switcher. Order is spatial:
// switching slides the incoming view in from the side it sits on.
// "wall" (the drifting image grid) isn't in the switcher; it's only reachable
// through its original /?view=grid link.
/** Off: no top-right switcher and no way into the editorial view (even via
 * ?view=stack); the homepage is always split. Flip on to bring it back. */
export const VIEW_SWITCHER_ENABLED = false;

export type SwitcherView = "split" | "stack";
export type HomeView = SwitcherView | "wall";

export const HOME_VIEWS: { id: SwitcherView; label: string }[] = [
  { id: "split", label: "Split view" },
  { id: "stack", label: "Editorial view" },
];

/** `?view=` value → view. */
export function parseHomeView(param?: string): HomeView {
  if (param === "grid") return "wall";
  if (!VIEW_SWITCHER_ENABLED) return "split";
  return HOME_VIEWS.some((v) => v.id === param) ? (param as HomeView) : "split";
}

export function homeViewHref(view: HomeView): string {
  if (view === "wall") return "/?view=grid";
  return view === "split" ? "/" : `/?view=${view}`;
}
