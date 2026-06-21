const STORAGE_KEYS = {
  cart: "arcticFreshCart",
  wishlist: "arcticFreshWishlist",
  currency: "arcticFreshCurrency",
  language: "arcticFreshLanguage",
  newsletter: "arcticFreshNewsletter"
};

const currencyRates = {
  USD: 1,
  EUR: 0.92
};

const currencySymbols = {
  USD: "$",
  EUR: "€"
};



const productGrid = document.getElementById("productGrid");
const cartBadge = document.getElementById("cartBadge");
const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const clearCartButton = document.getElementById("clearCartButton");
const checkoutButton = document.getElementById("checkoutButton");
const searchButton = document.getElementById("searchButton");
const accountButton = document.getElementById("accountButton");
const searchModal = document.getElementById("searchModal");
const infoModal = document.getElementById("infoModal");
const infoTitle = document.getElementById("infoTitle");
const infoBody = document.getElementById("infoBody");
const modalOverlay = document.getElementById("modalOverlay");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearSearchButton = document.getElementById("clearSearchButton");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterMessage = document.getElementById("newsletterMessage");
const toast = document.getElementById("toast");
const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
const currencyButtons = Array.from(document.querySelectorAll("[data-currency]"));

let cart = readStorage(STORAGE_KEYS.cart, []);
let wishlistState = new Set(readStorage(STORAGE_KEYS.wishlist, []));
let currentCurrency = localStorage.getItem(STORAGE_KEYS.currency) || "USD";
let currentLanguage = localStorage.getItem(STORAGE_KEYS.language) || "EN";
let currentFilter = "all";
let searchTerm = "";
let toastTimer = null;

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from localStorage`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write ${key} to localStorage`, error);
  }
}

function formatPrice(value) {
  const converted = value * currencyRates[currentCurrency];
  return `${currencySymbols[currentCurrency]}${converted.toFixed(2)}`;
}

