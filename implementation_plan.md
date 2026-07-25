# Rencana Implementasi Sistem Multi-Role (Konsumen, Pemilik UMKM, Admin)

Sistem ini memperkenalkan pembagian hak akses (role-based access) menjadi 3 peran utama dengan alur masuk yang disesuaikan:
1. **Konsumen & Pengunjung Biasa**: Bebas menjelajahi landing page dan langsung diarahkan ke halaman Katalog (`Main page.html`).
2. **Pemilik UMKM**: Masuk menggunakan akun UMKM terdaftar (atau mendaftar baru) untuk mengakses Dashboard Pemilik (`owner.html`) guna mengelola informasi usahanya secara mandiri.
3. **Admin**: Masuk menggunakan kredensial admin khusus untuk mengakses Dashboard Admin (`admin.html`) guna mengawasi, menambah, mengedit, dan menghapus (CRUD) seluruh data UMKM secara terpusat.

Untuk mendukung fitur ini secara interaktif tanpa backend server, seluruh data UMKM akan disimpan dan disinkronkan menggunakan `localStorage` (`umkm_data`).

---

## User Review Required

> [!IMPORTANT]
> - **Kredensial Default**: Admin menggunakan username `admin` dan password `admin123`. Pemilik UMKM yang sudah ada di database akan menggunakan password default `owner123` (bisa diubah dari dashboard pemilik).
> - **Layar Pemilihan Peran (Welcome Overlay)**: Ditampilkan di `index.html` hanya jika pengguna belum memilih peran mereka. Sekali memilih "Konsumen", overlay akan tersembunyi, dan tombol "Ganti Peran" / "Login" akan tersedia di navigasi bar.
> - **Persistensi Data**: Seluruh aksi tambah/edit/hapus oleh Admin maupun Pemilik UMKM akan disimpan ke `localStorage`. Perubahan langsung tercermin di Katalog dan Halaman Utama secara instan!

---

## Proposed Changes

### 1. Core Services & Database Layer

#### [MODIFY] [umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js)
* Memperbarui `fetchAllUmkm` agar memuat data dari `localStorage` (`umkm_data`) jika sudah tersedia. Jika belum, ambil dari `Database/umkm.json` dan simpan ke `localStorage`.
* Menambahkan fungsi CRUD:
  * `addUmkm(umkmData)`: Menambahkan UMKM baru dengan ID unik, password default `owner123`, dan menyimpannya ke `localStorage`.
  * `updateUmkm(id, updatedData)`: Memperbarui data UMKM berdasarkan ID dan menyimpan perubahan.
  * `deleteUmkm(id)`: Menghapus UMKM berdasarkan ID dari daftar dan menyimpan perubahan.
  * `saveToLocalStorage()`: Utility untuk mensinkronisasi data array `this.daftarUmkm` ke `localStorage`.

---

### 2. Welcome Page & Authentication Overlay

#### [MODIFY] [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)
* Menyisipkan kontainer `roleSelectorOverlay` berupa layar penuh (overlay) glassmorphic dengan 3 pilihan peran.
* Menyisipkan form login admin dan login pemilik UMKM yang bersifat interaktif di dalam overlay.
* Menyisipkan form pendaftaran UMKM baru bagi pemilik usaha baru yang belum terdaftar.

#### [MODIFY] [landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js)
* Membaca status `localStorage.getItem('user_role')`.
* Jika kosong, tampilkan `roleSelectorOverlay`.
* Mengelola transisi klik peran:
  * Konsumen: Set `user_role = 'konsumen'`, sembunyikan overlay, dan arahkan ke `Main page.html`.
  * Pemilik UMKM: Buka form login pemilik (dropdown daftar UMKM yang diambil dinamis + input password). Menyediakan opsi "Daftar Usaha Baru" untuk membuka form pendaftaran UMKM.
  * Admin: Buka form login admin (input username + password).
* Melakukan validasi login di sisi klien dan mengarahkan ke dashboard masing-masing.

---

### 3. Unified Navigation & Global Routing

#### [NEW] [navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js)
* Skrip modular yang diimpor di seluruh halaman (`index.html`, `Main page.html`, `Detail produk.html`, `tentang.html`, `admin.html`, `owner.html`).
* Mengatur tampilan menu navigasi secara dinamis berdasarkan `user_role` saat ini:
  * Jika Admin: Menampilkan badge "Mode Admin ⚙️", tombol "Dashboard Admin", dan tombol "Keluar (Logout)".
  * Jika Pemilik: Menampilkan badge "Toko: [Nama UMKM] 🏪", tombol "Dashboard Pemilik", dan tombol "Keluar (Logout)".
  * Jika Konsumen / belum login: Menampilkan tombol "Masuk / Kelola UMKM" untuk membuka/kembali ke layar pemilihan peran di `index.html`.
* Mengelola fungsi **Logout (Keluar)** global yang membersihkan data sesi peran dan mengembalikan ke layar utama pemilihan peran.

---

### 4. Admin Dashboard (Dashboard Admin)

