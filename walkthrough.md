# Walkthrough: Pembuatan Halaman Layanan Bantuan & Laporan Bug (`bantuan.html`)

Telah berhasil dibuat halaman baru **Layanan Bantuan & Laporan Bug** (`bantuan.html`) pada website **DigiJaya**. Pengguna dapat melaporkan bug/kendala teknis, menyertakan deskripsi jelas, melampirkan tangkapan layar (screenshot/gambar bug), mendapatkan nomor tiket laporan, serta mengakses FAQ interaktif.

---

## 🛠️ Fitur & Komponen yang Dibuat

### 1. Halaman Utama Layanan Bantuan (`bantuan.html`)
- **[bantuan.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/bantuan.html)**:
  - **Formulir Laporan Kendala & Bug**:
    - **Nama & Kontak**: Nama lengkap dan email/WhatsApp pelapor untuk kontak tindak lanjut.
    - **Kategori Kendala**: Dropdown opsi (*Bug / Error Sistem*, *Kendala Tampilan UI/UX*, *Data UMKM Salah*, *Masalah Upload Foto*, *Masalah Login*, *Pertanyaan & Masukan*).
    - **Judul & Detail Kendala**: Input deskriptif dengan petunjuk kronologi bug.
    - **Unggah Bukti Foto Bug**: Area *drag-and-drop* & upload foto dengan **pratinjau langsung (Live Image Preview)** sebelum dikirim, informasi ukuran/nama file, dan tombol hapus foto.
  - **Nomor Tiket & Modal Sukses**:
    - Generasi **Nomor Tiket Unik** (contoh: `#TICKET-2026-X891`) saat laporan dikirim.
    - Menampilkan modal konfirmasi sukses dengan ringkasan tiket dan status bukti foto.
  - **Pusat FAQ Interaktif (Accordion)**:
    - Pertanyaan yang sering diajukan lengkap dengan jawaban buka-tutup beranimasi.
  - **Riwayat Tiket Laporan**:
    - Menyimpan riwayat tiket yang baru dikirim pengguna di `localStorage` (`digijaya_help_tickets`).
  - **Kontak Langsung Hotline**:
    - Akses cepat via WhatsApp Hotline & Email Resmi Tim Support Desa.

### 2. Styling & Layout CSS (`assets/css/bantuan.css`)
- **[bantuan.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/bantuan.css)**:
  - Tampilan modern bergaya *glassmorphism* dengan latar belakang gradient lembut.
  - Animasi hover, efek glowing input focus, Uploader Drag & Drop interaktif.
  - Dukungan **Mode Gelap (*Dark Mode*)** dan **Mode Terang (*Light Mode*)**.
  - Layout responsif 2-kolom pada Desktop dan 1-kolom terurut pada layar HP/Tablet.

### 3. Logika JavaScript (`Js/bantuan_app.js` & `Js/navbar.js`)
- **[bantuan_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/bantuan_app.js)**:
  - Menangani pembacaan file gambar via `FileReader` dan rendering Live Preview.
  - Validasi form, generasi tiket unik, penyimpan memori `localStorage`, dan reset form.
  - Menangani aksi accordion FAQ dan modal konfirmasi tiket.
- **[navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js)**:
  - Menyisipkan tautan menu **Layanan Bantuan** secara otomatis di seluruh navigasi halaman.

---

## 🧪 Hasil Pengujian & Verifikasi

1. **Pengujian Form Laporan & Live Image Preview**:
   - Memilih file gambar bug (PNG/JPG) $\rightarrow$ Gambar langsung tampil pada kotak *preview* beserta nama file, ukuran KB, dan tombol *Hapus Foto*.
   - Mengklik *Hapus Foto* $\rightarrow$ Area upload kembali ke tampilan awal secara bersih.
2. **Pengujian Pengiriman Form & Generasi Tiket**:
   - Mengisi seluruh field wajib dan mengklik **Kirim Laporan Kendala**.
   - Modal sukses terbuka menampilkan **Nomor Tiket Unik** `#TICKET-2026-XXXX`.
   - Tiket baru otomatis tersimpan dan muncul pada kartu *Riwayat Tiket Laporan Anda*.
3. **Pengujian Accordion FAQ**:
   - Mengklik item FAQ $\rightarrow$ Jawaban terbuka dengan transisi animasi accordion yang halus.
4. **Pengujian Mode Terang & Gelap**:
   - Menekan tombol tema di Navbar $\rightarrow$ Seluruh elemen `bantuan.html` beralih warna secara serasi.
