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
*   **Visualisasi Grafik & Diagram (Chart.js)**: Menyisipkan dua diagram visualisasi interaktif:
    *   **Diagram Donat**: Distribusi persentase kategori UMKM (Kuliner, Kerajinan, Jasa).
    *   **Diagram Batang**: Sebaran jumlah UMKM per dusun wilayah Desa Jayamakmur (Krajan, Babakan, Sukamaju, Mekarsari, dll.).
    *   *Kelebihan*: Grafik terintegrasi penuh dengan basis data real-time (ikut berubah saat data ditambah/dihapus) dan mendukung penggantian warna font/grid otomatis saat website dialihkan ke Mode Gelap!
*   **Tabel Data & CRUD**: Admin dapat mencari, memfilter, mengedit data (termasuk kata sandi login pemilik usaha), menghapus usaha, atau menambah UMKM baru langsung di tempat dengan modal pop-up yang interaktif.
*   **Proteksi Rute**: Membatasi akses langsung ke berkas `admin.html`. Pengunjung tanpa peran admin akan ditolak dan diarahkan ke beranda.

### 6. Dashboard Pemilik UMKM (`owner.html`)
*   **Pembaruan Profil Mandiri**: Pemilik usaha dapat memperbarui nomor WhatsApp, alamat, deskripsi, tautan Google Maps, serta gambar profil utama toko mereka.
*   **Manajer Galeri Produk**: Menambah atau menghapus gambar pendukung galeri secara langsung, yang akan dirender sebagai carousel di halaman detail produk.
*   **Keamanan Sandi**: Pemilik usaha dapat memperbarui kata sandi login mereka secara mandiri demi keamanan.
*   **Proteksi Rute**: Membatasi akses langsung ke berkas `owner.html`. Pengunjung yang tidak login sebagai pemilik akan ditolak dan diarahkan ke beranda.

### 7. Peta Interaktif Desa 3D (`peta.html`)
*   **Engine Peta 3D Tilted (MapLibre GL JS)**: Peta ditingkatkan dari Leaflet 2D menjadi MapLibre GL JS 3D yang sangat interaktif dan premium. Kamera peta memiliki kemiringan sudut (*pitch: 55 derajat*) dan rotasi kompas (*bearing: -15 derajat*) untuk memberikan efek perspektif 3D yang megah.
*   **Garis Batas Desa (GeoJSON Boundary)**: Menampilkan poligon garis batas (*outline*) transparan berwarna hijau *teal* dengan garis putus-putus yang melingkari seluruh teritori Desa Jayamakmur, menandai dengan jelas batas wilayah desa.
*   **Vector Tile Styling Dinamis (CartoDB Vector)**: Mengintegrasikan gaya peta vektor CartoDB Voyager (terang berwarna) untuk mode siang dan CartoDB Dark Matter untuk mode malam yang berganti otomatis saat tombol tema diklik.
*   **Sidebar & Efek Terbang 3D (flyTo)**: Ketika kartu UMKM di sidebar kiri diklik, kamera peta akan terbang meluncur secara halus (*flyTo*) dalam perspektif 3D menuju marker tujuan dan membuka popup informasinya secara dinamis.

---

## File yang Dibuat & Dimodifikasi

