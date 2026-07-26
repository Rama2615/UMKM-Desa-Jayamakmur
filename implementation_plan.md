# Rencana Implementasi: Landing Page 3D Interaktif (Interactive 3D Landing Page)

Rencana ini bertujuan untuk mentransformasi Landing Page (`index.html`) JayamakmurHub menjadi antarmuka **3D Interaktif yang modern, estetik, dan memukau** menggunakan **Three.js WebGL Engine** dan **3D Tilt Parallax Effect**.

---

## User Review Required

> [!IMPORTANT]
> - **Three.js 3D WebGL Background Canvas**: Mengintegrasikan sistem WebGL 3D pada Hero Banner berupa bola dunia/jaring-jaring partikel interaktif 3D (*3D Interactive Particle Mesh*) berwarna khas brand Desa Jayamakmur (Teal `#1b4d3e` & Orange `#e65c00`). Partikel ini merespons posisi kursor mouse pengguna secara real-time dan memberikan gelombang saat diklik.
> - **3D Parallax & Specular Light Tilt Engine**: Seluruh kartu informasi platform (`.explanation-card`), kartu statistik, dan kartu produk UMKM unggulan (`.card-umkm`) akan memiliki efek miring 3D (*3D Tilt*) yang mengikuti pergerakan mouse beserta efek pantulan cahaya (*specular lighting glare*).
> - **Lencana Kategori 3D Melayang (*Floating 3D Badges*)**: Menambahkan elemen 3D melayang (*floating 3D badges*) untuk kategori 🍱 Kuliner, 🎨 Kerajinan, dan 🛠️ Jasa di bagian Hero yang berorientasi 3D.
> - **Performa Tinggi & Kompatibilitas Mobile**: Menggunakan rendering WebGL ter-optimasi (60 FPS) dengan fallback halus untuk perangkat berdaya rendah.

---

## Proposed Changes

### 1. 3D WebGL & Interactive Engines (Js/components/ & Js/utils/)

#### [NEW] [hero_3d_canvas.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/components/hero_3d_canvas.js)
* Menginisialisasi Scene Three.js, Kamera 3D Perspective, dan Renderer WebGL transparan pada `<canvas id="hero-3d-canvas">`.
* Merancang objek 3D partikel mesh / geometri globe interaktif dengan material glowing.
* Mengikat event `mousemove` untuk rotasi parallax kamera 3D dan event `click` untuk efek gelombang kejut (*burst wave animation*).
* Menangani otomatis penyesuaian ukuran (*resize handler*) agar selalu pas dengan layar pengguna.

#### [NEW] [tilt_3d.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/utils/tilt_3d.js)
* Engine 3D Tilt mandiri untuk menghitung sudut rotasi X/Y (`rotateX`, `rotateY`) dan kedalaman Z (`translateZ`) berdasarkan kursor mouse pada elemen HTML.
* Menambahkan lapisan efek kilauan cahaya (*specular glare overlay*) yang bergeser secara dinamis.

---

### 2. Layout & HTML Modifications

#### [MODIFY] [index.html](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/index.html)
* Menyisipkan elemen `<canvas id="hero-3d-canvas">` di bagian Hero Section.
* Menyisipkan elemen 3D Floating Category Badges (Kuliner 🍱, Kerajinan 🎨, Jasa 🛠️) pada Hero Banner.
* Menambahkan atribut `data-tilt-3d` pada kartu statistik, kartu penjelasan, dan kartu spotlight.

---

### 3. Styling 3D & Glassmorphism

#### [MODIFY] [landing.css](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/assets/css/landing.css)
* Menambahkan properti `transform-style: preserve-3d` dan `perspective: 1000px` pada wadah utama.
* Menambahkan gaya untuk `canvas#hero-3d-canvas` (posisi fixed/absolute transparan dengan z-index di belakang teks).
* Menambahkan efek kilauan 3D (*glare sheen*), animasi melayang (*3D levitation keyframes*), dan bayangan 3D mengambang (*floating 3D shadow*).

---

### 4. Application Integration

#### [MODIFY] [landing_app.js](file:///c:/Users/ADVAN/Documents/UMKM-Desa-Jayamakmur/Js/landing_app.js)
* Memuat dan menginisialisasi `initHero3DCanvas()` dan `init3DTiltEngine()` saat halaman dimuat.
* Memasang event listener untuk kartu spotlight UMKM agar efek 3D tilt aktif pada kartu yang dimuat secara dinamis.

---

## Verification Plan

### Manual Verification
1. **Pengujian Canvas 3D Hero Banner**:
   - Buka `index.html` di browser.
   - Gerakkan mouse di area Hero Banner dan pastikan objek 3D partikel berputar & bergeser mengikuti arah kursor.
   - Klik di area Hero Banner dan pastikan terjadi animasi responsif (*burst particle wave*).
2. **Pengujian 3D Card Tilt & Lighting**:
   - Arahkan kursor mouse ke kartu "Dukungan Ekonomi Lokal", "Pencarian Cepat", dll.
   - Pastikan kartu miring secara 3D secara presisi mengikuti kursor dengan kilauan cahaya di atasnya.
3. **Pengujian Responsif & Performa**:
   - Ubah ukuran jendela browser dan uji pada tampilan HP/Tablet untuk memastikan animasi 3D tetap mulus tanpa lag.
