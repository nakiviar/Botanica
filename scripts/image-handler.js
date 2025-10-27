class ImageHandler {
    constructor() {
        // The handler is initialized externally by BotanicalApp.showPage().
    }

    /**
     * Initializes the ImageHandler with specific DOM element IDs.
     * This makes the handler reusable for different forms (e.g., 'add-plant' and 'wishlist').
     * @param {string} uploadAreaId - ID of the clickable upload area (div).
     * @param {string} imageInputId - ID of the file input element.
     * @param {string} imagePreviewId - ID of the container for the preview image.
     * @param {string} removeBtnId - ID of the button to remove the image.
     * @param {string} previewImgId - ID of the actual <img> element inside the preview.
     */
    initHandler(uploadAreaId, imageInputId, imagePreviewId, removeBtnId, previewImgId) {
        this.destroyEventListeners();

        // Set new elements based on dynamic IDs
        this.uploadArea = document.getElementById(uploadAreaId);
        this.imageInput = document.getElementById(imageInputId);
        this.imagePreview = document.getElementById(imagePreviewId);
        this.previewImg = document.getElementById(previewImgId);
        this.removeBtn = document.getElementById(removeBtnId);

        if (!this.uploadArea || !this.imageInput) {
            console.error('ImageHandler: required DOM elements not found for current form.');
            return;
        }

        this.imageInput.setAttribute('accept', 'image/*');
        this.initEventListeners();
    }

    /**
     * Removes event listeners from previous elements to prevent conflicts when re-initializing.
     */
    destroyEventListeners() {
        // Remove existing listeners if elements exist
        if (this.uploadArea && this._uploadAreaClickListener) {
            this.uploadArea.removeEventListener('click', this._uploadAreaClickListener);
            this.uploadArea.removeEventListener('dragover', this._dragOverListener);
            this.uploadArea.removeEventListener('dragleave', this._dragLeaveListener);
            this.uploadArea.removeEventListener('drop', this._dropListener);
        }
        if (this.imageInput && this._imageInputChangeListener) {
            this.imageInput.removeEventListener('change', this._imageInputChangeListener);
        }
        if (this.removeBtn && this._removeBtnClickListener) {
            this.removeBtn.removeEventListener('click', this._removeBtnClickListener);
        }

        // Reset element references
        this.uploadArea = null;
        this.imageInput = null;
        this.imagePreview = null;
        this.previewImg = null;
        this.removeBtn = null;
    }

    initEventListeners() {
        // Store bound functions to allow removal later
        this._uploadAreaClickListener = () => this.imageInput.click();
        this._imageInputChangeListener = (e) => this.handleImageSelect(e);
        this._removeBtnClickListener = (e) => { e.stopPropagation(); this.clearImage(); };

        // Drag/Drop listeners need separate handling to reset styles correctly
        this._dragOverListener = (e) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            this.uploadArea.style.background = 'var(--accent)';
            this.uploadArea.style.color = 'var(--white)';
        };

        this._dragLeaveListener = (e) => {
            e.preventDefault();
            this.uploadArea.style.background = 'var(--light)';
            this.uploadArea.style.color = 'var(--text)';
        };

        this._dropListener = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.uploadArea.style.background = 'var(--light)';
            this.uploadArea.style.color = 'var(--text)';

            const files = (e.dataTransfer && e.dataTransfer.files) || [];
            if (files.length > 0 && files[0].type && files[0].type.startsWith('image/')) {
                // Use DataTransfer to create a writable FileList for the input
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                this.imageInput.files = dt.files;
                this.handleImageSelect();
                if (e.dataTransfer && e.dataTransfer.clearData) e.dataTransfer.clearData();
            } else {
                console.warn('Dropped item is not an image');
            }
        };

        // Click on upload area triggers file input
        this.uploadArea.addEventListener('click', this._uploadAreaClickListener);
        // Handle file selection
        this.imageInput.addEventListener('change', this._imageInputChangeListener);
        // Handle drag and drop
        this.uploadArea.addEventListener('dragover', this._dragOverListener);
        this.uploadArea.addEventListener('dragleave', this._dragLeaveListener);
        this.uploadArea.addEventListener('drop', this._dropListener);
        // Remove image
        if (this.removeBtn) {
            this.removeBtn.addEventListener('click', this._removeBtnClickListener);
        }
    }

    handleImageSelect(event) {
        // Prefer the input's FileList (set via DataTransfer from drop) for consistency
        const file = (this.imageInput && this.imageInput.files && this.imageInput.files[0]) ||
                     (event && event.target && event.target.files && event.target.files[0]);

        if (!file) {
            console.warn('No file selected');
            return;
        }

        if (!file.type || !file.type.startsWith('image/')) {
            console.warn('Selected file is not an image');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            this.previewImg.src = e.target.result;
            this.uploadArea.classList.add('hidden');
            this.imagePreview.classList.remove('hidden');
        };

        reader.readAsDataURL(file);
    }

    clearImage() {
        if (this.imageInput) {
            // Clear files safely by resetting the input value
            try {
                this.imageInput.value = '';
            } catch (err) {
                // Fallback: replace input element if clearing value is blocked (e.g., security restrictions)
                const newInput = this.imageInput.cloneNode(true);
                this.imageInput.parentNode.replaceChild(newInput, this.imageInput);
                this.imageInput = newInput;
                // Re-initialize listeners for the new input element
                this.destroyEventListeners();
                this.initEventListeners();
            }
        }
        if (this.previewImg) this.previewImg.src = '';
        if (this.imagePreview) this.imagePreview.classList.add('hidden');
        if (this.uploadArea) this.uploadArea.classList.remove('hidden');
    }

    getImageData() {
        if (this.previewImg && this.previewImg.src && this.previewImg.src.startsWith('data:')) {
            return this.previewImg.src;
        }
        return null;
    }

    validateImage() {
        // Check if elements are initialized before checking files
        if (!this.imageInput) {
            // Treat as valid if no image input is available (e.g., on pages where no image is required)
            return { valid: true };
        }

        const file = (this.imageInput.files && this.imageInput.files[0]) || null;

        // If optional image is not provided, it's valid
        if (!file) {
            return { valid: true };
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { valid: false, message: 'Image must be less than 5MB' };
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return { valid: false, message: 'Please select a valid image (JPEG, PNG, GIF, WebP)' };
        }

        return { valid: true };
    }
}