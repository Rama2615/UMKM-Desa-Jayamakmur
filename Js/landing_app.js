import { initTheme } from './theme.js?v=11';
import { UmkmService } from './Services/umkm_services.js?v=11';
import { UmkmCard } from './components/umkm_card.js?v=11';
import { initHero3DCanvas } from './components/hero_3d_canvas.js?v=11';
import { init3DTiltEngine } from './utils/tilt_3d.js?v=11';
import { init3DMarqueeWall } from './components/marquee_3d.js?v=11';

// Inisialisasi tema saat halaman dimuat
initTheme();

const umkmService = new UmkmService();

async function initLanding() {
    // 0. Inisialisasi Engine 3D Interaktif
    initHero3DCanvas('hero-3d-canvas');
    init3DTiltEngine('[data-tilt-3d]');

    try {
        await umkmService.fetchAllUmkm();
        const totalUmkm = umkmService.daftarUmkm.length;

        // Inisialisasi 3D Marquee Showcase Background
        if (totalUmkm > 0) {
            init3DMarqueeWall('marquee3dContainer', umkmService.daftarUmkm);
        }
        
        // 1. Animasikan jumlah UMKM terdaftar
        const countElement = document.getElementById('landing-stat-count');
        if (countElement) {
            animateCount(countElement, totalUmkm);
        }
        
        // 2. Render 3 UMKM Unggulan di bagian Spotlight secara dinamis
        const spotlightContainer = document.getElementById('spotlightContainer');
        if (spotlightContainer && totalUmkm > 0) {
            renderSpotlight(spotlightContainer);
        }

        // 3. Inisialisasi Pop-up Rekomendasi Scroll-Triggered
        if (totalUmkm > 0) {
            setupScrollRecommendation();
        }

        // 4. Default role untuk pengunjung umum (jika belum login)
        if (!currentRole) {
            localStorage.setItem('user_role', 'guest');
        }

    } catch (error) {
        console.error("Gagal mengambil data UMKM untuk Beranda:", error);
        // Fallback ke angka dummy jika gagal memuat JSON
        const countElement = document.getElementById('landing-stat-count');
        if (countElement) {
            countElement.textContent = "10+";
        }
    }
    
    // 5. Inisialisasi Animasi Scroll Reveal
    initScrollReveal();
}

function animateCount(element, target) {
    if (target === 0) {
        element.textContent = "0";
        return;
    }

    let current = 0;
    const duration = 1200; // ms
    const increment = target / (duration / 16); // ~60fps

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = `${target}+`;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function renderSpotlight(container) {
    container.innerHTML = '';
    
    // Acak data UMKM dan ambil 3 item teratas
    const allItems = [...umkmService.daftarUmkm];
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    const spotlightItems = shuffled.slice(0, Math.min(3, allItems.length));
    
    spotlightItems.forEach(item => {
        const card = new UmkmCard(item);
        container.innerHTML += card.render();
    });
    
    // Pasang 3D tilt pada kartu spotlight
    init3DTiltEngine(container.querySelectorAll('.card-umkm'));

    // Jalankan event listener untuk tombol favorit & share (Event Delegation)
    setupSpotlightInteractions(container);
}

function setupSpotlightInteractions(container) {
    const toastNotification = document.getElementById('toastNotification');
    
    function showToast(msg) {
        if (!toastNotification) return;
        toastNotification.textContent = msg;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000);
    }

    container.addEventListener('click', (e) => {
        // Handle share button click
        const shareBtn = e.target.closest('.btn-share');
        if (shareBtn) {
            const id = shareBtn.getAttribute('data-id');
            const nama = shareBtn.getAttribute('data-nama');
            const detailUrl = `${window.location.origin}${window.location.pathname.replace(/index\.html$/i, '')}Detail%20produk.html?id=${id}`;

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

        // Handle favorite button click
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
        }
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Hanya animasi sekali saat discroll
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

function setupScrollRecommendation() {
    const scrollModal = document.getElementById('scrollRecommendModal');
    const modalContent = document.getElementById('scrollModalContent');
    const closeBtn = document.getElementById('closeScrollModal');
    
    if (!scrollModal || !modalContent) return;

    // Pilih 1 UMKM secara acak dari database
    const allItems = umkmService.daftarUmkm;
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    
    if (randomItem) {
        modalContent.innerHTML = `
            <div class="modal-recom-card">
                <img src="assets/images/${randomItem.gambar}" alt="${randomItem.nama}" class="modal-recom-img" onerror="this.src='https://placehold.co/150x150?text=Foto'">
                <div class="modal-recom-info">
                    <h4 class="modal-recom-title">${randomItem.nama}</h4>
                    <p class="modal-recom-desc">${randomItem.deskripsi}</p>
                    <a href="Detail produk.html?id=${randomItem.id}" class="modal-recom-action">Lihat Profil &rarr;</a>
                </div>
            </div>
        `;
    }

    // Tampilkan modal saat scroll melewati 300px
    const handleScroll = () => {
        const isDismissed = sessionStorage.getItem('dismissed_recom') === 'true';
        if (!isDismissed && window.scrollY > 300) {
            scrollModal.classList.add('show');
        } else {
            scrollModal.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Tombol tutup modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            scrollModal.classList.remove('show');
            sessionStorage.setItem('dismissed_recom', 'true');
            window.removeEventListener('scroll', handleScroll);
        });
    }
}

// Mendengarkan sinyal perubahan data secara real-time dari Dashboard Admin
umkmService.onDataChanged(async () => {
    try {
        await umkmService.fetchAllUmkm();
        const totalUmkm = umkmService.daftarUmkm.length;

        // 1. Update jumlah UMKM terdaftar
        const countElement = document.getElementById('landing-stat-count');
        if (countElement) {
            countElement.textContent = `${totalUmkm}+`;
        }
        
        // 2. Render ulang Marquee Wall
        if (totalUmkm > 0) {
            init3DMarqueeWall('marquee3dContainer', umkmService.daftarUmkm);
        }

        // 3. Render ulang Spotlight
        const spotlightContainer = document.getElementById('spotlightContainer');
        if (spotlightContainer && totalUmkm > 0) {
            renderSpotlight(spotlightContainer);
        }
    } catch (e) {
        console.error("Gagal menyinkronkan data beranda secara real-time:", e);
    }
});

// Jalankan ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanding);
} else {
    initLanding();
}
