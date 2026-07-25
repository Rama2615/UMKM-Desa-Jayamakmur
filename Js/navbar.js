import { UmkmService } from './Services/umkm_services.js?v=3';

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
        navbarLinks.innerHTML += badgeHtml + dbLinkHtml + actionBtnHtml;
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
    document.addEventListener('DOMContentLoaded', updateNavbar);
} else {
    updateNavbar();
}
