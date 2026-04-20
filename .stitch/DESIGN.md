# Design System: Asosiy sahifa - Gulso
**Project ID:** 16543510580450364312

## 1. Visual Theme & Atmosphere
A modern, vibrant, and clean e-commerce experience tailored for a premium flowers and gifts marketplace. The atmosphere is inviting and elegant, utilizing generous whitespace with soft, warm backgrounds that make the vivid product photography stand out. It seamlessly supports both airy light mode and a sophisticated, deep dark mode.

## 2. Color Palette & Roles
- **Vibrant Rose (#e7236a)**: Primary action color. Used for prominent buttons, active navigation links, icons, and highlight badges.
- **Soft Warm White (#f8f6f7)**: Main background color in light mode, providing a gentle canvas that reduces eye strain compared to pure white.
- **Deep Espresso Night (#211117)**: Main background color in dark mode, offering a rich, premium dark surface.
- **Pure White (#ffffff) / Dark Slate (#0f172a)**: Used for elevated surfaces like cards, headers, and floating menus.
- **Slate Gray (#64748b)**: Used for secondary text, borders, and inactive states.

## 3. Typography Rules
- **Font Family**: Plus Jakarta Sans
- **Headers**: Black (800) and Bold (700) weights, with tight tracking (`tracking-tighter`) for a modern, punchy look.
- **Body**: Medium (500) and Regular (400) weights for readability.
- **Sizing**: Uses standard Tailwind text scale, with `text-[10px]` for small badges and labels.

## 4. Component Stylings
- **Buttons**: Subtly rounded corners (`rounded-lg` or `rounded-xl`). Primary buttons use solid Vibrant Rose. Secondary buttons use transparent backgrounds with hover effects (`hover:bg-[#e7236a]/5`).
- **Cards/Containers**: Generously rounded corners (`rounded-2xl` for large banners, `rounded-xl` for product cards). They feature subtle borders (`border-primary/5`) and soft shadows (`shadow-sm`) that elevate on hover (`hover:shadow-md`).
- **Inputs/Forms**: Soft, semi-transparent backgrounds (`bg-slate-100` or `bg-slate-800`), completely borderless until focused, revealing a solid primary color ring. Generous padding and fully rounded corners (`rounded-2xl`).

## 5. Layout Principles
- **Container**: Max-width is constrained to `max-w-7xl` (or `max-w-8xl` on extremely wide screens) to ensure the layout never feels too stretched or overwhelmingly large.
- **Spacing**: Generous vertical rhythm (`py-6`, `mb-12`). Components are well-separated.
- **Grid**: Responsive grid system adapting from 1-column (mobile) to 2-column (tablet) to 4-column (desktop) for product displays.
