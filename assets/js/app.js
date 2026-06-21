const STORAGE_KEYS = {
  cart: "sikatArawQuoteCart",
  wishlist: "sikatArawWishlist",
  currency: "sikatArawCurrency",
  language: "sikatArawLanguage",
  newsletter: "sikatArawNewsletter",
  quoteRequests: "sikatArawQuoteRequests"
};

const currencyRates = {
  PHP: 1,
  USD: 0.017
};

const currencySymbols = {
  PHP: "₱",
  USD: "$"
};

const QUOTE_STATUS_FLOW = [
  {
    label: "Quote Submitted",
    description: "Buyer inquiry captured in the SPA"
  },
  {
    label: "Under Review",
    description: "Sales validates stock, MOQ, and delivery"
  },
  {
    label: "Quotation Sent",
    description: "Official price and terms are prepared"
  },
  {
    label: "Awaiting Approval",
    description: "Buyer confirms quantity, price, and schedule"
  },
  {
    label: "Approved / Sales Order Created",
    description: "Approved quote is converted into a sales order"
  },
  {
    label: "Completed",
    description: "Order is fulfilled in this front-end demo flow"
  }
];


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
const historyDrawerButton = document.getElementById("historyDrawerButton");
const searchButton = document.getElementById("searchButton");
const accountButton = document.getElementById("accountButton");
const adminButton = document.getElementById("adminButton");
const historyButton = document.getElementById("historyButton");
const backendButton = document.getElementById("backendButton");
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
const quoteModal = document.getElementById("quoteModal");
const quoteForm = document.getElementById("quoteForm");
const quoteSummary = document.getElementById("quoteSummary");
const quoteConfirmation = document.getElementById("quoteConfirmation");
const quoteHistoryModal = document.getElementById("quoteHistoryModal");
const quoteHistoryList = document.getElementById("quoteHistoryList");
const quoteHistoryCount = document.getElementById("quoteHistoryCount");
const historySearchInput = document.getElementById("historySearchInput");
const historyStatusFilter = document.getElementById("historyStatusFilter");
const exportHistoryButton = document.getElementById("exportHistoryButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const dashboardOpenButton = document.getElementById("dashboardOpenButton");
const dashboardSeedButton = document.getElementById("dashboardSeedButton");
const adminDashboardModal = document.getElementById("adminDashboardModal");
const backendModal = document.getElementById("backendModal");
const adminPreviewGrid = document.getElementById("adminPreviewGrid");
const adminKpiGrid = document.getElementById("adminKpiGrid");
const adminStatusPipeline = document.getElementById("adminStatusPipeline");
const adminStockOverview = document.getElementById("adminStockOverview");
const adminRecentTable = document.getElementById("adminRecentTable");
const refreshDashboardButton = document.getElementById("refreshDashboardButton");
const seedDemoDataButton = document.getElementById("seedDemoDataButton");
const exportDashboardButton = document.getElementById("exportDashboardButton");
const openHistoryFromDashboardButton = document.getElementById("openHistoryFromDashboardButton");
const openBackendFromDashboardButton = document.getElementById("openBackendFromDashboardButton");
const backendStatusGrid = document.getElementById("backendStatusGrid");
const backendModalStatusGrid = document.getElementById("backendModalStatusGrid");
const backendSqlBlock = document.getElementById("backendSqlBlock");
const copyBackendSqlButton = document.getElementById("copyBackendSqlButton");
const toast = document.getElementById("toast");
const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
const currencyButtons = Array.from(document.querySelectorAll("[data-currency]"));

let cart = readStorage(STORAGE_KEYS.cart, []);
let wishlistState = new Set(readStorage(STORAGE_KEYS.wishlist, []));
let currentCurrency = localStorage.getItem(STORAGE_KEYS.currency) || "PHP";
if (!Object.prototype.hasOwnProperty.call(currencyRates, currentCurrency)) {
  currentCurrency = "PHP";
  localStorage.setItem(STORAGE_KEYS.currency, currentCurrency);
}
let currentLanguage = localStorage.getItem(STORAGE_KEYS.language) || "EN";
if (!["EN", "PH"].includes(currentLanguage)) {
  currentLanguage = "EN";
  localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
}
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

function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getDataService() {
  return window.SikatArawDataService || null;
}

function getQuoteRequests() {
  const service = getDataService();
  return service ? service.getQuoteRequests() : readStorage(STORAGE_KEYS.quoteRequests, []);
}

function setQuoteRequests(requests) {
  const service = getDataService();
  if (service) {
    return service.setQuoteRequests(requests);
  }
  writeStorage(STORAGE_KEYS.quoteRequests, requests);
  return requests;
}

function getBackendStatus() {
  const service = getDataService();
  if (service) return service.getBackendStatus();
  return {
    phase: "4A",
    provider: "localStorage",
    table: "quote_requests",
    syncMode: "local-fallback",
    remoteConfigured: false,
    sdkAvailable: false,
    remoteReady: false,
    message: "Backend service file is not loaded. The SPA is using direct localStorage fallback."
  };
}

function buildTimelineFromStatus(status = "Quote Submitted") {
  const activeIndex = Math.max(0, QUOTE_STATUS_FLOW.findIndex((step) => step.label === status));
  return QUOTE_STATUS_FLOW.map((step, index) => ({
    ...step,
    active: index <= activeIndex
  }));
}

function getNextQuoteStatus(status = "Quote Submitted") {
  const index = QUOTE_STATUS_FLOW.findIndex((step) => step.label === status);
  const safeIndex = index >= 0 ? index : 0;
  return QUOTE_STATUS_FLOW[Math.min(safeIndex + 1, QUOTE_STATUS_FLOW.length - 1)].label;
}

function getStatusClass(status = "Quote Submitted") {
  const map = {
    "Quote Submitted": "submitted",
    "Under Review": "review",
    "Quotation Sent": "sent",
    "Awaiting Approval": "approval",
    "Approved / Sales Order Created": "approved",
    "Completed": "completed"
  };
  return map[status] || "submitted";
}

function getStatusIcon(status = "Quote Submitted") {
  const map = {
    "Quote Submitted": "fa-inbox",
    "Under Review": "fa-magnifying-glass-chart",
    "Quotation Sent": "fa-file-invoice",
    "Awaiting Approval": "fa-hourglass-half",
    "Approved / Sales Order Created": "fa-circle-check",
    "Completed": "fa-flag-checkered"
  };
  return map[status] || "fa-inbox";
}

function formatPrice(value) {
  const converted = value * currencyRates[currentCurrency];
  return new Intl.NumberFormat(currentCurrency === "PHP" ? "en-PH" : "en-US", {
    style: "currency",
    currency: currentCurrency,
    maximumFractionDigits: currentCurrency === "PHP" ? 0 : 2
  }).format(converted);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getCartDetails() {
  return cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return {
      id: item.id,
      quantity: item.quantity,
      name: product?.name || "Product",
      sku: product?.sku || "N/A",
      category: product?.category || "wholesale",
      packSize: product?.packSize || "Wholesale item",
      moq: product?.moq || "Request",
      leadTime: product?.leadTime || "Confirm",
      storage: product?.storage || "Frozen",
      unitPrice: product?.price || 0,
      lineTotal: (product?.price || 0) * item.quantity
    };
  });
}

