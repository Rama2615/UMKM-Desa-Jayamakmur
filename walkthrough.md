# Walkthrough: Sistem Customer Service AI (JayaBot) & Handoff Admin Manusia

Telah berhasil dibuat dan diintegrasikan **Sistem Customer Service (CS)** interaktif berbasis **AI Assistant Mascot Widget (JayaBot)** yang melayani pengunjung secara otomatis 24/7 dan mendukung **Transfer / Handoff ke Admin Asli (Manusia)** di seluruh halaman platform **DigiJaya**.

---

## 🛠️ Fitur & Komponen yang Dibuat

### 1. Floating CS Assistant Widget & UI Chat Window (`assets/css/cs_bot.css`)
- **[cs_bot.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/cs_bot.css)**:
  - **Floating Launcher Button**: Tombol mengambang di pojok kanan bawah dengan badge status *"Online 24/7 🟢"* dan gelembung sapaan awal (*"Halo! Ada yang bisa JayaBot bantu? 👋"*).
  - **Jendela Chat Glassmorphism**: Header bernuansa oranye khas DigiJaya, tombol cepat eskalasi ke admin manusia, dan tombol minimize.
  - **Linimasa Obrolan Interaktif**: Gelembung pesan user vs bot, indikator status mengetik (*typing animation*), serta *Quick Suggestion Chips* (tombol opsi cepat).
  - **Kartu Eskalasi Admin Manusia**: Kartu konfirmasi transfer hijau yang menyediakan tombol langsung ke WhatsApp Admin Hotline.
  - Dukungan **Mode Gelap (*Dark Mode*)** dan **Mode Terang (*Light Mode*)**.

### 2. Modul Logika AI & Admin Handoff Engine (`Js/components/cs_bot.js`)
- **[cs_bot.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/components/cs_bot.js)**:
  - **Klasifikasi Niat (Intent Classifier)**:
    - *Intent Katalog/Produk*: Memberikan tautan ke `Main page.html` dan rekomendasi kategori.
    - *Intent Pendaftaran UMKM*: Menjelaskan alur pendaftaran toko dan mengarahkan ke login portal.
    - *Intent Peta Desa*: Mengarahkan ke peta interaktif 3D (`peta.html`).
    - *Intent Bug/Kendala*: Mengarahkan ke form laporan di `bantuan.html`.
    - *Intent Transfer Admin Manusia*: Mengubah status obrolan dan menghasilkan link WhatsApp Admin resmi dengan pesan terformat otomatis.
  - **Penyimpanan Riwayat Obrolan**: Menggunakan `sessionStorage` (`digijaya_cs_history`) agar percakapan tetap tersimpan dan berkelanjutan saat pengguna berpindah halaman.

### 3. Integrasi Global (`Js/navbar.js`)
- **[navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js)**:
  - Mengimpor `initCsBotWidget()` dan menjalankannya secara otomatis di seluruh halaman website ([index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html), [Main page.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html), [tentang.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/tentang.html), [peta.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/peta.html), [bantuan.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/bantuan.html), [Detail produk.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Detail%20produk.html)).

---

## 🧪 Hasil Pengujian & Verifikasi

1. **Pengujian Chat AI & Suggestion Chips**:
   - Mengklik widget di pojok kanan bawah $\rightarrow$ Jendela chat terbuka dengan sapaan awal dan tombol chip opsi cepat.
   - Mengklik chip *🛍️ Cari Produk Katalog* $\rightarrow$ JayaBot memberikan penjelasan beserta link ke katalog.
2. **Pengujian Eskalasi / Transfer ke Admin Orang Asli**:
   - Mengklik tombol **"Bicara dengan Admin (Manusia) 👤"** atau mengetik *"hubungi admin"* $\rightarrow$ JayaBot merespons dengan **Kartu Transfer Admin**.
   - Mengklik tombol **Chat Langsung via WhatsApp Admin** $\rightarrow$ Membuka aplikasi/web WhatsApp dengan format pesan otomatis: *"Halo Admin DigiJaya Desa Jayamakmur, saya butuh bantuan manusia..."*.
3. **Pengujian Keberlanjutan Sesi (Session Persistence)**:
   - Mengobrol dengan JayaBot di `index.html` lalu berpindah ke `Main page.html` $\rightarrow$ Obrolan tetap tersimpan dan dapat dilanjutkan tanpa hilang.
4. **Pengujian Mode Terang & Gelap**:
   - Peralihan tema memperbarui warna jendela chat dan gelembung percakapan secara serasi.
