import { UmkmService } from './Services/umkm_services.js?v=12';
import { UmkmCard } from './components/umkm_card.js?v=12';
import { initTheme } from './theme.js?v=12';
import { init3DTiltEngine } from './utils/tilt_3d.js?v=12';

// Inisialisasi tema saat halaman dimuat
initTheme();

const umkmService = new UmkmService();

// DOM Elements
const umkmContainer = document.getElementById('umkmContainer'); 
const txtSearch = document.getElementById('searchInput');      
const btnClearSearch = document.getElementById('btnClearSearch');
const selKategori = document.getElementById('categoryFilter');
const selSort = document.getElementById('sortFilter');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageInfo = document.getElementById('page-info');
const catalogCountBadge = document.getElementById('catalogCountBadge');
const pillButtons = document.querySelectorAll('.pill-btn');
const katalogSection = document.getElementById('katalogSection');
const toastNotification = document.getElementById('toastNotification');

// Variabel Kontrol Pagination (9 kartu per halaman untuk tampilan Grid 3D yang kaya)
let currentPage = 1;
const itemsPerPage = 9;
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
    if (!umkmContainer) return;
    umkmContainer.innerHTML = '';
    
    // Perbarui jumlah UMKM terdaftar pada badge
    if (catalogCountBadge) {
        catalogCountBadge.textContent = `Menampilkan ${filteredData.length} UMKM Terdaftar`;
    }
    const heroCatalogCountBadge = document.getElementById('heroCatalogCountBadge');
    if (heroCatalogCountBadge) {
        heroCatalogCountBadge.textContent = `${umkmService.daftarUmkm.length} UMKM Terdaftar`;
    }

    if (filteredData.length === 0) {
        umkmContainer.innerHTML = `
            <div class="empty-state-box" style="grid-column: 1/-1; text-align:center; padding: 60px 20px; background: var(--card-bg); border-radius: 24px; border: 1px dashed var(--border-color);">
                <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
                <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-dark); margin-bottom: 8px;">UMKM Tidak Ditemukan</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">Tidak ada UMKM yang cocok dengan kata kunci atau kategori yang Anda pilih.</p>
                <button type="button" id="btnResetFilters" class="btn-recommend" style="display: inline-flex; width: auto; padding: 10px 24px;">Reset Filter & Pencarian</button>
            </div>
        `;

        const btnReset = document.getElementById('btnResetFilters');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (txtSearch) txtSearch.value = '';
                if (selKategori) selKategori.value = '';
                applyFilterAndSearch();
            });
        }

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

    // Inisialisasi 3D Tilt Engine pada seluruh kartu UMKM yang baru di-render
    init3DTiltEngine('.umkm-grid .card-umkm');

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    updatePaginationControls(totalPages);
}

// Fungsi untuk mengatur tombol Previous & Next
function updatePaginationControls(totalPages) {
    if (!btnPrev || !btnNext || !pageInfo) return;

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

// Fungsi untuk memperbarui status aktif pada 3D Category Pills
function updateActivePill(category) {
    pillButtons.forEach(btn => {
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
    const keyword = txtSearch ? txtSearch.value.trim() : '';
    const kategori = selKategori ? selKategori.value : '';
    const sortBy = selSort ? selSort.value : 'nama-asc';

    // Tampilkan / sembunyikan tombol clear search
    if (btnClearSearch) {
        btnClearSearch.style.display = keyword ? 'block' : 'none';
    }

    if (kategori === 'Favorit') {
        filteredData = umkmService.getFilteredUmkm(keyword, '', sortBy);
        const favorites = JSON.parse(localStorage.getItem('umkm_favorites')) || [];
        filteredData = filteredData.filter(item => favorites.includes(Number(item.id)));
    } else {
        filteredData = umkmService.getFilteredUmkm(keyword, kategori, sortBy);
    }
    
    updateActivePill(kategori);

    currentPage = 1;
    renderCurrentPage();
}

// Event Listeners Navigasi Halaman
if (btnPrev) {
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
            if (katalogSection) katalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (btnNext) {
    btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
            if (katalogSection) katalogSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Event Listeners 3D Category Pills
pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        if (selKategori) {
            selKategori.value = category;
        }
        applyFilterAndSearch();
    });
});

// Event Listener Clear Search Input
if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
        if (txtSearch) {
            txtSearch.value = '';
            txtSearch.focus();
            applyFilterAndSearch();
        }
    });
}

// Event Listeners Input Pencarian & Select Sorting
if (txtSearch) {
    txtSearch.addEventListener('input', applyFilterAndSearch);
}
if (selKategori) selKategori.addEventListener('change', applyFilterAndSearch);
if (selSort) selSort.addEventListener('change', applyFilterAndSearch);

// Event Delegation untuk Tombol Bagikan (Share) & Favorit (Wishlist)
if (umkmContainer) {
    umkmContainer.addEventListener('click', (e) => {
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
                favBtn.style.transform = 'scale(1.3)';
                setTimeout(() => favBtn.style.transform = '', 250);
            }

            localStorage.setItem('umkm_favorites', JSON.stringify(favorites));

            const kategori = selKategori ? selKategori.value : '';
            if (kategori === 'Favorit') {
                applyFilterAndSearch();
            }
        }
    });
}

// Inisialisasi Aplikasi Pertama Kali
async function initApp() {
    try {
        await umkmService.fetchAllUmkm();
        
        if (umkmService.daftarUmkm && umkmService.daftarUmkm.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            if (categoryParam && selKategori) {
                const validCategories = ['Kuliner', 'Kerajinan', 'Jasa', 'Favorit'];
                if (validCategories.includes(categoryParam)) {
                    selKategori.value = categoryParam;
                }
            }

            const searchParam = urlParams.get('search');
            if (searchParam && txtSearch) {
                txtSearch.value = searchParam;
            }

            applyFilterAndSearch();
            // Inisialisasi 3D Tilt untuk Control Bar
            init3DTiltEngine('.catalog-filter-bar');
        } else {
            umkmContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #888;">Basis data umkm.json kosong atau tidak terbaca.</p>';
        }
    } catch (error) {
        console.error("Gagal memuat data UMKM:", error);
        umkmContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: red; padding: 20px;">Gagal memuat sistem. Cek konsol inspeksi browser Anda.</p>';
    }
}

initApp();