function getCartSubtotal() {
  return getCartDetails().reduce((sum, item) => sum + item.lineTotal, 0);
}

function generateQuoteReference() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SATC-${datePart}-${timePart}-${randomPart}`;
}

function getVisibleProducts() {
  return products.filter((product) => {
    const matchesCategory = currentFilter === "all" || product.category === currentFilter;
    const searchable = `${product.name} ${product.origin} ${product.category} ${product.sku} ${product.packSize} ${product.moq || ""}`.toLowerCase();
    const matchesSearch = !searchTerm || searchable.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function getStockState(stock) {
  if (stock >= 60) {
    return { className: "high", label: "Ready stock", icon: "fa-circle-check" };
  }
  if (stock >= 30) {
    return { className: "medium", label: "Limited allocation", icon: "fa-clock" };
  }
  return { className: "low", label: "Reserve early", icon: "fa-triangle-exclamation" };
}

function getCategoryLabel(category) {
  const labels = {
    seafood: "Seafood",
    meat: "Meat",
    sushi: "Sushi-grade"
  };
  return labels[category] || "Wholesale";
}

function getSavingsLabel(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return "";
  const savings = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  return `<span class="savings-chip">Save ${savings}%</span>`;
}

function renderProducts() {
  const visible = getVisibleProducts();

  productGrid.innerHTML = visible.map((product) => {
    const oldPrice = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : "";
    const savingsLabel = getSavingsLabel(product);
    const stockState = getStockState(product.stock);
    const wishlistActive = wishlistState.has(product.id) ? "active" : "";
    const wishlistLabel = wishlistState.has(product.id) ? "Remove from wishlist" : "Save to wishlist";

    return `
      <article class="product-card" data-category="${product.category}">
        <div class="product-media">
          <span class="product-tag">${product.tag}</span>
          <span class="stock-ribbon ${stockState.className}"><i class="fa-solid ${stockState.icon}"></i> ${stockState.label}</span>
          <button class="wishlist-btn ${wishlistActive}" type="button" aria-label="${wishlistLabel}: ${product.name}" data-wishlist="${product.id}">
            <i class="fa-${wishlistState.has(product.id) ? "solid" : "regular"} fa-heart"></i>
          </button>
          <img src="${product.image}" alt="${product.name} from ${product.origin}" loading="lazy" />
        </div>
        <div class="product-body">
          <div class="product-kicker">
            <span>${getCategoryLabel(product.category)}</span>
            <span>${product.sku}</span>
          </div>
          <h3>${product.name}</h3>
          <div class="origin"><i class="fa-solid fa-location-dot"></i> ${product.origin}</div>
          <div class="price-card">
            <span class="price-label">Estimated wholesale price</span>
            <div class="price-row">
              <span class="price">${formatPrice(product.price)}</span>
              ${oldPrice}
              ${savingsLabel}
            </div>
            <span class="price-note">Per ${product.packSize.toLowerCase()}</span>
          </div>
          <div class="product-spec-grid" aria-label="Wholesale product details">
            <span class="spec-item"><small>Pack Size</small><strong>${product.packSize}</strong></span>
            <span class="spec-item"><small>MOQ</small><strong>${product.moq || "Request"}</strong></span>
            <span class="spec-item"><small>Storage</small><strong>${product.storage}</strong></span>
            <span class="spec-item"><small>Lead Time</small><strong>${product.leadTime || "Confirm"}</strong></span>
          </div>
          <div class="product-meta">
            <div class="stock-pill ${stockState.className}" title="Estimated available stock">
              <i class="fa-solid fa-warehouse"></i>
              <span>${product.stock} units</span>
            </div>
            <button class="add-btn" type="button" data-add="${product.id}" aria-label="Add ${product.name} to quote cart">
              <i class="fa-solid fa-file-signature"></i>
              <span>Add to Quote</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  if (!visible.length) {
    productGrid.innerHTML = `
      <div class="product-card empty-state-card" style="grid-column:1/-1;padding:2rem;text-align:center;">
        <h3 style="margin:0 0 .5rem;">No products match your search</h3>
        <p style="margin:0;color:var(--muted);">Try another category, SKU, pack size, or clear the search field.</p>
      </div>
    `;
  }
}