*   [form_umkm.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/form_umkm.html) **[NEW]** — Halaman khusus mandiri untuk mengisi formulir pendaftaran dan pengeditan profil UMKM.
*   [Js/form_umkm_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/form_umkm_app.js) **[NEW]** — Logika pengontrol pengisian form, validasi, dan integrasi penyimpanan data (Supabase).
*   [peta.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/peta.html) **[NEW]** — Halaman antarmuka Peta Interaktif 3D penyebaran UMKM Desa menggunakan MapLibre GL JS.
*   [Js/map_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/map_app.js) **[NEW]** — Logika pengontrol peta 3D MapLibre, penggambaran boundary GeoJSON, filter kategori, dan animasi kamera 3D.
*   [login.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/login.html) **[NEW]** — Halaman khusus untuk pemilihan peran, login pemilik/admin, dan pendaftaran UMKM.
*   [Js/login_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/login_app.js) **[NEW]** — Logika kontroler halaman khusus login.html.
*   [admin.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/admin.html) **[NEW]** — Halaman antarmuka utama Dashboard Admin Desa.
*   [owner.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/owner.html) **[NEW]** — Halaman antarmuka utama Dashboard Pemilik Toko.
*   [Js/admin_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/admin_app.js) **[NEW]** — Logika kontroler dashboard admin (menangani CRUD modal, rendering tabel, filter, dan pagination).
*   [Js/owner_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/owner_app.js) **[NEW]** — Logika kontroler dashboard pemilik (mengisi form profil, manajemen galeri, dan pembaruan password).
*   [Js/navbar.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/navbar.js) **[MODIFY]** — Menyisipkan link 'Peta Desa' secara dinamis ke seluruh halaman web secara otomatis, di samping mengelola hak akses.
*   [assets/css/auth.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/auth.css) **[NEW]** — File penggayaan CSS khusus untuk layout login, registrasi, pemilihan peran overlay, tabel, dan form dashboard.
*   [Js/Services/umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js) **[MODIFY]** — Mengintegrasikan koneksi SDK Supabase cloud database secara penuh dengan fallback lokal.
*   [Js/models/umkm.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/models/umkm.js) **[MODIFY]** — Menambahkan properti `password` ke constructor UMKM.
*   [assets/css/global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css) **[MODIFY]** — Mengimpor `auth.css` agar seluruh gaya dashboard dan navbar dinamis termuat secara global.
*   [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html) **[MODIFY]** — Menghapus penanda welcome selector overlay (dialihkan ke login.html).
*   [Js/landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js) **[MODIFY]** — Mengubah logika awal: jika tidak ada role, redirect otomatis ke `login.html`.
*   [Main page.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html) **[MODIFY]** — Mengintegrasikan tag script `Js/navbar.js`.
*   [Detail produk.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Detail%20produk.html) **[MODIFY]** — Mengintegrasikan tag script `Js/navbar.js` dan menambahkan fallback parameter kosong.
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

---

## Fitur Baru Tambahan: Unggah Gambar Kustom & Kompresi Canvas

### Deskripsi Implementasi
Fitur unggah gambar (*custom image upload*) telah berhasil diintegrasikan pada alur pendaftaran dan pengisian form UMKM:
1. **Pilihan Unggah Gambar pada Form Admin (`form_umkm.html`)**: Admin Desa kini dapat menarik & melepaskan (*drag and drop*) atau memilih berkas gambar (.jpg, .png, .webp, .heic) langsung saat menambah atau mengedit profil UMKM.
2. **Unggah Foto Profil & Galeri pada Dashboard Pemilik (`owner.html`)**: Pemilik UMKM dapat mengunggah foto profil usaha kustom dan menambah foto galeri produk menggunakan *File Picker / Dropzone UI*.
3. **Pendaftaran UMKM Baru (`login.html`)**: Calon Pemilik UMKM dapat langsung memilih foto usaha saat mendaftar.
4. **Kompresi Canvas Otomatis (`Js/utils/image_uploader.js`)**: Berkas gambar diubah ukurannya secara dinamis (maksimal 1000px) dan dikompresi ke Base64 Data URL sebelum disimpan, menjaga kuota `localStorage` dan Supabase tetap efisien.
5. **Kompatibilitas Tampilan Gambar**: `getImagePath()` diterapkan secara konsisten di `umkm_card.js`, `detail_app.js`, `admin_app.js`, dan `map_app.js` sehingga gambar lokal (`assets/images/`) dan gambar Base64 yang diunggah pengguna dapat ditampilkan secara sempurna tanpa icon link rusak.

### Petunjuk Verifikasi Fitur Upload Gambar
1. **Uji Upload Form Admin (`form_umkm.html`)**:
   - Login sebagai Admin Desa -> Klik **Tambah UMKM Baru**.
   - Pilih berkas gambar kustom dari perangkat Anda (misal `.jpg` atau `.png`).
   - Pastikan pratinjau (*live preview*) gambar langsung muncul dengan tombol hapus/batal.
   - Simpan data dan verifikasi bahwa gambar baru Anda muncul di tabel Admin, katalog produk, dan peta 3D.
