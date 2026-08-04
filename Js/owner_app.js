import { UmkmService } from './Services/umkm_services.js';
import { initTheme } from './theme.js';
import { setupImageDropzone, getImagePath } from './utils/image_uploader.js';

// Inisialisasi Tema
initTheme();

const service = new UmkmService();
let loggedOwnerId = localStorage.getItem('logged_owner_id');
let activeUmkm = null;

// DOM Elements
const dashboardTitle = document.getElementById('ownerDashboardTitle');
const btnPreview = document.getElementById('btnPreviewToko');

const profileForm = document.getElementById('ownerProfileForm');
const ownerNama = document.getElementById('ownerNama');
const ownerKategori = document.getElementById('ownerKategori');
const ownerWhatsapp = document.getElementById('ownerWhatsapp');
const ownerAlamat = document.getElementById('ownerAlamat');
const ownerDeskripsi = document.getElementById('ownerDeskripsi');
const ownerGambarValue = document.getElementById('ownerGambarValue');
const ownerMapsUrl = document.getElementById('ownerMapsUrl');

const galleryGrid = document.getElementById('ownerGalleryGrid');
const addGalleryForm = document.getElementById('ownerAddGalleryForm');
const ownerGaleriValue = document.getElementById('ownerGaleriValue');

const passwordForm = document.getElementById('ownerPasswordForm');
const newPasswordInput = document.getElementById('ownerNewPassword');
const confirmPasswordInput = document.getElementById('ownerConfirmPassword');

const toastNotification = document.getElementById('toastNotification');

// Inisialisasi Dropzone Profil Pemilik
const profileDropzoneController = setupImageDropzone(
    document.getElementById('ownerGambarDropzone'),
    document.getElementById('ownerGambarFileInput'),
    document.getElementById('ownerGambarPreviewContainer'),
    document.getElementById('ownerGambarPreviewImg'),
    document.getElementById('ownerGambarRemoveBtn'),
    (base64Data) => {
        if (ownerGambarValue) ownerGambarValue.value = base64Data || '';
    }
);

// Inisialisasi Dropzone Galeri Baru
const galeriDropzoneController = setupImageDropzone(
    document.getElementById('ownerGaleriDropzone'),
    document.getElementById('ownerGaleriFileInput'),
    document.getElementById('ownerGaleriPreviewContainer'),
    document.getElementById('ownerGaleriPreviewImg'),
    document.getElementById('ownerGaleriRemoveBtn'),
    (base64Data) => {
        if (ownerGaleriValue) ownerGaleriValue.value = base64Data || '';
    }
);

// Fungsi Toast Notification
function showToast(msg) {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// Render Galeri Foto
function renderGallery() {
    if (!galleryGrid || !activeUmkm) return;
    galleryGrid.innerHTML = '';

    if (!activeUmkm.galeri || activeUmkm.galeri.length === 0) {
        galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 0.85rem; color: #888; padding: 15px 0;">Belum ada foto galeri.</p>`;
        return;
    }

    activeUmkm.galeri.forEach((filename, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-manager-item';
        const imgPath = getImagePath(filename);
        item.innerHTML = `
            <img src="${imgPath}" alt="Galeri ${index + 1}" onerror="this.src='https://placehold.co/100x100?text=Foto'">
            <button type="button" class="btn-delete-gal" data-index="${index}" title="Hapus foto">&times;</button>
        `;
        galleryGrid.appendChild(item);
    });

    // Event Listener Hapus Galeri
    const deleteButtons = galleryGrid.querySelectorAll('.btn-delete-gal');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const index = parseInt(btn.getAttribute('data-index'), 10);
            
            // Konfirmasi hapus
            const konfirmasi = confirm('Apakah Anda yakin ingin menghapus foto ini dari galeri profil?');
            if (konfirmasi) {
                activeUmkm.galeri.splice(index, 1);
                
                // Simpan perubahan ke service
                await service.updateUmkm(activeUmkm.id, { galeri: activeUmkm.galeri });
                showToast('Foto galeri berhasil dihapus! 🗑️');
                renderGallery();
            }
        });
    });
}

// Inisialisasi Setup Awal
async function initOwnerApp() {
    await service.fetchAllUmkm();
    
    // Tarik data UMKM yang sedang login
    activeUmkm = service.getUmkmById(loggedOwnerId);
    if (!activeUmkm) {
        alert('⚠️ Profil UMKM pengelola tidak ditemukan! Kembali ke beranda.');
        localStorage.removeItem('user_role');
        localStorage.removeItem('logged_owner_id');
        window.location.href = 'index.html';
        return;
    }

    // Tampilkan informasi ke Form
    if (dashboardTitle) dashboardTitle.textContent = `Dashboard: ${activeUmkm.nama}`;
    if (btnPreview) btnPreview.href = `Detail produk.html?id=${activeUmkm.id}`;

    if (ownerNama) ownerNama.value = activeUmkm.nama;
    if (ownerKategori) ownerKategori.value = activeUmkm.kategori;
    if (ownerWhatsapp) ownerWhatsapp.value = activeUmkm.whatsapp;
    if (ownerAlamat) ownerAlamat.value = activeUmkm.alamat;
    if (ownerDeskripsi) ownerDeskripsi.value = activeUmkm.deskripsi;
    if (ownerMapsUrl) ownerMapsUrl.value = activeUmkm.mapsUrl || '';

    if (activeUmkm.gambar && activeUmkm.gambar !== 'placeholder.jpg') {
        if (ownerGambarValue) ownerGambarValue.value = activeUmkm.gambar;
        if (profileDropzoneController) {
            profileDropzoneController.showPreview(getImagePath(activeUmkm.gambar));
        }
    }

    // Render Galeri
    renderGallery();
}

// Submit Update Profil
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
            whatsapp: ownerWhatsapp.value.trim(),
            alamat: ownerAlamat.value.trim(),
            deskripsi: ownerDeskripsi.value.trim(),
            gambar: ownerGambarValue ? (ownerGambarValue.value.trim() || 'placeholder.jpg') : 'placeholder.jpg',
            mapsUrl: ownerMapsUrl.value.trim()
        };

        const result = await service.updateUmkm(activeUmkm.id, updatedData);
        if (result) {
            activeUmkm = result;
            showToast('Profil usaha berhasil disimpan! 💾');
        } else {
            alert('Gagal menyimpan profil.');
        }
    });
}

// Submit Tambah Foto Galeri
if (addGalleryForm) {
    addGalleryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newImageSrc = ownerGaleriValue ? ownerGaleriValue.value.trim() : '';

        if (newImageSrc) {
            if (!activeUmkm.galeri) activeUmkm.galeri = [];
            activeUmkm.galeri.push(newImageSrc);

            await service.updateUmkm(activeUmkm.id, { galeri: activeUmkm.galeri });
            showToast('Foto berhasil ditambahkan ke galeri! 📸');
            
            if (ownerGaleriValue) ownerGaleriValue.value = '';
            if (galeriDropzoneController) galeriDropzoneController.clearPreview();
            renderGallery();
        } else {
            alert('⚠️ Harap pilih foto produk terlebih dahulu sebelum menambahkan ke galeri.');
        }
    });
}

// Submit Perbarui Kata Sandi
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert('⚠️ Konfirmasi kata sandi baru tidak cocok!');
            return;
        }

        const result = await service.updateUmkm(activeUmkm.id, { password: newPassword });
        if (result) {
            activeUmkm = result;
            showToast('Kata sandi berhasil diperbarui! 🔑');
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
        } else {
            alert('Gagal memperbarui kata sandi.');
        }
    });
}

initOwnerApp();
