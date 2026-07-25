# Walkthrough: Sistem Multi-Role (Konsumen, Pemilik UMKM, Admin) dengan Halaman Login Khusus & Persistensi Data Lokal

Pembaruan sistem multi-role lengkap dengan pembagian hak akses (role-based access) menjadi 3 peran utama (Konsumen, Pemilik UMKM, dan Admin) telah berhasil diimplementasikan menggunakan **Halaman Login Khusus (`login.html`)** di platform JayamakmurHub. Pembaruan ini mendukung fungsionalitas CRUD basis data penuh bagi Admin, penyuntingan data mandiri bagi Pemilik UMKM, serta navbar dinamis global dan integrasi tema gelap/terang.

---

## Fitur Baru yang Diimplementasikan

### 1. Halaman Pilihan Peran & Login Khusus (`login.html`)
*   **Halaman Khusus (Dedicated Page)**: Dibandingkan sistem overlay sebelumnya, sekarang pemilihan peran dan login berada di halaman tersendiri (`login.html`) dengan latar belakang bulatan cahaya melayang interaktif.
*   **Redirect Otomatis**: Jika pengunjung pertama kali membuka `index.html` dan belum memilih peran mereka, sistem secara otomatis mengalihkan (redirect) rute ke `login.html`.
*   **Tiga Pilihan Peran**:
    *   **Konsumen & Pengunjung**: Klik tombol ini akan menyimpan peran `'konsumen'` ke `localStorage` dan langsung mengarahkan pengguna ke Katalog Utama (`Main page.html`).
    *   **Pemilik UMKM**: Menampilkan formulir login pemilik yang memuat daftar usaha secara dinamis dari database lokal, atau opsi mendaftarkan usaha baru.
    *   **Admin Desa**: Menampilkan formulir login admin menggunakan kredensial admin.

### 2. Mock Authentication & Registrasi Baru
*   **Login Admin**: Masuk menggunakan username `admin` dan kata sandi `admin123`.
*   **Login Pemilik**: Masuk dengan memilih usaha dari dropdown dan memasukkan kata sandi (default: `owner123`).
*   **Registrasi Usaha Baru**: Pemilik usaha baru dapat langsung mendaftarkan UMKM-nya melalui form registrasi (Nama, Kategori, WhatsApp, Alamat, Deskripsi, dan Kata Sandi baru). Pendaftaran akan otomatis membuat profil di `localStorage` dan meloginkan pengguna ke Dashboard Pemilik.

### 3. Persistensi Data Lokal (Client-Side Database)
*   **localStorage Synchronization**: Seluruh data UMKM dimuat pertama kali dari `umkm.json` dan dipindahkan ke `localStorage` (`umkm_data`). Semua aksi tambah, edit, dan hapus data oleh admin atau pemilik toko akan disinkronkan ke `localStorage` secara real-time dan langsung berdampak ke landing page maupun katalog produk secara instan!

### 4. Navigasi Dinamis Global (`Js/navbar.js`)
*   **Role Badge & Tautan Dashboard**: Navbar secara otomatis mendeteksi status login pengguna:
    *   **Admin**: Menampilkan badge `Admin ⚙️` dan tautan cepat ke `Dashboard`.
    *   **Pemilik UMKM**: Menampilkan badge `Toko: [Nama UMKM] 🏪` dan tautan cepat `Kelola Toko`.
    *   **Konsumen**: Menampilkan tombol `Kelola UMKM / Login` untuk login.
*   **Logout global**: Klik tombol `Keluar` di navbar akan menghapus status peran saat ini dari memori browser dan mengarahkan kembali ke `login.html`.
*   **Tautan Login Baru**: Klik tombol `Kelola UMKM / Login` di navbar sekarang langsung mengarahkan pengguna ke `login.html`.

### 5. Dashboard Admin (`admin.html`)
*   **Ringkasan Statistik Real-time**: Menampilkan total toko terdaftar beserta pembagian per kategori (Kuliner, Kerajinan, Jasa).
*   **Tabel Data & CRUD**: Admin dapat mencari, memfilter, mengedit data (termasuk kata sandi login pemilik usaha), menghapus usaha, atau menambah UMKM baru langsung di tempat dengan modal pop-up yang interaktif.
*   **Proteksi Rute**: Membatasi akses langsung ke berkas `admin.html`. Pengunjung tanpa peran admin akan ditolak dan diarahkan ke beranda.

### 6. Dashboard Pemilik UMKM (`owner.html`)
*   **Pembaruan Profil Mandiri**: Pemilik usaha dapat memperbarui nomor WhatsApp, alamat, deskripsi, tautan Google Maps, serta gambar profil utama toko mereka.
*   **Manajer Galeri Produk**: Menambah atau menghapus gambar pendukung galeri secara langsung, yang akan dirender sebagai carousel di halaman detail produk.
*   **Keamanan Sandi**: Pemilik usaha dapat memperbarui kata sandi login mereka secara mandiri demi keamanan.
*   **Proteksi Rute**: Membatasi akses langsung ke berkas `owner.html`. Pengunjung yang tidak login sebagai pemilik akan ditolak dan diarahkan ke beranda.

---

## File yang Dibuat & Dimodifikasi

