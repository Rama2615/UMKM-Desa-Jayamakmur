import { UmkmService } from './Services/umkm_services.js?v=3';
import { initTheme } from './theme.js?v=3';
import { setupImageDropzone, getImagePath } from './utils/image_uploader.js?v=3';

// Inisialisasi tema saat halaman dimuat
initTheme();

const service = new UmkmService();

// DOM Elements
const formTitle = document.getElementById('formTitle');
const formUmkmId = document.getElementById('formUmkmId');
const formNama = document.getElementById('formNama');
const formKategori = document.getElementById('formKategori');
const formWhatsapp = document.getElementById('formWhatsapp');
const formAlamat = document.getElementById('formAlamat');
const formDeskripsi = document.getElementById('formDeskripsi');
const formGambarValue = document.getElementById('formGambarValue');
const formPassword = document.getElementById('formPassword');
const formMapsUrl = document.getElementById('formMapsUrl');
const umkmForm = document.getElementById('umkmForm');

// Inisialisasi Dropzone Foto Utama
const dropzoneController = setupImageDropzone(
    document.getElementById('formGambarDropzone'),
    document.getElementById('formGambarFileInput'),
    document.getElementById('formGambarPreviewContainer'),
    document.getElementById('formGambarPreviewImg'),
    document.getElementById('formGambarRemoveBtn'),
    (base64Data) => {
        if (formGambarValue) {
            formGambarValue.value = base64Data || '';
        }
    }
);

async function initFormPage() {
    // 1. Fetch seluruh data dari database (Supabase / local fallback)
    await service.fetchAllUmkm();

    // 2. Baca URL query parameter 'id'
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // Mode Edit
        const numericId = Number(id);
        const umkm = service.getUmkmById(numericId || id);
        if (umkm) {
            formTitle.textContent = 'Edit Profil UMKM';
            formUmkmId.value = umkm.id;
            formNama.value = umkm.nama || '';
            formKategori.value = umkm.kategori || 'Kuliner';
            formWhatsapp.value = umkm.whatsapp || '';
            formAlamat.value = umkm.alamat || '';
            formDeskripsi.value = umkm.deskripsi || '';
            formPassword.value = umkm.password || '';
            formMapsUrl.value = umkm.mapsUrl || '';

            if (umkm.gambar && umkm.gambar !== 'placeholder.jpg') {
                formGambarValue.value = umkm.gambar;
                if (dropzoneController) {
                    dropzoneController.showPreview(getImagePath(umkm.gambar));
                }
            }
        } else {
            alert('Data UMKM tidak ditemukan.');
            window.location.href = 'admin.html';
        }
    } else {
        // Mode Tambah Baru
        formTitle.textContent = 'Tambah UMKM Baru';
        formUmkmId.value = '';
    }
}

if (umkmForm) {
    umkmForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = formUmkmId.value;
        const dataSubmit = {
            nama: formNama.value.trim(),
            kategori: formKategori.value,
            whatsapp: formWhatsapp.value.trim(),
            alamat: formAlamat.value.trim(),
            deskripsi: formDeskripsi.value.trim(),
            gambar: formGambarValue ? (formGambarValue.value.trim() || 'placeholder.jpg') : 'placeholder.jpg',
            mapsUrl: formMapsUrl.value.trim(),
            password: formPassword.value.trim() || 'owner123'
        };

        try {
            if (id) {
                // Aksi Edit
                await service.updateUmkm(id, dataSubmit);
                alert('Profil UMKM berhasil diperbarui! 💾');
            } else {
                // Aksi Tambah
                await service.addUmkm(dataSubmit);
                alert('UMKM Baru berhasil ditambahkan! 🎉');
            }
            window.location.href = 'admin.html';
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menyimpan data.');
        }
    });
}

// Jalankan inisialisasi
initFormPage();
