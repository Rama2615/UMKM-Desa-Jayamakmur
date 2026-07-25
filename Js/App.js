import { UmkmService } from './Services/umkm_services.js?v=3';
import { UmkmCard } from './components/umkm_card.js?v=3';
import { initTheme } from './theme.js?v=3';

// Inisialisasi tema saat halaman dimuat
initTheme();

const umkmService = new UmkmService();

// DOM Elements
const umkmContainer = document.getElementById('umkmContainer'); 
const txtSearch = document.getElementById('searchInput');      
const selKategori = document.getElementById('categoryFilter');
const selSort = document.getElementById('sortFilter');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageInfo = document.getElementById('page-info');
const btnRecommend = document.getElementById('btnRecommend');
const chipButtons = document.querySelectorAll('.chip-btn');
const katalogSection = document.getElementById('katalogSection');
const toastNotification = document.getElementById('toastNotification');

// Variabel Kontrol Pagination
let currentPage = 1;
const itemsPerPage = 4;
let filteredData = [];

// Fungsi Toast Notification
function showToast(msg = 'Link profil berhasil disalin! 📋') {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// Fungsi Utama untuk Merender Kartu berdasarkan Halaman
function renderCurrentPage() {
    umkmContainer.innerHTML = '';
    
    if (filteredData.length === 0) {
        umkmContainer.innerHTML = '<p class="empty-text" style="grid-column: 1/-1; text-align:center; color: #888; padding: 40px 20px;">Data UMKM tidak ditemukan.</p>';
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

// Fungsi untuk memperbarui status aktif pada Quick Chips
function updateActiveChip(category) {
    chipButtons.forEach(btn => {
        const btnCat = btn.getAttribute('data-category');
        if (btnCat === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Fungsi Filter & Pencarian Gabungan
function applyFilterAndSearch() {
    const keyword = txtSearch ? txtSearch.value : '';
    const kategori = selKategori ? selKategori.value : '';
    const sortBy = selSort ? selSort.value : 'nama-asc';

    if (kategori === 'Favorit') {
        filteredData = umkmService.getFilteredUmkm(keyword, '', sortBy);
        const favorites = JSON.parse(localStorage.getItem('umkm_favorites')) || [];
        filteredData = filteredData.filter(item => favorites.includes(Number(item.id)));
    } else {
        filteredData = umkmService.getFilteredUmkm(keyword, kategori, sortBy);
    }
    
    updateActiveChip(kategori);

    currentPage = 1;
    renderCurrentPage();
}

// Event Listeners untuk Tombol Navigasi Halaman
btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
        if (katalogSection) {
            katalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

btnNext.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
        if (katalogSection) {
            katalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Event Listener untuk Tombol "Cek Rekomendasi"
if (btnRecommend) {
    btnRecommend.addEventListener('click', () => {
        applyFilterAndSearch();
        if (katalogSection) {
            katalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Event Listeners untuk Quick Category Chips
chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        if (selKategori) {
            selKategori.value = category;
        }
        applyFilterAndSearch();
        if (katalogSection) {
            katalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Event Listeners untuk Input Pencarian, Select Kategori, dan Select Sorting
if (txtSearch) {
    txtSearch.addEventListener('input', applyFilterAndSearch);
    txtSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilterAndSearch();
            if (katalogSection) {
                katalogSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}
if (selKategori) selKategori.addEventListener('change', applyFilterAndSearch);
if (selSort) selSort.addEventListener('change', applyFilterAndSearch);

// Event Delegation untuk Tombol Bagikan (Share)
// Event Delegation untuk Tombol Bagikan (Share) & Favorit (Wishlist)
if (umkmContainer) {
    umkmContainer.addEventListener('click', (e) => {
        // Handle share button
        const shareBtn = e.target.closest('.btn-share');
        if (shareBtn) {
            const id = shareBtn.getAttribute('data-id');
            const nama = shareBtn.getAttribute('data-nama');
            const detailUrl = `${window.location.origin}${window.location.pathname.replace(/Main%20page\.html|index\.html$/i, '')}Detail%20produk.html?id=${id}`;

            if (navigator.share) {
                navigator.share({
                    title: nama,
                    text: `Profil UMKM Desa Jayamakmur: ${nama}`,
                    url: detailUrl
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(detailUrl).then(() => {
                    showToast(`Link profil ${nama} berhasil disalin! 🔗`);
                }).catch(() => {
                    showToast(`Link: ${detailUrl}`);
                });
            }
            return;
        }

        // Handle favorite button
        const favBtn = e.target.closest('.btn-favorite');
        if (favBtn) {
            const id = Number(favBtn.getAttribute('data-id'));
            let favorites = JSON.parse(localStorage.getItem('umkm_favorites')) || [];

            if (favorites.includes(id)) {
                favorites = favorites.filter(favId => favId !== id);
                favBtn.classList.remove('active');
                showToast("Dihapus dari Favorit Saya ❤️");
            } else {
                favorites.push(id);
                favBtn.classList.add('active');
                showToast("Disimpan ke Favorit Saya ❤️");
                // Efek denyut mikro-animasi
                favBtn.style.transform = 'scale(1.3)';
                setTimeout(() => favBtn.style.transform = '', 250);
            }

            localStorage.setItem('umkm_favorites', JSON.stringify(favorites));

            // Jika filter saat ini adalah "Favorit", langsung perbarui tampilan
            const kategori = selKategori ? selKategori.value : '';
            if (kategori === 'Favorit') {
                applyFilterAndSearch();
            }
        }
    });
}

// Fungsi animasi statistik realtime
function animateStats() {
    const totalUmkm = umkmService.daftarUmkm.length;
    
    // Hitung jumlah kategori unik secara realtime
    const totalKategori = new Set(umkmService.daftarUmkm.map(u => u.kategori)).size;
    
    // Hitung wilayah dusun unik secara realtime dari alamat
    const dusunSet = new Set();
    umkmService.daftarUmkm.forEach(u => {
        const match = u.alamat.match(/Dusun\s+([A-Za-z]+)/i);
        if (match) {
            dusunSet.add(match[1]);
        } else {
            const streetMatch = u.alamat.match(/Jl\.\s+([A-Za-z]+)/i);
            if (streetMatch) {
                dusunSet.add(streetMatch[1]);
            }
        }
    });
    const totalDusun = dusunSet.size || 4;

    const stats = [
        { id: 'stat-umkm', target: totalUmkm },
        { id: 'stat-dusun', target: totalDusun },
        { id: 'stat-kategori', target: totalKategori }
    ];

    stats.forEach(stat => {
        const el = document.getElementById(stat.id);
        if (!el) return;

        // Set target data-attribute untuk referensi
        el.setAttribute('data-target', stat.target);

        let current = 0;
        const target = stat.target;
        const duration = 1200; // ms
        
        if (target === 0) {
            el.textContent = '0';
            return;
        }
        
        const increment = target / (duration / 16); // ~60fps

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = `${target}+`;
                clearInterval(counter);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Inisialisasi Aplikasi Pertama Kali
async function initApp() {
    try {
        await umkmService.fetchAllUmkm();
        
        if (umkmService.daftarUmkm && umkmService.daftarUmkm.length > 0) {
            // Cek parameter query category dari URL
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            if (categoryParam && selKategori) {
                const validCategories = ['Kuliner', 'Kerajinan', 'Jasa', 'Favorit'];
                if (validCategories.includes(categoryParam)) {
                    selKategori.value = categoryParam;
                }
            }

            // Cek parameter query search dari URL
            const searchParam = urlParams.get('search');
            const searchInputEl = txtSearch || document.getElementById('searchInput');
            if (searchParam && searchInputEl) {
                searchInputEl.value = searchParam;
            }


            applyFilterAndSearch();
            // Jalankan animasi stats
            animateStats();
        } else {
            umkmContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #888;">Basis data umkm.json kosong atau tidak terbaca.</p>';
        }
    } catch (error) {
        console.error("Gagal memuat data UMKM:", error);
        umkmContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: red; padding: 20px;">Gagal memuat sistem. Cek konsol inspeksi browser Anda.</p>';
    }
}

initApp();