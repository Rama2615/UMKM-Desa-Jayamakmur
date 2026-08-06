/**
 * Asisten Maskot Digital Si Jaya 🌾🤖
 * DigiJaya - Widget Maskot Interaktif Pemandu UMKM Desa Jayamakmur
 */

import { UmkmService } from '../Services/umkm_services.js';
import { getImagePath } from '../utils/image_uploader.js';

const umkmService = new UmkmService();

export function initMascotWidget() {
    if (document.getElementById('mascotFloatingBtn')) return;

    // 1. Injeksi Elemen HTML Floating Mascot & Modal Asisten
    const mascotContainer = document.createElement('div');
    mascotContainer.id = 'mascotWidgetRoot';
    mascotContainer.innerHTML = `
        <!-- Floating Speech Bubble -->
        <div class="mascot-speech-bubble" id="mascotBubble">
            <span>Halo! Saya <strong>Si Jaya</strong> 🌾</span>
            <small>Klik untuk rekomendasi UMKM hoki!</small>
        </div>

        <!-- Floating Button Avatar -->
        <button type="button" id="mascotFloatingBtn" class="mascot-floating-btn" aria-label="Buka Asisten Si Jaya">
            <div class="mascot-avatar-inner">
                <span class="mascot-icon-emoji">🌾🤖</span>
                <span class="mascot-pulse-ring"></span>
                <span class="mascot-online-badge">ON</span>
            </div>
        </button>

        <!-- Mascot Assistant Modal Overlay -->
        <div class="mascot-modal-overlay" id="mascotModal">
            <div class="mascot-modal-card">
                <!-- Header -->
                <div class="mascot-modal-header">
                    <div class="mascot-header-info">
                        <div class="mascot-avatar-lg">🌾🤖</div>
                        <div>
                            <h3 class="mascot-name">Si Jaya <span class="mascot-tag">Asisten UMKM</span></h3>
                            <p class="mascot-status">● Pemandu Resmi Desa Jayamakmur</p>
                        </div>
                    </div>
                    <button type="button" class="mascot-close-btn" id="mascotCloseBtn" title="Tutup Chat">&times;</button>
                </div>

                <!-- Chat Body / Dialog Area -->
                <div class="mascot-modal-body">
                    <div class="mascot-dialog-box" id="mascotDialogBox">
                        <div class="mascot-msg bot">
                            <p>Sampurasun Warga Jayamakmur! 🙏<br>Saya <strong>Si Jaya</strong>, maskot digital Desa Jayamakmur. Apa yang ingin Anda cari hari ini?</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Action Chips -->
                <div class="mascot-quick-chips">
                    <button type="button" class="chip-btn" data-action="random">🎲 Rekomendasi Acak Hoki</button>
                    <button type="button" class="chip-btn" data-action="kuliner">🍜 Kuliner Terlaris</button>
                    <button type="button" class="chip-btn" data-action="kerajinan">🎨 Kerajinan Khas</button>
                    <button type="button" class="chip-btn" data-action="jasa">💈 Jasa & Pelayanan</button>
                    <button type="button" class="chip-btn" data-action="maps">📍 Peta Desa</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(mascotContainer);

    // 2. Logic Event Listeners
    const floatingBtn = document.getElementById('mascotFloatingBtn');
    const mascotModal = document.getElementById('mascotModal');
    const closeBtn = document.getElementById('mascotCloseBtn');
    const bubble = document.getElementById('mascotBubble');
    const dialogBox = document.getElementById('mascotDialogBox');
    const chips = mascotContainer.querySelectorAll('.chip-btn');

    // Tampilkan speech bubble secara berkala
    setTimeout(() => {
        if (bubble) bubble.classList.add('show');
    }, 2500);

    setTimeout(() => {
        if (bubble) bubble.classList.remove('show');
    }, 10000);

    // Buka / Tutup Modal
    if (floatingBtn) {
        floatingBtn.addEventListener('click', () => {
            if (bubble) bubble.classList.remove('show');
            if (mascotModal) mascotModal.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (mascotModal) mascotModal.classList.remove('active');
        });
    }

    if (mascotModal) {
        mascotModal.addEventListener('click', (e) => {
            if (e.target === mascotModal) {
                mascotModal.classList.remove('active');
            }
        });
    }

    // Handle Quick Action Chips
    chips.forEach(chip => {
        chip.addEventListener('click', async () => {
            const action = chip.getAttribute('data-action');
            await umkmService.fetchAllUmkm();
            const allItems = umkmService.daftarUmkm || [];

            if (action === 'random') {
                if (allItems.length === 0) return;
                const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                const imgSrc = getImagePath(randomItem.gambar, randomItem.nama, randomItem.kategori);

                addMascotMsg(`🎉 <strong>Rekomendasi Hoki Si Jaya!</strong><br>
                    <div style="display:flex; gap:12px; align-items:center; background:var(--card-bg, #ffffff); padding:10px; border-radius:12px; margin-top:8px; border:1px solid rgba(45,212,191,0.25); box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                        <img src="${imgSrc}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" alt="${randomItem.nama}" onerror="this.src='https://placehold.co/60x60?text=UMKM'">
                        <div>
                            <strong style="color:var(--accent-orange, #e65c00); display:block; font-size:0.95rem;">${randomItem.nama}</strong>
                            <small style="color:var(--text-muted, #64748b); font-size:0.8rem;">📍 ${randomItem.alamat}</small>
                        </div>
                    </div>
                    <a href="Detail produk.html?id=${randomItem.id}" class="btn-primary" style="display:inline-block; margin-top:10px; padding:8px 16px; font-size:0.85rem; border-radius:20px; text-decoration:none; text-align:center;">Lihat Profil UMKM 🔍</a>
                `);
            } else if (action === 'kuliner') {
                addMascotMsg(`🍜 Ada kuliner lezat khas Desa Jayamakmur! Buka katalog untuk melihat menu seblak, es doger, bakso, dan warung makan lokal. <br><br><a href="Main page.html?category=Kuliner" style="color:var(--accent-orange, #e65c00); font-weight:700;">Lihat Katalog Kuliner &rarr;</a>`);
            } else if (action === 'kerajinan') {
                addMascotMsg(`🎨 Produk kerajinan tangan lokal Desa Jayamakmur seperti Toko Opak dan Usaha Jahit karya warga. <br><br><a href="Main page.html?category=Kerajinan" style="color:var(--accent-orange, #e65c00); font-weight:700;">Lihat Katalog Kerajinan &rarr;</a>`);
            } else if (action === 'jasa') {
                addMascotMsg(`💈 Butuh pelayanan atau jasa di Desa Jayamakmur? Seperti pangkas rambut dan sembako Madura 24 jam! <br><br><a href="Main page.html?category=Jasa" style="color:var(--accent-orange, #e65c00); font-weight:700;">Lihat Katalog Jasa &rarr;</a>`);
            } else if (action === 'maps') {
                addMascotMsg(`📍 Ingin menelusuri lokasi UMKM secara langsung di peta wilayah Desa Jayamakmur? <br><br><a href="peta.html" style="color:var(--accent-orange, #e65c00); font-weight:700;">Buka Peta Desa Interaktif &rarr;</a>`);
            }
        });
    });

    function addMascotMsg(htmlContent) {
        if (!dialogBox) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'mascot-msg bot';
        msgDiv.innerHTML = `<p>${htmlContent}</p>`;
        dialogBox.appendChild(msgDiv);
        dialogBox.scrollTop = dialogBox.scrollHeight;
    }
}
