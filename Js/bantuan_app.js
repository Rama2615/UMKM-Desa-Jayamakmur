import { initTheme } from './theme.js';

// Inisialisasi tema saat halaman dimuat
initTheme();

let currentUploadedImageData = null;

function initHelpdeskApp() {
    setupImageUploader();
    setupFormSubmission();
    setupFaqAccordion();
    setupModalEvents();
    renderTicketHistory();
    initScrollReveal();
}

// 1. Penanganan Drag and Drop & Live Image Preview
function setupImageUploader() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('bugImageInput');
    const dropzonePrompt = document.getElementById('dropzonePrompt');
    const previewWrapper = document.getElementById('imagePreviewWrapper');
    const previewImg = document.getElementById('bugImagePreview');
    const previewFilename = document.getElementById('previewFilename');
    const previewFilesize = document.getElementById('previewFilesize');
    const btnRemoveImg = document.getElementById('btnRemoveImg');

    if (!dropzone || !fileInput) return;

    // Klik dropzone untuk memilih file
    dropzone.addEventListener('click', (e) => {
        if (e.target.closest('#btnRemoveImg')) return;
        fileInput.click();
    });

    // Event drag & drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            handleSelectedFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleSelectedFile(fileInput.files[0]);
        }
    });

    function handleSelectedFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast("Harap pilih file gambar (PNG, JPG, WEBP) ⚠️");
            return;
        }

        // Cek ukuran file (maksimal 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast("Ukuran foto terlalu besar. Maksimal 5MB! ⚠️");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            currentUploadedImageData = event.target.result;
            previewImg.src = currentUploadedImageData;
            previewFilename.textContent = file.name;
            previewFilesize.textContent = formatBytes(file.size);

            dropzonePrompt.style.display = 'none';
            previewWrapper.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    if (btnRemoveImg) {
        btnRemoveImg.addEventListener('click', (e) => {
            e.stopPropagation();
            resetImagePreview();
        });
    }

    function resetImagePreview() {
        currentUploadedImageData = null;
        fileInput.value = '';
        previewImg.src = '';
        previewWrapper.style.display = 'none';
        dropzonePrompt.style.display = 'flex';
    }

    window.resetImagePreview = resetImagePreview;
}

// 2. Form Submission Handler
function setupFormSubmission() {
    const form = document.getElementById('helpdeskForm');
    const modal = document.getElementById('ticketModal');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reporterName').value.trim();
        const contact = document.getElementById('reporterContact').value.trim();
        const category = document.getElementById('issueCategory').value;
        const title = document.getElementById('issueTitle').value.trim();
        const description = document.getElementById('issueDescription').value.trim();

        if (!name || !contact || !category || !title || !description) {
            showToast("Harap lengkapi semua kolom yang wajib diisi (*) ⚠️");
            return;
        }

        // Generasi Nomor Tiket Unik
        const ticketCode = `#TICKET-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const timestamp = new Date().toISOString();

        const ticketObject = {
            code: ticketCode,
            name,
            contact,
            category,
            title,
            description,
            hasImage: !!currentUploadedImageData,
            image: currentUploadedImageData,
            timestamp
        };

        // Simpan ke LocalStorage
        saveTicketToHistory(ticketObject);

        // Update Modal Details
        document.getElementById('modalTicketCode').textContent = ticketCode;
        document.getElementById('modalReporterName').textContent = name;
        document.getElementById('modalCategory').textContent = category;
        document.getElementById('modalHasImage').textContent = currentUploadedImageData ? 'Dilampirkan ✅' : 'Tidak Ada ❌';

        // Tampilkan Modal
        if (modal) modal.classList.add('active');

        // Reset Form
        form.reset();
        if (window.resetImagePreview) window.resetImagePreview();

        renderTicketHistory();
    });
}

// 3. Modal Events
function setupModalEvents() {
    const modal = document.getElementById('ticketModal');
    const btnClose = document.getElementById('btnCloseTicketModal');

    if (!modal) return;

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// 4. FAQ Accordion Handler
function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Tutup faq item lain
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            // Toggle item saat ini
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// 5. LocalStorage Ticket History Storage & Rendering
function saveTicketToHistory(ticket) {
    let history = JSON.parse(localStorage.getItem('digijaya_help_tickets')) || [];
    history.unshift(ticket);
    // Simpan maksimal 10 tiket terakhir
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('digijaya_help_tickets', JSON.stringify(history));
}

function renderTicketHistory() {
    const historyContainer = document.getElementById('ticketHistoryList');
    if (!historyContainer) return;

    const history = JSON.parse(localStorage.getItem('digijaya_help_tickets')) || [];

    if (history.length === 0) {
        historyContainer.innerHTML = `<p class="empty-history-text">Belum ada laporan yang Anda kirimkan sesi ini.</p>`;
        return;
    }

    historyContainer.innerHTML = history.map(ticket => `
        <div class="ticket-history-item">
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <span class="ticket-history-code">${ticket.code}</span>
                <span class="ticket-history-title">${escapeHtml(ticket.title.substring(0, 28))}${ticket.title.length > 28 ? '...' : ''}</span>
            </div>
            <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">Terkirim ✅</span>
        </div>
    `).join('');
}

// Toast Notifikasi Helper
function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Inisialisasi saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHelpdeskApp);
} else {
    initHelpdeskApp();
}
