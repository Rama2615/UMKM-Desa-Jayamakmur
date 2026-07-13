import { UmkmService } from './Services/umkm_services.js';

const umkmService = new UmkmService();
const detailContainer = document.getElementById('detailContainer');

// Fungsi untuk mendapatkan ID dari URL browser (?id=1)
function getUmkmIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Fungsi untuk menampilkan detail ke HTML
function renderDetail(umkm) {
    if (!umkm) {
        detailContainer.innerHTML = '<p class="empty-text">Data UMKM tidak ditemukan.</p>';
        return;
    }

    detailContainer.innerHTML = `
        <div class="detail-wrapper">
            <div class="detail-image">
                <img src="assets/images/umkm/${umkm.gambar}" alt="${umkm.nama}" onerror="this.src='https://placehold.co/600x400?text=Foto+UMKM'">
            </div>
            <div class="detail-info">
                <span class="badge-${umkm.kategori.toLowerCase()}">${umkm.kategori}</span>
                <h2>${umkm.nama}</h2>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>Deskripsi Produk / Usaha:</h3>
                <p class="detail-desc">${umkm.deskripsi}</p>
                
                <div class="action-box" style="margin-top: 30px;">
                    <a href="${umkm.getWhatsAppLink()}" target="_blank" class="btn-whatsapp" style="display: inline-block; padding: 12px 25px;">
                        Hubungi via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
}

async function initDetailApp() {
    // 1. Ambil semua data UMKM terlebih dahulu
    await umkmService.fetchAllUmkm();
    
    // 2. Ambil ID dari URL
    const umkmId = getUmkmIdFromURL();
    
    // 3. Cari data UMKM yang cocok berdasarkan ID memanfaatkan data dari Service
    const dataUmkm = umkmService.daftarUmkm.find(item => item.id === umkmId);
    
    // 4. Tampilkan ke layar
    renderDetail(dataUmkm);
}

initDetailApp();