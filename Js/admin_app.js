import { UmkmService } from './Services/umkm_services.js?v=3';
import { initTheme } from './theme.js?v=3';
import { getImagePath } from './utils/image_uploader.js?v=3';

// Inisialisasi Tema
initTheme();

const service = new UmkmService();

// State Variabel Kontrol
let currentPage = 1;
let itemsPerPage = 8;
let filteredData = [];
let categoryChartInstance = null;
let locationChartInstance = null;

// DOM Elements
const tableBody = document.getElementById('adminTableBody');
const searchInput = document.getElementById('adminSearchInput');
const categoryFilter = document.getElementById('adminCategoryFilter');

const btnPrev = document.getElementById('adminBtnPrev');
const btnNext = document.getElementById('adminBtnNext');
const pageInfo = document.getElementById('adminPageInfo');

const statTotal = document.getElementById('statTotal');
const statKuliner = document.getElementById('statKuliner');
const statKerajinan = document.getElementById('statKerajinan');
const statJasa = document.getElementById('statJasa');

const toastNotification = document.getElementById('toastNotification');

// DOM Elements Modal
// (Aksi Edit & Tambah dialihkan ke form_umkm.html)

// Fungsi Toast Notification
function showToast(msg) {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// Fungsi Hitung Statistik
function renderStats() {
    const allItems = service.daftarUmkm;
    if (statTotal) statTotal.textContent = allItems.length;
    if (statKuliner) statKuliner.textContent = allItems.filter(u => u.kategori === 'Kuliner').length;
    if (statKerajinan) statKerajinan.textContent = allItems.filter(u => u.kategori === 'Kerajinan').length;
    if (statJasa) statJasa.textContent = allItems.filter(u => u.kategori === 'Jasa').length;
}

// Fungsi Filter Gabungan
function applyFilters() {
    const keyword = searchInput ? searchInput.value : '';
    const kategori = categoryFilter ? categoryFilter.value : '';

    filteredData = service.getFilteredUmkm(keyword, kategori, 'id-asc');
    currentPage = 1;
    renderTable();
}

// Fungsi Render Tabel
function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888; padding: 30px;">Data UMKM tidak ditemukan.</td></tr>`;
        updatePagination(0);
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredData.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        const imgPath = getImagePath(item.gambar);
        row.innerHTML = `
            <td><strong>#${item.id}</strong></td>
            <td>
                <img src="${imgPath}" alt="${item.nama}" class="db-img-thumb" onerror="this.src='https://placehold.co/50x50?text=Logo'">
            </td>
            <td><strong>${item.nama}</strong></td>
            <td><span class="badge-${item.kategori.toLowerCase()}">${item.kategori}</span></td>
            <td><span style="font-size:0.85rem; color:var(--text-muted);">${item.alamat}</span></td>
            <td><span style="font-weight:700;">${item.whatsapp}</span></td>
            <td>
                <div class="btn-group-actions">
                    <button class="btn-icon btn-edit" data-id="${item.id}" title="Edit Profil">✏️</button>
                    <button class="btn-icon delete btn-hapus" data-id="${item.id}" title="Hapus Toko">🗑️</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    updatePagination(totalPages);
}

// Update Pagination Controls
function updatePagination(totalPages) {
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

// Fungsi Render Grafik Statistik
function renderCharts() {
    const allItems = service.daftarUmkm;

    // 1. DATA KATEGORI
    const categoriesCount = {
        'Kuliner': allItems.filter(u => u.kategori === 'Kuliner').length,
        'Kerajinan': allItems.filter(u => u.kategori === 'Kerajinan').length,
        'Jasa': allItems.filter(u => u.kategori === 'Jasa').length
    };

    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#ffffff' : '#333333';
    const gridColor = isDark ? '#3f4d5a' : '#eaeaea';

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    const ctxCategory = document.getElementById('categoryChart');
    if (ctxCategory) {
        categoryChartInstance = new Chart(ctxCategory, {
            type: 'doughnut',
            data: {
                labels: ['Kuliner', 'Kerajinan', 'Jasa'],
                datasets: [{
                    data: [categoriesCount['Kuliner'], categoriesCount['Kerajinan'], categoriesCount['Jasa']],
                    backgroundColor: [
                        '#ff6b4a', // Orange untuk Kuliner
                        '#8b5cf6', // Ungu untuk Kerajinan
                        '#0d9488'  // Teal untuk Jasa
                    ],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? '#1c2732' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: { family: 'Outfit', size: 12 }
                        }
                    }
                }
            }
        });
    }
}

// Inisialisasi Setup Awal
async function initDashboard() {
    await service.fetchAllUmkm();
    renderStats();
    renderCharts();
    applyFilters();

    // Dengarkan perubahan tema gelap/terang untuk melukis ulang grafik
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTimeout(renderCharts, 150);
        });
    }

    // Tombol Download Database Terbaru (umkm.json)
    const btnExportJson = document.getElementById('btnExportJson');
    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            const cleanData = service.daftarUmkm.map(u => ({
                id: u.id,
                nama: u.nama,
                kategori: u.kategori,
                deskripsi: u.deskripsi,
                whatsapp: u.whatsapp,
                gambar: u.gambar,
                galeri: u.galeri || [],
                alamat: u.alamat,
                mapsUrl: u.mapsUrl
            }));
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "umkm.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast("File umkm.json terbaru berhasil didownload! 📥");
        });
    }

    // Event Listener Filter & Cari
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);

    // Event Listener Pagination
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    // Event Delegation untuk Aksi Edit dan Hapus di Tabel
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit');
            const hapusBtn = e.target.closest('.btn-hapus');

            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                window.location.href = `form_umkm.html?id=${id}`;
            }

            if (hapusBtn) {
                const id = hapusBtn.getAttribute('data-id');
                prosesHapus(id);
            }
        });
    }
}

// Proses Hapus UMKM
async function prosesHapus(id) {
    const umkm = service.getUmkmById(id);
    if (!umkm) return;

    const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus data toko "${umkm.nama}" dari platform?`);
    if (konfirmasi) {
        const sukses = await service.deleteUmkm(id);
        if (sukses) {
            showToast(`Sukses menghapus toko ${umkm.nama}! 🗑️`);
            renderStats();
            renderCharts();
            applyFilters();
        } else {
            alert('Gagal menghapus data.');
        }
    }
}

initDashboard();
