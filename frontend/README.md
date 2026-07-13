# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# RunPeak — Frontend Scaffold

## Overview
This is a working React + TypeScript scaffold that implements the full RunPeak e-commerce mockup
(`RunPeak.dc.html` and its supporting design components in the design project) as real, routable
pages for your existing Vite + React 19 + TypeScript app (`frontend/`).

## About these files
These files are **application source code**, built to drop into your existing `frontend/` Vite
project — not a static HTML reference. They reuse your existing tooling (Vite, TypeScript, React 19)
and add no new build system. The only new runtime dependency is `react-router-dom` for page
navigation (see Setup below).

## Fidelity
High-fidelity. Colors, typography, spacing, copy, and layout are carried over directly from the
approved HTML mockup (`RunPeak.dc.html`). Some interactions are simplified for a scaffold:
- Login/Register and "Continuar con Google" are UI-only (no real auth) — buttons navigate to Home.
- Cart/favorites/admin state live in a single React Context (`AppContext`) with in-memory state,
  not persisted or backed by an API. Replace with your real data layer (REST/GraphQL calls, auth,
  persistence) as the next step.
- Product data (`src/data/products.ts`) is the same demo catalog used in the mockup. Swap for a
  real product API/service.

## Setup
1. Copy the contents of this folder into your `frontend/` project (merge `src/`, keeping your
   existing `main.tsx` replaced by the one included here, which just mounts `<App />`).
2. Install the one added dependency:
   ```
   npm install react-router-dom
   ```
3. Remove the unused Vite starter assets/leftovers (`react.svg`, `vite.svg`, the old counter demo)
   if you don't need them — this scaffold's `App.tsx` no longer imports them.
4. `npm run dev` — the app boots at `/` (Home) and routes to every screen below.

## Screens / Routes
| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero with size selector + Add to Cart, Why Choose Us, product grid, About, Testimonials |
| `/catalogo` | Catalog | Sidebar filters (category, brand, size, color, price) + product grid (CU-02) |
| `/producto/:id` | Product detail | Gallery, size/color/qty selectors, favorite toggle, mini-cart aside, related products |
| `/carrito` | Cart | Full-page cart: qty stepper, remove, totals (CU-03) |
| `/checkout` | Checkout | Shipping form + payment method + order summary with coupon (CU-05) |
| `/seguimiento` | Order tracking | 5-step horizontal stepper: Recibido → En preparación → Despachado → En tránsito → Entregado (CU-06) |
| `/login` | Login / Register | Tab toggle, Google button, minimal-friction fields (CU-01) |
| `/promociones` | Promotions | Banner, discounted product grid, coupon cards |
| `/favoritos` | Favorites | Saved products grid + empty state (CU-04 / RF-06) |
| `/confirmacion` | Order confirmation | Success state after checkout, order summary, CTAs (RF-08) |
| `/admin` | Admin dashboard | Own sidebar (no site header/footer): Productos (CRUD table), Promociones, Pedidos, Reportes (KPIs + charts) (CU-07 / CU-08) |

No auth gating was implemented on `/admin` or `/login` — all screens are reachable directly, as
requested for a presentation-ready prototype.

## Interactions & Behavior
- **Cart**: `AppContext` holds cart items; `addToCart`, `updateQty`, `removeItem` are shared across
  Home, Catalog, Product detail, Cart, and Checkout so the header cart badge stays in sync everywhere.
- **Favorites**: heart toggle on product cards and the product detail page; Favorites page lists
  only favorited products, with "mover al carrito" (adds to cart + un-favorites) and remove.
- **Checkout → Confirmation → Tracking**: `placeOrder()` snapshots the current cart into
  `lastOrder`, clears the live cart, then navigates to `/confirmacion`. `/seguimiento` reads
  `lastOrder` so both screens show the purchased items even though the cart is now empty.
- **Search modal**: triggered from the header search icon on every page except `/admin`. Renders
  as a fixed, dimmed overlay with an autofocused input, quick-filter chips, and a demo results grid.
- **Admin**: product/coupon "Eliminar" buttons remove rows from local state; "Editar" toggles a
  product's Activo/Agotado status as a lightweight stand-in for a real edit form; "+ Nuevo
  producto" / "+ Nueva promoción" append a placeholder row. Wire these to real mutations when you
  connect a backend.

## State Management
All shared state lives in `src/context/AppContext.tsx`:
- `cart: CartItem[]`, `favorites: string[]`, `couponApplied: boolean`, `lastOrder: LastOrder | null`
- Derived: `subtotal`, `shipping`, `discount`, `total`, `cartCount` (all `useMemo`/computed)
- Admin-only local state: `adminProducts`, `adminCoupons`, `adminOrders`
- `searchOpen: boolean` for the search modal

Local component state (not lifted): selected size/qty on Home hero and Product detail, the
Login tab toggle, and the active Admin sidebar tab.

## Design Tokens
Defined in `src/styles/tokens.css`:
- `--rp-black: #0A0A0A`, `--rp-orange: #FF4405`, `--rp-gray: #7A7A76`, `--rp-paper: #FAFAF8`
- Supporting status colors: `--rp-green: #15803d`, `--rp-red: #b91c1c`, `--rp-amber: #b45309`, `--rp-blue: #1d4ed8`
- `--font-display: 'Bebas Neue'` (headings), `--font-sans: 'Inter'` (body/UI)
- All component/page styling is in `src/styles/app.css`, using plain CSS classes (BEM-ish, prefixed
  `rp-` for shared components, page-prefixed like `home-`, `catalog-`, `detail-`, `admin-` for
  page-specific rules) — no CSS-in-JS or utility framework, to match the existing project's plain-CSS setup.

## Assets
All product/testimonial photography is placeholder imagery from Unsplash (same URLs as the
approved mockup) — replace with real product photography before shipping. The Google "G" icon in
Login is an inline SVG using Google's official brand colors.

## Files in this bundle
```
src/
  types.ts                  Shared TS interfaces (Product, CartItem, Coupon, etc.)
  data/products.ts          Demo catalog, testimonials, coupons, admin orders/report data
  context/AppContext.tsx    Cart/favorites/order/admin state + actions
  components/
    Header.tsx              Site header, nav, cart badge, search trigger
    Footer.tsx               Site footer (links, social, newsletter, admin/tracking links)
    ProductCard.tsx          Reusable product card (favorite/quick-add/stock badge/sizes are opt-in props)
    SearchModal.tsx          Search overlay
    Layout.tsx               Header + <Outlet/> + Footer + SearchModal wrapper
  pages/                    One file per route (see table above)
  styles/tokens.css          Design tokens
  styles/app.css             All component & page styles
  App.tsx                    Router setup
  main.tsx                   Entry point
```

For the original HTML design reference, see `RunPeak.dc.html` (and `RpHeader.dc.html` /
`RpFooter.dc.html`) in the design project this scaffold was generated from.
