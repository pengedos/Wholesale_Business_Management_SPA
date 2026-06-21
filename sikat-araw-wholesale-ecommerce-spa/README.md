# Sikat Araw Trading Corp. Wholesale E-Commerce SPA

A responsive single-page wholesale e-commerce catalog for frozen food distribution. This project is built as a portfolio-ready static SPA that demonstrates product browsing, SKU-level product data, quotation-cart behavior, wishlist persistence, search, filtering, and cold-chain buyer support.

## Project Purpose

The goal of this project is to show how a frozen food distributor can present a clean front-facing catalog for restaurants, retailers, distributors, and institutional buyers. Instead of using a simple retail checkout, the interface uses a quote-cart workflow that better fits wholesale purchasing.

## Business Problem

Wholesale buyers need to review products quickly before contacting sales. They usually care about more than product photos and price. They need SKU, pack size, stock availability, origin, storage temperature, and bulk-order context.

## Solution Overview

This SPA organizes frozen seafood, sushi-grade products, and premium meat items into a searchable product catalog. Buyers can filter by category, save products, add items to a quote cart, adjust quantities, and prepare an inquiry for sales coordination.

## Key Features

- Responsive landing page for desktop, tablet, and mobile
- Product catalog rendered from JavaScript data
- SKU, origin, pack size, storage temperature, stock count, and wholesale price display
- Category filtering for seafood, meat, and sushi-grade items
- Product search modal
- Quote cart drawer with quantity controls
- Estimated subtotal calculation
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
- LocalStorage
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
│   │   └── app.js
│   └── images/
│       └── README.txt
└── docs/
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
- Edit page behavior in `assets/js/app.js`.
- Edit styling in `assets/css/styles.css`.
- Keep `index.html` at the repository root for GitHub Pages.

## Portfolio Notes

This is a static front-end demonstration. The quote cart, wishlist, currency preference, and newsletter entries are saved in the browser using localStorage. A production version would connect these workflows to a backend database, authentication, inventory system, and sales quotation module.

## Future Improvements

- Admin dashboard for product and stock management
- Customer login and trade account approval
- Backend quote request submission
- PDF quotation generation
- Inventory and purchase order integration
- Local optimized product images inside `assets/images/`
- Analytics dashboard for product demand and quote activity

## Author

John Eric Malonosan  
Portfolio project for wholesale, logistics, and web development presentation.
