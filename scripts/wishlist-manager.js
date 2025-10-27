class WishlistManager {
  constructor() {
    // Use a unique key for Local Storage to separate from the main plant collection
    this.STORAGE_KEY = 'botanical-wishlist';
    this.wishes = this.loadFromStorage();
  }

  // --- Data Persistence ---

  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading wishlist from Local Storage:", error);
      return [];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishes));
  }

  // --- CRUD Operations ---

  /**
   * Adds a new wish item to the wishlist.
   * @param {object} wishData - { name, note, link, image }
   */
  addWish(wishData) {
    const wish = {
      id: Date.now().toString(), // Unique ID based on timestamp
      name: wishData.name,
      note: wishData.note || '',
      link: wishData.link || '',
      image: wishData.image || null, // Base64 or null
      createdAt: new Date().toISOString()
    };

    // Add the new wish to the beginning of the array
    this.wishes.unshift(wish);
    this.saveToStorage();
    return wish;
  }

  /**
   * Retrieves all current wishlist items.
   * @returns {Array<object>}
   */
  getWishes() {
    return this.wishes;
  }

  /**
   * Retrieves a single wish item by its ID.
   * @param {string} id
   * @returns {object|undefined}
   */
  getWishById(id) {
    return this.wishes.find(wish => wish.id === id);
  }

  /**
   * Deletes a wish item by its ID.
   * @param {string} id
   */
  deleteWish(id) {
    const initialLength = this.wishes.length;
    this.wishes = this.wishes.filter(wish => wish.id !== id);

    if (this.wishes.length < initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // --- UI Rendering ---

  /**
   * Renders the entire wishlist to the DOM.
   * @param {Array<object>} wishes - The list of items to render.
   */
  renderWishlist(wishes) {
    const container = document.getElementById("wishlist-grid");
    if (!container) return;

    if (wishes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-heart"></i>
          <h3>Your Wishlist is Empty</h3>
          <p>Found a plant you love? Add it to your list!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = wishes
      .map((wish) => this.createWishCard(wish))
      .join("");

    this.bindWishCardEvents(container);
  }

  /**
   * Creates the HTML structure for a single wishlist item card.
   * @param {object} wish
   * @returns {string} HTML markup
   */
  createWishCard(wish) {
    // Use a distinct placeholder for wishlist items
    const imageSrc =
      wish.image ||
      "https://via.placeholder.com/300x200/f39c12/ffffff?text=⭐";

    // HTML structure for the card (uses the plant-card class for consistent styling)
    return `
      <div class="plant-card wishlist-card" data-wish-id="${wish.id}">
        <img src="${imageSrc}" 
          alt="${this.escapeHtml(wish.name)}" 
          class="plant-image"
          onerror="this.src='https://via.placeholder.com/300x200/f39c12/ffffff?text=⭐'">
        <div class="plant-info">
          <h3 class="plant-name">${this.escapeHtml(wish.name)}</h3>
          ${
            wish.note
              ? `<p class="wish-note">${this.escapeHtml(wish.note).substring(0, 50)}...</p>`
              : '<p class="wish-note">No quick note.</p>'
          }
          <div class="plant-meta">
            ${
              wish.link
                ? `<a href="${this.escapeHtml(wish.link)}" target="_blank" class="wish-link-badge">
                    <i class="fas fa-shopping-cart"></i> Store Link
                   </a>`
                : '<span class="wish-link-badge empty"><i class="fas fa-link"></i> No Link</span>'
            }
          </div>
        </div>
        <button class="delete-wish-btn" data-id="${wish.id}" aria-label="Delete wishlist item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }

  /**
   * Binds click handlers to the cards for showing details and deleting.
   * @param {HTMLElement} container
   */
  bindWishCardEvents(container) {
    container.querySelectorAll(".wishlist-card").forEach((card) => {
      // Bind click to show detail (excluding the delete button)
      card.addEventListener("click", (e) => {
        if (!e.target.closest('.delete-wish-btn')) {
          const wishId = card.dataset.wishId;
          if (wishId && window.app && window.app.showWishDetail) {
            window.app.showWishDetail(wishId);
          }
        }
      });
    });

    // Bind click specifically for the delete button
    container.querySelectorAll(".delete-wish-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the card click event from firing
        const wishId = button.dataset.id;
        if (wishId && window.app && window.app.deleteWish) {
          window.app.deleteWish(wishId);
        }
      });
    });
  }

  /**
   * Helper function to safely escape HTML content.
   */
  escapeHtml(unsafe) {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}