class ImageHandler {
    constructor() {
        this.uploadArea = document.getElementById('upload-area');
        this.imageInput = document.getElementById('plant-image');
        this.imagePreview = document.getElementById('image-preview');
        this.previewImg = document.getElementById('preview-img');
        this.removeBtn = document.getElementById('remove-image');
        
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
            this.uploadArea.style.background = 'var(--light)';
            this.uploadArea.style.color = 'var(--text)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.imageInput.files = files;
                this.handleImageSelect(e);
            }
        });

        // Remove image
        this.removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearImage();
        });
    }

    handleImageSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.previewImg.src = e.target.result;
                this.uploadArea.classList.add('hidden');
                this.imagePreview.classList.remove('hidden');
            };
            
            reader.readAsDataURL(file);
        }
    }

    clearImage() {
        this.imageInput.value = '';
        this.previewImg.src = '';
        this.imagePreview.classList.add('hidden');
        this.uploadArea.classList.remove('hidden');
    }

    getImageData() {
        if (this.previewImg.src && this.previewImg.src.startsWith('data:')) {
            return this.previewImg.src;
        }
        return null;
    }

    validateImage() {
        const file = this.imageInput.files[0];
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