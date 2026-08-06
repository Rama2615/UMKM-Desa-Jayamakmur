# Rencana Implementasi: Karakter Pemandu Interaktif dengan Bubble Text

Rencana ini bertujuan untuk menambahkan ilustrasi karakter orang (Pemandu Digital DigiJaya) beranimasi yang mempersembahkan 3 opsi pilihan berbentuk **Bubble Text** beranimasi. Bubble text ini dapat diklik dan langsung mengarahkan pengguna ke halaman yang dituju.

---

## User Review Required

> [!IMPORTANT]
> **Tiga Opsi Bubble Text:**
> 1. **Eksplor Katalog**: Mengarahkan pengguna langsung ke katalog produk [`Main page.html`](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html).
> 2. **Tentang Kami**: Mengarahkan pengguna langsung ke halaman profil & informasi platform [`tentang.html`](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/tentang.html).
> 3. **Layanan Bantuan**: Ditandai dengan label *"Segera Hadir"* (karena belum dibuat). Saat diklik, menampilkan pop-up / toast notifikasi interaktif yang ramah memberitahu bahwa layanan bantuan sedang disiapkan.

---

## Proposed Changes

### 1. Aset Ilustrasi & Gambar Pemandu
#### [NEW] [mascot_guide.png](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/images/mascot_guide.png)
- Menyimpan gambar ilustrasi karakter pemandu lokal bergaya hangat (shopkeeper/guide Desa Jayamakmur) dengan gestur tangan menyambut.

---

### 2. Halaman Utama Landing Page
#### [MODIFY] [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)
- Menambahkan section interaktif baru `<section class="guide-interactive-section">` di landing page.
- Menempatkan karakter pemandu di satu sisi dan 3 balon percakapan (*speech bubbles*) di sisinya.

---

### 3. Styling & Animasi CSS
#### [MODIFY] [landing.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/landing.css)
- Menambahkan animasi mengapung (*floating animation*) untuk karakter dan bubble text.
- Mendesain balon percakapan (*speech bubbles*) bergaya *glassmorphism* dengan ekor balon menunjuk ke arah pemandu.
- Menambahkan efek hover (*scale, glowing outline, arrow indicator*) dan transisi interaktif.
- Menyesuaikan tampilan responsif untuk layar HP dan desktop.
- Memastikan kompatibilitas warna pada *Light Mode* dan *Dark Mode*.

---

### 4. Logic Interaksi JS
#### [MODIFY] [landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js) / [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)
- Menambahkan penanganan klik untuk balon percakapan "Layanan Bantuan" agar memunculkan dialog/toast notifikasi interaktif yang menarik.

---

## Verification Plan

### Manual Verification
1. **Pengujian Klik Bubble Text**:
   - Klik **Eksplor Katalog** $\rightarrow$ Memastikan browser membuka halaman Katalog UMKM (`Main page.html`).
   - Klik **Tentang Kami** $\rightarrow$ Memastikan browser membuka halaman Informasi (`tentang.html`).
   - Klik **Layanan Bantuan** $\rightarrow$ Memastikan muncul notifikasi ramah bahwa fitur sedang dalam tahap pembuatan.
2. **Pengujian Visual & Responsivitas**:
   - Memeriksa animasi mengapung karakter dan bubble text berjalan dengan halus tanpa lag.
   - Memeriksa tampilan di layar PC, tablet, dan smartphone (HP).
   - Memeriksa keterbacaan balon percakapan saat beralih antara Mode Gelap (*Dark Mode*) dan Mode Terang (*Light Mode*).
