# CNB Cards

> A clean, modern e-commerce storefront for F1 trading card singles.

---

## Overview

CNB Cards is a web-based storefront for a Formula 1 trading card business, allowing collectors to browse and purchase individual F1 cards (singles). Built as a fast, minimal, bilingual (English / Romanian) React application.

This is **V1** — a fully designed and animated frontend with mocked product data, no payment integration or backend yet.

---

## Features

- 🏎️ **F1 Singles Shop** — Browse individual Formula 1 trading cards with driver, year, set, condition and price
- 🔍 **Filters** — Search by driver name, filter by condition, sort by price
- 🌊 **Interactive Hero** — Wave animation background with mouse interaction
- ⭐ **Testimonials** — Customer reviews section
- 🌍 **Bilingual** — Full English / Romanian language toggle
- 📱 **Responsive** — Mobile-first design, works on all screen sizes
- ✨ **Animations** — Staggered scroll animations throughout

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Animations | Motion (Framer Motion) |
| Language | TypeScript |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dragosbaiu/cnb-cards.git
cd cnb-cards

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Base components (wave-background, etc.)
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── TrustStrip.jsx
│   ├── ProductGrid.jsx
│   ├── ProductCard.jsx
│   ├── Testimonials.jsx
│   ├── ComingSoonBanner.jsx
│   └── Footer.jsx
├── pages/            # Route-level pages
│   ├── HomePage.jsx
│   ├── ShopPage.jsx
│   ├── AboutPage.jsx
│   └── ContactPage.jsx
├── i18n/             # Translations
│   └── translations.js
├── context/          # React context
│   └── LanguageContext.jsx
├── hooks/            # Custom hooks
│   └── useTranslation.js
└── data/             # Mock data
    └── mockCards.js
```

---

## Roadmap

### V1 (current)
- [x] Homepage with hero, trust strip, product grid, testimonials, footer
- [x] Shop page with search and filter
- [x] About page
- [x] Contact page with FAQ
- [x] Bilingual EN / RO support
- [x] Scroll animations

### V2 (planned)
- [ ] Stripe / PayPal payment integration
- [ ] Supabase product database and admin panel
- [ ] Sealed Topps F1 box product type
- [ ] User accounts and order history
- [ ] Email order confirmations
- [ ] SEO optimization

---

## Contact

**CNB Cards**
📧 contact@cnbcards.com

---

© 2025 CNB Cards. All rights reserved.
