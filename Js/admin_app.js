import { UmkmService } from './Services/umkm_services.js?v=3';
import { initTheme } from './theme.js?v=3';

// Inisialisasi Tema
initTheme();

const service = new UmkmService();

// State Variabel Kontrol
let currentPage = 1;
const itemsPerPage = 8;
let filteredData = [];

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
const modal = document.getElementById('umkmModal');
const btnTambah = document.getElementById('btnTambahUmkm');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnBatal = document.getElementById('btnBatal');
const umkmForm = document.getElementById('umkmForm');

const modalTitle = document.getElementById('modalTitle');
const formUmkmId = document.getElementById('formUmkmId');
const formNama = document.getElementById('formNama');
const formKategori = document.getElementById('formKategori');
const formWhatsapp = document.getElementById('formWhatsapp');
const formAlamat = document.getElementById('formAlamat');
const formDeskripsi = document.getElementById('formDeskripsi');
const formGambar = document.getElementById('formGambar');
const formPassword = document.getElementById('formPassword');
const formMapsUrl = document.getElementById('formMapsUrl');

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

    filteredData = service.getFilteredUmkm(keyword, kategori, 'nama-asc');
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
        row.innerHTML = `
            <td><strong>#${item.id}</strong></td>
            <td>
                <img src="assets/images/${item.gambar}" alt="${item.nama}" class="db-img-thumb" onerror="this.src='https://placehold.co/50x50?text=Logo'">
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

// Inisialisasi Setup Awal
async function initDashboard() {
    await service.fetchAllUmkm();
    renderStats();
    applyFilters();

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
                bukaModalEdit(id);
            }

            if (hapusBtn) {
                const id = hapusBtn.getAttribute('data-id');
                prosesHapus(id);
            }
        });
    }
}

// Buka Modal Tambah
if (btnTambah) {
    btnTambah.addEventListener('click', () => {
        umkmForm.reset();
        formUmkmId.value = '';
        formPassword.placeholder = 'default: owner123';
        formPassword.required = true;
        modalTitle.textContent = 'Tambah UMKM Baru';
        modal.classList.add('show');
    });
}

// Tutup Modal
function tutupModal() {
    modal.classList.remove('show');
}
if (btnCloseModal) btnCloseModal.addEventListener('click', tutupModal);
if (btnBatal) btnBatal.addEventListener('click', tutupModal);

// Buka Modal Edit
function bukaModalEdit(id) {
    const umkm = service.getUmkmById(id);
    if (!umkm) return;

    formUmkmId.value = umkm.id;
    formNama.value = umkm.nama;
    formKategori.value = umkm.kategori;
    formWhatsapp.value = umkm.whatsapp;
    formAlamat.value = umkm.alamat;
    formDeskripsi.value = umkm.deskripsi;
    formGambar.value = umkm.gambar;
    formPassword.value = umkm.password;
    formPassword.required = false; // tidak wajib diganti
    formMapsUrl.value = umkm.mapsUrl || '';

    modalTitle.textContent = `Edit UMKM: ${umkm.nama}`;
    modal.classList.add('show');
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
            applyFilters();
        } else {
            alert('Gagal menghapus data.');
        }
    }
}

// Submit Form CRUD
if (umkmForm) {
    umkmForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = formUmkmId.value;
        const dataSubmit = {
            nama: formNama.value.trim(),
            kategori: formKategori.value,
            whatsapp: formWhatsapp.value.trim(),
            alamat: formAlamat.value.trim(),
            deskripsi: formDeskripsi.value.trim(),
            gambar: formGambar.value.trim() || 'placeholder.jpg',
            mapsUrl: formMapsUrl.value.trim(),
            password: formPassword.value
        };

        if (id) {
            // Aksi Edit
            await service.updateUmkm(id, dataSubmit);
            showToast('Profil UMKM berhasil diperbarui! 💾');
        } else {
            // Aksi Tambah
            await service.addUmkm(dataSubmit);
            showToast('UMKM Baru berhasil ditambahkan! 🎉');
        }

        tutupModal();
        renderStats();
        applyFilters();
    });
}

initDashboard();
