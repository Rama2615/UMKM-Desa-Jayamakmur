# Rencana Implementasi: Halaman Layanan Bantuan & Laporan Bug

Rencana ini bertujuan untuk membuat halaman **Layanan Bantuan & Laporan Bug** (`bantuan.html`) resmi platform **DigiJaya**. Pengguna dapat melaporkan bug/kendala teknis, menyertakan deskripsi jelas, melampirkan tangkapan layar (screenshot/gambar bug), serta melihat FAQ (Pertanyaan yang Sering Diajukan).

---

## User Review Required

> [!IMPORTANT]
> **Fitur Utama Halaman Layanan Bantuan (`bantuan.html`):**
> 1. **Formulir Laporan Bug & Kendala**:
>    - **Nama & Kontak**: Nama lengkap dan email/WhatsApp pelapor untuk tindak lanjut.
>    - **Kategori Kendala**: Pilihan kategori (e.g. *Bug/Error Website*, *Data UMKM Salah*, *Kendala Tampilan*, *Saran/Masukan*).
>    - **Judul & Detail Kendala**: Input teks deskriptif untuk menjelaskan masalah secara rinci.
>    - **Unggah Bukti Gambar Bug**: Fitur *drag-and-drop* & upload foto dengan **pratinjau langsung (live image preview)** sebelum dikirim.
> 2. **Sistem Notifikasi & Bukti Laporan (Nomor Tiket)**:
>    - Pengiriman laporan menghasilkan **Nomor Tiket Laporan** (contoh: `#TICKET-2026-X89A`) yang disimpan secara lokal / database untuk referensi pengguna.
> 3. **Pusat FAQ Interaktif (Accordion)**:
>    - Jawaban cepat untuk masalah umum yang sering dihadapi pengguna tanpa harus mengirim tiket.
> 4. **Navigasi & Mode Gelap/Terang**:
>    - Terintegrasi penuh dengan Navbar utama, Footer, dan Sistem Tema (`theme.js`).

---

## Proposed Changes

### 1. Halaman HTML Baru
#### [NEW] [bantuan.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/bantuan.html)
- Membuat struktur halaman Layanan Bantuan lengkap dengan Navbar, Hero Banner, Form Laporan Bug + Image Preview, FAQ Accordion, dan Footer.

---

### 2. Styling & Layout CSS
#### [NEW] [bantuan.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/bantuan.css)
- Mendesain form laporan dengan gaya *glassmorphism*, uploader gambar interaktif, *preview box*, tombol *submit* beranimasi, serta FAQ *accordion* yang responsif pada layar HP dan Desktop.

---

### 3. Logic JavaScript
#### [NEW] [bantuan_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/bantuan_app.js)
- Menangani *preview* gambar yang diunggah secara instan (`FileReader` / Base64).
- Menangani validasi formulir dan generasi Nomor Tiket Laporan.
- Menangani interaksi accordion FAQ.
- Menautkan halaman `bantuan.html` ke navigasi di `index.html`, `Main page.html`, dan `tentang.html`.

---

### 4. Pembaharuan Navigasi Header di Halaman Lain
#### [MODIFY] [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)
#### [MODIFY] [Main page.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html)
#### [MODIFY] [tentang.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/tentang.html)
- Menambahkan tautan **Layanan Bantuan** pada menu navigasi utama agar pengguna dapat mengaksesnya dari halaman mana saja.

---

## Verification Plan

### Manual Verification
1. **Pengujian Unggah & Live Preview Gambar Bug**:
   - Pilih/Upload file foto bug (JPG/PNG).
   - Memastikan foto langsung tampil pada area *preview* beserta tombol hapus foto.
2. **Pengujian Pengiriman Form Laporan**:
   - Isi seluruh field form dan klik **Kirim Laporan Kendala**.
   - Memastikan modal sukses / notifikasi tiket muncul dengan nomor referensi unik.
3. **Pengujian Accordion FAQ**:
   - Klik pertanyaan pada FAQ $\rightarrow$ Memastikan jawaban terbuka/tertutup dengan animasi halus.
4. **Pengujian Responsivitas & Mode Gelap**:
   - Memeriksa tampilan di layar smartphone/HP dan desktop PC.
   - Menguji peralihan Mode Terang & Gelap.