2. **Uji Upload Dashboard Pemilik (`owner.html`)**:
   - Login sebagai Pemilik UMKM -> Buka Dashboard Pemilik.
   - Unggah foto profil baru via dropzone area, lalu klik **Simpan Perubahan Profil**.
   - Unggah foto produk baru pada seksi Galeri Foto Produk, klik **Tambahkan ke Galeri**.
   - Klik **Lihat Toko di Katalog** untuk mengonfirmasi bahwa foto profil dan galeri terbaru sudah berhasil diperbarui di halaman detail produk.

---

## Fitur Baru Tambahan: Landing Page 3D Interaktif (3D WebGL Canvas & Parallax Tilt)

### Deskripsi Implementasi
Landing Page (`index.html`) telah berhasil ditingkatkan menjadi **3D Interaktif yang futuristik & responsif**:
1. **3D WebGL Hero Canvas (`Js/components/hero_3d_canvas.js`)**: Kanvas partikel 3D & jaringan geometri (*3D Constellation Mesh*) interaktif di latar belakang Hero Banner. Partikel berputar secara 3D, bereaksi terhadap gerakan mouse, dan memancarkan gelombang kejut (*burst wave*) saat diklik.
2. **3D Parallax & Specular Light Tilt Engine (`Js/utils/tilt_3d.js`)**: Kartu penjelasan platform, kartu statistik, dan kartu UMKM spotlight miring secara 3D mengikuti kursor mouse dengan efek pantulan cahaya (*specular glare reflection*).
3. **Lencana Kategori 3D Melayang (`index.html` & `assets/css/landing.css`)**: Tiga lencana kategori (🍱 Kuliner, 🎨 Kerajinan, 🛠️ Jasa) melayang di area Hero Banner dengan efek animasi 3D levitasi dan responsif saat di-hover.

### Petunjuk Verifikasi Landing Page 3D Interaktif
1. **Uji Canvas 3D Hero Banner**: Buka `index.html` -> gerakkan mouse di area Hero Banner. Perhatikan jaringan partikel 3D berputar & bergeser secara parallax. Klik di mana saja pada Hero Banner untuk memicu gelombang kejut partikel 3D.
2. **Uji 3D Tilt Kartu**: Dekatkan kursor ke kartu "Dukungan Ekonomi Lokal", "Pencarian Cepat", atau kartu produk UMKM Spotlight. Pastikan kartu miring secara 3D mengikuti kursor dengan kilauan cahaya di atasnya.

---

## Fitur Baru Tambahan: 3D Infinite Marquee Showcase Background

### Deskripsi Implementasi
Latar belakang Hero Banner pada Landing Page (`index.html`) kini dilengkapi **3D Infinite Marquee Showcase Wall** yang bergerak secara terus menerus (*continuous seamless loop*):
1. **Visualisasi Foto UMKM Asli (`Js/components/marquee_3d.js`)**: Memuat foto-foto produk UMKM asli dari folder `assets/images/` (Es Doger Mang Ulis, Seblak & Mie Ayam, Toko Opak Ibu Eli, Pangkas Rambut One Man, Jahit Pak Ceming, Warung Sayur, dll.) serta gambar unggahan kustom pengguna.
2. **Sudut Perspektif 3D & Barisan Bertingkat (`landing.css`)**: Kartu-kartu vertikal dengan sudut membulat (*rounded 3D cards*) disusun dalam 2 trek horizontal yang miring secara 3D (`perspective: 1200px`, `rotateY(-14deg) rotateX(8deg)`).
3. **Interaktivitas Hover & Navigasi Direct**:
   - Dekatkan kursor ke area marquee: gerakan animasi melambat secara halus (*smooth pause/slowdown*).
   - Arahkan kursor ke kartu UMKM tertentu: kartu terangkat ke depan secara 3D (*translateZ 50px scale 1.12*) dengan efek glow dan tombol "Lihat Profil".
   - Klik kartu untuk langsung berpindah ke Halaman Detail UMKM (`Detail produk.html?id=...`).
