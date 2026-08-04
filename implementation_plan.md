# Rencana Implementasi: Real-Time Auto-Sync Data UMKM

Rencana ini bertujuan agar setiap kali Admin atau Pemilik UMKM **menambah, mengedit, atau menghapus** data UMKM di Dashboard Admin, perubahan tersebut **langsung terupdate secara otomatis dan seketika di seluruh halaman website** (Beranda, Katalog, Peta, dan Detail Produk) tanpa perlu me-refresh halaman (F5) atau mengekspor file JSON secara manual.

---

## User Review Required

> [!IMPORTANT]
> - **Real-time Event Broadcasting**: Menggunakan `BroadcastChannel` (dan fallback `storage` event) untuk mengirimkan notifikasi instan antar-tab browser begitu data disimpan/diedit di [form_umkm_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/form_umkm_app.js) atau [admin_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/admin_app.js).
> - **Konsistensi LocalStorage & Memory**: Memastikan [umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js) selalu memperbarui memori lokal (`this.daftarUmkm`) dan `localStorage` secara serentak baik dalam mode lokal maupun saat terhubung ke Supabase Cloud.
> - **Auto Re-render UI**: Menambahkan event listener di [App.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/App.js) (Katalog), [landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js) (Beranda), [map_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/map_app.js) (Peta), dan [detail_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/detail_app.js) agar komponen kartu, statistik, spotlight, dan marker peta langsung memperbarui dirinya saat menerima sinyal update data.

---

## Proposed Changes

### 1. Core Data Service (`umkm_services.js`)

#### [MODIFY] [umkm_services.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/Services/umkm_services.js)
* Memastikan metode `addUmkm()`, `updateUmkm()`, dan `deleteUmkm()` selalu memanggil `this.saveToLocalStorage()`.
* Menambahkan mekanisme penyebaran sinyal update instan (`broadcastUpdate()`) menggunakan `BroadcastChannel('umkm_sync_channel')` dan `localStorage` event trigger.
* Memastikan `fetchAllUmkm()` mengutamakan data terbaru dari `localStorage` / Supabase agar data selalu tersinkronisasi antar navigasi halaman.

---

### 2. Live Update Handlers pada Seluruh Halaman Website

#### [MODIFY] [App.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/App.js) (Halaman Katalog UMKM)
* Menambahkan listener `BroadcastChannel` / `storage` event.
* Ketika sinyal perubahan data diterima: otomatis memanggil `fetchAllUmkm()`, memperbarui data terfilter, dan memanggil `renderCurrentPage()` secara otomatis tanpa refresh.

#### [MODIFY] [landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js) (Halaman Beranda)
* Menambahkan listener perubahan data untuk memperbarui jumlah total UMKM terdaftar (`landing-stat-count`), merender ulang 3D Marquee Wall (`marquee3dContainer`), dan merender ulang kartu Spotlight UMKM Unggulan.

#### [MODIFY] [map_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/map_app.js) (Halaman Peta Desa)
* Menambahkan listener perubahan data untuk memperbarui titik pin/marker lokasi UMKM pada peta Leaflet secara otomatis.

#### [MODIFY] [detail_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/detail_app.js) (Halaman Detail Produk)
* Menambahkan listener untuk memperbarui detail produk yang sedang dilihat jika produk tersebut baru saja di-edit dari admin.

---

## Verification Plan

### Manual Verification
1. **Pengujian Tambah UMKM Baru**:
   - Buka 2 tab browser secara berdampingan: Tab 1 ([Main page.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Main%20page.html) / Katalog) dan Tab 2 ([admin.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/admin.html) -> Tambah UMKM).
   - Isi form tambah UMKM di Tab 2 lalu klik **Simpan**.
   - Verifikasi kartu UMKM baru **langsung muncul di Tab 1 secara otomatis** tanpa menekan F5.
2. **Pengujian Edit Profil UMKM**:
   - Edit nama/foto/deskripsi salah satu UMKM di Tab 2.
   - Verifikasi informasi di Tab 1 (Katalog & Beranda) langsung berubah seketika.
3. **Pengujian Hapus UMKM**:
   - Hapus salah satu UMKM di Tab 2.
   - Verifikasi kartu UMKM tersebut langsung hilang dari katalog dan jumlah statistik terdaftar di Beranda langsung berkurang.

