---
name: Luxcerie
description: White and off-white luxury retail with metallic gold actions, blush glass, precise geometry and real product photography.
colors:
  gold: "#c5a059"
  ground: "#fdfbf8"
  panel: "#ffffff"
  ink: "#2b2723"
  muted: "#6e665d"
  line: "#e3d9ce"
  logo-ground: "#ffffff"
  gold-ink: "#85611d"
  gold-hover: "#b58e45"
  gold-wash: "#f4ead7"
  control-line: "#a17b36"
  pink: "#f8efed"
typography:
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(60px, 6.6vw, 96px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "31px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  control:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "normal"
rounded:
  square: "0px"
spacing:
  compact: "10px"
  medium: "20px"
  large: "30px"
  gutter: "clamp(24px, 3.2vw, 60px)"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
  inquiry-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "20px"
  product-card:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "16px 15px 11px"
---

# Design System: Luxcerie

## Overview

**Creative North Star: "The Display Vitrine"**

Luxcerie's white and off-white glass surfaces frame real bag photography, with restrained blush warmth and metallic gold for identity and action. High-contrast serif lettering carries the identity; quieter sans-serif controls guide browsing and inquiries. Straight borders and square containers establish a precise, restrained retail presence.

**Key Characteristics:**

- Real transparent product photographs remain the focal content.
- Gold marks identity, selected states and primary actions.
- Every UI corner is square.
- Typography separates expressive identity from practical controls.

## Colors

White and off-white are the dominant surfaces. Pale blush is limited to glass and photograph backgrounds; metallic gold identifies actions, trust and selection. Deep gold keeps small text and icons readable on light surfaces.

### Primary

- **Metallic Gold (`#C5A059`):** Primary action fills, matching the LC logo.
- **Deep Gold (`#85611D`):** Brand wordmarks, trust signals, pagination, selected navigation, text actions and focus.
- **Hover Gold (`#B58E45`):** Primary action hover fill.
- **Gold Wash (`#F4EAD7`):** Selected glass and menu hover surfaces.
- **Control Gold (`#A17B36`):** Visible control borders.

### Neutral

- **Off-white Ground:** Main background.
- **White Panel:** Header, navigation, fields and glass container layer.
- **Warm Ink:** Primary text and display lettering.
- **Warm Stone:** Supporting text and descriptions.
- **Straight Rule:** Dividers and quiet borders.
- **Stage Tint (`#FAF6F1`):** Off-white transition between the white canvas and blush display surface.
- **Inactive Sequence (`#B4A99B`):** Quiet dashes for pieces outside the current selection.
- **Logo White:** Square background behind the LC monogram.
- **Blush Pink (`#F8EFED`):** Subtle glass and photograph surface warmth.

**The Gold Signal Rule.** Gold communicates identity and action; pink stays in surfaces, while product photographs provide the collection's stronger color variation.

## Typography

**Display Font:** Bodoni Moda, with Georgia and serif fallbacks.

**Body Font:** Manrope, with Arial and sans-serif fallbacks.

Both fonts are served locally. Bodoni's thin hairlines and thick vertical strokes suit the serif monogram; Manrope makes descriptions and menus legible.

The desktop display reaches 96px. Phone identity is 58px, reduced to 54px at 380px and below. Product titles generally range from 20px to 31px. Long phone brand names use a smaller display size to preserve their line. Dialog body copy is 14px; editable inquiry text is 16px. Functional labels are generally 11px–12px. Legal and compact inventory labels are 10px.

**The Role Separation Rule.** Serif type carries identity and product titles; sans-serif type carries facts, descriptions and actions.

## Layout

Desktop uses a flexible stage and a collection sidebar, with a 100px identity header and 72px bottom navigation. The sidebar uses an asymmetric two-column Bento grid, with the first product spanning both columns. At compact desktop heights, the grid scrolls internally.

At 900px and below, the collection stacks below the stage and its Bento grid scrolls horizontally. The header becomes compact; the navigation remains fixed at the bottom with safe-area padding. On short phones the document scrolls vertically, with enough bottom padding for the full collection to clear navigation. Typical mobile gutters are 20px, reduced to 16px at 380px and below. Repeated compact gaps are 8px–10px; dialog and collection separation generally use 20px–30px.

## Elevation & Depth

Cards use tonal transparency, thin borders and restrained backdrop blur. Product photographs use soft downward drop shadows; containers have no hard offset shadows. The collection's authored depth motion combines perspective scale, horizontal travel, opacity and blur. Animation eases toward the target and stops when settled. Reduced-motion mode changes selection immediately and removes transitions.

## Shapes

**The Square Rule.** All UI borders, cards, controls, fields, dividers and navigation have rigid 90-degree corners, with zero radius. Icons use consistent SVG strokes and straight joins. Real photographed bag silhouettes retain their own contours.

## Components

### Buttons

Primary actions use gold fill with dark text. Secondary actions use deep gold text and a thin gold-toned border. Hover reverses secondary color into a gold surface; focus uses a visible gold outline. Principal tap targets are at least 44px tall. Disabled inquiry choices are visibly dimmed.

### Cards / Containers

Product cards are square glass containers with a fine border. A gold-toned border distinguishes the stage's selected piece. Photographs use contain sizing. Save controls and image controls are separate targets; headers do not intercept image clicks. Desktop cards display serif brand names and supporting model names; compact mobile cells pair the image with sans-serif facts.

### Inputs / Fields

The editable inquiry message uses a white field, gold control border and warm ink text. Text is 16px with generous line height, a gold caret and user-controlled vertical resizing.

### Navigation

The bottom navigation offers Collection, Saved, Inquiry list and Our story. The active item and count use gold; other labels use the muted foreground. Phone labels sit beneath SVG icons. Drawer transitions focus the new heading and reset internal scroll; save toggles update in place to preserve focus and scroll.

### Collection motion

The stage supports wheel, horizontal drag, arrow keys and explicit previous/next controls. Selection wraps across all five bags. Phone bag scale is bounded by the space between hero facts and product details, preserving photographic proportions.

## Do's and Don'ts

### Do:

- **Do** keep real product photographs dominant and preserve transparent contours.
- **Do** use gold to identify actions and selected states.
- **Do** retain visible focus, reduced-motion support and mobile safe-area spacing.
- **Do** ask for product price and availability through the inquiry flow when those facts are unavailable.

### Don't:

- **Don't** introduce curved corners into UI components.
- **Don't** replace bag photography with decorative illustration.
- **Don't** invent prices, availability, certification records or perfume inventory.
- **Don't** use the decorative wordmark tracking as a style for long body copy.
