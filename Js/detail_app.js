import { UmkmService } from './Services/umkm_services.js?v=3';
import { initTheme } from './theme.js?v=3';
import { getImagePath } from './utils/image_uploader.js?v=3';

// Inisialisasi tema saat halaman dimuat
initTheme();

const umkmService = new UmkmService();
const detailContainer = document.getElementById('detailContainer');
const toastNotification = document.getElementById('toastNotification');

function getUmkmIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'), 10);
}

function showToast(msg = 'Link profil berhasil disalin! 📋') {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

function renderDetail(umkm) {
    if (!umkm) {
        detailContainer.innerHTML = '<p class="empty-text">Data UMKM tidak ditemukan.</p>';
        return;
    }

    const mainImgSrc = getImagePath(umkm.gambar);

    // Bangun HTML thumbnail galeri secara dinamis
    let thumbsHtml = `
        <div class="thumb-item active">
            <img src="${mainImgSrc}" alt="Utama" onerror="this.src='https://placehold.co/100x100?text=Utama'">
        </div>
    `;

    if (umkm.galeri && umkm.galeri.length > 0) {
        umkm.galeri.forEach((galImg, index) => {
            const galImgSrc = getImagePath(galImg);
            thumbsHtml += `
                <div class="thumb-item">
                    <img src="${galImgSrc}" alt="Varian ${index + 1}" onerror="this.src='https://placehold.co/100x100?text=Varian+${index + 1}'">
                </div>
            `;
        });
    } else {
        const p2 = `https://placehold.co/600x400/1b4d3e/ffffff?text=Produk+Andalan+1`;
        const p3 = `https://placehold.co/600x400/e65c00/ffffff?text=Produk+Andalan+2`;
        thumbsHtml += `
            <div class="thumb-item">
                <img src="${p2}" alt="Varian 1">
            </div>
            <div class="thumb-item">
                <img src="${p3}" alt="Varian 2">
            </div>
        `;
    }

    detailContainer.innerHTML = `
        <div class="detail-wrapper">
            <div class="detail-image-section">
                <div class="detail-main-image-wrapper">
                    <img id="mainDetailImg" src="${mainImgSrc}" alt="${umkm.nama}" onerror="this.src='https://placehold.co/600x400?text=Foto+UMKM'">
                </div>
                <div class="detail-image-thumbs">
                    ${thumbsHtml}
                </div>
            </div>
            
            <div class="detail-info">
                <div class="detail-badge">
                    <span class="badge-${umkm.kategori.toLowerCase()}">${umkm.kategori}</span>
                </div>
                <h2>${umkm.nama}</h2>
                <div class="detail-location">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>${umkm.alamat}</span>
                </div>
                
                <hr class="detail-divider">
                
                <h3>Tentang UMKM / Produk:</h3>
                <p class="detail-desc">${umkm.deskripsi}</p>
                
                <!-- Google Maps Embed Section -->
                <div class="detail-map-section">
                    <h3>Lokasi Peta:</h3>
                    <div class="map-iframe-container">
                        <a href="${umkm.getGoogleMapsLink()}" target="_blank" rel="noopener noreferrer" class="map-overlay-btn" title="Buka Tempat di Google Maps">
                            Buka di Maps ↗
                        </a>
                        <iframe 
                            width="100%" 
                            height="250" 
                            frameborder="0" 
                            style="border:0;" 
                            src="https://maps.google.com/maps?q=${encodeURIComponent(umkm.nama.includes('Jahit Pak Ceming') ? 'Toko Jahit Pak RT. Ceming Jayamakmur Karawang' : umkm.nama + ' Desa Jayamakmur Karawang')}&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
                
                <div class="action-box">
                    <a href="${umkm.getGoogleMapsLink()}" target="_blank" rel="noopener noreferrer" class="btn-maps">
                        Buka di Google Maps 📍
                    </a>
                    <button type="button" id="btnShareDetail" class="btn-share-detail">
                        Bagikan Profil 🔗
                    </button>
                </div>
            </div>
        </div>
    `;

    // Pasang Logika Carousel Gambar Thumbnail
    const thumbs = document.querySelectorAll('.thumb-item');
    const mainImg = document.getElementById('mainDetailImg');
    if (thumbs && mainImg) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                const newSrc = thumb.querySelector('img').getAttribute('src');
                
                // Efek fade-out & fade-in lembut
                mainImg.style.opacity = '0';
                mainImg.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    mainImg.setAttribute('src', newSrc);
                    mainImg.style.opacity = '1';
                    mainImg.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Event Listener untuk Tombol Bagikan di Halaman Detail
    const btnShareDetail = document.getElementById('btnShareDetail');
    if (btnShareDetail) {
        btnShareDetail.addEventListener('click', () => {
            const currentUrl = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: umkm.nama,
                    text: `Profil UMKM Desa Jayamakmur: ${umkm.nama}`,
                    url: currentUrl
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    showToast(`Link profil ${umkm.nama} berhasil disalin! 📋`);
                }).catch(() => {
                    showToast(`Link: ${currentUrl}`);
                });
            }
        });
    }
}

async function initDetailApp() {
    await umkmService.fetchAllUmkm();
    let umkmId = getUmkmIdFromURL();
    
    console.log("ID dari URL:", umkmId);
    console.log("Semua data UMKM terdaftar di halaman ini:", umkmService.daftarUmkm);
    console.log("Hasil pencarian UMKM berdasarkan ID:", umkmService.getUmkmById(umkmId));
    
    // Jika tidak ada ID di URL (NaN), coba arahkan ke toko milik pemilik yang sedang login
    if (isNaN(umkmId)) {
        const loggedRole = localStorage.getItem('user_role');
        const loggedOwnerId = localStorage.getItem('logged_owner_id');
        if (loggedRole === 'owner' && loggedOwnerId) {
            umkmId = Number(loggedOwnerId);
            console.log("Menggunakan ID toko pemilik yang sedang login:", umkmId);
        }
    }
    
    // Jika ID masih tidak valid atau tidak ditemukan dalam basis data halaman ini, tampilkan UMKM pertama sebagai contoh/default
    if (isNaN(umkmId) || !umkmService.getUmkmById(umkmId)) {
        console.warn("ID tidak valid atau tidak ditemukan dalam basis data halaman ini! Menggunakan fallback ke item pertama.");
        umkmId = umkmService.daftarUmkm.length > 0 ? umkmService.daftarUmkm[0].id : null;
    }
    
    const dataUmkm = umkmService.getUmkmById(umkmId);
    renderDetail(dataUmkm);
}

// Mendengarkan perubahan data UMKM secara real-time dari Admin
umkmService.onDataChanged(async () => {
    try {
        await initDetailApp();
    } catch (e) {
        console.error("Gagal menyinkronkan halaman detail produk secara real-time:", e);
    }
});

initDetailApp();