*   [login.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/login.html) **[NEW]** — Halaman khusus untuk pemilihan peran, login pemilik/admin, dan pendaftaran UMKM.
*   [Js/login_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/login_app.js) **[NEW]** — Logika kontroler halaman khusus login.html.
*   [admin.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/admin.html) **[NEW]** — Halaman antarmuka utama Dashboard Admin Desa.
*   [owner.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/owner.html) **[NEW]** — Halaman antarmuka utama Dashboard Pemilik Toko.
*   [Js/admin_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/admin_app.js) **[NEW]** — Logika kontroler dashboard admin (menangani CRUD modal, rendering tabel, filter, dan pagination).
*   [Js/owner_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/owner_app.js) **[NEW]** — Logika kontroler dashboard pemilik (mengisi form profil, manajemen galeri, dan pembaruan password).
*   [Js/navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js) **[NEW]** — Logika navbar dinamis yang diimpor global untuk semua halaman.
*   [assets/css/auth.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/auth.css) **[NEW]** — File penggayaan CSS khusus untuk layout login, registrasi, pemilihan peran overlay, tabel, dan form dashboard.
*   [Js/Services/umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js) **[MODIFY]** — Menambahkan loading & saving `localStorage` serta logika CRUD (`addUmkm`, `updateUmkm`, `deleteUmkm`).
*   [Js/models/umkm.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/models/umkm.js) **[MODIFY]** — Menambahkan properti `password` ke constructor UMKM.
*   [assets/css/global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css) **[MODIFY]** — Mengimpor `auth.css` agar seluruh gaya dashboard dan navbar dinamis termuat secara global.
*   [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html) **[MODIFY]** — Menghapus penanda welcome selector overlay (dialihkan ke login.html).
*   [Js/landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js) **[MODIFY]** — Mengubah logika awal: jika tidak ada role, redirect otomatis ke `login.html`.
*   [Main page.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html) **[MODIFY]** — Mengintegrasikan tag script `Js/navbar.js`.
*   [Detail produk.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Detail%20produk.html) **[MODIFY]** — Mengintegrasikan tag script `Js/navbar.js`.
*   [tentang.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/tentang.html) **[MODIFY]** — Mengintegrasikan tag script `Js/navbar.js`.

---

## Petunjuk Pengujian Mandiri (Langkah-Demi-Langkah)

### A. Pengujian Peran Konsumen & Navigasi
1.  Buka beranda (`index.html`). Jika Anda sudah masuk, klik tombol **Keluar** di kanan atas navbar.
2.  Jika basis data peran kosong, pastikan Anda langsung dialihkan (redirect) ke `login.html`.
3.  Di halaman `login.html`, klik **Konsumen & Pengunjung**.
4.  Pastikan Anda langsung diarahkan ke halaman Katalog (`Main page.html`). Di navbar kanan atas, pastikan terdapat tombol **Kelola UMKM / Login**.
5.  Coba klik tombol **Kelola UMKM / Login** di navbar, pastikan Anda diarahkan kembali ke `login.html` secara bersih.

### B. Pengujian Peran Admin Desa (CRUD & Monitoring)
1.  Di halaman `login.html`, pilih peran **Admin Desa**.
2.  Masukkan username `admin` dan kata sandi `admin123`, lalu klik **Masuk Sekarang**.
3.  Pastikan Anda diarahkan ke `admin.html` (Dashboard Admin). Periksa kartu statistik (Total UMKM, dll.) dan tabel daftar usaha.
4.  **Tambah Data Baru**:
    *   Klik **Tambah UMKM Baru** di kanan atas.
    *   Isi formulir dengan data dummy (contoh: Nama: "Kopi Gayo Jayamakmur", Kategori: "Kuliner", WhatsApp: "628999888777", Alamat: "Dusun Babakan RT 04"). Tentukan kata sandi login untuk pemilik baru (misal: `kopi123`).
    *   Klik **Simpan Data**. Pastikan toko baru muncul di tabel dan statistik total bertambah.
5.  **Edit Data**:
    *   Di baris data "Kopi Gayo Jayamakmur", klik tombol edit (✏️).
    *   Ubah namanya menjadi "Kopi Gayo & Teh Melati Jayamakmur", lalu klik **Simpan Data**. Pastikan perubahan langsung tercermin di tabel.
6.  **Uji di Katalog**:
    *   Klik tautan **Katalog** di navbar. Cari toko "Kopi Gayo" di kotak pencarian. Pastikan profilnya muncul lengkap dengan nama barunya.

### C. Pengujian Peran Pemilik UMKM (Edit Profil & Galeri)
1.  Kembali ke beranda / picu overlay login, pilih **Pemilik UMKM**.
2.  Di dropdown profil usaha, pilih usaha baru "Kopi Gayo & Teh Melati Jayamakmur" (atau usaha eksisting lainnya).
3.  Masukkan kata sandi usaha tersebut (misal `kopi123` untuk kopi gayo baru, atau default `owner123` untuk usaha bawaan). Klik **Masuk Sekarang**.
4.  Pastikan Anda diarahkan ke `owner.html` (Dashboard Pemilik).
5.  **Edit Profil**:
    *   Ubah bagian deskripsi atau nomor WhatsApp usaha Anda.
    *   Klik **Simpan Perubahan Profil**.
6.  **Tambah Foto Galeri**:
    *   Di box Galeri Foto Produk, isi nama file gambar (misal: `Es Doger Mang Ulis.HEIC` atau sejenisnya) pada input tambahan foto, lalu klik **Tambah**.
    *   Pastikan thumbnail gambar masuk ke daftar galeri di dashboard pemilik.
7.  **Verifikasi di Halaman Detail**:
    *   Klik tombol **Lihat Toko di Katalog** di kanan atas dashboard pemilik.
    *   Pastikan deskripsi baru Anda sudah ter-update, dan carousel galeri di bawah peta lokasi menampilkan foto tambahan yang Anda masukkan!
