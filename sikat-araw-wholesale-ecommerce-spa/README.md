# Sikat Araw Trading Corp. Wholesale E-Commerce SPA

A responsive single-page wholesale e-commerce catalog for frozen food distribution. This project is built as a portfolio-ready static SPA that demonstrates product browsing, SKU-level product data, quotation-cart behavior, buyer quote-request submission, saved quote/order history, admin dashboard KPIs, backend-ready data-service structure, wishlist persistence, search, filtering, and cold-chain buyer support.

## Project Purpose

The goal of this project is to show how a frozen food distributor can present a clean front-facing catalog for restaurants, retailers, distributors, and institutional buyers. Instead of using a simple retail checkout, the interface uses a quote-cart and quote-request workflow that better fits wholesale purchasing.

## Business Problem

Wholesale buyers need to review products quickly before contacting sales. They usually care about more than product photos and price. They need SKU, pack size, stock availability, MOQ, lead time, origin, storage temperature, delivery context, payment preference, and bulk-order notes.

## Solution Overview

This SPA organizes frozen seafood, sushi-grade products, and premium meat items into a searchable product catalog. Buyers can filter by category, save products, add items to a quote cart, adjust quantities, submit a buyer-information form, receive a generated quote reference number, and review a front-end order-status timeline. Phase 2 adds a local quote/order history panel where saved requests can be searched, filtered, restored to cart, exported, advanced through demo statuses, or deleted. Phase 3 adds an admin-style dashboard. Phase 4A adds a backend-ready data-service layer that keeps GitHub Pages compatibility while preparing the workflow for Supabase/database integration.

## Current Buyer Workflow

```text
Visit website
→ Browse product catalog
→ Filter/search by category, SKU, pack size, or MOQ
→ Add products to Quote Cart
→ Adjust quantity
→ Prepare Wholesale Quote
→ Complete buyer/company/delivery/payment details
→ Submit quote request
→ Generate quote reference number
→ Save request in localStorage
→ Display quote status timeline
→ Review saved quote/order history
→ Search/filter previous quote requests
→ Restore previous quote items back to quote cart
→ Advance mock status for demo tracking
→ Export quote history as JSON
→ Review admin dashboard KPIs
→ Confirm backend fallback/database readiness
```

## Key Features

- Responsive landing page for desktop, tablet, and mobile
- Product catalog rendered from JavaScript data
- Polished B2B product cards with SKU, origin, pack size, MOQ, lead time, storage temperature, stock status, and wholesale price display
- Category filtering for seafood, meat, and sushi-grade items
- Product search modal with SKU, pack-size, and MOQ matching
- Quote cart drawer with quantity controls
- Estimated subtotal calculation
- Phase 1 quote-request modal with buyer, company, contact, delivery, payment, and order-notes fields
- Generated quote reference number using SATC-style reference format
- Phase 2 saved quote/order history panel using localStorage
- Searchable and filterable saved quote requests
- Restore previous quote requests back into the quote cart
- Mock status progression for demo tracking: Quote Submitted, Under Review, Quotation Sent, Awaiting Approval, Approved / Sales Order Created, Completed
- Export quote history as JSON for demo/admin review
- Phase 3 admin dashboard mockup with KPI cards, recent quote table, pipeline status, stock overview, demo data loader, and CSV export
- Phase 4A backend-ready service layer with localStorage fallback and Supabase table schema draft
- Sync-status labels on saved quote records
- Delete individual saved quote records or clear local history
- Quote status timeline shown after submission and inside history cards
- Print summary, copy-reference, and copy-summary actions after submission
- Wishlist toggle with localStorage persistence
- PHP/USD currency switcher
- Newsletter/demo lead capture with localStorage save state
- Informational service modals for delivery, cold-chain handling, claims, and trade accounts
- Mobile navigation
- Accessibility improvements for buttons, modals, tabs, drawer states, keyboard focus, and reduced motion

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage fallback
- Backend-ready JavaScript data service
- Font Awesome CDN
- Google Fonts
- GitHub Pages-ready static deployment

## Folder Structure

```text
sikat-araw-wholesale-ecommerce-spa/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── products.js
│   │   ├── backend-service.js
│   │   └── app.js
│   └── images/
│       └── README.txt
└── docs/
    ├── backend-setup.md
    └── screenshots/
        └── README.md
```

