# Walkthrough: Perbaikan Bug Reset Data / Database Swapping Saat Hapus UMKM

Telah dilakukan penelusuran mendalam (*root cause analysis*) dan pembenahan penuh pada skrip layanan database ([umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js)).

---

## 🔍 Akar Masalah (*Root Causes Identified*)

1. **Re-Seeding Otomatis Paksa (`pushAllLocalToCloud`)**:
   - Sebelumnya, jika jumlah baris di Supabase Cloud berkurang menjadi kurang dari 20 (karena ada UMKM yang dihapus), skrip latar belakang mendeteksi `cloudData.length < 20` dan **otomatis men-upload ulang seluruh 20 data awal dari file JSON ke Supabase**.
   - Hal ini membuat data yang baru saja dihapus kembali muncul secara tiba-tiba.

2. **Pengubahan ID Lokal (`reindexUmkm()`)**:
   - Ketika data #1 dihapus, fungsi `reindexUmkm()` mengubah ID lokal data #2 menjadi #1, #3 menjadi #2, dan seterusnya.
   - Namun ID di Supabase Cloud **tidak berubah**. Akibatnya, saat Admin menekan tombol Hapus pada toko baris berikutnya, sistem mengirim ID yang salah ke Supabase sehingga data toko lain yang terhapus/tertukar.

3. **Smart Merge yang Mengembalikan Data Terhapus**:
   - Fungsi sinkronisasi memetakan kembali `baseItems` dari `umkm.json` bahkan jika baris tersebut sudah secara sah dihapus dari Supabase.

---

## 🛠️ Perubahan & Solusi yang Diterapkan

1. **Menjadikan Supabase Cloud sebagai Single Source of Truth ([umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js))**:
   - Menghapus logika re-seeding otomatis saat jumlah data < 20.
   - Re-seeding hanya terjadi **sekali** jika tabel Supabase benar-benar kosong (0 baris).
   - Sinkronisasi kini langsung merefleksikan status tabel Supabase secara presisi.

2. **Menghapus Total `reindexUmkm()`**:
   - ID tiap UMKM kini bersifat stabil (*immutable*) sesuai Primary Key dari database Supabase (`id: 1, 2, 3, 4, ...`).
   - Tidak ada lagi penggeseran ID lokal yang menyebabkan salah target hapus/edit.

3. **Menyempurnakan `deleteUmkm(id)`**:
   - Mengirim request `DELETE /rest/v1/umkms?id=eq.${id}` langsung ke Supabase REST API.
   - Menyaring data lokal dan menyimpannya ke `localStorage` tanpa mengganggu ID baris lain.

---

## 🧪 Hasil Verifikasi

- Menghapus UMKM di Dashboard Admin kini **permanen** dan tidak akan memicu pemulihan data otomatis (*re-seeding*).
- Menghapus 1 baris tidak menggeser ID baris lain, sehingga penghapusan baris berikutnya selalu akurat targetnya.
