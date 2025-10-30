
class BotanicalApp {
  constructor() {
    // Initialize managers
    this.plantManager = new PlantManager();
    this.wishlistManager = new WishlistManager();
    this.calendarManager = calendarManager;
    this.imageHandler = new ImageHandler();
    this.currentPage = "dashboard";

    // Initialize theme
    this.theme = localStorage.getItem("theme") || "light";
    this.themeToggleBtn = document.getElementById("theme-toggle");
    
    this.init();
  }  init() {
    this.bindEvents();
    this.loadThemePreference();
    this.showPage("dashboard");
    this.updateDashboard();

    this.createFallingLeaves();
  }

  createFallingLeaves() {
    const fallingLeavesContainer = document.createElement('div');
    fallingLeavesContainer.className = 'falling-leaves';
    document.body.appendChild(fallingLeavesContainer);

    const leafTypes = ['leaf-type-1', 'leaf-type-2', 'leaf-type-3', 'leaf-type-4', 'leaf-type-5'];

    // Create 15 leaves for a gentle effect
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.createLeaf(fallingLeavesContainer, leafTypes);
      }, i * 800); // Stagger leaf creation
    }

    // Continuously create new leaves
    setInterval(() => {
      this.createLeaf(fallingLeavesContainer, leafTypes);
    }, 2000);
  }

  createLeaf(container, leafTypes) {
    const leaf = document.createElement('div');
    const leafType = leafTypes[Math.floor(Math.random() * leafTypes.length)];

    leaf.className = `leaf ${leafType}`;

    // Random properties for each leaf
    const left = Math.random() * 100; // 0-100% across screen
    const duration = 8 + Math.random() * 12; // 8-20 seconds
    const delay = Math.random() * 5; // 0-5 seconds delay
    const size = 0.5 + Math.random() * 1; // 0.5x to 1.5x size

    leaf.style.left = `${left}vw`;
    leaf.style.animationDuration = `${duration}s, ${duration / 2}s`;
    leaf.style.animationDelay = `${delay}s`;
    leaf.style.fontSize = `${size}em`;
    leaf.style.opacity = '0.7';

    container.appendChild(leaf);

    // Remove leaf after animation completes
    setTimeout(() => {
      if (leaf.parentNode) {
        leaf.remove();
      }
    }, (duration + delay) * 1000);
  }

  bindEvents() {
    // Footer navigation links
    document.querySelectorAll(".footer-nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Use .closest() to make sure we get the link
        const targetLink = e.target.closest(".footer-nav-link");
        if (!targetLink) return;

        const page = targetLink.getAttribute("data-page");

        if (page && page === this.currentPage) {
          this.showNotification("You are already on this page", "info");
        } else if (page) {
          this.showPage(page);
        }
      });
    });    // --- Contact Modal Listeners ---
    document.getElementById("contact-us-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.showContactModal();
    });

    document.getElementById("close-contact-modal")?.addEventListener("click", () => {
      this.hideContactModal();
    });

    document.getElementById("contact-modal")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        this.hideContactModal();
      }
    });

    document.getElementById("contact-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      // Since there's no backend, we just simulate success
      this.showNotification("Message sent successfully! (Demo)", "success");
      document.getElementById("contact-form").reset();
      this.hideContactModal();
    });
    // --- END Contact Modal Listeners ---

    // --- CALENDAR Listeners (NEW) ---
    document.getElementById('add-reminder')?.addEventListener('click', () => {
      this.showReminderModal();
    });

    document.getElementById('close-reminder-modal')?.addEventListener('click', () => {
      this.hideReminderModal();
    });

    document.getElementById('cancel-reminder-btn')?.addEventListener('click', () => {
      this.hideReminderModal();
    });

    // Close modal on outside click
    document.getElementById('reminder-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.hideReminderModal();
      }
    });

    // Handle reminder form submission
    document.getElementById('reminder-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleReminderSubmit();
    });

    // Handle calendar month navigation
    document.getElementById('prev-month')?.addEventListener('click', () => {
      this.calendarManager.currentDate.setMonth(this.calendarManager.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById('next-month')?.addEventListener('click', () => {
      this.calendarManager.currentDate.setMonth(this.calendarManager.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    // Handle reminder deletion (using event delegation)
    document.getElementById('upcoming-reminders')?.addEventListener('click', (e) => {
      const deleteButton = e.target.closest('.btn-remove-reminder');
      if (deleteButton) {
        const reminderId = deleteButton.dataset.id;
        this.deleteReminder(reminderId);
      }
    });
    // --- END CALENDAR Listeners ---

    // Navigation - Use event delegation
    document.querySelector(".nav").addEventListener("click", (e) => {
      if (e.target.closest(".nav-btn")) {
        const btn = e.target.closest(".nav-btn");
        const page = btn.dataset.page;

        if (page) {
          if (page === this.currentPage) {
            this.showNotification("You are already on this page", "info");
          } else {
            this.showPage(page);
          }
        }
      }
    });

    // Botanica logo click to return to dashboard
    document.querySelector(".logo").addEventListener("click", () => {
      this.showPage("dashboard");
    });

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }

    const sortPlants = document.getElementById("sort-plants");
    if (sortPlants) {
      sortPlants.addEventListener("change", (e) => {
        this.renderCollection();
      });
    }

    // Plant form submission
    const plantForm = document.getElementById("plant-form");
    if (plantForm) {
      plantForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handlePlantSubmit();
      });
    }

    // Wishlist form submission
    const wishlistForm = document.getElementById("wishlist-form");
    if (wishlistForm) {
      wishlistForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleWishlistSubmit();
      });
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.showPage("collection");
      });
    }

    // Search and filter controls
    const filterType = document.getElementById("filter-type");
    if (filterType) {
      filterType.addEventListener("change", (e) => {
        this.plantManager.setFilter(e.target.value);
        this.renderCollection();
      });
    }

    const searchPlants = document.getElementById("search-plants");
    if (searchPlants) {
      searchPlants.addEventListener("input", (e) => {
        this.plantManager.setSearch(e.target.value);
        this.renderCollection();
      });
    }

    // Modal close events
    const closeModal = document.getElementById("close-modal");
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        this.hideModal();
      });
    }

    const plantModal = document.getElementById("plant-modal");
    if (plantModal) {
      plantModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          this.hideModal();
        }
      });
    }

    // Handle delete clicks within modal content
    document.getElementById("modal-content").addEventListener("click", (e) => {
      if (e.target.closest("#modal-delete-btn")) {
        // Delegated deletion is handled inside bindPlantDetailEvents now
      }
    });
  
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideModal(); // Close plant modal
        this.hideContactModal(); // Close contact modal
        this.hideReminderModal(); // Close reminder modal (NEW)
      }
    });
  }

  loadThemePreference() {
    try {
      // Apply current theme
      this.applyTheme(this.theme);
      
      // Set up click handler
      if (this.themeToggleBtn) {
        this.themeToggleBtn.onclick = () => this.toggleTheme();
      }
    } catch (error) {
      console.error("Error in loadThemePreference:", error);
    }
  }

  applyTheme(theme) {
    if (!this.themeToggleBtn) return;
    
    const icon = this.themeToggleBtn.querySelector("i");
    const text = this.themeToggleBtn.querySelector("span");
    
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      if (icon) icon.className = "fas fa-sun";
      if (text) text.textContent = "Light Mode";
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (icon) icon.className = "fas fa-moon";
      if (text) text.textContent = "Dark Mode";
    }
  }

  toggleTheme() {
    try {
      // Toggle theme state
      this.theme = this.theme === "dark" ? "light" : "dark";
      
      // Apply the new theme
      this.applyTheme(this.theme);
      
      // Save to localStorage
      localStorage.setItem("theme", this.theme);
      
      console.log("Theme toggled to:", this.theme);
    } catch (error) {
      console.error("Error in toggleTheme:", error);
    }    // Save preference to localStorage
    localStorage.setItem(
      "theme",
      document.documentElement.getAttribute("data-theme") || "light"
    );
  }

  /**
   * Shows a specific page and runs page-specific initialization logic.
   * @param {string} pageName - The ID of the page element to show.
   */
  showPage(pageName) {
    // Update navigation buttons
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === pageName);
    });

    // Hide all pages
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });

    // Show target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
      this.currentPage = pageName;
      targetPage.classList.add("active");

      // Page-specific initialization
      switch (pageName) {
        case "dashboard":
          this.updateDashboard();
          break;
        case "collection":
          this.renderCollection();
          break;
        case "wishlist":
          this.wishlistManager.renderWishlist(this.wishlistManager.getWishes());
          // Initialize image handler for the wishlist form
          if (this.imageHandler) {
            this.imageHandler.initHandler("wish-upload-area", "wish-image", "wish-image-preview", "wish-remove-image", "wish-preview-img");
            this.imageHandler.clearImage();
          }
          document.getElementById("wishlist-form")?.reset();
          break;
        case "add-plant":
          // Initialize image handler for the add plant form
          if (this.imageHandler) {
            this.imageHandler.initHandler("upload-area", "plant-image", "image-preview", "remove-image", "preview-img");
            this.imageHandler.clearImage();
          }
          document.getElementById("plant-form")?.reset();
          break;
        
        // --- ADDED THIS BLOCK ---
        case "calendar":
          this.renderCalendar();
          this.renderUpcomingReminders();
          break;
        // --- END OF NEW BLOCK ---

        // No case needed for help-center, privacy-policy, or terms-of-service
        // as they are just simple content pages with no special init logic.
      }
    } else {
      console.error("Page not found:", pageName);
    }
  }

  updateDashboard() {
    const stats = this.plantManager.getStats();

    // Update stats
    const totalPlants = document.getElementById("total-plants");
    const needsWater = document.getElementById("needs-water");
    const lowLight = document.getElementById("low-light");

    if (totalPlants) totalPlants.textContent = stats.total;
    if (needsWater) needsWater.textContent = stats.needsWater;
    if (lowLight) lowLight.textContent = stats.lowLight;

    this.renderRecentPlants();
  }

  renderRecentPlants() {
    const container = document.getElementById("recent-plants-grid");
    if (!container) return;

    const recentPlants = this.plantManager.getRecentPlants();

    if (recentPlants.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-seedling"></i>
                    <h3>No plants yet</h3>
                    <p>Add your first plant to get started!</p>
                    <button class="btn-primary" id="add-first-plant">
                        <i class="fas fa-plus"></i>
                        Add First Plant
                    </button>
                </div>
          .   `;

      // Add event listener to the new button
      const addFirstPlantBtn = document.getElementById("add-first-plant");
      if (addFirstPlantBtn) {
        addFirstPlantBtn.addEventListener("click", () => {
          this.showPage("add-plant");
        });
      }
      return;
    }

    container.innerHTML = recentPlants
      .map((plant) => this.createPlantCard(plant))
      .join("");
    this.bindPlantCardEvents(container);
  }

  renderCollection() {
    const container = document.getElementById("collection-grid");
    if (!container) return;

    let plants = this.plantManager.getPlants();

    // Sort by dropdown selection
    const sortBy = document.getElementById("sort-plants")?.value || "name";
    plants.sort((a, b) => {
      if (sortBy === "dateAdded") {
        return new Date(b.createdAt) - new Date(a.createdAt); // newest first
      } else {
        return a[sortBy]?.toLowerCase() > b[sortBy]?.toLowerCase() ? 1 : -1;
      }
    });

    if (plants.length === 0) {
      const message =
        this.plantManager.currentSearch ||
        this.plantManager.currentFilter !== "all"
          ? "Try adjusting your search or filter"
          : "Start building your plant collection!";

      container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-leaf"></i>
                    <h3>No plants found</h3>
                    <p>${message}</p>
                    <button class="btn-primary" id="add-new-plant">
                        <i class="fas fa-plus"></i>
                        Add New Plant
                    </button>
                </div>
            `;

      // Add event listener to the new button
      const addNewPlantBtn = document.getElementById("add-new-plant");
      if (addNewPlantBtn) {
        addNewPlantBtn.addEventListener("click", () => {
          this.showPage("add-plant");
        });
      }
      return;
    }

    container.innerHTML = plants
      .map((plant) => this.createPlantCard(plant))
      .join("");
    this.bindPlantCardEvents(container);
  }

  bindPlantCardEvents(container) {
    container.querySelectorAll(".plant-card").forEach((card) => {
      card.addEventListener("click", () => {
        const plantId = card.dataset.plantId;
        if (plantId) {
          this.showPlantDetail(plantId);
        }
      });
    });
  }

  createPlantCard(plant) {
    const lightIcons = {
      low: "fas fa-moon",
      medium: "fas fa-sun",
      bright: "fas fa-sun",
    };

    // Use placeholder if no image
    const imageSrc =
      plant.image ||
      "assets/images/demo_pic.png";

    return `
            <div class="plant-card" data-plant-id="${plant.id}">
                <img src="${imageSrc}" 
                    alt="${plant.name}" 
                    class="plant-image"
                    onerror="this.src='https.via.placeholder.com/300x200/8bb574/ffffff?text=🌿'">
                <div class="plant-info">
                    <h3 class="plant-name">${this.escapeHtml(plant.name)}</h3>
                    ${
                      plant.species
                        ? `<p class="plant-species">${this.escapeHtml(
                              plant.species
                            )}</p>`
                        : ""
                    }
                    <div class="plant-meta"> 
                        <span class="plant-type">${plant.type}</span>
                        <span class="plant-light">
                            <i class="${
                              lightIcons[plant.light] || "fas fa-sun"
                            }"></i>
                            ${plant.light}
                        </span>
                    </div>
                </div>
            </div>
        `;
  }

  async handlePlantSubmit() {
    // Validate image
    const imageValidation = this.imageHandler.validateImage();
    if (!imageValidation.valid) {
      this.showNotification(imageValidation.message, "error");
      return;
    }

    // Validate form
    const plantName = document.getElementById("plant-name");
    if (!plantName || !plantName.value.trim()) {
      this.showNotification("Please enter a plant name", "error");
      return;
    }

    // Get form data
    const plantData = {
      name: plantName.value.trim(),
      species: document.getElementById("plant-species").value.trim(),
      type: document.getElementById("plant-type").value,
      light: document.getElementById("light-requirement").value,
      notes: document.getElementById("plant-notes").value.trim(),
      image: this.imageHandler.getImageData(),
      createdAt: new Date().toISOString(),
    };

    try {
      // Add plant to collection
      this.plantManager.addPlant(plantData);

      // Show success message
      this.showNotification("Plant added successfully!", "success");

      // Reset form and return to collection
      this.imageHandler.clearImage();
      document.getElementById("plant-form").reset();
      this.showPage("collection");

      // Update dashboard stats
      this.updateDashboard();
    } catch (error) {
      this.showNotification("Error adding plant: " + error.message, "error");
    }
  }

  /**
   * Handles the submission of the wishlist form.
   */
  async handleWishlistSubmit() {
    // Re-initialize image handler for the wishlist form
    this.imageHandler.initHandler("wish-upload-area", "wish-image", "wish-image-preview", "wish-remove-image", "wish-preview-img");

    // Validate image (it's optional)
    const imageValidation = this.imageHandler.validateImage();
    if (!imageValidation.valid) {
      this.showNotification(imageValidation.message, "error");
      return;
    }

    // Validate form
    const wishName = document.getElementById("wish-name");
    if (!wishName || !wishName.value.trim()) {
      this.showNotification("Please enter a plant name for your wish", "error");
      return;
    }

    const wishLink = document.getElementById("wish-link");

    // Get form data
    const wishData = {
      name: wishName.value.trim(),
      note: document.getElementById("wish-note").value.trim(),
      link: wishLink?.value.trim() || "",
      image: this.imageHandler.getImageData(),
      createdAt: new Date().toISOString(),
    };

    try {
      this.wishlistManager.addWish(wishData);

      this.showNotification("Wish added to your list!", "success");

      // Reset form and update view
      this.imageHandler.clearImage();
      document.getElementById("wishlist-form").reset();
      this.wishlistManager.renderWishlist(this.wishlistManager.getWishes());

    } catch (error) {
      this.showNotification("Error adding wish: " + error.message, "error");
    }
  }

  /**
   * Renders the detail view for a plant, including the Journal tab.
   * @param {string} plantId - The ID of the plant.
   */
  showPlantDetail(plantId) {
    const plant = this.plantManager.getPlantById(plantId);
    if (!plant) {
      this.showNotification("Plant not found", "error");
      return;
    }

    const lightIcons = {
      low: "fas fa-moon",
      medium: "fas fa-sun",
      bright: "fas fa-sun",
    };

    const modalContent = document.getElementById("modal-content");
    if (!modalContent) return;

    // Use placeholder if no image
    const imageSrc = plant.image || "assets/images/demo_pic.png";
    
    // --- Modal Structure with Tabs ---
    modalContent.innerHTML = `
            <div class="plant-detail-container" data-plant-id="${plantId}">
                <div class="detail-header">
                    <img src="${imageSrc}" 
                        alt="${plant.name}" 
                        class="detail-image"
                        onerror="this.src='httpshttps://via.placeholder.com/400x300/8bb574/ffffff?text=🌿'">
                    <div class="detail-info">
                        <h2>${this.escapeHtml(plant.name)}</h2>
                        ${plant.species ? `<p class="detail-species">${this.escapeHtml(plant.species)}</p>` : ""}
                        <div class="detail-meta">
                            <span class="detail-type">${plant.type}</span>
                            <span class="detail-light">
                                <i class="${lightIcons[plant.light] || "fas fa-sun"}"></i> ${plant.light} Light
                            </span>
                        </div>
                        <p><small>Added: ${new Date(plant.createdAt).toLocaleDateString()}</small></p>
                    </div>
                </div>

                <div class="detail-tabs">
                    <button class="tab-btn active" data-tab="info">Info</button>
          <button class="tab-btn" data-tab="journal">Journal (${plant.journal?.length || 0})</button>
          <button class="tab-btn" data-tab="health">Health (${plant.healthLogs?.length || 0})</button>
                </div>

                <div id="tab-info" class="tab-content active">
                    ${plant.notes ? `
                        <div class="detail-notes">
                            <h3>Care Notes</h3>
                            <p>${this.escapeHtml(plant.notes)}</p>
                        </div>` : `<p class="empty-state-small">No specific care notes recorded.</p>`
                    }
                    <div class="form-actions">
                        <button class="btn-secondary" id="modal-delete-btn" data-plant-id="${plantId}">
                            <i class="fas fa-trash"></i> Delete Plant
                        </button>
                    </div>
                </div>

                <div id="tab-journal" class="tab-content">
                    <h3>New Journal Entry</h3>
                    <form id="journal-form" class="journal-form" data-plant-id="${plantId}">
                        <div class="form-group">
                            <label for="journal-note">Observation/Note *</label>
                            <textarea id="journal-note" rows="2" required placeholder="New leaf, watering, pest notice, etc."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="journal-image">Optional Photo Progress</label>
                            <div class="image-upload">
                                <div class="upload-area" id="journal-upload-area">
                                    <i class="fas fa-camera"></i>
                                    <p>Click to upload image</p>
                                    <input type="file" id="journal-image" accept="image/*" hidden />
                                </div>
                                <div class="image-preview hidden" id="journal-image-preview">
                                    <img id="journal-preview-img" src="" alt="Preview" />
                                    <button type="button" id="journal-remove-image" class="btn-remove">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="form-actions journal-actions">
                            <small class="date-display">Date: ${new Date().toLocaleDateString()}</small>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-pen"></i> Add Entry
                            </button>
                        </div>
          .         </form>

                    <h3 class="journal-history-header">History</h3>
                    <div id="journal-entries-container" class="journal-entries-container">
                        ${this.renderJournalHistory(plant.journal || [])}
                    </div>
  t             </div>

        <div id="tab-health" class="tab-content">
          <h3>Record Health Event</h3>
          <form id="health-form" class="health-form" data-plant-id="${plantId}">
            <div class="form-group">
              <label for="health-type">Event Type *</label>
              <select id="health-type" required>
                <option value="watering">Watering</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="growth">Growth / Photo</option>
                <option value="pest">Pest / Disease</option>
                <option value="general">General</option>
              </select>
            </div>

            <div class="form-group">
              <label for="health-date">Date *</label>
              <input type="date" id="health-date" required value="${new Date().toISOString().split('T')[0]}" />
            </div>

            <div class="form-group">
              <label for="health-notes">Notes</label>
              <textarea id="health-notes" rows="2" placeholder="Notes about watering, fertilizer, pests, growth..."></textarea>
            </div>

            <div class="form-group">
              <label>Photo (optional)</label>
              <div class="image-upload">
                <div class="upload-area" id="health-upload-area">
                  <i class="fas fa-camera"></i>
                  <p>Click to upload image</p>
Note: Code-heavy output has been truncated.`
}}
