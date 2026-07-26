/**
 * 3D Infinite Marquee Showcase Wall Engine
 * JayamakmurHub - Background Kartu 3D Bergerak Kontinu Berbasis Aset Foto UMKM Asli
 */

import { getImagePath, getSmartFallback } from '../utils/image_uploader.js?v=8';

export function init3DMarqueeWall(containerId = 'marquee3dContainer', umkms = []) {
    const container = document.getElementById(containerId);
    if (!container || !umkms || umkms.length === 0) return;

    container.innerHTML = '';

    // Gandakan data UMKM agar cukup untuk membentuk trek berkelanjutan
    let extendedList = [...umkms, ...umkms];
    if (extendedList.length < 12) {
        extendedList = [...extendedList, ...extendedList, ...extendedList];
    }

    // Bagi data menjadi 2 trek (Trek Atas bergerak ke Kiri, Trek Bawah bergerak ke Kanan)
    const midIndex = Math.ceil(extendedList.length / 2);
    const track1Items = extendedList.slice(0, midIndex);
    const track2Items = extendedList.slice(midIndex);

    // Buat Struktur HTML Marquee 3D
    const wrapper = document.createElement('div');
    wrapper.className = 'marquee-3d-wrapper';

    // Trek 1 (Scroll Kiri)
    const track1Container = document.createElement('div');
    track1Container.className = 'marquee-3d-track-container track-left';
    
    const track1Content = renderTrackContent(track1Items);
    track1Container.innerHTML = `
        <div class="marquee-3d-track scroll-left">${track1Content}</div>
        <div class="marquee-3d-track scroll-left" aria-hidden="true">${track1Content}</div>
    `;

    // Trek 2 (Scroll Kanan)
    const track2Container = document.createElement('div');
    track2Container.className = 'marquee-3d-track-container track-right';
    
    const track2Content = renderTrackContent(track2Items);
    track2Container.innerHTML = `
        <div class="marquee-3d-track scroll-right">${track2Content}</div>
        <div class="marquee-3d-track scroll-right" aria-hidden="true">${track2Content}</div>
    `;

    wrapper.appendChild(track1Container);
    wrapper.appendChild(track2Container);
    container.appendChild(wrapper);
}

function renderTrackContent(items) {
    return items.map(umkm => {
        const imgSrc = getImagePath(umkm.gambar, umkm.nama, umkm.kategori);
        const fallbackUrl = getSmartFallback(umkm.nama, umkm.kategori);
        const badgeClass = `badge-${(umkm.kategori || 'Kuliner').toLowerCase()}`;
        
        return `
            <a href="Detail produk.html?id=${umkm.id}" class="marquee-3d-card" title="Klik untuk melihat detail ${umkm.nama}">
                <img src="${imgSrc}" alt="${umkm.nama}" loading="lazy" class="marquee-card-img" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                <div class="marquee-card-overlay">
                    <span class="marquee-badge ${badgeClass}">${umkm.kategori}</span>
                    <h3 class="marquee-card-title">${umkm.nama}</h3>
                    <p class="marquee-card-location">📍 ${umkm.alamat}</p>
                    <span class="marquee-card-cta">Lihat Profil &rarr;</span>
                </div>
            </a>
        `;
    }).join('');
}