function getVisibleProducts() {
  return products.filter((product) => {
    const matchesCategory = currentFilter === "all" || product.category === currentFilter;
    const searchable = `${product.name} ${product.origin} ${product.category} ${product.sku}`.toLowerCase();
    const matchesSearch = !searchTerm || searchable.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const visible = getVisibleProducts();

  productGrid.innerHTML = visible.map((product) => {
    const oldPrice = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : "";
    const wishlistActive = wishlistState.has(product.id) ? "active" : "";
    const wishlistLabel = wishlistState.has(product.id) ? "Remove from wishlist" : "Save to wishlist";

    return `
      <article class="product-card" data-category="${product.category}">
        <div class="product-media">
          <span class="product-tag">${product.tag}</span>
          <button class="wishlist-btn ${wishlistActive}" type="button" aria-label="${wishlistLabel}: ${product.name}" data-wishlist="${product.id}">
            <i class="fa-${wishlistState.has(product.id) ? "solid" : "regular"} fa-heart"></i>
          </button>
          <img src="${product.image}" alt="${product.name} from ${product.origin}" loading="lazy" />
        </div>
        <div class="product-body">
          <h3>${product.name}</h3>
          <div class="origin">${product.origin}</div>
          <div class="price-row">
            <span class="price">${formatPrice(product.price)}</span>
            ${oldPrice}
          </div>
          <div class="product-extra">
            <span><i class="fa-solid fa-barcode"></i> ${product.sku}</span>
            <span><i class="fa-solid fa-box"></i> ${product.packSize}</span>
            <span><i class="fa-solid fa-temperature-low"></i> ${product.storage} storage • ${product.stock} in stock</span>
          </div>
          <div class="product-meta">
            <button class="add-btn" type="button" data-add="${product.id}">
              <i class="fa-solid fa-bag-shopping"></i>
              <span>Add to Cart</span>
            </button>
            <div class="count-chip" title="Cold-chain code">${String(product.category).slice(0, 1).toUpperCase()}</div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  if (!visible.length) {
    productGrid.innerHTML = `
      <div class="product-card" style="grid-column:1/-1;padding:2rem;text-align:center;">
        <h3 style="margin:0 0 .5rem;">No products match your search</h3>
        <p style="margin:0;color:var(--muted);">Try another category or clear the search field.</p>
      </div>
    `;
  }
}

function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = total;
  cartBadge.setAttribute("aria-label", `${total} item${total === 1 ? "" : "s"} in cart`);
  cartBadge.classList.remove("bump");
  void cartBadge.offsetWidth;
  cartBadge.classList.add("bump");
}

function renderCart() {
  updateCartBadge();
  writeStorage(STORAGE_KEYS.cart, cart);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div>
          <i class="fa-solid fa-bag-shopping" style="font-size:2rem;color:var(--primary);"></i>
          <p>Your cart is empty. Add premium imports from the collection.</p>
        </div>
      </div>
    `;
    cartSubtotal.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = `
    <div class="cart-list">
      ${cart.map((item) => {
        const product = products.find((entry) => entry.id === item.id) || item;
        return `
          <article class="cart-item">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <div>
              <h3>${product.name}</h3>
              <small>${product.packSize || "Premium frozen import"} • ${formatPrice(product.price)} each</small>
              <div class="cart-item-actions">
                <div class="qty-control" aria-label="Quantity for ${product.name}">
                  <button class="qty-btn" type="button" data-qty="decrease" data-id="${item.id}" aria-label="Decrease ${product.name} quantity">−</button>
                  <span>${item.quantity}</span>
                  <button class="qty-btn" type="button" data-qty="increase" data-id="${item.id}" aria-label="Increase ${product.name} quantity">+</button>
                </div>
                <button class="remove-btn" type="button" data-remove="${item.id}">Remove</button>
              </div>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + ((product?.price || 0) * item.quantity);
  }, 0);

  cartSubtotal.textContent = formatPrice(subtotal);
}

function addToCart(productId, button) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to cart`);

  const label = button.querySelector("span");
  const icon = button.querySelector("i");
  const originalText = label.textContent;
  const originalClass = icon.className;

  button.classList.add("added");
  label.textContent = "Added";
  icon.className = "fa-solid fa-check";

  window.clearTimeout(button._resetTimer);
  button._resetTimer = window.setTimeout(() => {
    button.classList.remove("added");
    label.textContent = originalText;
    icon.className = originalClass;
  }, 1200);
}

function changeQuantity(productId, direction) {
  const existing = cart.find((item) => item.id === productId);
  if (!existing) return;

  existing.quantity += direction === "increase" ? 1 : -1;
  if (existing.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
  showToast("Item removed from cart");
}

function toggleWishlist(productId, button) {
  const icon = button.querySelector("i");
  const product = products.find((item) => item.id === productId);

  if (wishlistState.has(productId)) {
    wishlistState.delete(productId);
    button.classList.remove("active");
    button.setAttribute("aria-label", `Save to wishlist: ${product?.name || "product"}`);
    icon.className = "fa-regular fa-heart";
    showToast("Removed from wishlist");
  } else {
    wishlistState.add(productId);
    button.classList.add("active");
    button.setAttribute("aria-label", `Remove from wishlist: ${product?.name || "product"}`);
    icon.className = "fa-solid fa-heart";
    showToast("Saved to wishlist");
  }

  writeStorage(STORAGE_KEYS.wishlist, Array.from(wishlistState));
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartButton.setAttribute("aria-expanded", "true");
  cartOverlay.hidden = false;
  requestAnimationFrame(() => cartOverlay.classList.add("open"));
  document.body.style.overflow = "hidden";
  closeCartButton.focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartButton.setAttribute("aria-expanded", "false");
  cartOverlay.classList.remove("open");
  window.setTimeout(() => { cartOverlay.hidden = true; }, 220);
  document.body.style.overflow = "";
  cartButton.focus();
}

function openModal(modal) {
  modalOverlay.hidden = false;
  modalOverlay.classList.add("open");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const focusTarget = modal.querySelector("input, button");
  if (focusTarget) focusTarget.focus();
}

function closeModal() {
  [searchModal, infoModal].forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  modalOverlay.classList.remove("open");
  window.setTimeout(() => { modalOverlay.hidden = true; }, 220);
  document.body.style.overflow = "";
}

function showInfoPanel(type = "trade") {
  const content = {
    "shipping": {
      title: "Shipping Details",
      body: "Frozen orders are prepared in insulated packaging and dispatched through temperature-managed logistics. Delivery windows depend on buyer location, order volume, and product availability."
    },
    "cold-chain": {
      title: "Cold Chain Promise",
      body: "Products are handled under frozen temperature control from source warehouse to final dispatch, with packaging designed to protect texture, shelf stability, and food safety."
    },
    "returns": {
      title: "Returns & Claims",
      body: "For damaged, thawed, or incorrect items, contact support with order details and product photos as soon as the delivery is received so the claim can be reviewed."
    },
    "trade": {
      title: "Trade Account",
      body: "Restaurants, retailers, and wholesale buyers can request account setup, bulk quotation, product availability, and recurring supply support through orders@arcticfresh.com."
    }
  };

  const selected = content[type] || content.trade;
  infoTitle.textContent = selected.title;
  infoBody.innerHTML = `<p>${selected.body}</p>`;
  openModal(infoModal);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function setActiveSwitcher(buttons, value, attribute) {
  buttons.forEach((button) => {
    const isActive = button.dataset[attribute] === value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initializeSwitchers() {
  setActiveSwitcher(currencyButtons, currentCurrency, "currency");
  setActiveSwitcher(languageButtons, currentLanguage, "language");
}

tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentFilter = tab.dataset.filter;
    tabButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderProducts();
  });
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addToCart(Number(addButton.dataset.add), addButton);
    return;
  }

  const wishlistButton = event.target.closest("[data-wishlist]");
  if (wishlistButton) {
    toggleWishlist(Number(wishlistButton.dataset.wishlist), wishlistButton);
  }
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-qty]");
  if (quantityButton) {
    changeQuantity(Number(quantityButton.dataset.id), quantityButton.dataset.qty);
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.innerHTML = `<i class="fa-solid fa-${isOpen ? "xmark" : "bars"}"></i>`;
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
});

document.addEventListener("click", (event) => {
  if (window.matchMedia("(max-width: 899.98px)").matches) {
    const clickedOutside = !event.target.closest(".main-nav");
    if (clickedOutside && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }
});

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

clearCartButton.addEventListener("click", () => {
  cart = [];
  renderCart();
  showToast("Cart cleared");
});

checkoutButton.addEventListener("click", () => {
  if (!cart.length) {
    showToast("Add at least one product before checkout");
    return;
  }
  const orderSummary = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `${product?.name || "Product"} x ${item.quantity}`;
  }).join(", ");
  showToast("Quote request prepared. Contact orders@arcticfresh.com to complete the order.");
  console.info("Quote request summary:", orderSummary);
});

searchButton.addEventListener("click", () => openModal(searchModal));
accountButton.addEventListener("click", () => showInfoPanel("trade"));
modalOverlay.addEventListener("click", closeModal);

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.querySelectorAll("[data-info]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showInfoPanel(link.dataset.info);
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  renderProducts();
  closeModal();
  document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(searchTerm ? `Showing results for “${searchTerm}”` : "Showing all products");
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderProducts();
});

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  renderProducts();
  showToast("Search cleared");
});

currencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCurrency = button.dataset.currency;
    localStorage.setItem(STORAGE_KEYS.currency, currentCurrency);
    setActiveSwitcher(currencyButtons, currentCurrency, "currency");
    renderProducts();
    renderCart();
    showToast(`Currency changed to ${currentCurrency}`);
  });
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.language;
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    setActiveSwitcher(languageButtons, currentLanguage, "language");
    showToast(currentLanguage === "AR" ? "Arabic language preference saved" : "English language preference saved");
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();

  if (!email) {
    newsletterMessage.textContent = "Please enter your email address.";
    return;
  }

  const subscribers = readStorage(STORAGE_KEYS.newsletter, []);
  if (!subscribers.includes(email)) subscribers.push(email);
  writeStorage(STORAGE_KEYS.newsletter, subscribers);

  newsletterMessage.textContent = "Thanks. Your newsletter email has been saved locally for this demo.";
  showToast("Newsletter subscription saved");
  event.target.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("open")) closeCart();
    if (searchModal.classList.contains("open") || infoModal.classList.contains("open")) closeModal();
  }
});

initializeSwitchers();
renderProducts();
renderCart();
