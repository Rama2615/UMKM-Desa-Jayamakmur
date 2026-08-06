# Rencana Implementasi: Sistem Customer Service AI & Handoff Admin

Rencana ini bertujuan untuk membangun **Sistem Customer Service (CS)** interaktif berbasis **AI Assistant Mascot Widget (JayaBot)** yang melayani pengunjung secara otomatis 24/7 dan dapat melakukan **transfer / handoff secara langsung ke Admin Asli (Manusia)** via WhatsApp / Tiket Laporan jika dibutuhkan.

---

## User Review Required

> [!IMPORTANT]
> **Alur Kerja Sistem Customer Service (CS):**
> 1. **Floating CS Widget Interaktif (Pojok Kanan Bawah)**:
>    - Maskot/Bot dengan badge status *"Online 24/7 🟢"*.
>    - Gelembung sapaan otomatis saat pengunjung pertama kali membuka website (*"Halo! Ada yang bisa JayaBot bantu? 👋"*).
> 2. **AI Customer Service Assistant (JayaBot)**:
>    - Menjawab pertanyaan umum (Pencarian Katalog, Cara Daftar UMKM, Peta Desa, Informasi Produk, Laporan Bug).
>    - Dilengkapi *Quick Suggestion Chips* (Tombol Pilihan Cepat) agar pengguna dapat memilih topik tanpa mengetik.
> 3. **Eskalasi / Handoff ke Admin Asli (Orang/Manusia)**:
>    - Pengguna dapat mengetik *"hubungi admin"*, *"bicara dengan orang asli"*, atau mengklik tombol **"Bicara dengan Admin Manusia 👤"**.
>    - AI Bot akan merangkum topik pembicaraan dan mengarahkan langsung ke **WhatsApp Hotline Admin Resmi Desa** dengan pesan terformat otomatis atau mengarahkan ke pembuatan tiket di `bantuan.html`.

---

## Proposed Changes

### 1. Komponen Widget Customer Service (JS & SVG)
#### [NEW] [cs_bot.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/components/cs_bot.js)
- Membuat modul `CsBotWidget` yang mengelola UI obrolan (*chat window*), simulasi balasan AI pintar dengan animasi mengetik (*typing animation*), pengenalan kata kunci (*intent recognition*), serta sistem transfer ke Admin WhatsApp.

---

### 2. Styling CSS Widget CS
#### [NEW] [cs_bot.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/cs_bot.css)
- Mendesain jendela obrolan (*chat window*) bergaya *glassmorphism* modern, animasi gelembung percakapan, indikator status online, tombol *suggestion chips*, dan jendela transfer admin yang responsif di HP & Laptop.

---

### 3. Integrasi Global pada Seluruh Halaman
#### [MODIFY] [global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css) / [navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js)
- Mengimpor dan mengaktifkan `initCsBotWidget()` secara global agar widget Customer Service selalu aktif di seluruh halaman website (`index.html`, `Main page.html`, `tentang.html`, `peta.html`, `bantuan.html`, `Detail produk.html`).

---

## Verification Plan

### Manual Verification
1. **Pengujian Chat AI & Intent Recognition**:
   - Ketik *"bagaimana cara cari produk"* $\rightarrow$ Pastikan AI Bot merespons dengan panduan pencarian katalog + tombol link langsung.
   - Ketik *"cara mendaftar toko"* $\rightarrow$ Pastikan AI Bot menjelaskan alur pendaftaran UMKM.
2. **Pengujian Transfer / Handoff ke Admin Manusia**:
   - Klik tombol **"Bicara dengan Admin Manusia 👤"** atau ketik *"hubungi admin"*.
   - Memastikan AI Bot menampilkan kartu konfirmasi eskalasi dengan tombol **Buka WhatsApp Admin** (yang otomatis memuat isi teks pesan ke nomor admin).
3. **Pengujian UI & Responsivitas**:
   - Uji widget mengambang di pojok kanan bawah di PC dan Smartphone (HP).
   - Uji peralihan Mode Gelap dan Terang.
