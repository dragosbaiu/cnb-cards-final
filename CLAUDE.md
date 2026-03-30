# CNB Cards – Claude Code Instructions

## Project Overview
F1 trading card e-commerce store. Monorepo with React frontend and Fastify backend.

## Stack

### Frontend (`client/`)
- React 19 + Vite + Tailwind CSS
- React Router v6
- Dependencies: `motion`, `clsx`, `tailwind-merge`, `simplex-noise`
- Fonts: Inter (Google Fonts), Perandory (custom .otf, used for hero headline & navbar brand)

### Backend (`server/`)
- Node.js + Fastify
- PostgreSQL via Supabase (hosted)
- Supabase Auth (user accounts)
- Supabase Storage (card images)
- Stripe (payments)
- Nodemailer (transactional emails via SMTP)

## Design Tokens
```
bg-primary: #FFFFFF
bg-secondary: #F8F9FA
accent: #E10600 (F1 red, use sparingly — CTAs and badges only)
text-heading: #111111
text-body: #4B5563
text-muted: #9CA3AF
border: #E5E7EB
max-width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
section-padding: py-20
card-gap: gap-6
```

## File Structure
```
cnb-cards/
├── client/                  React frontend (Vite)
│   ├── src/
│   │   ├── assets/          logo.jpg, home-cards.jpg, team-picture.jpg, fonts/perandory.otf
│   │   ├── components/      Navbar, Hero, TrustStrip, ProductGrid, ProductCard,
│   │   │                    Testimonials, ComingSoonBanner, Footer, BeamsBackground
│   │   ├── components/ui/   wave-background.tsx (interactive SVG wave animation)
│   │   ├── pages/           HomePage, ShopPage, SealedBoxesPage, AboutPage, ContactPage, NotFoundPage
│   │   ├── i18n/            translations.js
│   │   ├── context/         LanguageContext.jsx
│   │   ├── hooks/           useTranslation.js, usePageMeta.js
│   │   ├── data/            mockCards.js (to be replaced by DB)
│   │   └── lib/             utils.js (cn() helper)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                  Fastify backend
│   ├── src/
│   │   ├── routes/          API route handlers
│   │   ├── services/        Business logic (stripe, email, etc.)
│   │   └── index.js         Server entry point
│   ├── .env                 Secrets (gitignored)
│   └── package.json
├── .gitignore
└── CLAUDE.md
```

## Bilingual System
- Default: English. Secondary: Romanian.
- `LanguageContext` + `toggleLanguage` in Navbar (EN / RO button, top right)
- All strings via `t()` from `useTranslation` hook — no hardcoded strings in JSX
- String file: `client/src/i18n/translations.js` — keys in both `en` and `ro`

## Routing

### Frontend Routes
```
/                   HomePage
/shop/singles       ShopPage (F1 singles)
/shop/sealed-boxes  SealedBoxesPage (coming soon)
/about              AboutPage
/contact            ContactPage
*                   NotFoundPage (404)
```

### API Routes (to be built)
```
GET    /api/products          List products (with filters)
GET    /api/products/:id      Single product
POST   /api/checkout          Create Stripe checkout session
POST   /api/contact           Contact form submission
GET    /api/orders            User order history (authenticated)
```

## Component Rules
- Mobile-first responsive throughout
- All images need `alt` text
- Tailwind only — no inline styles
- Use `cn()` from `lib/utils.js` for conditional classes
- Animations: use `motion` (motion/react) — `whileInView` for scroll animations, `duration: 0.5`, `ease: easeOut`, `staggerChildren` for grids
- Hover on cards: `hover:shadow-lg hover:-translate-y-1 transition`

## Shop Page Features
- **Filters**: search (multi-term across driver/set/year), year dropdown, collection dropdown, condition dropdown, sort (newest/price)
- **Search logic**: splits query into words, requires all words to match against `driver + set + year`
- Year and collection options derived dynamically from product data

## Hero & About Backgrounds
- Hero and About page hero use the **Waves** component (`wave-background.tsx`) — interactive SVG wave animation using `simplex-noise`
- Props: `strokeColor="#E10600"`, `backgroundColor="#000000"`
- **BeamsBackground** is legacy (still in codebase but unused)

## SEO
- `usePageMeta` hook sets per-route `<title>`, `<meta description>`, and Open Graph tags
- All SEO strings are bilingual (EN/RO) via translation keys

## Screenshot & Comparison Workflow
When given a reference image:
1. Screenshot `localhost:5173` via Puppeteer, save as `current.png`
2. Compare `current.png` vs reference — list all differences (px-level: spacing, font size, color, alignment)
3. Fix all differences
4. Re-screenshot and compare again
5. Repeat until ≤2-3px deviation or no visible differences remain
- Minimum 2 comparison rounds before stopping
- Be specific: "heading is 32px, reference shows 24px"

## Development Workflow
- Build feature by feature
- Test each feature before moving on
- Commit and push after each feature is complete
- Use conventional commits (feat:, fix:, refactor:, etc.)

## Rules
- Match references exactly — do not improve or redesign without being asked
- One section at a time — screenshot and verify before moving to next
- If a 21st.dev component is needed, install via its page prompt/code, then wrap in a local component
- Server secrets (.env, credentials) must never be committed or exposed to the frontend
- Frontend and backend are deployed independently

## V2 Feature Build Order
1. ~~Restructure to monorepo~~ (move frontend into `client/`, scaffold `server/`)
2. Supabase setup + product database (replace mockCards with real DB)
3. Admin panel (add/edit/delete cards from a dashboard)
4. Stripe checkout (cart + payment flow)
5. User accounts + order history (Supabase Auth)
6. Email confirmations (Nodemailer on order complete + contact form)
7. Sealed box product type (extend the product model)

## Future Considerations
- Self-host Supabase if free tier limits are reached
- Add PayPal alongside Stripe if customers request it
- Football cards (additional sport category in shop dropdown)
