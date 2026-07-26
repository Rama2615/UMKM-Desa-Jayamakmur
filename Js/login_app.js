import { UmkmService } from './Services/umkm_services.js?v=3';
import { initTheme } from './theme.js?v=3';
import { setupImageDropzone } from './utils/image_uploader.js?v=3';

// Inisialisasi tema saat halaman dimuat
initTheme();

const service = new UmkmService();

async function initLoginApp() {
    await service.fetchAllUmkm();
    setupRoleSelector(service);
}

function setupRoleSelector(service) {
    const roleSelectorSection = document.getElementById('roleSelectorSection');
    const authContainer = document.getElementById('authFormContainer');
    const regGambarValue = document.getElementById('regGambarValue');

    setupImageDropzone(
        document.getElementById('regGambarDropzone'),
        document.getElementById('regGambarFileInput'),
        document.getElementById('regGambarPreviewContainer'),
        document.getElementById('regGambarPreviewImg'),
        document.getElementById('regGambarRemoveBtn'),
        (base64Data) => {
            if (regGambarValue) regGambarValue.value = base64Data || '';
        }
    );
    
    const btnKonsumen = document.getElementById('roleKonsumenBtn');
    const btnPemilik = document.getElementById('rolePemilikBtn');
    const btnAdmin = document.getElementById('roleAdminBtn');
    const btnBack = document.getElementById('btnBackToRoles');
    
    const authFormTitle = document.getElementById('authFormTitle');
    const authFormSubtitle = document.getElementById('authFormSubtitle');
    const authForm = document.getElementById('authForm');
    const registerForm = document.getElementById('registerForm');
    
    const ownerSelectGroup = document.getElementById('ownerSelectGroup');
    const ownerSelect = document.getElementById('ownerSelect');
    const usernameGroup = document.getElementById('usernameGroup');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const passwordHint = document.getElementById('passwordHint');
    
    const btnRegisterNew = document.getElementById('btnRegisterNewUmkm');
    const btnBackToLogin = document.getElementById('btnBackToOwnerLogin');

    if (!roleSelectorSection) return;

    let loginMode = 'admin'; // 'admin' atau 'owner'

    // Aksi 1: Konsumen
    if (btnKonsumen) {
        btnKonsumen.addEventListener('click', () => {
            localStorage.setItem('user_role', 'konsumen');
            window.location.href = 'Main page.html';
        });
    }

    // Aksi 2: Pemilik UMKM (Tampilkan Login Pemilik)
    if (btnPemilik) {
        btnPemilik.addEventListener('click', () => {
            loginMode = 'owner';
            roleSelectorSection.style.display = 'none';
            authContainer.classList.remove('hidden');
            authForm.style.display = 'flex';
            registerForm.style.display = 'none';
            
            authFormTitle.textContent = "Login Pemilik UMKM";
            authFormSubtitle.textContent = "Pilih profil usaha Anda dan masukkan kata sandi";
            
            ownerSelectGroup.style.display = 'block';
            usernameGroup.style.display = 'none';
            btnRegisterNew.style.display = 'block';
            passwordHint.textContent = "Kata sandi default: owner123 (dapat diubah di dashboard)";
            
            // Isi dropdown secara dinamis
            ownerSelect.innerHTML = '';
            service.daftarUmkm.forEach(umkm => {
                const opt = document.createElement('option');
                opt.value = umkm.id;
                opt.textContent = umkm.nama;
                ownerSelect.appendChild(opt);
            });
        });
    }

    // Aksi 3: Admin Desa (Tampilkan Login Admin)
    if (btnAdmin) {
        btnAdmin.addEventListener('click', () => {
            loginMode = 'admin';
            roleSelectorSection.style.display = 'none';
            authContainer.classList.remove('hidden');
            authForm.style.display = 'flex';
            registerForm.style.display = 'none';
            
            authFormTitle.textContent = "Login Admin Desa";
            authFormSubtitle.textContent = "Masukkan username dan kata sandi admin desa";
            
            ownerSelectGroup.style.display = 'none';
            usernameGroup.style.display = 'block';
            btnRegisterNew.style.display = 'none';
            passwordHint.textContent = "Username: admin | Kata sandi: admin123";
        });
    }

    // Tombol Kembali ke Pemilihan Peran
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            authContainer.classList.add('hidden');
            roleSelectorSection.style.display = 'block';
        });
    }

    // Alih ke form registrasi
    if (btnRegisterNew) {
        btnRegisterNew.addEventListener('click', () => {
            authForm.style.display = 'none';
            registerForm.style.display = 'flex';
            authFormTitle.textContent = "Daftar Usaha Baru";
            authFormSubtitle.textContent = "Lengkapi data untuk mendaftarkan UMKM baru Anda";
        });
    }

    // Kembali ke form login dari form registrasi
    if (btnBackToLogin) {
        btnBackToLogin.addEventListener('click', () => {
            registerForm.style.display = 'none';
            authForm.style.display = 'flex';
            authFormTitle.textContent = "Login Pemilik UMKM";
            authFormSubtitle.textContent = "Pilih profil usaha Anda dan masukkan kata sandi";
        });
    }

    // Submit Form Login
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;

        if (loginMode === 'admin') {
            const username = usernameInput.value.trim();
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('user_role', 'admin');
                window.location.href = 'admin.html';
            } else {
                alert('⚠️ Username atau kata sandi admin tidak valid!');
            }
        } else if (loginMode === 'owner') {
            const umkmId = ownerSelect.value;
            const umkm = service.getUmkmById(umkmId);
            
            if (umkm && umkm.password === password) {
                localStorage.setItem('user_role', 'owner');
                localStorage.setItem('logged_owner_id', umkmId);
                window.location.href = 'owner.html';
            } else {
                alert('⚠️ Kata sandi pemilik usaha salah!');
            }
        }
    });

    // Submit Form Registrasi UMKM Baru
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('regNama').value.trim();
        const kategori = document.getElementById('regKategori').value;
        const whatsapp = document.getElementById('regWhatsapp').value.trim();
        const alamat = document.getElementById('regAlamat').value.trim();
        const deskripsi = document.getElementById('regDeskripsi').value.trim();
        const password = document.getElementById('regPassword').value;

        if (!nama || !password) {
            alert('⚠️ Nama Usaha dan Kata Sandi wajib diisi!');
            return;
        }

        // Tambah UMKM baru ke basis data lokal
        const regGambarVal = document.getElementById('regGambarValue');
        const gambar = regGambarVal ? (regGambarVal.value.trim() || 'placeholder.jpg') : 'placeholder.jpg';

        const newUmkm = service.addUmkm({
            nama,
            kategori,
            whatsapp,
            alamat,
            deskripsi,
            password,
            gambar,
            galeri: []
        });

        // Set login otomatis
        localStorage.setItem('user_role', 'owner');
        localStorage.setItem('logged_owner_id', newUmkm.id);
        
        alert('🎉 Pendaftaran berhasil! Selamat datang di dashboard Anda.');
        window.location.href = 'owner.html';
    });
}

initLoginApp();
