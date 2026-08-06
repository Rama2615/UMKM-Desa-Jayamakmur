# Walkthrough: Karakter Pemandu Interaktif dengan 3 Speech Bubbles

Telah berhasil ditambahkan komponen **Karakter Pemandu Interaktif (Shopkeeper/Guide)** beserta 3 balon percakapan (*speech bubbles*) beranimasi pada halaman landing page [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html).

---

## 🛠️ Perubahan yang Dilakukan

### 1. Aset Ilustrasi Pemandu
- **[mascot_guide.svg](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/images/mascot_guide.svg)**:
  - Membuat ilustrasi vektor SVG ultra-tajam karakter pemandu lokal Desa Jayamakmur dengan gestur menyambut, celemek denim, dan senyuman hangat.

### 2. Komponen Landing Page (`index.html`)
- **[index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)**:
  - Menambahkan `<section class="container guide-interactive-section reveal">` tepat setelah Hero Section.
  - Sisi Kiri: Karakter pemandu dengan efek *backdrop glow*, *floating animation*, dan badge status aktif.
  - Sisi Kanan: 3 Opsi pilihan berbentuk Balon Percakapan (*Speech Bubbles*):
    1. **Eksplor Katalog**: Mengarahkan langsung ke halaman [`Main page.html`](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html).
    2. **Tentang Kami**: Mengarahkan langsung ke halaman [`tentang.html`](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/tentang.html).
    3. **Layanan Bantuan**: Ditandai dengan badge *"Segera Hadir"* dan tombol interaktif yang dapat diklik.
  - Menambahkan elemen `#guideHelpdeskToast` untuk pesan notifikasi ramah saat Layanan Bantuan diklik.

### 3. Styling & Animasi (`landing.css`)
- **[landing.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/landing.css)**:
  - Mendesain balon percakapan bergaya *glassmorphism* modern dengan ekor percakapan (*bubble tail*) menunjuk ke pemandu.
  - Efek hover: *Pop-out scaling*, *glow border*, dan panah petunjuk beranimasi.
  - Menambahkan animasi mengapung (*floating animation*) pada karakter pemandu (`@keyframes mascotFloat`).
  - Menambahkan dukungan Mode Terang dan Mode Gelap (`[data-theme="dark"]`).
  - Menyesuaikan tata letak responsif untuk layar HP dan Tablet (`@media (max-width: 992px)` dan `@media (max-width: 640px)`).

### 4. Skrip Interaksi (`landing_app.js`)
- **[landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js)**:
  - Menambahkan fungsi `initMascotGuideInteractions()` untuk menangani klik pada bubble "Layanan Bantuan".
  - Menampilkan toast notification interaktif yang otomatis hilang setelah 5 detik atau saat tombol silang diklik.

---

## 🧪 Hasil Pengujian & Verifikasi

1. **Pengujian Navigasi Bubble Text**:
   - Klik **Eksplor Katalog** $\rightarrow$ Membuka halaman Katalog UMKM (`Main page.html`).
   - Klik **Tentang Kami** $\rightarrow$ Membuka halaman Informasi (`tentang.html`).
   - Klik **Layanan Bantuan** $\rightarrow$ Memunculkan toast pop-up notifikasi ramah *"Fitur Layanan Bantuan sedang dalam proses pengembangan"*.
2. **Pengujian Tampilan & Responsivitas**:
   - Memastikan animasi mengapung karakter berjalan mulus tanpa mengganggu performa halaman.
   - Memeriksa tampilan di layar PC (layout berdampingan) dan layar smartphone/HP (layout stacked responsif).
   - Memeriksa keterbacaan balon percakapan saat beralih antara Mode Gelap (*Dark Mode*) dan Mode Terang (*Light Mode*).
