/**
 * Image Uploader Utility
 * JayamakmurHub - Modul Penanganan Upload, Validasi, Kompresi Canvas, dan Resolution Helper
 */

// Format ekstensi & MIME type yang didukung
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
const MAX_FILE_SIZE_MB = 5;

/**
 * Validasi Berkas Gambar
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
    if (!file) {
        return { valid: false, error: 'Tidak ada berkas yang dipilih.' };
    }

    // Cek ukuran berkas
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
        return { valid: false, error: `Ukuran berkas (${fileSizeMB.toFixed(1)}MB) melebihi batas maksimal ${MAX_FILE_SIZE_MB}MB.` };
    }

    // Cek ekstensi & mime type
    const fileNameParts = file.name.split('.');
    const ext = fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : '';
    const isMimeValid = file.type.startsWith('image/') || file.type === '';
    const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

    if (!isExtValid && !isMimeValid) {
        return { valid: false, error: `Format berkas .${ext} tidak didukung. Harap pilih gambar format JPG, JPEG, PNG, WEBP, HEIC, atau HEIF.` };
    }

    return { valid: true };
}

/**
 * Mengonversi & Mengompresi Berkas Gambar menjadi Base64 Data URL menggunakan HTML5 Canvas
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 
 * @returns {Promise<string>}
 */
export function compressAndConvertToBase64(file, maxWidth = 1000, maxHeight = 1000, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
            return reject(new Error(validation.error));
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Hitung aspek rasio baru jika ukuran lebih besar dari maxWidth/maxHeight
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                // Gambar ke Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Export ke WebP jika didukung, fallback ke JPEG
                let mimeType = 'image/jpeg';
                if (file.type === 'image/png' || file.type === 'image/webp') {
                    mimeType = file.type;
                }

                const dataUrl = canvas.toDataURL(mimeType, quality);
                resolve(dataUrl);
            };

            img.onerror = () => {
                reject(new Error('Gagal membaca gambar. Berkas mungkin rusak.'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('Gagal membaca berkas dengan FileReader.'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Helper universal untuk mendapatkan src path gambar yang valid
 * @param {string} imgSrc 
 * @returns {string}
 */
export function getImagePath(imgSrc) {
    if (!imgSrc || imgSrc === 'placeholder.jpg') {
        return 'assets/images/placeholder.jpg';
    }
    if (imgSrc.startsWith('data:') || imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('blob:')) {
        return imgSrc;
    }
    return `assets/images/${imgSrc}`;
}

/**
 * Memasang Interaksi Dropzone & Preview Gambar
 * @param {HTMLElement} dropzoneEl 
 * @param {HTMLInputElement} fileInputEl 
 * @param {HTMLElement} previewContainerEl 
 * @param {HTMLImageElement} previewImgEl 
 * @param {HTMLElement} removeBtnEl 
 * @param {Function} onImageSelected Callback(base64DataUrl | null)
 */
export function setupImageDropzone(dropzoneEl, fileInputEl, previewContainerEl, previewImgEl, removeBtnEl, onImageSelected) {
    if (!dropzoneEl || !fileInputEl) return;

    // Trigger file picker saat dropzone diklik
    dropzoneEl.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-preview')) return;
        fileInputEl.click();
    });

    // Highlighting Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzoneEl.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzoneEl.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzoneEl.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzoneEl.classList.remove('dragover');
        }, false);
    });

    // Handle Drop
    dropzoneEl.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // Handle Change via Input File
    fileInputEl.addEventListener('change', (e) => {
        if (fileInputEl.files && fileInputEl.files.length > 0) {
            handleFileSelect(fileInputEl.files[0]);
        }
    });

    // Handle Remove Button
    if (removeBtnEl) {
        removeBtnEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearPreview();
            if (onImageSelected) onImageSelected(null);
        });
    }

    async function handleFileSelect(file) {
        try {
            const base64Data = await compressAndConvertToBase64(file);
            showPreview(base64Data);
            if (onImageSelected) onImageSelected(base64Data);
        } catch (error) {
            alert(`⚠️ ${error.message}`);
            fileInputEl.value = '';
        }
    }

    function showPreview(src) {
        if (previewImgEl) previewImgEl.src = src;
        if (previewContainerEl) previewContainerEl.style.display = 'block';
        if (dropzoneEl) dropzoneEl.classList.add('has-preview');
    }

    function clearPreview() {
        if (fileInputEl) fileInputEl.value = '';
        if (previewImgEl) previewImgEl.src = '';
        if (previewContainerEl) previewContainerEl.style.display = 'none';
        if (dropzoneEl) dropzoneEl.classList.remove('has-preview');
    }

    return {
        showPreview,
        clearPreview
    };
}
