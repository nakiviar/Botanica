class ImageHandler {
    constructor() {
        // Delay initialization until DOM is ready so getElementById finds elements
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._init());
        } else {
            this._init();
        }
    }

    _init() {
        this.uploadArea = document.getElementById('upload-area');
        this.imageInput = document.getElementById('plant-image');
        this.imagePreview = document.getElementById('image-preview');
        this.previewImg = document.getElementById('preview-img');
        this.removeBtn = document.getElementById('remove-image');

        if (!this.uploadArea || !this.imageInput) {
            console.error('ImageHandler: required DOM elements not found.');
            return;
        }

        // allow only images in the file picker
        this.imageInput.setAttribute('accept', 'image/*');

        this.initEventListeners();
    }

    initEventListeners() {
        // Click on upload area triggers file input
        this.uploadArea.addEventListener('click', () => {
            this.imageInput.click();
        });

        // Handle file selection
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageSelect(e);
        });

        // Handle drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            this.uploadArea.style.background = 'var(--accent)';
            this.uploadArea.style.color = 'var(--white)';
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadArea.style.background = 'var(--light)';
            this.uploadArea.style.color = 'var(--text)';
        });

        this.uploadArea.addEventListener('drop', (e) => {
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
                // Call handler without relying on event.target
                this.handleImageSelect();
                if (e.dataTransfer && e.dataTransfer.clearData) e.dataTransfer.clearData();
            } else {
                console.warn('Dropped item is not an image');
            }
        });

        // Remove image
        if (this.removeBtn) {
            this.removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearImage();
            });
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
            // clear files safely
            try {
                this.imageInput.value = '';
            } catch (err) {
                // fallback: replace input element if needed
                const newInput = this.imageInput.cloneNode(true);
                this.imageInput.parentNode.replaceChild(newInput, this.imageInput);
                this.imageInput = newInput;
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
        const file = (this.imageInput && this.imageInput.files && this.imageInput.files[0]) || null;
        if (!file) {
            return { valid: false, message: 'Please select an image' };
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