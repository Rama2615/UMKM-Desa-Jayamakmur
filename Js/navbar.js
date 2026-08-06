import { UmkmService } from './Services/umkm_services.js';
import { initSmoothEffects } from './smooth_effects.js';
import { initMascotWidget } from './components/mascot_widget.js';
import { initCsBotWidget } from './components/cs_bot.js';

export async function updateNavbar() {
    const role = localStorage.getItem('user_role');
    const ownerId = localStorage.getItem('logged_owner_id');
    const navbarLinks = document.querySelector('.navbar-links');
    const themeToggle = document.getElementById('theme-toggle');

    if (!navbarLinks) return;

    // Hapus elemen dinamis lama jika ada
    const oldBadge = navbarLinks.querySelector('.navbar-role-badge');
    if (oldBadge) oldBadge.remove();
    const oldDbLink = navbarLinks.querySelector('.nav-link-db');
    if (oldDbLink) oldDbLink.remove();
    const oldActionBtn = navbarLinks.querySelector('.btn-logout, .btn-login-trigger');
    if (oldActionBtn) oldActionBtn.remove();

    // Dapatkan halaman aktif
    const currentPath = window.location.pathname;
    const tentangLink = navbarLinks.querySelector('a[href*="tentang.html"]');

    // Injeksi tautan Layanan Bantuan secara dinamis setelah 'Tentang Kami'
    const activeBantuan = currentPath.includes('bantuan.html') ? 'active' : '';
    if (tentangLink && !navbarLinks.querySelector('a[href*="bantuan.html"]')) {
        tentangLink.insertAdjacentHTML('afterend', `<a href="bantuan.html" class="nav-link ${activeBantuan}">Layanan Bantuan</a>`);
    }

    let badgeHtml = '';
    let dbLinkHtml = '';
    let actionBtnHtml = '';

    if (role === 'admin') {
        const isActive = currentPath.includes('admin.html') ? 'active' : '';
        badgeHtml = `<span class="navbar-role-badge admin">Admin ⚙️</span>`;
        dbLinkHtml = `<a href="admin.html" class="nav-link nav-link-db ${isActive}">Dashboard</a>`;
        actionBtnHtml = `<button class="btn-logout" id="navbarLogoutBtn">Keluar</button>`;
    } else if (role === 'owner' && ownerId) {
        const service = new UmkmService();
        await service.fetchAllUmkm();
        const myUmkm = service.getUmkmById(ownerId);
        const name = myUmkm ? myUmkm.nama : 'Toko';
        const isActive = currentPath.includes('owner.html') ? 'active' : '';
        badgeHtml = `<span class="navbar-role-badge" title="${name}">Toko: ${name.substring(0, 10)}${name.length > 10 ? '...' : ''} 🏪</span>`;
        dbLinkHtml = `<a href="owner.html" class="nav-link nav-link-db ${isActive}">Kelola Toko</a>`;
        actionBtnHtml = `<button class="btn-logout" id="navbarLogoutBtn">Keluar</button>`;
    } else {
        actionBtnHtml = `<button class="btn-login-trigger" id="navbarLoginBtn">Kelola UMKM / Login</button>`;
    }

    // Sisipkan sebelum tombol pengubah tema
    if (themeToggle) {
        if (badgeHtml) {
            themeToggle.insertAdjacentHTML('beforebegin', badgeHtml);
        }
        if (dbLinkHtml) {
            themeToggle.insertAdjacentHTML('beforebegin', dbLinkHtml);
        }
        themeToggle.insertAdjacentHTML('beforebegin', actionBtnHtml);
    } else {
        navbarLinks.insertAdjacentHTML('beforeend', badgeHtml + dbLinkHtml + actionBtnHtml);
    }

    // Penanganan Mobile Navigation Hamburger Toggle Button
    const navbarContainer = document.querySelector('.navbar-container');
    if (navbarContainer && !document.getElementById('navbarMobileToggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'navbarMobileToggle';
        toggleBtn.className = 'navbar-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Buka Menu Navigasi Mobile');
        toggleBtn.innerHTML = `
            <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        navbarContainer.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navbarLinks.classList.toggle('active');
            const hamburger = toggleBtn.querySelector('.hamburger-icon');
            const close = toggleBtn.querySelector('.close-icon');
            if (isOpen) {
                hamburger.style.display = 'none';
                close.style.display = 'block';
            } else {
                hamburger.style.display = 'block';
                close.style.display = 'none';
            }
        });

        // Tutup menu jika mengklik di luar area navbar
        document.addEventListener('click', (e) => {
            if (!navbarContainer.contains(e.target) && navbarLinks.classList.contains('active')) {
                navbarLinks.classList.remove('active');
                const hamburger = toggleBtn.querySelector('.hamburger-icon');
                const close = toggleBtn.querySelector('.close-icon');
                if (hamburger) hamburger.style.display = 'block';
                if (close) close.style.display = 'none';
            }
        });
    }

    // Event listener untuk tombol Keluar
    const logoutBtn = document.getElementById('navbarLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user_role');
            localStorage.removeItem('logged_owner_id');
            window.location.href = 'index.html';
        });
    }

    // Event listener untuk tombol login
    const loginBtn = document.getElementById('navbarLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

// Jalankan ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateNavbar();
        initSmoothEffects();
        initMascotWidget();
        initCsBotWidget();
    });
} else {
    updateNavbar();
    initSmoothEffects();
    initMascotWidget();
    initCsBotWidget();
}

