# Design System Documentation: The Architectural Sanctuary

## 1. Overview & Creative North Star
### Creative North Star: "The Architectural Sanctuary"
Management of property and community (Syndic) requires a visual language that balances authoritative trust with domestic serenity. This design system rejects the "utilitarian template" look in favor of an **Architectural Sanctuary**. 

We achieve this by treating the mobile screen not as a flat canvas, but as a series of curated, layered spaces. By utilizing intentional asymmetry, expansive white space, and high-contrast typography scales, we move the user through the Arabic (RTL) interface with the grace of a physical gallery. We prioritize **Tonal Depth** over structural borders, creating a premium experience that feels high-end, custom, and calm.

---

## 2. Colors: Tonal Atmosphere
The palette is anchored in a professional "Modern Blue" hierarchy, supported by a sophisticated range of greys that define space without the need for intrusive lines.

*   **Primary Identity:** Use `primary` (#0058bc) for core brand moments and `primary_container` (#0070eb) for interactive depth.
*   **The "No-Line" Rule:** To maintain a high-end editorial feel, **1px solid borders are prohibited** for sectioning content. Boundaries must be defined by shifts in background color. For example, a card using `surface_container_lowest` should sit atop a `surface` background.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of fine paper. 
    *   **Base:** `surface` (#f8f9fa).
    *   **Interactive Cards:** `surface_container_lowest` (#ffffff).
    *   **Secondary Zones:** `surface_container_high` (#e7e8e9) for nested elements like search bars or inactive tabs.
*   **The "Glass & Gradient" Rule:** For floating elements (Bottom Nav, FABs), use `surface_container_lowest` with an 80% opacity and a `backdrop-blur` of 20px. This "frosted" effect prevents the UI from feeling "pasted on."
*   **Signature Textures:** For primary CTAs (e.g., "Pay Dues"), use a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide visual "soul."

---

## 3. Typography: The Editorial Script
Since the focus is Arabic (RTL), we utilize the **Cairo** font family to bridge the gap between geometric modernism and traditional calligraphic flow.

*   **Display & Headline (Cairo):** Use `headline-lg` (2rem) for dashboard totals and "Welcome" greetings. These should have a tighter letter-spacing and a bold weight to command authority.
*   **Title (Cairo):** Use `title-lg` (1.375rem) for card headers. Ensure generous line-height (leading) to accommodate the tall ascenders and descenders of the Arabic script.
*   **Body (Cairo):** `body-md` (0.875rem) is the workhorse. It must be set in `on_surface_variant` (#414755) to reduce eye strain and increase the "premium" feel.
*   **Hierarchy Note:** Always align text to the right. Use asymmetric margins (e.g., `spacing-8` on the right, `spacing-10` on the left) for headers to create a dynamic, editorial rhythm that leads the eye across the content.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create **presence**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface_container_lowest` card placed on a `surface` background creates a natural lift.
*   **Ambient Shadows:** When a card requires a floating state (e.g., an active payment card), use a shadow with a blur of 32px and a 4% opacity of the `on_surface` color. The shadow should feel like a soft glow of ambient light, not a dark smudge.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use a "Ghost Border": the `outline_variant` token at 15% opacity. Never use 100% opaque lines.
*   **Roundedness:** All primary containers must use the `md` (1.5rem/24px) or `lg` (2rem/32px) corner radius. This softness communicates a modern, friendly, and high-end residential atmosphere.

---

## 5. Components

### Cards & List Items
*   **Rule:** Forbid the use of divider lines between items.
*   **Execution:** Use `spacing-4` (1rem) of vertical white space to separate card-based list items. 
*   **Style:** `surface_container_lowest` background, `md` rounded corners, and a subtle `surface_dim` ambient shadow on hover/press.

### Bottom Navigation Bar
*   **Style:** A floating "Island" layout rather than a edge-to-edge bar. 
*   **Background:** Glassmorphism (semi-transparent `surface_container_lowest` with blur). 
*   **Active State:** Use a soft `primary_container` pill behind the active icon, rather than just changing the icon color.

### Floating Action Button (FAB)
*   **Shape:** Do not use a perfect circle. Use a "Squircle" (roundedness `md`).
*   **Color:** Gradient of `primary` to `primary_container`.
*   **Position:** For RTL, the FAB should typically sit on the bottom-left to balance the flow of text starting from the right.

### Progress Bars & Charts
*   **Circular Progress:** Use `primary` for the progress track and `surface_container_high` for the empty track. The stroke should be "Cap: Round" to match the system's roundedness.
*   **Bar Charts:** Use varied widths for bars to create a more organic, less "Excel-like" feel. Use `primary` for current data and `secondary_container` (#a1befd) for historical data.

### Input Fields
*   **Style:** "Filled" style using `surface_container_low`. 
*   **Active State:** No heavy border. Instead, shift the background to `surface_container_lowest` and add a 2px `primary` ghost-border at 30% opacity.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use vertical white space (Spacing 6 to 10) to separate logical sections.
*   **Do** lean into the RTL flow; ensure icons that indicate direction (arrows) are mirrored.
*   **Do** use `tertiary` (#9e3d00) sparingly for "Urgent" syndic alerts or late fee warnings—it creates a sophisticated contrast against the blue.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on_surface` or `on_surface_variant` for a softer, premium look.
*   **Don't** use 90-degree sharp corners. This violates the "Sanctuary" principle.
*   **Don't** clutter the dashboard. If a piece of information isn't vital, move it to a "View More" layer. Editorial design is about curation.