function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = total;
  cartBadge.setAttribute("aria-label", `${total} item${total === 1 ? "" : "s"} in quote cart`);
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
          <p>Your quote cart is empty. Add wholesale products from the catalog.</p>
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
              <small>${product.packSize || "Wholesale frozen item"} • ${formatPrice(product.price)} each</small>
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

  cartSubtotal.textContent = formatPrice(getCartSubtotal());
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
  showToast(`${product.name} added to quote cart`);

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
  showToast("Item removed from quote cart");
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

  const focusTarget = modal.querySelector("[autofocus], input, select, textarea, button");
  if (focusTarget) focusTarget.focus();
}

function closeModal() {
  [searchModal, infoModal, quoteModal, quoteHistoryModal, adminDashboardModal, backendModal].filter(Boolean).forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  modalOverlay.classList.remove("open");
  window.setTimeout(() => { modalOverlay.hidden = true; }, 220);
  document.body.style.overflow = "";
}

function renderQuoteSummary() {
  const details = getCartDetails();
  if (!details.length) {
    quoteSummary.innerHTML = `
      <div class="quote-summary-header">
        <h3>No products selected</h3>
        <span>Add products to the quote cart first.</span>
      </div>
    `;
    return;
  }

  quoteSummary.innerHTML = `
    <div class="quote-summary-header">
      <h3>Quote Cart Summary</h3>
      <span>${details.length} SKU${details.length === 1 ? "" : "s"} • ${cart.reduce((sum, item) => sum + item.quantity, 0)} total unit${cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "" : "s"}</span>
    </div>
    <div class="quote-lines">
      ${details.map((item) => `
        <div class="quote-line">
          <div>
            <strong>${item.name}</strong>
            <small>${item.sku} • ${item.packSize} • MOQ ${item.moq} • ${item.leadTime}</small>
          </div>
          <div class="line-total">${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}</div>
        </div>
      `).join("")}
    </div>
    <div class="quote-summary-total">
      <span>Estimated subtotal before freight, discounts, and final stock validation</span>
      <strong>${formatPrice(getCartSubtotal())}</strong>
    </div>
  `;
}

function openQuoteModal() {
  if (!cart.length) {
    showToast("Add at least one product before requesting a quote");
    return;
  }

  renderQuoteSummary();
  quoteForm.hidden = false;
  quoteForm.reset();
  quoteConfirmation.hidden = true;
  quoteConfirmation.innerHTML = "";

  if (cartDrawer.classList.contains("open")) {
    closeCart();
    window.setTimeout(() => openModal(quoteModal), 240);
  } else {
    openModal(quoteModal);
  }
}

function buildQuoteRequest(form) {
  const formData = new FormData(form);
  const submittedAt = new Date().toISOString();
  const reference = generateQuoteReference();
  const items = getCartDetails();

  return {
    reference,
    submittedAt,
    status: "Quote Submitted",
    customer: {
      buyerName: formData.get("buyerName")?.trim(),
      companyName: formData.get("companyName")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      businessType: formData.get("businessType"),
      paymentMethod: formData.get("paymentMethod"),
      deliveryDate: formData.get("deliveryDate"),
      deliveryLocation: formData.get("deliveryLocation")?.trim(),
      notes: formData.get("notes")?.trim()
    },
    items,
    subtotal: getCartSubtotal(),
    currency: currentCurrency,
    updatedAt: submittedAt,
    timeline: buildTimelineFromStatus("Quote Submitted")
  };
}

function saveQuoteRequest(request) {
  const service = getDataService();
  const savedRequest = service ? service.saveQuoteRequest(request) : (() => {
    const requests = getQuoteRequests();
    requests.unshift(request);
    setQuoteRequests(requests.slice(0, 50));
    return request;
  })();

  renderAdminPreview();
  renderBackendStatus();
  return savedRequest;
}


