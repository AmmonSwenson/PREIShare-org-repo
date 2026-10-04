# PREIshare dashboard — responsive QA checklist

**Tester:** Ammon Swenson
**Date:** 2026-10-04
**App URL tested:** http://127.0.0.1:43123/dashboard
**Build / branch:** main

## Breakpoints used

| Name    | Width  | How to set                          |
|---------|--------|-------------------------------------|
| Mobile  | 375px  | Devtools device toolbar             |
| Tablet  | 768px  | Devtools device toolbar             |
| Desktop | 1280px | Devtools device toolbar             |

## How to use this sheet

1. Load the dashboard route with the dev server running.
2. For each row, set the width, perform the check, mark **Pass** or **Fail**.
3. On Fail, write a short **Symptom** and which **file** you will ask the agent to touch.
4. After a targeted fix, re-test and update **Status** and **Fix notes**.
5. Critical rows must Pass (or be listed under Known limitations with stakeholder-safe wording).

Measurements: `document.documentElement.scrollWidth` equaled `clientWidth` at 375, 768, and 1280 (no extra horizontal overflow on `#main-content`).

---

## Mobile (~375px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| M1 | No horizontal page scroll | Pass | `scrollWidth` 375 / `clientWidth` 375. Cards and empty copy wrap. | n/a |
| M2 | Header remains visible and usable | Pass | PREIshare brand + Overview label stay in the top bar; user chip shows initials. | n/a |
| M3 | Desktop sidebar is hidden or off-canvas (not permanently covering content) | Pass | `aside` `display: none`; sidebar width 0. Main content is full 375px. | n/a |
| M4 | MobileNav or menu control is visible | Pass | “Open menu” sits under the header. | Raised control to 44px in cycle 1 (see T6). |
| M5 | Menu opens and closes navigation links | Pass | Click Open menu → Close menu + Home / Portfolio / Deals / Profile. Click Close menu → panel hides; home content remains. | n/a (behavior already wired in MobileNav `useState`) |
| M6 | Main content readable without pinched text | Pass | Intro, metric hints, and empty copy wrap at 16px padding; no clipped sentences. | n/a |
| M7 | Metric cards stack in a single column (or intentional narrow grid) | Pass | Three metric rows (`grid` default 1 col; `sm:grid-cols-2` is 640px+). | n/a |
| M8 | PortfolioSummary does not overflow or clip | Pass | Empty-state paragraph fully visible; same left edge as metrics (16px). | n/a |
| M9 | RecentActivity list wraps; no cut-off timestamps/labels | Pass | Empty-state copy visible below Portfolio summary (stacked). No timestamps on empty list. | n/a |
| M10 | Empty-state messaging (if shown) is fully visible | Pass | Holdings and activity empty messages are complete, not truncated. | n/a |

## Tablet (~768px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| T1 | No horizontal page scroll | Pass | Doc and main `scrollWidth` match `clientWidth` (768 / main 528 beside 240px sidebar). | n/a |
| T2 | Navigation pattern matches plan (sidebar, rail, or menu—not both fighting) | Pass | Architecture: sidebar from 768px up. Sidebar `display: block` (240px). MobileNav `md:hidden` (0×0). | n/a |
| T3 | Header + content spacing not cramped | Pass | Header ~67px; main `md:p-6`; title and cards have clear gaps. | n/a |
| T4 | Metric cards use a sensible 2-column (or planned) layout | Pass | Two columns, third card wraps (`sm:grid-cols-2`, two metric rows). | n/a |
| T5 | PortfolioSummary and RecentActivity share space without overlap | Pass | Stacked (same left 264px; activity below). `lg:grid-cols-5` starts at 1024px per architecture desktop split. No overlap. | n/a |
| T6 | Touch targets / click targets large enough to use | Pass | First fail: Open menu measured 38px tall. After cycle 1, menu button is 44px (`min-h-11`); sidebar/mobile links also `min-h-11`. | Cycle 1: MobileNav.tsx + Sidebar.tsx |

## Desktop (~1280px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| D1 | Sidebar visible and usable per architecture | Pass | 240px left nav with Home, Portfolio, Deals, Profile. Links remain clickable after the mobile min-height change. | Re-tested after cycle 1 — no regression |
| D2 | MobileNav hidden or not duplicating full sidebar awkwardly | Pass | Open menu not visible (0×0). Only sidebar nav shows. | n/a |
| D3 | Main region has comfortable padding/margins | Pass | Main ~1040px with `p-4 md:p-6`; content not stuck in a narrow column. | n/a |
| D4 | Metric cards align in a multi-column row as planned | Pass | Three cards in one row (`xl:grid-cols-3` at 1280px). | n/a |
| D5 | PortfolioSummary + RecentActivity sit in intended regions | Pass | Side by side (`lg:col-span-3` / `lg:col-span-2`); same top edge (~341px). | n/a |
| D6 | Long labels/numbers do not break the header or sidebar width | Pass | Header uses `truncate` + `min-w-0`. Sidebar stays 240px. Placeholder “—” values do not overflow. | n/a |

## Cross-cutting issues

| ID | Check | Status | Notes |
|----|--------|--------|-------|
| X1 | Focus order / keyboard: menu and links reachable | Pass | Native `<button>` and TanStack `<Link>` (anchor) controls. Not a full screen-reader audit. |
| X2 | No layout jump when opening/closing mobile menu | Fail (known limitation) | Menu is in-flow, so opening it pushes home content down instead of overlaying. Acceptable for this beginner MobileNav; overlay drawer deferred. |
| X3 | Stacking order: important metrics appear before low-priority lists on small screens | Pass | Order is intro → metrics → Portfolio summary → Recent activity at 375px. |

## Targeted fix log (one row per prompt cycle)

| Cycle | Breakpoint | File(s) touched | Prompt summary (one sentence) | Result after re-test |
|-------|------------|-----------------|-------------------------------|----------------------|
| 1 | 375px (T6); re-check 1280px | `src/components/dashboard/MobileNav.tsx`, `src/components/dashboard/Sidebar.tsx` | At 375px the Open menu control was 38px tall; add `min-h-11` (44px) on the toggle and nav links only — do not rewrite AppShell or widgets. | Pass: button 44×101px; menu still opens/closes; overflow still 0; desktop sidebar still visible and MobileNav still hidden at 1280px. |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## Known limitations (optional)

List anything still imperfect that you are **not** fixing in this sprint, with a reason (e.g. “Chart library deferred to next topic”).

- **X2 — in-flow mobile menu:** Opening MobileNav expands the top of the page and shifts main content down. An overlay/drawer would remove that jump; it is out of scope for this QA pass so we do not rewrite navigation state or AppShell.
- **`body { overflow-x: hidden }` in `src/styles.css`:** Marketing chrome already clips stray overflow. Dashboard QA still measured `scrollWidth === clientWidth` at all three widths, so this was not used as a substitute for a real overflow check.
- **Live data and charts:** Empty-state copy is intentional. No chart library in this sprint.

## Sign-off

- [x] Critical mobile checks M1–M7 pass
- [x] Critical tablet checks T1–T5 pass
- [x] Critical desktop checks D1–D5 pass
- [x] Fix log filled for every change made during QA
- [x] Touched components still match the architecture (no accidental full rewrite)

**Ready for stakeholder handoff draft:** Yes
