import { UmkmService } from './Services/umkm_services.js';
import { UmkmCard } from './components/UmkmCard.js'; // Mengubah jalur berkas menjadi satu lapis folder components

const umkmService = new UmkmService();

// DOM Elements
const umkmContainer = document.getElementById('umkmContainer'); 
const txtSearch = document.getElementById('searchInput');      
const selKategori = document.getElementById('categoryFilter');  
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageInfo = document.getElementById('page-info');

// Variabel Kontrol Pagination
let currentPage = 1;
const itemsPerPage = 8;
let filteredData = [];

// Fungsi Utama untuk Merender Kartu berdasarkan Halaman
function renderCurrentPage() {
    umkmContainer.innerHTML = '';
    
    if (filteredData.length === 0) {
        umkmContainer.innerHTML = '<p class="empty-text" style="grid-column: 1/-1; text-align:center; color: #888; padding: 20px;">Data UMKM tidak ditemukan.</p>';
        updatePaginationControls(0);
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredData.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
        const card = new UmkmCard(item);
        umkmContainer.innerHTML += card.render();
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    updatePaginationControls(totalPages);
}

// Fungsi untuk mengatur aktif/tidaknya tombol Previous & Next
function updatePaginationControls(totalPages) {
    if (totalPages <= 1) {
        btnPrev.disabled = true;
        btnNext.disabled = true;
        pageInfo.textContent = `Halaman 1 dari 1`;
        return;
    }

    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
}

// Fungsi Filter & Pencarian Gabungan
function applyFilterAndSearch() {
    const keyword = txtSearch.value.toLowerCase();
    const kategori = selKategori.value;

    filteredData = umkmService.daftarUmkm.filter(item => {
        const matchKeyword = item.nama.toLowerCase().includes(keyword) || 
                             item.deskripsi.toLowerCase().includes(keyword);
        
        // Memastikan opsi "Semua" atau nilai kosong tetap meloloskan semua kategori
        const matchKategori = kategori === '' || kategori === 'Semua' || item.kategori === kategori;
        
        return matchKeyword && matchKategori;
    });

    currentPage = 1;
    renderCurrentPage();
}

// Event Listeners untuk Tombol Navigasi Halaman
btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
        window.scrollTo({ top: umkmContainer.offsetTop - 100, behavior: 'smooth' });
    }
});

btnNext.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
        window.scrollTo({ top: umkmContainer.offsetTop - 100, behavior: 'smooth' });
    }
});

// Event Listeners untuk Input Pencarian dan Filter
txtSearch.addEventListener('input', applyFilterAndSearch);
selKategori.addEventListener('change', applyFilterAndSearch);

// Inisialisasi Aplikasi Pertama Kali
async function initApp() {
    try {
        await umkmService.fetchAllUmkm();
        
        // Memastikan data terisi sebelum melakukan render halaman
        if (umkmService.daftarUmkm && umkmService.daftarUmkm.length > 0) {
            filteredData = umkmService.daftarUmkm;
            renderCurrentPage();
        } else {
            umkmContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #888;">Basis data umkm.json kosong atau tidak terbaca.</p>';
        }
    } catch (error) {
        console.error("Gagal memuat data UMKM:", error);
        umkmContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: red; padding: 20px;">Gagal memuat sistem. Cek konsol inspeksi browser Anda.</p>';
    }
}

initApp();