function getFilteredQuoteRequests() {
  const requests = getQuoteRequests();
  const query = (historySearchInput?.value || "").trim().toLowerCase();
  const status = historyStatusFilter?.value || "all";

  return requests.filter((request) => {
    const itemSearch = (request.items || []).map((item) => `${item.name} ${item.sku} ${item.packSize}`).join(" ");
    const searchable = `${request.reference} ${request.status} ${request.customer?.buyerName || ""} ${request.customer?.companyName || ""} ${request.customer?.email || ""} ${request.customer?.phone || ""} ${request.customer?.deliveryLocation || ""} ${itemSearch}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesStatus = status === "all" || request.status === status;
    return matchesQuery && matchesStatus;
  });
}

function getRequestItemCount(request) {
  return (request.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function renderQuoteHistory() {
  if (!quoteHistoryList) return;

  const allRequests = getQuoteRequests();
  const filtered = getFilteredQuoteRequests();
  quoteHistoryCount.textContent = `${filtered.length} of ${allRequests.length} saved quote request${allRequests.length === 1 ? "" : "s"}`;

  if (!allRequests.length) {
    quoteHistoryList.innerHTML = `
      <div class="history-empty">
        <i class="fa-solid fa-clipboard-list" style="font-size:2rem;color:var(--primary);"></i>
        <h3 style="margin:0.7rem 0 0.3rem;color:var(--navy);">No saved quotes yet</h3>
        <p style="margin:0;">Submit a quote request first. Saved requests will appear here for local demo tracking.</p>
      </div>
    `;
    return;
  }

  if (!filtered.length) {
    quoteHistoryList.innerHTML = `
      <div class="history-empty">
        <h3 style="margin:0 0 0.3rem;color:var(--navy);">No matching records</h3>
        <p style="margin:0;">Try another reference, company, SKU, buyer name, location, or status filter.</p>
      </div>
    `;
    return;
  }

  quoteHistoryList.innerHTML = filtered.map((request) => {
    const timeline = buildTimelineFromStatus(request.status);
    const statusClass = getStatusClass(request.status);
    const statusIcon = getStatusIcon(request.status);
    const customer = request.customer || {};
    const items = request.items || [];
    const itemCount = getRequestItemCount(request);
    const isFinalStatus = request.status === QUOTE_STATUS_FLOW[QUOTE_STATUS_FLOW.length - 1].label;

    return `
      <article class="history-card" data-reference="${escapeHTML(request.reference)}">
        <div class="history-card-top">
          <div>
            <h3>${escapeHTML(request.reference)}</h3>
            <small>Submitted ${formatDateTime(request.submittedAt)}${request.updatedAt && request.updatedAt !== request.submittedAt ? ` • Updated ${formatDateTime(request.updatedAt)}` : ""}</small>
          </div>
          <div class="history-status-stack">
            <span class="history-status ${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${escapeHTML(request.status)}</span>
            <span class="sync-chip"><i class="fa-solid fa-database"></i> ${escapeHTML(request.syncStatus || "local-fallback")}</span>
          </div>
        </div>

        <div class="history-grid">
          <div class="history-metric">
            <span>Buyer / Company</span>
            <strong>${escapeHTML(customer.buyerName || "Buyer")}<br>${escapeHTML(customer.companyName || "Company not set")}</strong>
          </div>
          <div class="history-metric">
            <span>Delivery Area</span>
            <strong>${escapeHTML(customer.deliveryLocation || "Not specified")}</strong>
          </div>
          <div class="history-metric">
            <span>Items</span>
            <strong>${items.length} SKU${items.length === 1 ? "" : "s"} • ${itemCount} unit${itemCount === 1 ? "" : "s"}</strong>
          </div>
          <div class="history-metric">
            <span>Estimated Subtotal</span>
            <strong>${formatPrice(request.subtotal || 0)}</strong>
          </div>
        </div>

        <div class="history-mini-timeline" aria-label="Quote status timeline for ${escapeHTML(request.reference)}">
          ${timeline.map((step) => `<span class="${step.active ? "active" : ""}">${escapeHTML(step.label.replace(" / Sales Order Created", ""))}</span>`).join("")}
        </div>

        <details class="history-details">
          <summary>View line items and buyer notes</summary>
          <div class="history-lines">
            ${items.map((item) => `
              <div class="history-line">
                <div>
                  <strong>${escapeHTML(item.name)}</strong>
                  <small>${escapeHTML(item.sku)} • ${escapeHTML(item.packSize)} • MOQ ${escapeHTML(item.moq)} • ${escapeHTML(item.leadTime)}</small>
                </div>
                <strong>${Number(item.quantity || 0)} × ${formatPrice(item.unitPrice || 0)} = ${formatPrice(item.lineTotal || 0)}</strong>
              </div>
            `).join("")}
            <div class="history-line">
              <div>
                <strong>Buyer details</strong>
                <small>${escapeHTML(customer.email || "No email")} • ${escapeHTML(customer.phone || "No mobile")} • ${escapeHTML(customer.businessType || "No business type")}</small>
                <small>Payment: ${escapeHTML(customer.paymentMethod || "Not selected")} • Preferred date: ${escapeHTML(customer.deliveryDate || "Flexible")}</small>
                <small>Notes: ${escapeHTML(customer.notes || "No notes provided")}</small>
              </div>
            </div>
          </div>
        </details>

        <div class="history-actions">
          <button class="secondary-btn compact-btn" type="button" data-copy-history="${escapeHTML(request.reference)}"><i class="fa-regular fa-copy"></i> Copy Summary</button>
          <button class="secondary-btn compact-btn" type="button" data-restore-history="${escapeHTML(request.reference)}"><i class="fa-solid fa-cart-arrow-down"></i> Restore Cart</button>
          <button class="secondary-btn compact-btn" type="button" data-advance-history="${escapeHTML(request.reference)}" ${isFinalStatus ? "disabled" : ""}><i class="fa-solid fa-forward-step"></i> Next Status</button>
          <button class="secondary-btn compact-btn danger" type="button" data-delete-history="${escapeHTML(request.reference)}"><i class="fa-regular fa-trash-can"></i> Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function openQuoteHistoryModal() {
  renderQuoteHistory();

  if (cartDrawer.classList.contains("open")) {
    closeCart();
    window.setTimeout(() => openModal(quoteHistoryModal), 240);
    return;
  }

  openModal(quoteHistoryModal);
}

function findQuoteRequest(reference) {
  return getQuoteRequests().find((request) => request.reference === reference);
}

function copyQuoteSummary(reference) {
  const request = findQuoteRequest(reference);
  if (!request) return;

  const customer = request.customer || {};
  const lines = (request.items || []).map((item) => `- ${item.quantity} x ${item.name} (${item.sku}) = ${formatPrice(item.lineTotal || 0)}`).join("\n");
  const summary = `Quote Reference: ${request.reference}\nStatus: ${request.status}\nBuyer: ${customer.buyerName || ""}\nCompany: ${customer.companyName || ""}\nDelivery: ${customer.deliveryLocation || ""}\nEstimated Subtotal: ${formatPrice(request.subtotal || 0)}\n\nItems:\n${lines}`;

  navigator.clipboard?.writeText(summary);
  showToast("Quote summary copied");
}

function restoreQuoteToCart(reference) {
  const request = findQuoteRequest(reference);
  if (!request) return;

  cart = (request.items || [])
    .filter((item) => products.some((product) => product.id === item.id))
    .map((item) => ({ id: item.id, quantity: Number(item.quantity || 1) }));

  renderCart();
  closeModal();
  openCart();
  showToast(`Quote ${reference} restored to cart`);
}

function advanceQuoteStatus(reference) {
  const service = getDataService();
  if (service) {
    service.updateQuoteRequest(reference, (request) => {
      const nextStatus = getNextQuoteStatus(request.status);
      return {
        status: nextStatus,
        timeline: buildTimelineFromStatus(nextStatus)
      };
    });
  } else {
    const requests = getQuoteRequests().map((request) => {
      if (request.reference !== reference) return request;
      const nextStatus = getNextQuoteStatus(request.status);
      return {
        ...request,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        timeline: buildTimelineFromStatus(nextStatus)
      };
    });
    setQuoteRequests(requests);
  }

  renderQuoteHistory();
  renderAdminPreview();
  renderBackendStatus();
  if (adminDashboardModal?.classList.contains("open")) renderAdminDashboard();
  if (backendModal?.classList.contains("open")) renderBackendStatus();
  showToast("Quote status advanced in local fallback storage");
}

function deleteQuoteRequest(reference) {
  const service = getDataService();
  if (service) {
    service.deleteQuoteRequest(reference);
  } else {
    const requests = getQuoteRequests().filter((request) => request.reference !== reference);
    setQuoteRequests(requests);
  }
  renderQuoteHistory();
  renderAdminPreview();
  renderBackendStatus();
  if (adminDashboardModal?.classList.contains("open")) renderAdminDashboard();
  if (backendModal?.classList.contains("open")) renderBackendStatus();
  showToast("Saved quote deleted");
}

function clearQuoteHistory() {
  const requests = getQuoteRequests();
  if (!requests.length) {
    showToast("No saved quote history to clear");
    return;
  }

  if (!window.confirm("Clear all locally saved quote requests?")) return;

  const service = getDataService();
  if (service) {
    service.clearQuoteRequests();
  } else {
    setQuoteRequests([]);
  }
  renderQuoteHistory();
  renderAdminPreview();
  renderBackendStatus();
  if (adminDashboardModal?.classList.contains("open")) renderAdminDashboard();
  if (backendModal?.classList.contains("open")) renderBackendStatus();
  showToast("Quote history cleared");
}

function exportQuoteHistory() {
  const requests = getQuoteRequests();
  if (!requests.length) {
    showToast("No saved quote history to export");
    return;
  }

  const payload = JSON.stringify(requests, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sikat-araw-quote-history-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Quote history exported as JSON");
}

function renderQuoteConfirmation(request) {
  quoteConfirmation.hidden = false;
  quoteConfirmation.innerHTML = `
    <h3>Quote request submitted</h3>
    <p>Your quote request was saved through the Phase 4A data-service layer. In this GitHub Pages demo it uses localStorage fallback; the same workflow is prepared for Supabase/database sync in the next phase.</p>
    <div class="quote-reference"><i class="fa-solid fa-receipt"></i> ${request.reference}</div>
    <div class="quote-reference-row">
      <span>Submitted: ${formatDateTime(request.submittedAt)}</span>
      <span>Estimated subtotal: <strong>${formatPrice(request.subtotal)}</strong></span>
    </div>
    <ul class="status-timeline" aria-label="Quote request status timeline">
      ${buildTimelineFromStatus(request.status).map((step) => `
        <li class="${step.active ? "active" : ""}">
          <strong>${escapeHTML(step.label)}</strong>
          ${escapeHTML(step.description)}
        </li>
      `).join("")}
    </ul>
    <div class="confirmation-actions">
      <button class="checkout-btn" type="button" data-print-quote><i class="fa-solid fa-print"></i> Print Summary</button>
      <button class="secondary-btn" type="button" data-copy-reference="${request.reference}"><i class="fa-regular fa-copy"></i> Copy Reference</button>
      <button class="secondary-btn" type="button" data-view-history><i class="fa-solid fa-clock-rotate-left"></i> View Saved Quotes</button>
      <button class="secondary-btn" type="button" data-new-quote><i class="fa-solid fa-plus"></i> Start New Quote</button>
    </div>
  `;
}

function submitQuoteRequest(event) {
  event.preventDefault();

  if (!cart.length) {
    showToast("Your quote cart is empty");
    return;
  }

  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    return;
  }

  const request = buildQuoteRequest(quoteForm);
  const savedRequest = saveQuoteRequest(request);
  quoteForm.hidden = true;
  renderQuoteConfirmation(savedRequest);
  showToast(`Quote request ${savedRequest.reference} saved in ${savedRequest.syncStatus || "local fallback"}`);
}


function getAdminMetrics() {
  const requests = getQuoteRequests();
  const statusCounts = QUOTE_STATUS_FLOW.reduce((acc, step) => {
    acc[step.label] = 0;
    return acc;
  }, {});

  let totalValue = 0;
  let pendingValue = 0;
  let completedValue = 0;
  let totalUnits = 0;
  const productDemand = new Map();
  const locationDemand = new Map();

  requests.forEach((request) => {
    const status = request.status || "Quote Submitted";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    const subtotal = Number(request.subtotal || 0);
    totalValue += subtotal;
    if (status !== "Completed") pendingValue += subtotal;
    if (status === "Completed") completedValue += subtotal;

    const location = (request.customer?.deliveryLocation || "Unspecified").trim() || "Unspecified";
    locationDemand.set(location, (locationDemand.get(location) || 0) + 1);

    (request.items || []).forEach((item) => {
      const quantity = Number(item.quantity || 0);
      totalUnits += quantity;
      const current = productDemand.get(item.sku) || { name: item.name, sku: item.sku, quantity: 0 };
      current.quantity += quantity;
      productDemand.set(item.sku, current);
    });
  });

  const pendingStatuses = ["Quote Submitted", "Under Review", "Quotation Sent", "Awaiting Approval"];
  const pendingCount = requests.filter((request) => pendingStatuses.includes(request.status)).length;
  const approvedCount = requests.filter((request) => request.status === "Approved / Sales Order Created").length;
  const completedCount = requests.filter((request) => request.status === "Completed").length;
  const lowStockProducts = products.filter((product) => product.stock < 30);
  const limitedStockProducts = products.filter((product) => product.stock >= 30 && product.stock < 60);
  const readyStockProducts = products.filter((product) => product.stock >= 60);
  const topProduct = Array.from(productDemand.values()).sort((a, b) => b.quantity - a.quantity)[0];
  const topLocation = Array.from(locationDemand.entries()).sort((a, b) => b[1] - a[1])[0];

  return {
    requests,
    totalRequests: requests.length,
    pendingCount,
    approvedCount,
    completedCount,
    totalValue,
    pendingValue,
    completedValue,
    totalUnits,
    averageValue: requests.length ? totalValue / requests.length : 0,
    statusCounts,
    lowStockProducts,
    limitedStockProducts,
    readyStockProducts,
    topProduct,
    topLocation
  };
}

function renderAdminPreview() {
  if (!adminPreviewGrid) return;
  const metrics = getAdminMetrics();
  adminPreviewGrid.innerHTML = `
    <article class="admin-preview-card">
      <span>Saved Quotes</span>
      <strong>${metrics.totalRequests}</strong>
      <small>${metrics.pendingCount} pending review • ${metrics.completedCount} completed</small>
    </article>
    <article class="admin-preview-card">
      <span>Pipeline Value</span>
      <strong>${formatPrice(metrics.pendingValue)}</strong>
      <small>Estimated value before final quotation approval</small>
    </article>
    <article class="admin-preview-card">
      <span>Units Requested</span>
      <strong>${metrics.totalUnits}</strong>
      <small>${metrics.topProduct ? `Top SKU: ${escapeHTML(metrics.topProduct.sku)}` : "No product demand yet"}</small>
    </article>
    <article class="admin-preview-card ${metrics.lowStockProducts.length ? "warning" : ""}">
      <span>Stock Warnings</span>
      <strong>${metrics.lowStockProducts.length}</strong>
      <small>${metrics.limitedStockProducts.length} limited allocation products</small>
    </article>
  `;
}

function renderAdminDashboard() {
  if (!adminDashboardModal) return;
  const metrics = getAdminMetrics();
  renderAdminPreview();

  if (adminKpiGrid) {
    adminKpiGrid.innerHTML = `
      <article class="admin-kpi-card">
        <span>Total Quote Requests</span>
        <strong>${metrics.totalRequests}</strong>
        <small>${metrics.pendingCount} active pipeline records</small>
      </article>
      <article class="admin-kpi-card">
        <span>Estimated Pipeline</span>
        <strong>${formatPrice(metrics.pendingValue)}</strong>
        <small>Total open quote value</small>
      </article>
      <article class="admin-kpi-card">
        <span>Approved / Sales Orders</span>
        <strong>${metrics.approvedCount}</strong>
        <small>${formatPrice(metrics.averageValue)} average quote value</small>
      </article>
      <article class="admin-kpi-card">
        <span>Completed Value</span>
        <strong>${formatPrice(metrics.completedValue)}</strong>
        <small>${metrics.completedCount} completed local records</small>
      </article>
    `;
  }

  if (adminStatusPipeline) {
    const maxCount = Math.max(1, ...Object.values(metrics.statusCounts));
    adminStatusPipeline.innerHTML = QUOTE_STATUS_FLOW.map((step) => {
      const count = metrics.statusCounts[step.label] || 0;
      const width = Math.max(6, Math.round((count / maxCount) * 100));
      return `
        <div class="admin-status-row">
          <div class="admin-status-label">
            <span>${escapeHTML(step.label.replace(" / Sales Order Created", ""))}</span>
            <strong>${count}</strong>
          </div>
          <div class="admin-progress" aria-hidden="true"><span style="width:${width}%"></span></div>
        </div>
      `;
    }).join("");
  }

  if (adminStockOverview) {
    const sortedProducts = [...products].sort((a, b) => a.stock - b.stock);
    adminStockOverview.innerHTML = sortedProducts.map((product) => {
      const state = getStockState(product.stock);
      return `
        <div class="admin-stock-item">
          <div>
            <strong>${escapeHTML(product.name)}</strong>
            <small>${escapeHTML(product.sku)} • ${escapeHTML(product.packSize)} • ${escapeHTML(product.leadTime)}</small>
          </div>
          <span class="history-status ${state.className === "high" ? "completed" : state.className === "medium" ? "review" : "submitted"}">
            <i class="fa-solid ${state.icon}"></i> ${product.stock} units
          </span>
        </div>
      `;
    }).join("");
  }

  if (adminRecentTable) {
    const recent = metrics.requests.slice(0, 8);
    if (!recent.length) {
      adminRecentTable.innerHTML = `
        <tr>
          <td colspan="6" class="admin-empty-cell">No quote records yet. Submit a quote or load demo records to populate the admin dashboard.</td>
        </tr>
      `;
    } else {
      adminRecentTable.innerHTML = recent.map((request) => {
        const customer = request.customer || {};
        const itemCount = (request.items || []).length;
        const unitCount = getRequestItemCount(request);
        return `
          <tr>
            <td><strong>${escapeHTML(request.reference)}</strong><small>${formatDateTime(request.submittedAt)}</small></td>
            <td>${escapeHTML(customer.buyerName || "Buyer")}<small>${escapeHTML(customer.companyName || "Company not set")}</small></td>
            <td><span class="history-status ${getStatusClass(request.status)}"><i class="fa-solid ${getStatusIcon(request.status)}"></i> ${escapeHTML(request.status)}</span></td>
            <td>${itemCount}</td>
            <td>${unitCount}</td>
            <td><strong>${formatPrice(request.subtotal || 0)}</strong></td>
          </tr>
        `;
      }).join("");
    }
  }
}

function openAdminDashboard() {
  renderAdminDashboard();
  openModal(adminDashboardModal);
}

function buildRequestItem(productId, quantity) {
  const product = products.find((entry) => entry.id === productId) || products[0];
  return {
    id: product.id,
    quantity,
    name: product.name,
    sku: product.sku,
    category: product.category,
    packSize: product.packSize,
    moq: product.moq,
    leadTime: product.leadTime,
    storage: product.storage,
    unitPrice: product.price,
    lineTotal: product.price * quantity
  };
}

function createDemoRequest(referenceSuffix, status, customer, lines, daysAgo) {
  const submittedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  const items = lines.map(([productId, quantity]) => buildRequestItem(productId, quantity));
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    reference: `SATC-DEMO-${referenceSuffix}`,
    submittedAt,
    status,
    customer,
    items,
    subtotal,
    currency: "PHP",
    updatedAt: submittedAt,
    timeline: buildTimelineFromStatus(status)
  };
}

function seedDemoQuoteRequests() {
  const existing = getQuoteRequests();
  const hasDemoData = existing.some((request) => String(request.reference || "").startsWith("SATC-DEMO-"));
  if (hasDemoData) {
    showToast("Demo records are already loaded");
    renderAdminDashboard();
    return;
  }

  const demos = [
    createDemoRequest("0001", "Under Review", {
      buyerName: "Maria Santos",
      companyName: "North Bay Seafood Grill",
      email: "procurement@northbay.example",
      phone: "+63 917 000 1001",
      businessType: "Restaurant / Café",
      paymentMethod: "Bank Transfer",
      deliveryDate: "2026-07-02",
      deliveryLocation: "Quezon City",
      notes: "Prefer morning delivery and salmon substitution if allocation is tight."
    }, [[1, 6], [3, 12]], 2),
    createDemoRequest("0002", "Quotation Sent", {
      buyerName: "Luis Reyes",
      companyName: "Metro Frozen Depot",
      email: "orders@metrofrozen.example",
      phone: "+63 918 000 2002",
      businessType: "Distributor / Reseller",
      paymentMethod: "Credit Terms / Existing Account",
      deliveryDate: "2026-07-05",
      deliveryLocation: "Pasig City",
      notes: "Monthly replenishment inquiry."
    }, [[2, 5], [4, 3], [6, 8]], 5),
    createDemoRequest("0003", "Approved / Sales Order Created", {
      buyerName: "Andrea Lim",
      companyName: "Prime Hotel Catering",
      email: "purchasing@primehotel.example",
      phone: "+63 919 000 3003",
      businessType: "Hotel / Catering",
      paymentMethod: "Maya",
      deliveryDate: "2026-07-08",
      deliveryLocation: "Makati City",
      notes: "Include delivery receipt and product temp check."
    }, [[5, 3], [7, 2]], 8),
    createDemoRequest("0004", "Completed", {
      buyerName: "John Cruz",
      companyName: "Southline Retail Mart",
      email: "buying@southline.example",
      phone: "+63 920 000 4004",
      businessType: "Retail Store",
      paymentMethod: "GCash",
      deliveryDate: "2026-06-26",
      deliveryLocation: "Parañaque City",
      notes: "Completed demo record for reporting."
    }, [[3, 10], [8, 1]], 14)
  ];

  setQuoteRequests([...demos, ...existing].slice(0, 50));
  renderQuoteHistory();
  renderAdminDashboard();
  renderAdminPreview();
  showToast("Demo quote records loaded");
}

function exportAdminDashboardCsv() {
  const requests = getQuoteRequests();
  if (!requests.length) {
    showToast("No dashboard records to export");
    return;
  }

  const rows = [["Reference", "Submitted", "Status", "Buyer", "Company", "Delivery Location", "SKU Count", "Units", "Subtotal"]];
  requests.forEach((request) => {
    const customer = request.customer || {};
    rows.push([
      request.reference,
      request.submittedAt,
      request.status,
      customer.buyerName || "",
      customer.companyName || "",
      customer.deliveryLocation || "",
      String((request.items || []).length),
      String(getRequestItemCount(request)),
      String(request.subtotal || 0)
    ]);
  });

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sikat-araw-admin-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Admin dashboard CSV exported");
}

function renderBackendStatus() {
  const status = getBackendStatus();
  const statusCards = `
    <article class="backend-status-card">
      <span>Backend Phase</span>
      <strong>${escapeHTML(status.phase || "4A")}</strong>
      <small>Backend-ready integration layer</small>
    </article>
    <article class="backend-status-card">
      <span>Active Storage</span>
      <strong>${escapeHTML(status.syncMode || "local-fallback")}</strong>
      <small>${escapeHTML(status.message || "Local fallback active")}</small>
    </article>
    <article class="backend-status-card">
      <span>Database Target</span>
      <strong>${escapeHTML(status.table || "quote_requests")}</strong>
      <small>Supabase-ready table name for Phase 4B/4C</small>
    </article>
    <article class="backend-status-card ${status.remoteReady ? "ready" : "warning"}">
      <span>Remote Sync</span>
      <strong>${status.remoteReady ? "Ready" : "Not connected"}</strong>
      <small>Configured: ${status.remoteConfigured ? "Yes" : "No"} • SDK: ${status.sdkAvailable ? "Loaded" : "Not loaded"}</small>
    </article>
  `;

  if (backendStatusGrid) backendStatusGrid.innerHTML = statusCards;
  if (backendModalStatusGrid) backendModalStatusGrid.innerHTML = statusCards;
  if (backendSqlBlock) {
    const service = getDataService();
    backendSqlBlock.textContent = service?.getSupabaseTableSql ? service.getSupabaseTableSql() : "Supabase SQL setup is available after backend-service.js loads.";
  }
}

function openBackendModal() {
  renderBackendStatus();
  openModal(backendModal);
}

function copyBackendSql() {
  const sql = backendSqlBlock?.textContent?.trim();
  if (!sql) return;
  navigator.clipboard?.writeText(sql);
  showToast("Supabase SQL copied");
}

function showInfoPanel(type = "trade") {
  const content = {
    "shipping": {
      title: "Delivery & Dispatch",
      body: "Frozen wholesale orders are prepared for insulated dispatch and cold-chain coordination. Final delivery windows depend on buyer location, order volume, and product availability."
    },
    "cold-chain": {
      title: "Cold-Chain Handling",
      body: "Products are presented with storage-temperature details so buyers can evaluate handling requirements before requesting a quotation."
    },
    "returns": {
      title: "Claims Support",
      body: "For damaged, thawed, or incorrect items, buyers should prepare order details and product photos as soon as delivery is received so the claim can be reviewed."
    },
    "trade": {
      title: "Trade Account",
      body: "Restaurants, retailers, and wholesale buyers can request account setup, bulk quotations, product availability, and recurring supply support through sales@sikatarawtrading.com."
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
  showToast("Quote cart cleared");
});

checkoutButton.addEventListener("click", openQuoteModal);
if (historyDrawerButton) historyDrawerButton.addEventListener("click", openQuoteHistoryModal);
if (historyButton) historyButton.addEventListener("click", openQuoteHistoryModal);
if (adminButton) adminButton.addEventListener("click", openAdminDashboard);
if (backendButton) backendButton.addEventListener("click", openBackendModal);
if (dashboardOpenButton) dashboardOpenButton.addEventListener("click", openAdminDashboard);
if (dashboardSeedButton) dashboardSeedButton.addEventListener("click", seedDemoQuoteRequests);
if (refreshDashboardButton) refreshDashboardButton.addEventListener("click", () => { renderAdminDashboard(); showToast("Admin dashboard refreshed"); });
if (seedDemoDataButton) seedDemoDataButton.addEventListener("click", seedDemoQuoteRequests);
if (exportDashboardButton) exportDashboardButton.addEventListener("click", exportAdminDashboardCsv);
if (openHistoryFromDashboardButton) openHistoryFromDashboardButton.addEventListener("click", () => { closeModal(); window.setTimeout(openQuoteHistoryModal, 240); });
if (openBackendFromDashboardButton) openBackendFromDashboardButton.addEventListener("click", () => { closeModal(); window.setTimeout(openBackendModal, 240); });
if (copyBackendSqlButton) copyBackendSqlButton.addEventListener("click", copyBackendSql);

if (quoteForm) {
  quoteForm.addEventListener("submit", submitQuoteRequest);
}

if (quoteConfirmation) {
  quoteConfirmation.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-reference]");
    if (copyButton) {
      navigator.clipboard?.writeText(copyButton.dataset.copyReference);
      showToast("Quote reference copied");
      return;
    }

    if (event.target.closest("[data-print-quote]")) {
      window.print();
      return;
    }

    if (event.target.closest("[data-view-history]")) {
      closeModal();
      window.setTimeout(openQuoteHistoryModal, 240);
      return;
    }

    if (event.target.closest("[data-new-quote]")) {
      cart = [];
      renderCart();
      closeModal();
      showToast("Quote cart cleared for a new request");
    }
  });
}