#### [NEW] [admin.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/admin.html)
* Halaman Dashboard Admin eksklusif.
* Dilengkapi sistem proteksi: jika `user_role !== 'admin'`, otomatis redirect kembali ke `index.html`.
* Struktur visual premium:
  * Kartu Ringkasan (Stats): Total UMKM, kategori terbanyak, dusun aktif.
  * Tabel Data UMKM: Menampilkan ID, Logo/Gambar, Nama UMKM, Kategori, Dusun/Alamat, No WhatsApp, dan Aksi (Edit / Hapus).
  * Fitur Pencarian & Filter Kategori khusus admin di dalam tabel.
  * Tombol "Tambah UMKM Baru" yang membuka modal input form.
  * Modal Form Tambah/Edit UMKM yang dinamis.

#### [NEW] [admin_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/admin_app.js)
* Memproteksi rute halaman admin.
* Memuat seluruh daftar UMKM dari `UmkmService`.
* Mengelola pembuatan, pembacaan, pembaruan, dan penghapusan (CRUD) data UMKM ke dalam `localStorage`.
* Merender data ke tabel secara dinamis, mengelola paginasi tabel admin, dan form submission.

---

### 5. Owner Dashboard (Dashboard Pemilik)

#### [NEW] [owner.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/owner.html)
* Halaman Dashboard khusus Pemilik UMKM yang sedang login.
* Proteksi rute: jika `user_role !== 'owner'` atau `logged_owner_id` tidak valid, redirect ke `index.html`.
* Struktur halaman:
  * Profil Ringkas Toko: Nama, Kategori, Deskripsi, Alamat, WhatsApp, dan gambar profil.
  * Form Edit Informasi Toko: Memperbarui deskripsi, WhatsApp, alamat, koordinat peta, dan gambar.
  * Panel Pengelolaan Galeri Produk: Menambah atau menghapus URL/nama berkas gambar pendukung untuk galeri detail produk.
  * Panel Keamanan: Form untuk memperbarui kata sandi login pemilik.

#### [NEW] [owner_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/owner_app.js)
* Memproteksi rute halaman pemilik.
* Mengambil data UMKM spesifik berdasarkan `logged_owner_id`.
* Mengisi form secara otomatis dengan data pemilik saat ini.
* Menangani pembaruan profil pemilik ke `UmkmService` dan mensinkronisasikannya ke `localStorage`.

---

### 6. Styles Design System

#### [NEW] [auth.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/auth.css)
* Berisi gaya untuk overlay pemilihan peran (`roleSelectorOverlay`), efek glassmorphism, ornamen kartu peran, dan form input login/register.
* Berisi gaya tata letak dashboard admin dan pemilik (sidebar/navbar dashboard, kartu statistik, tabel interaktif dengan scrollbar cantik, tombol aksi, serta modal pop-up form admin).
* Menerapkan variabel CSS global agar mendukung mode gelap (dark mode) secara otomatis.

---

## Verification Plan

### Automated Tests
* Tidak ada pengujian otomatis (unit testing framework) dalam proyek ini. Pengujian dilakukan melalui verifikasi alur manual yang komprehensif.

### Manual Verification
1. **Layar Awal & Pemilihan Peran**:
   - Buka `index.html` dengan membersihkan `localStorage`. Pastikan overlay pemilihan peran menutupi seluruh layar secara elegan.
   - Klik **Konsumen**: Pastikan diarahkan langsung ke `Main page.html` (Katalog), dan overlay tidak muncul lagi saat membuka beranda.
2. **Login Admin & Dashboard Admin**:
   - Klik "Masuk / Kelola UMKM" di navbar, pilih **Admin Desa**.
   - Coba masukkan password salah, pastikan muncul notifikasi error.
   - Masukkan username `admin` dan password `admin123`. Pastikan diarahkan ke `admin.html` (Dashboard Admin).
   - Di dashboard admin, uji fitur **Tambah UMKM**: buat UMKM baru, isi semua field. Pastikan data langsung terdaftar di tabel admin.
   - Di dashboard admin, uji fitur **Edit UMKM**: ubah nama atau deskripsi dari UMKM yang baru dibuat, pastikan berhasil diperbarui.
   - Di dashboard admin, uji fitur **Hapus UMKM**: hapus salah satu UMKM, pastikan terhapus dari tabel dan tidak terlihat lagi di katalog.
3. **Login Pemilik UMKM & Dashboard Pemilik**:
   - Buka form login pemilik, pilih salah satu UMKM yang ada di dropdown, gunakan password default `owner123`. Pastikan diarahkan ke `owner.html` (Dashboard Pemilik).
   - Ubah deskripsi usaha atau nomor WhatsApp, klik simpan. Buka halaman detail produk tersebut di katalog (`Detail produk.html?id=ID`), pastikan data yang telah diedit langsung terupdate di halaman tersebut.
   - Coba ganti kata sandi pemilik usaha, lalu keluar (logout), dan uji login kembali menggunakan kata sandi baru.
4. **Proteksi Akses (Security Routing)**:
   - Saat sedang keluar (logout), coba ketik langsung URL `admin.html` atau `owner.html` di address bar. Pastikan sistem menolak akses dan mengarahkan kembali ke halaman beranda.
