# Arctic Fresh SPA

A responsive single-page product catalog and quotation-style shopping interface for a premium frozen food wholesale brand.

## Project Overview

Arctic Fresh is a front-facing static SPA for showcasing frozen seafood, sushi-grade products, and premium meats. It includes product filtering, search, wishlist behavior, cart drawer interactions, currency switching, newsletter capture, and localStorage persistence.

This project is structured for GitHub Pages deployment.

## Features

- Responsive landing page layout
- Product catalog rendered from JavaScript data
- Category filtering
- Product search modal
- Cart drawer with quantity controls
- Cart subtotal calculation
- Wishlist toggle with persistence
- Currency switcher for USD/EUR
- Newsletter form with local save state
- Informational service modals
- Mobile navigation
- Accessibility improvements for buttons, modals, tabs, and drawer states
- Reduced-motion support

## Folder Structure

```text
arctic-fresh-spa/
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

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Font Awesome CDN
- Google Fonts

## How to Run Locally

Open `index.html` directly in your browser.

No build step, package installation, or backend server is required.

## GitHub Pages Deployment

1. Create a public GitHub repository.
2. Upload all files and folders from this project.
3. Go to **Settings > Pages**.
4. Set the source to **Deploy from a branch**.
5. Select the `main` branch and `/root` folder.
6. Save and wait for GitHub Pages to publish the site.

## Editing Guide

- Edit product data in `assets/js/products.js`.
- Edit page behavior in `assets/js/app.js`.
- Edit styling in `assets/css/styles.css`.
- Keep `index.html` at the project root for GitHub Pages.

## Notes

The current product images are loaded from remote Unsplash URLs. For production or portfolio polish, place optimized local images inside `assets/images/` and update the image paths in `assets/js/products.js`.
