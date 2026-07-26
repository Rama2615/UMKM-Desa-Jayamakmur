# Rencana Implementasi: 3D Infinite Marquee Showcase Background

Rencana ini merealisasikan keinginan pengguna untuk merancang **3D Marquee Showcase Wall** yang bergerak secara terus-menerus (*infinite continuous scroll*) sebagai latar belakang interaktif pada Landing Page (`index.html`), dengan menggunakan foto-foto asli UMKM dari berkas aset proyek (`assets/images/`).

---

## User Review Required

> [!IMPORTANT]
> - **3D Infinite Marquee Wall (Dinding Kartu 3D Bergerak)**: Dinding kartu bertingkat (*multi-track horizontal marquee*) yang menampilkan foto-foto asli produk & usaha UMKM Desa Jayamakmur (Es Doger Mang Ulis, Seblak, Toko Opak Bu Eli, Pangkas Rambut One Man, Jahit Pak Ceming, Warung Sayur, dll. beserta gambar unggahan kustom).
> - **Animasi Miring 3D & Infinite Loop**: Kartu disusun dalam sudut perspektif 3D (*3D perspective tilt & depth*) dan bergerak secara sinambung (*seamless loop*) tanpa henti.
> - **Interaktivitas Hover & Klik**:
>   - Saat kursor mouse berada di atas marquee, gerakan melambat secara halus.
>   - Kartu yang di-hover akan terangkat ke depan secara 3D (*translateZ 40px*) dengan efek cahaya glowing.
>   - Setiap kartu dapat diklik untuk langsung membuka halaman detail UMKM (`Detail produk.html?id=...`).
> - **Kontras Teks & Keterbacaan**: Ditambahkan kontainer *Glassmorphism* di bagian tengah agar teks utama "Selamat Datang di JayamakmurHub" tetap terbaca dengan jelas dan kontras tinggi.

---

## Proposed Changes

### 1. Modul Dynamic 3D Marquee Wall

#### [NEW] [marquee_3d.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/components/marquee_3d.js)
* Memuat seluruh data UMKM secara dinamis dari `UmkmService` (termasuk gambar lokal & gambar Base64 yang diunggah pengguna).
* Membangun dua atau tiga baris trek kartu marquee 3D yang bergerak berlawanan arah secara terus-menerus.
* Menangani pembentukan kartu bermuka 3D (*rounded 3D cards*), gambar beresolusi tinggi, lencana kategori, dan tautan langsung ke halaman detail.

---

### 2. Styling 3D Marquee & Perspektif

#### [MODIFY] [landing.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/landing.css)
* Menambahkan CSS untuk `.marquee-3d-wrapper` dan `.marquee-3d-track`:
  * Transformasi perspektif 3D (`perspective: 1200px`, `rotateY(-12deg) rotateX(6deg)`).
  * Animasi CSS keyframe `marqueeScrollLeft` dan `marqueeScrollRight` dengan durasi halus (*linear infinite*).
  * Efek visual kartu rounded, bayangan mengambang (*floating 3D shadow*), kilauan cahaya, dan tombol "Lihat Detail".
  * Overlay gradien kaca (*Glassmorphism*) di bagian tengah agar konten teks utama menonjol secara estetis.

---

### 3. Integrasi Layout & Aplikasi

#### [MODIFY] [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)
* Menyisipkan kontainer `<div id="marquee3dWrapper" class="marquee-3d-wrapper"></div>` di bagian Hero Banner.

#### [MODIFY] [landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js)
* Mengimpor dan menginisialisasi `init3DMarqueeWall(umkmService.daftarUmkm)` saat data UMKM siap dimuat.

---

## Verification Plan

### Manual Verification
1. **Pengujian Animasi 3D Infinite Marquee**:
   - Buka `index.html` dan perhatikan barisan kartu foto UMKM bergerak secara kontinu di latar belakang.
   - Verifikasi foto-foto yang ditampilkan adalah foto asli produk UMKM dari folder `assets/images/` (Es Doger, Toko Opak, Seblak, dll.).
2. **Pengujian Interaktivitas Hover & Navigasi**:
   - Dekatkan kursor ke salah satu kartu yang sedang bergerak. Pastikan gerakan melambat/berhenti secara halus dan kartu menonjol keluar secara 3D.
   - Klik kartu tersebut dan pastikan halaman berpindah ke `Detail produk.html` dengan data UMKM yang sesuai.
