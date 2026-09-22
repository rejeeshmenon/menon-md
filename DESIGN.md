# Design System: menon.md

## Visual Theme & Atmosphere

A printed academic CV that learned modern web craft. White paper, near-black ink, a single institutional navy for headings and links, and a muted gold used only for hairline rules and section labels. Generous whitespace, a narrow prose column, and typographic hierarchy doing all the work. No gradients, no glass, no shadows, no icons, no emoji. Dark mode is a response to `prefers-color-scheme` only: deep blue-black paper, warm off-white ink, lightened navy and gold.

## Color Palette & Roles

Light (default)

- Paper `#FFFFFF`: page background.
- Ink `#14181F`: body text.
- Navy `#1F3A5F`: headings, links, display numbers.
- Navy hover `#162B47`.
- Gold `#8A6A24`: section labels and hairline rules (contrast against white 5.3:1 for small text).
- Muted `#4F5864`: secondary text, dates, sublabels (contrast 7.4:1).
- Hairline `#E3E6EA`: borders and rules.
- Tint `#F5F7FA`: banner and code background, used sparingly.

Dark (`prefers-color-scheme: dark`)

- Paper `#0E1420`, Ink `#EDE8DF`, Navy `#8FB2DE`, Navy hover `#B3CCEB`, Gold `#D2B36A`, Muted `#A3ACBA`, Hairline `#25314A`, Tint `#141C2B`.

Print: black on white, links show their URL for primary profiles, nav and chat hidden.

## Typography

- Display and headings: Georgia, "Times New Roman", Times, serif. Weight 400, `text-wrap: balance`. Letter-spacing -0.01em on the name only.
- Body: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif. 17px/1.6 on desktop, 16px on mobile. `text-wrap: pretty` on prose.
- Section labels: body sans, 0.78rem, `font-variant: small-caps`, letter-spacing 0.12em, gold. This is a deliberate single-device tied to the printed-CV register and is used once per section, never as decoration elsewhere.
- Display numbers (stat tiles): serif, 2.5rem, navy, tabular figures.
- Scale: 0.78 / 0.9 / 1 / 1.15 / 1.4 / 1.8 / 2.5 rem.

## Layout & Spacing

- Single column, max-width 72ch for prose; 76rem shell for nav and the stat row.
- Vertical rhythm on an 8px grid: sections separated by 4rem desktop, 3rem mobile, with a 1px gold hairline above each section label.
- Stat tiles: four cells in one row on desktop (grid, auto-fit 160px), two per row on mobile; hairline borders between cells, no fills, no icons.
- Entries (roles, projects) use a two-line header: title on the left, date range right-aligned in muted; body bullets under it. On mobile the date drops below the title.
- Sticky top nav: 48px, paper background with hairline bottom border, anchor links in body sans 0.9rem, active item underlined in gold.

## Components

- Hero: name (h1), degree, headline, subheadline, location and email in an `address`, primary links inline separated by hairline dots.
- StatTiles: four cells (value, label, sublabel).
- SectionHeading: hairline rule, small-caps label, h2 in serif.
- Entry: header row, meta, bullet list.
- Publication: numbered list, citation text, identifier links (DOI, PMID) in muted with navy on hover.
- ChatLauncher: fixed bottom-right text button "Ask about my work", paper background, hairline border, navy text. Hidden in print. Degrades to a link to /chat.
- Banner (audience pages): tinted box with hairline border; greeting, company and role, three bullets, disclosure line.

## Motion

Almost none. Nav active-state underline transitions 150ms ease-out. Chat widget fades in 200ms. Everything respects `prefers-reduced-motion: reduce` by dropping to instant.
