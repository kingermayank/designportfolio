# UI component setup

This project already uses TypeScript (`tsconfig.json`, `@/*` alias) and Framer Motion. No additional dependency is needed for the hover preview.

General components live in `/components`, global styles in `/app/globals.css`, and component styles beside their components. Reusable UI primitives now have `/components/ui`, the conventional shadcn location. Keeping primitives there makes generated components and imports predictable, separate from portfolio features.

The hover preview uses a CSS Module equivalent of the supplied Tailwind styles so it works with the current styling setup. Tailwind and shadcn are not currently configured.

## Optional Tailwind and shadcn setup

1. Install Tailwind for the existing Next.js app:

   ```sh
   npm install -D tailwindcss @tailwindcss/postcss
   ```

2. Create `postcss.config.mjs`:

   ```js
   export default { plugins: { "@tailwindcss/postcss": {} } };
   ```

3. Add Tailwind imports at the top of `/app/globals.css`. To preserve the portfolio's existing reset, omit Tailwind's preflight:

   ```css
   @layer theme, base, components, utilities;
   @import "tailwindcss/theme.css" layer(theme);
   @import "tailwindcss/utilities.css" layer(utilities);
   ```

4. Initialize shadcn, select the existing app, and keep the UI alias as `@/components/ui` and CSS path as `app/globals.css`:

   ```sh
   npx shadcn@latest init
   ```

   Review generated global styles before adopting them: shadcn's theme and reset may affect the current portfolio styling.
