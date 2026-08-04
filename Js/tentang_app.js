import { initTheme } from './theme.js';
import { init3DTiltEngine } from './utils/tilt_3d.js';

// Inisialisasi tema saat halaman dimuat
initTheme();

// Inisialisasi 3D Tilt Engine untuk kartu profil & tim
document.addEventListener('DOMContentLoaded', () => {
    init3DTiltEngine('[data-tilt-3d]');
});