## How to Run Locally

Open `index.html` directly in your browser.

No build step, package installation, or backend server is required.

## GitHub Pages Deployment

1. Upload `index.html`, `README.md`, `.gitignore`, `assets/`, and `docs/` to the repository root.
2. Go to **Settings > Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select the `main` branch and `/root` folder.
5. Save and wait for GitHub Pages to publish the site.

## Editing Guide

- Edit product data in `assets/js/products.js`.
- Edit backend-ready quote persistence in `assets/js/backend-service.js`.
- Edit page behavior in `assets/js/app.js`.
- Edit styling in `assets/css/styles.css`.
- Keep `index.html` at the repository root for GitHub Pages.

## Portfolio Notes

This is a static front-end demonstration. The quote cart, quote request records, saved quote/order history, wishlist, currency preference, and newsletter entries are saved in the browser using localStorage. Product cards are intentionally designed around procurement details such as MOQ, lead time, stock status, SKU, and cold-chain storage so the project reads more like a B2B wholesale interface than a basic retail catalog.

The Phase 1 quote-request workflow completes the visible buyer journey up to quote submission. Phase 2 adds a browser-based quote/order history panel to simulate post-submission tracking and repeat-order review. Phase 4A prepares that production path by introducing a backend-ready service boundary and Supabase schema notes. A production version would connect the same workflow to a backend database, authentication, inventory system, sales quotation module, email notification service, file upload, and payment processing.

## Phase 2 Scope

Phase 2 focuses on saved quote/order history without adding a backend yet. It keeps the project GitHub Pages-compatible while making the buyer journey more complete after quote submission.

```text
Saved Quote / Order History
→ View all locally saved quote requests
→ Search by reference, buyer, company, location, SKU, or product name
→ Filter by quote/order status
→ Restore a previous request to the quote cart
→ Advance demo status locally
→ Copy quote summary
→ Export quote history as JSON
→ Delete saved records or clear local history
```

## Future Improvements

- Real backend quote request submission
- Real email notification to sales/admin
- Admin dashboard for product, quote, stock, and order management
- Customer login and trade account approval
- Payment processing and proof-of-payment upload
- Inventory deduction and purchase order integration
- Cross-device order tracking through a database
- PDF quotation generation
- Local optimized product images inside `assets/images/`
- Analytics dashboard for product demand and quote activity

## Author

John Eric Malonosan  
Portfolio project for wholesale, logistics, and web development presentation.


## Phase 3 - Admin Dashboard Mockup

This version adds an internal dashboard layer to make the project feel closer to a wholesale business management SPA instead of only a customer-facing catalog.

### Added in Phase 3

- Admin dashboard shortcut in the header
- Admin dashboard section on the homepage
- Dashboard KPI cards for total quote requests, pending pipeline, approved orders, completed value, and requested units
- Quote / order status distribution using saved local quote records
- Recent quote request table
- Product stock overview sorted by lowest stock first
- Stock warning count for low-stock products
- Demo data loader for portfolio presentation
- Admin CSV export for quote/order records
- Dashboard refresh and shortcut to saved quote management

### Important limitation

The dashboard is still front-end only. It reads from `localStorage`, so records are stored only in the current browser. Real multi-user dashboards, authentication, payment verification, stock deduction, file uploads, and cross-device order tracking should be added later with a backend/database such as Supabase, Firebase, or Node.js + PostgreSQL.


## Phase 4A - Backend-Ready Data Service

This version adds the first backend integration layer while keeping the project deployable on GitHub Pages. No private keys or real database credentials are included.

### Added in Phase 4A

- New `assets/js/backend-service.js` file
- Centralized quote persistence service
- LocalStorage fallback adapter
- Backend readiness section on the homepage
- Backend readiness modal with Supabase table draft
- Sync-status labels on saved quote records
- Admin dashboard reads from the service layer instead of being tightly coupled to direct localStorage logic
- `docs/backend-setup.md` for future Supabase setup notes

### Phase 4A Limitation

This is backend-ready, not a live backend connection yet. Quote records still remain in the current browser/device. Supabase, login, real email, real payment processing, proof upload, inventory deduction, and cross-device order tracking should be implemented in Phase 4B/4C/5.
