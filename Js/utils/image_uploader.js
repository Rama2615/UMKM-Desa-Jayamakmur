/**
 * Image Uploader & Image Resolution Utility
 * JayamakmurHub - Modul Penanganan Upload, Validasi, Kompresi Canvas, dan Smart Image Resolution
 */

// Format ekstensi & MIME type yang didukung
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
const MAX_FILE_SIZE_MB = 5;

// Pemetaan Foto Kategori & Nama UMKM (Digunakan saat berkas .HEIC tidak dapat di-render langsung oleh browser dekstop)
const SPECIFIC_PHOTOS = {
    'es doger': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    'pangkas rambut': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    'warung bu miswaroh': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    'cilok': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    'warung radja': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    'sayur': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    'opak': 'assets/images/Toko Opak Ibu Eli 2.PNG',
    'jahit': 'assets/images/Jahit Pak Ceming.PNG',
    'mie ayam': 'assets/images/Mie Ayam Bakso, Seblak Mang Ulis.jpg',
    'madura': 'assets/images/Warung Madura Tiga Putri.PNG'
};

const CATEGORY_FALLBACKS = {
    'kuliner': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    'jasa': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    'kerajinan': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
};

/**
 * Validasi Berkas Gambar
 */
export function validateImageFile(file) {
    if (!file) {
        return { valid: false, error: 'Tidak ada berkas yang dipilih.' };
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
        return { valid: false, error: `Ukuran berkas (${fileSizeMB.toFixed(1)}MB) melebihi batas maksimal ${MAX_FILE_SIZE_MB}MB.` };
    }

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
 * Mengonversi & Mengompresi Berkas Gambar menjadi Base64 Data URL
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

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

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
 * Memastikan gambar berkas .HEIC yang tidak bisa diproses browser dekstop otomatis mendapat foto pendukung yang relevan & menarik
 */
export function getImagePath(imgSrc, umkmName = '', category = 'Kuliner') {
    if (!imgSrc || imgSrc === 'placeholder.jpg') {
        return getSmartFallback(umkmName, category);
    }
    
    // Jika format gambar adalah Base64, HTTP URL, atau Blob
    if (imgSrc.startsWith('data:') || imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('blob:')) {
        return imgSrc;
    }

    const lowerSrc = imgSrc.toLowerCase();

    // Jika berkas adalah .HEIC / .HEIF (format khusus iPhone yang tidak didukung browser Windows/Chrome standar)
    if (lowerSrc.endsWith('.heic') || lowerSrc.endsWith('.heif')) {
        return getSmartFallback(umkmName || imgSrc, category);
    }

    return `assets/images/${imgSrc}`;
}

/**
 * Mendapatkan foto pendukung pintar berdasarkan nama atau kategori UMKM
 */
export function getSmartFallback(name = '', category = 'Kuliner') {
    const lowerName = (name || '').toLowerCase();
    
    for (const key in SPECIFIC_PHOTOS) {
        if (lowerName.includes(key)) {
            return SPECIFIC_PHOTOS[key];
        }
    }

    const lowerCat = (category || 'kuliner').toLowerCase();
    return CATEGORY_FALLBACKS[lowerCat] || CATEGORY_FALLBACKS['kuliner'];
}

/**
 * Memasang Interaksi Dropzone & Preview Gambar
 */
export function setupImageDropzone(dropzoneEl, fileInputEl, previewContainerEl, previewImgEl, removeBtnEl, onImageSelected) {
    if (!dropzoneEl || !fileInputEl) return;

    dropzoneEl.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-preview')) return;
        fileInputEl.click();
    });

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

    dropzoneEl.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    fileInputEl.addEventListener('change', (e) => {
        if (fileInputEl.files && fileInputEl.files.length > 0) {
            handleFileSelect(fileInputEl.files[0]);
        }
    });

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
