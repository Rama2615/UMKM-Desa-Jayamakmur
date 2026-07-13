import { UmkmService } from './Services/umkm_services.js';
import { UmkmCard } from './components/umkm_card.js';

// Inisialisasi Service Utama
const umkmService = new UmkmService();

// Ambil elemen DOM dari HTML
const umkmContainer = document.getElementById('umkmContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Fungsi Utama untuk menampilkan daftar UMKM ke layar HTML
function renderList(daftarUmkm) {
    // Bersihkan kontainer terlebih dahulu
    umkmContainer.innerHTML = '';

    // Jika data kosong
    if (daftarUmkm.length === 0) {
        umkmContainer.innerHTML = '<p class="empty-text">UMKM tidak ditemukan.</p>';
        return;
    }

    // Lakukan perulangan untuk setiap data UMKM menggunakan Class Komponen UmkmCard
    daftarUmkm.forEach(umkm => {
        const cardComponent = new UmkmCard(umkm);
        // Menambahkan elemen HTML string ke dalam kontainer
        umkmContainer.innerHTML += cardComponent.render();
    });
}

// Fungsi untuk menangani aksi pencarian dan filter secara bersamaan
function handleFilterDanCari() {
    const keyword = searchInput.value;
    const kategori = categoryFilter.value;

    // Jalankan logika service OOP kita
    let hasil = umkmService.searchByName(keyword);
    
    // Jika filter kategori bukan 'Semua', lakukan penyaringan lagi
    if (kategori !== 'Semua') {
        hasil = hasil.filter(umkm => umkm.kategori === kategori);
    }

    // Tampilkan hasil akhir ke layar
    renderList(hasil);
}

// Jalankan aplikasi pertama kali saat halaman selesai dimuat
async function initApp() {
    // Ambil data dari umkm.json via service
    const semuaUmkm = await umkmService.fetchAllUmkm();
    
    // Tampilkan semua data ke layar
    renderList(semuaUmkm);

    // Pasang Event Listener untuk fitur Pencarian (Ketik langsung menyaring)
    searchInput.addEventListener('input', handleFilterDanCari);

    // Pasang Event Listener untuk fitur Filter Kategori (Pilih langsung menyaring)
    categoryFilter.addEventListener('change', handleFilterDanCari);
}

// Jalankan fungsi inisialisasi aplikasi
initApp();