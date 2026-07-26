# Rencana Implementasi: Fitur Upload Gambar Kustom UMKM & Pemegang UMKM

Fitur ini menambahkan kemampuan upload gambar kustom (dengan format `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif`) pada formulir Tambah/Edit UMKM bagi **Admin Desa** (`form_umkm.html`) serta pada Dashboard **Pemilik UMKM** (`owner.html`) untuk foto profil toko dan galeri produk.

---

## User Review Required

> [!IMPORTANT]
> - **Format Berkas Yang Didukung**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif` (Ukuran maksimum berkas mentah: 5MB).
> - **Otomatisasi Kompresi Canvas**: Berkas gambar yang diunggah oleh pengguna akan otomatis dikompresi dan disesuaikan ukurannya (maksimum dimensi 1000px) menggunakan Canvas HTML5 menjadi Data URL Base64 yang efisien. Hal ini menjaga agar penyimpanan `localStorage` & Supabase tetap ringan dan super cepat!
> - **Pratinjau Langsung (Live Preview)**: Pengguna dapat melihat pratinjau gambar secara langsung saat memilih berkas, serta memiliki tombol hapus/ganti berkas sebelum data disimpan.
> - **Kompatibilitas Mundur**: Gambar lama yang berbasis nama file lokal (`assets/images/xxx.jpg`) tetap didukung dan akan dirender secara sempurna berdampingan dengan gambar hasil unggahan pengguna (Data URL).

---

## Proposed Changes

### 1. Utility & Helper Module (Modul Pembantu Upload Gambar)

#### [NEW] [image_uploader.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/utils/image_uploader.js)
* Membuat utilitas mandiri untuk:
  * **`validateImageFile(file)`**: Memeriksa ekstensi dan MIME type berkas gambar (JPG, PNG, WEBP, HEIC, HEIF) serta batasan ukuran berkas (maksimal 5MB).
  * **`compressAndConvertToBase64(file, maxWidth, maxHeight, quality)`**: Membaca file dengan `FileReader`, lalu memprosesnya melalui HTML5 Canvas untuk memperkecil resolusi & mengompresi ke Data URL Base64 yang optimal.
  * **`setupImageDropzone(...)`**: Menangani event Drag & Drop, klik area dropzone, serta pembaruan elemen pratinjau gambar secara responsif.
  * **`getImagePath(imgSrc)`**: Helper universal yang mengembalikan URL gambar yang valid—baik jika nilainya berupa Data URL (`data:image/...`), URL external (`http://...`), maupun nama berkas lokal (`assets/images/...`).

---

### 2. Styling (Penggayaan Tampilan Upload Dropzone & Preview)

#### [MODIFY] [global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css) & [main.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/main.css)
* Menambahkan CSS kelas kustom untuk area unggah berkas (`.image-upload-dropzone`):
  * State hover & dragover dengan border putus-putus (*dashed border*) bergaya modern.
  * Ikon kamera/upload, petunjuk format yang didukung, dan teks instruksi.
  * Wadah pratinjau gambar (`.image-preview-container`) dengan animasi fade-in, ukuran thumbnail yang pas, dan tombol hapus (`.btn-remove-preview`).

---

### 3. Form Admin Tambah / Edit UMKM

#### [MODIFY] [form_umkm.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/form_umkm.html)
* Mengganti input teks biasa `formGambar` dengan Komponen Upload Dropzone + Input File (`<input type="file" accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif">`) dan kontainer pratinjau gambar.

#### [MODIFY] [form_umkm_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/form_umkm_app.js)
* Mengintegrasikan `setupImageDropzone` pada halaman form admin.
* Saat mode Edit: Menampilkan gambar UMKM yang sudah ada pada pratinjau.
* Saat submit: Mengambil Base64 Data URL dari gambar baru yang diunggah (atau mempertahankan gambar lama jika tidak diubah) untuk disimpan via `UmkmService`.

---

### 4. Dashboard Pemilik UMKM (Owner Dashboard)

#### [MODIFY] [owner.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/owner.html)
* Mengganti input teks gambar profil `ownerGambar` dengan Komponen Upload Dropzone & Live Preview.
* Mengganti input teks galeri produk `ownerGalleryInput` dengan Komponen Upload File gambar galeri + Live Preview thumbnail sebelum ditambahkan.

#### [MODIFY] [owner_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/owner_app.js)
* Memasang handler unggah gambar pada form profil pemilik (`ownerProfileForm`) dan form tambah foto galeri (`ownerAddGalleryForm`).
* Menyimpan gambar profil baru dan foto galeri berbasis Base64 ke Supabase / `localStorage`.

---

### 5. Kompatibilitas Rendering Gambar di Seluruh Halaman

#### [MODIFY] [umkm_card.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/components/umkm_card.js)
* Memperbarui atribut `src` gambar kartu menggunakan `getImagePath(this.umkm.gambar)`.

#### [MODIFY] [detail_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/detail_app.js)
* Memperbarui rujukan gambar utama dan thumbnail galeri menggunakan `getImagePath()`.

#### [MODIFY] [admin_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/admin_app.js)
* Memperbarui thumbnail foto UMKM pada tabel admin menggunakan `getImagePath(item.gambar)`.

#### [MODIFY] [map_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/map_app.js)
* Memperbarui rujukan gambar pada pop-up peta 3D menggunakan `getImagePath(umkm.gambar)`.

---

## Verification Plan

### Manual Verification
1. **Pengujian Form Admin (`form_umkm.html`)**:
   - Buka form tambah UMKM baru sebagai Admin.
   - Seret atau pilih berkas gambar (JPG/PNG/WEBP).
   - Pastikan pratinjau gambar muncul secara instan.
   - Simpan UMKM baru dan verifikasi apakah foto muncul di Tabel Admin (`admin.html`) dan Katalog (`Main page.html`).
   - Coba lakukan **Edit** pada UMKM tersebut dan ganti gambarnya dengan gambar lain.

2. **Pengujian Dashboard Pemilik UMKM (`owner.html`)**:
   - Login sebagai Pemilik UMKM.
   - Unggah foto profil usaha baru menggunakan file picker. Simpan dan cek perubahannya di Halaman Detail (`Detail produk.html`).
   - Unggah foto galeri produk baru menggunakan upload file picker. Pastikan foto muncul di daftar galeri dan di Halaman Detail.

3. **Pengujian Validasi Berkas**:
   - Coba unggah berkas yang bukan gambar (misal `.pdf` atau `.txt`) dan pastikan muncul notifikasi/peringatan format tidak sesuai.
   - Coba unggah berkas gambar berukuran sangat besar (>5MB) dan pastikan kompresi Canvas berjalan tanpa *error*.