if (quoteHistoryList) {
  quoteHistoryList.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-history]");
    if (copyButton) {
      copyQuoteSummary(copyButton.dataset.copyHistory);
      return;
    }

    const restoreButton = event.target.closest("[data-restore-history]");
    if (restoreButton) {
      restoreQuoteToCart(restoreButton.dataset.restoreHistory);
      return;
    }

    const advanceButton = event.target.closest("[data-advance-history]");
    if (advanceButton) {
      advanceQuoteStatus(advanceButton.dataset.advanceHistory);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-history]");
    if (deleteButton) {
      deleteQuoteRequest(deleteButton.dataset.deleteHistory);
    }
  });
}

if (historySearchInput) historySearchInput.addEventListener("input", renderQuoteHistory);
if (historyStatusFilter) historyStatusFilter.addEventListener("change", renderQuoteHistory);
if (exportHistoryButton) exportHistoryButton.addEventListener("click", exportQuoteHistory);
if (clearHistoryButton) clearHistoryButton.addEventListener("click", clearQuoteHistory);


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
    if (quoteHistoryModal?.classList.contains("open")) renderQuoteHistory();
    renderAdminPreview();
    if (adminDashboardModal?.classList.contains("open")) renderAdminDashboard();
  if (backendModal?.classList.contains("open")) renderBackendStatus();
    showToast(`Currency changed to ${currentCurrency}`);
  });
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.language;
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    setActiveSwitcher(languageButtons, currentLanguage, "language");
    showToast(currentLanguage === "PH" ? "Filipino language preference saved" : "English language preference saved");
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

  newsletterMessage.textContent = "Thanks. Your email has been saved locally for this portfolio demo.";
  showToast("Newsletter subscription saved");
  event.target.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("open")) closeCart();
    if (
      searchModal.classList.contains("open") ||
      infoModal.classList.contains("open") ||
      quoteModal.classList.contains("open") ||
      quoteHistoryModal.classList.contains("open") ||
      adminDashboardModal?.classList.contains("open") ||
      backendModal?.classList.contains("open")
    ) closeModal();
  }
});

initializeSwitchers();
renderBackendStatus();
renderProducts();
renderCart();
renderAdminPreview();
