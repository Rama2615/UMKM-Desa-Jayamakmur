# Rencana Implementasi: Mobile Versatility & Ultra-Responsive Enhancement

Rencana ini merealisasikan peningkatan versatilitas website **UMKM Desa Jayamakmur** agar tampil responsif, elegan, dan *user-friendly* pada semua ukuran perangkat (Mobile Phone, Tablet, Laptop, dan Desktop).

---

## User Review Required

> [!IMPORTANT]
> - **Mobile Hamburger Navigation Menu**: Menambahkan menu navigasi beranimasi halus (*collapsible drawer / mobile overlay*) pada [navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js) & [global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css).
> - **Responsive Data Tables**: Menambahkan kontainer scrollable horizontal & gaya tampilan kartu responsif pada tabel dashboard [admin.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/admin.html) dan [owner.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/owner.html).
> - **Form & Modal Responsiveness**: Menyesuaikan modal overlay login & registrasi di [auth.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/auth.css) agar pas di layar kecil HP tanpa terpotong (*scrollable modal body*).
> - **Touch-Friendly Controls**: Memastikan target sentuh tombol (seperti tombol WhatsApp, Ubah Tema, Rute, Login, Logout) berukuran minimum 44px dengan efek sentuh yang nyaman di Smartphone.

---

## Proposed Changes

### 1. Navigasi & Mobile Menu Drawer System

#### [MODIFY] [global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css)
* Menambahkan styling untuk `.navbar-toggle-btn` (tombol hamburger `☰` / `✕`) yang muncul secara otomatis pada layar `<=` 768px.
* Mengubah tampilan `.navbar-links` di layar HP menjadi menu dropdown / sliding drawer dengan efek glassmorphism, animasi `slideDown`, dan penyesuaian posisi pengubah tema (Theme Toggle).

#### [MODIFY] [navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js)
* Memasang tombol hamburger dinamis ke dalam `.navbar-container`.
* Menambahkan *event listener* `toggleNavbar()` untuk membuka/menutup menu di HP secara interaktif.
* Menutup menu secara otomatis ketika pengguna mengklik salah satu tautan navigasi.

---

### 2. Dashboard & Form Responsiveness

#### [MODIFY] [auth.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/auth.css)
* Menambahkan gaya responsif untuk tabel dashboard admin & pemilik UMKM di layar HP (horizontal scroll & touch-friendly action buttons).
* Mengoptimalkan form modal login, pendaftaran UMKM, dan welcome overlay agar 100% pas di layar HP dengan opsi scroll jika konten melebihi tinggi layar (`max-height: 90vh`).

---

### 3. Layout Katalog, Detail Produk, & Peta Desa

#### [MODIFY] [main.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/main.css)
* Mengatur bilah pencarian & filter kategori pada [Main page.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main page.html) agar berbaris vertikal di HP secara rapi.
* Memastikan grid kartu UMKM berpindah ke 1 kolom dengan margin yang pas di Smartphone.

#### [MODIFY] [detail.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/detail.css)
* Memastikan foto galeri produk dan informasi kontak di [Detail produk.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Detail produk.html) menumpuk vertikal secara elegan di HP.

---

## Verification Plan

### Manual Verification
1. **Pengujian Layar Mobile & Responsive Toggle**:
   - Buka website dan sesuaikan ukuran jendela browser (atau gunakan Chrome DevTools Device Toolbar mode Mobile HP iPhone/Android).
   - Pastikan tombol Hamburger (`☰`) muncul di kanan navbar.
   - Klik tombol Hamburger dan verifikasi menu navigasi meluncur kebawah dengan smooth.
2. **Pengujian Form & Dashboard di Mobile**:
   - Buka halaman Dashboard Admin [admin.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/admin.html) dan Pemilik [owner.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/owner.html) pada mode mobile.
   - Verifikasi tabel data UMKM dapat digeser secara horizontal tanpa merusak tata letak halaman.
   - Buka modal Tambah/Edit UMKM dan verifikasi form dapat diisi & iscroll dengan nyaman di HP.