4. **Hero Glassmorphic Container**: Bagian tengah teks utama dilapisi kontainer *Glassmorphism* transparan dengan efek *backdrop-filter blur 22px* sehingga teks tetap terlihat kontras, elegan, dan sangat mudah dibaca.
5. **Pembersihan Background Gambar Static**: Gambar statis latar belakang `desa.jpeg` telah dihapus dan digantikan dengan gradien gelap modern (`linear-gradient`) berkontras tinggi sehingga seluruh kartu 3D Marquee foto UMKM dan partikel WebGL glowing terlihat sangat tajam dan jernih.
6. **Dukungan Video Background Loop 10 Detik (`index.html`, `Main page.html`, `main.css`, `landing.css`)**:
   - Menambahkan elemen `<video class="hero-bg-video" autoplay loop muted playsinline>` yang dikonfigurasi untuk memutar berkas `assets/images/buat_gambar_agar_tidak_statis.mp4` secara sinambung tanpa henti (*infinite loop*) di latar belakang Hero Banner Halaman Beranda (`index.html`) dan Halaman Katalog (`Main page.html`).

---

## Fitur Baru Tambahan: Redesain Halaman Tentang Kami & Profil Desa

### Deskripsi Implementasi
Halaman **Tentang Kami & Profil Desa (`tentang.html`)** telah dirancang ulang secara menyeluruh menjadi tampilan **ultra-modern, interaktif, dan komprehensif**:
1. **Interactive Glassmorphic Hero & Video Background (`tentang.html`)**: Dilengkapi latar belakang video bergerak 10 detik dan bingkai *Glassmorphism* blur transparan yang elegan.
2. **Peta Wilayah 4 Dusun Desa Jayamakmur (`tentang.css`)**: Kartu-kartu interaktif untuk 4 wilayah dusun (Dusun Krajan, Babakan, Sukamaju, Mekarsari) beserta produk unggulan masing-masing dusun.
3. **3 Pilar Utama Program KKN Digitalisasi**: Penjelasan komprehensif pilar program kerja mahasiswa KKN (Direktori Digital, Foto & Branding, Pemetaan 3D & WhatsApp).
4. **Kartu Tim KKN 3D Parallax Tilt (`Js/tentang_app.js`)**: Kartu anggota tim pengembang dengan efek kemiringan 3D (*3D tilt engine*), foto avatar melingkar, lencana *role*, dan tombol tautan media sosial.
5. **Seksi FAQ (Pertanyaan Umum)**: Jawaban seputar pendaftaran UMKM, kebebasan biaya, dan alur transaksi pesan langsung via WhatsApp.

---

## Fitur Baru Tambahan: Redesain Total Halaman Katalog UMKM (3D Focus Grid & Smart Search Hub)

### Deskripsi Implementasi
Halaman **Katalog UMKM (`Main page.html`)** telah dirancang ulang secara menyeluruh dengan fokus penuh pada **kartu-kartu UMKM terdaftar**, **fitur pencarian pintar**, dan **filter 3D interaktif**:
1. **Sleek 3D Control Header & Filter Hub (`Main page.html` & `main.css`)**: Menghapus banner hero/statistik yang mengalihkan perhatian, menggantikannya dengan header 3D berfokus penuh pada eksplorasi UMKM. Dilengkapi badge jumlah UMKM aktif secara real-time (*"Menampilkan X UMKM Terdaftar"*).
2. **Interactive Live Search Input**: Bar pencarian langsung (*real-time typing filter*) dengan icon pencarian, tombol hapus otomatis (`#btnClearSearch`), dan pengurutan A-Z / Z-A.
3. **Lencana Filter Kategori 3D (*3D Category Pills*)**: Tombol kategori mengambang 3D (Semua, 🍱 Kuliner, 🎨 Kerajinan, 🛠️ Jasa, ❤️ Favorit Saya) yang merespons kursor mouse secara interaktif.
4. **Grid Kartu 3D Parallax Tilt (`Js/App.js`)**: Menampilkan 9 kartu UMKM per halaman dalam tata letak grid 3D. Setiap kartu miring secara 3D (*3D perspective tilt & glare reflection*) saat kursor didekatkan.
5. **Penanganan Status Kosong (Empty State)**: Tampilan status kosong interaktif dengan tombol "Reset Filter & Pencarian" saat pencarian tidak menemukan hasil.

