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
const formGaleri1Value = document.getElementById('formGaleri1Value');
const formGaleri2Value = document.getElementById('formGaleri2Value');
const formPassword = document.getElementById('formPassword');
const formMapsUrl = document.getElementById('formMapsUrl');
const umkmForm = document.getElementById('umkmForm');

// Inisialisasi Dropzone Foto Utama
const dropzoneUtama = setupImageDropzone(
    document.getElementById('formGambarDropzone'),
    document.getElementById('formGambarFileInput'),
    document.getElementById('formGambarPreviewContainer'),
    document.getElementById('formGambarPreviewImg'),
    document.getElementById('formGambarRemoveBtn'),
    (base64Data) => {
        if (formGambarValue) formGambarValue.value = base64Data || '';
    }
);

// Inisialisasi Dropzone Galeri 1
const dropzoneGaleri1 = setupImageDropzone(
    document.getElementById('formGaleri1Dropzone'),
    document.getElementById('formGaleri1FileInput'),
    document.getElementById('formGaleri1PreviewContainer'),
    document.getElementById('formGaleri1PreviewImg'),
    document.getElementById('formGaleri1RemoveBtn'),
    (base64Data) => {
        if (formGaleri1Value) formGaleri1Value.value = base64Data || '';
    }
);

// Inisialisasi Dropzone Galeri 2
const dropzoneGaleri2 = setupImageDropzone(
    document.getElementById('formGaleri2Dropzone'),
    document.getElementById('formGaleri2FileInput'),
    document.getElementById('formGaleri2PreviewContainer'),
    document.getElementById('formGaleri2PreviewImg'),
    document.getElementById('formGaleri2RemoveBtn'),
    (base64Data) => {
        if (formGaleri2Value) formGaleri2Value.value = base64Data || '';
    }
);

async function initFormPage() {
    // 1. Fetch seluruh data dari database
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

            // 1. Set Foto Utama
            if (umkm.gambar && umkm.gambar !== 'placeholder.jpg') {
                formGambarValue.value = umkm.gambar;
                if (dropzoneUtama) {
                    dropzoneUtama.showPreview(getImagePath(umkm.gambar));
                }
            }

            // 2. Set Foto Galeri 1 & Galeri 2
            if (umkm.galeri && Array.isArray(umkm.galeri)) {
                if (umkm.galeri[0]) {
                    formGaleri1Value.value = umkm.galeri[0];
                    if (dropzoneGaleri1) {
                        dropzoneGaleri1.showPreview(getImagePath(umkm.galeri[0]));
                    }
                }
                if (umkm.galeri[1]) {
                    formGaleri2Value.value = umkm.galeri[1];
                    if (dropzoneGaleri2) {
                        dropzoneGaleri2.showPreview(getImagePath(umkm.galeri[1]));
                    }
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

        // Kumpulkan array galeri foto
        const galeriList = [];
        if (formGaleri1Value && formGaleri1Value.value.trim()) {
            galeriList.push(formGaleri1Value.value.trim());
        }
        if (formGaleri2Value && formGaleri2Value.value.trim()) {
            galeriList.push(formGaleri2Value.value.trim());
        }

        const dataSubmit = {
            nama: formNama.value.trim(),
            kategori: formKategori.value,
            whatsapp: formWhatsapp.value.trim(),
            alamat: formAlamat.value.trim(),
            deskripsi: formDeskripsi.value.trim(),
            gambar: formGambarValue ? (formGambarValue.value.trim() || 'placeholder.jpg') : 'placeholder.jpg',
            galeri: galeriList,
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
