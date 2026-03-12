# Skill: Add shadcn/ui Component

## Description
Add a new shadcn/ui component to the project and use it in the feed interface.

## Steps
1. Install the component:
   ```bash
   npx shadcn@latest add <component-name>
   ```
   This auto-detects Tailwind v4 and places the component in `src/components/ui/`.

2. Import and use in your component:
   ```typescript
   import { ComponentName } from "@/components/ui/component-name";
   ```

## Important Notes
- **Do NOT manually edit files in `src/components/ui/`** — they are managed by shadcn CLI
- All custom components go in `src/components/` (not the `ui/` subdirectory)
- This project uses **Tailwind v4** with CSS-first config — no `tailwind.config.js`
- Theme tokens are in `src/app/globals.css` using `@theme inline { ... }`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Icons come from `lucide-react`, not shadcn

## Available Components
card, badge, button, input, select, skeleton, separator, scroll-area, sonner (toast)
