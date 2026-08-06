# Walkthrough: Pembesaran & Penyesuaian Logo Header Navbar (`Header Wajib.png`)

Sesuai instruksi pengguna, logo header pada navbar ([global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css)) telah **diperbesar secara maksimal dan dirapatkan penuh ke pojok kiri navbar**.

---

## 🛠️ Perubahan yang Dilakukan ([global.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/global.css))

1. **Pembesaran Ukuran Logo (`.navbar-kkn-logo`)**:
   - Mengubah tinggi logo dari `48px` menjadi **`68px`** sehingga terlihat gagah, jelas, dan menonjol.
   - Menyesuaikan *padding* menjadi `4px 12px` dan *border-radius* menjadi `12px`.

2. **Perapatan ke Pojok Kiri (`.navbar-container` & `.navbar-logo`)**:
   - Mengubah *max-width* container navbar dari `1200px` menjadi `1300px`.
   - Mengurangi *padding-left* container navbar dan menambahkan `margin-left: -6px` pada logo agar gambar terdorong rapat hingga ke sudut pojok kiri navbar.

---

## 🧪 Hasil Verifikasi

- Logo header (`Header Wajib.png`) kini berukuran besar, tajam, dan memenuhi area pojok kiri navbar di seluruh halaman website.
- Tampilan navbar tetap responsif dan seimbang dengan tombol-tombol navigasi di sebelah kanan.
