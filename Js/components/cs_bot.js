/* ==========================================================================
   CUSTOMER SERVICE AI BOT & HUMAN ADMIN HANDOFF MODULE (cs_bot.js)
   ========================================================================== */

export function initCsBotWidget() {
    // Hindari duplikasi jika widget sudah diinjeksi
    if (document.getElementById('csWidgetContainer')) return;

    // Inject CSS cs_bot.css secara otomatis jika belum ada
    if (!document.querySelector('link[href*="cs_bot.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'assets/css/cs_bot.css?v=99999';
        document.head.appendChild(link);
    }

    // Injeksi elemen HTML CS Widget ke body
    const widgetHtml = `
    <div id="csWidgetContainer" class="cs-widget-wrapper">
        <!-- Initial Greeting Popover -->
        <div id="csGreetingPopover" class="cs-greeting-popover">
            <span>👋 Butuh bantuan? Chat dengan JayaBot 🤖</span>
        </div>

        <!-- Floating Launcher Button -->
        <button type="button" id="csToggleBtn" class="cs-toggle-btn" aria-label="Buka Chat Customer Service">
            <span class="cs-online-badge"></span>
            <svg id="csIconOpen" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg id="csIconClose" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <!-- Chat Window Box -->
        <div id="csChatWindow" class="cs-chat-window">
            <!-- Header -->
            <div class="cs-header">
                <div class="cs-header-info">
                    <div class="cs-avatar">🤖</div>
                    <div class="cs-header-text">
                        <h4>JayaBot - CS DigiJaya</h4>
                        <span><span style="color:#22c55e;">●</span> Asisten AI 24/7 • Desa Jayamakmur</span>
                    </div>
                </div>
                <div class="cs-header-actions">
                    <button type="button" id="csBtnConnectAdmin" class="cs-action-btn" title="Bicara dengan Admin 👤">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                    <button type="button" id="csBtnMinimize" class="cs-action-btn" title="Tutup Chat">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Messages List Body -->
            <div id="csMessagesContainer" class="cs-messages-container">
                <!-- Pesan akan diisi secara dinamis melalui JS -->
            </div>

            <!-- Chat Footer Input -->
            <form id="csInputForm" class="cs-footer">
                <input type="text" id="csInputField" class="cs-input" placeholder="Ketik pertanyaan Anda..." autocomplete="off">
                <button type="submit" class="cs-send-btn" aria-label="Kirim Pesan">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHtml);

    // Bind Event Listeners
    setupCsWidgetLogic();
}

function setupCsWidgetLogic() {
    const toggleBtn = document.getElementById('csToggleBtn');
    const greetingPopover = document.getElementById('csGreetingPopover');
    const chatWindow = document.getElementById('csChatWindow');
    const btnMinimize = document.getElementById('csBtnMinimize');
    const btnConnectAdmin = document.getElementById('csBtnConnectAdmin');
    const messagesContainer = document.getElementById('csMessagesContainer');
    const inputForm = document.getElementById('csInputForm');
    const inputField = document.getElementById('csInputField');
    const iconOpen = document.getElementById('csIconOpen');
    const iconClose = document.getElementById('csIconClose');

    let isOpen = false;

    // Toggle Chat Window
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.add('active');
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
            if (greetingPopover) greetingPopover.style.display = 'none';
            inputField.focus();
            
            // Jika percakapan masih kosong, tampilkan pesan sambutan awal
            if (getChatHistory().length === 0) {
                sendBotGreeting();
            } else {
                renderMessagesFromHistory();
            }
        } else {
            chatWindow.classList.remove('active');
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    if (greetingPopover) greetingPopover.addEventListener('click', toggleChat);
    if (btnMinimize) btnMinimize.addEventListener('click', toggleChat);

    // Tombol Transfer ke Admin Manusia di Header
    if (btnConnectAdmin) {
        btnConnectAdmin.addEventListener('click', () => {
            triggerHumanAdminTransfer("Permintaan langsung bicara dengan Admin orang asli.");
        });
    }

    // Form Submit Chat
    if (inputForm) {
        inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = inputField.value.trim();
            if (!text) return;

            // Tambah pesan user
            addUserMessage(text);
            inputField.value = '';

            // Proses balasan AI
            processUserIntent(text);
        });
    }

    // Event Delegation untuk Chip Tombol Opsi Cepat
    if (messagesContainer) {
        messagesContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.cs-chip-btn');
            if (chip) {
                const action = chip.getAttribute('data-action');
                const text = chip.textContent.trim();
                
                addUserMessage(text);
                
                if (action === 'admin_handoff') {
                    triggerHumanAdminTransfer(text);
                } else if (action === 'katalog') {
                    processUserIntent("katalog");
                } else if (action === 'daftar') {
                    processUserIntent("daftar umkm");
                } else if (action === 'bug') {
                    processUserIntent("laporkan bug");
                } else {
                    processUserIntent(text);
                }
            }
        });
    }
}

// Memory / Session Storage
function getChatHistory() {
    let history = JSON.parse(sessionStorage.getItem('digijaya_cs_history')) || [];
    if (Array.isArray(history)) {
        let modified = false;
        history.forEach(msg => {
            if (msg.chips && Array.isArray(msg.chips)) {
                const initialLen = msg.chips.length;
                msg.chips = msg.chips.filter(c => c.action !== 'peta' && !(c.text || '').toLowerCase().includes('peta'));
                msg.chips.forEach(c => {
                    if (c.text && c.text.includes('(Manusia)')) {
                        c.text = c.text.replace(/\s*\(Manusia\)/g, '');
                        modified = true;
                    }
                });
                if (msg.chips.length !== initialLen) modified = true;
            }
        });
        if (modified) {
            sessionStorage.setItem('digijaya_cs_history', JSON.stringify(history));
        }
    }
    return history;
}

function saveChatHistory(messages) {
    sessionStorage.setItem('digijaya_cs_history', JSON.stringify(messages));
}

function addUserMessage(text) {
    const history = getChatHistory();
    const msg = { sender: 'user', text, time: getCurrentTime() };
    history.push(msg);
    saveChatHistory(history);
    renderMessagesFromHistory();
}

function addBotMessage(text, chips = [], showHandoff = false, handoffTopic = '') {
    const history = getChatHistory();
    const msg = { sender: 'bot', text, chips, showHandoff, handoffTopic, time: getCurrentTime() };
    history.push(msg);
    saveChatHistory(history);
    renderMessagesFromHistory();
}

function sendBotGreeting() {
    const greetingText = "Halo! Selamat datang di DigiJaya Desa Jayamakmur 👋🏼\n\nSaya **JayaBot**, asisten AI Customer Service 24/7. Ada yang bisa saya bantu hari ini?";
    const chips = [
        { text: "🛍️ Cari Produk Katalog", action: "katalog" },
        { text: "🏪 Cara Daftar UMKM", action: "daftar" },
        { text: "🐛 Laporkan Bug / Kendala", action: "bug" },
        { text: "👤 Bicara dengan Admin", action: "admin_handoff" }
    ];
    addBotMessage(greetingText, chips);
}

// Render Messages & Auto-Scroll
function renderMessagesFromHistory() {
    const container = document.getElementById('csMessagesContainer');
    if (!container) return;

    const history = getChatHistory();
    container.innerHTML = '';

    history.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `cs-msg cs-msg-${msg.sender}`;

        let chipsHtml = '';
        if (msg.chips && msg.chips.length > 0) {
            chipsHtml = `
                <div class="cs-chips-wrapper">
                    ${msg.chips.map(c => `<button type="button" class="cs-chip-btn" data-action="${c.action || ''}">${c.text}</button>`).join('')}
                </div>
            `;
        }

        let handoffCardHtml = '';
        if (msg.showHandoff) {
            const encodedTopic = encodeURIComponent(`Halo Admin DigiJaya Desa Jayamakmur, saya butuh bantuan manusia dari website terkait: ${msg.handoffTopic || 'Bantuan Umum'}`);
            const waUrl = `https://wa.me/6281234567890?text=${encodedTopic}`;
            
            handoffCardHtml = `
                <div class="cs-handoff-card">
                    <div class="cs-handoff-header">
                        <span>👤</span> Transfer ke Admin Desa
                    </div>
                    <p class="cs-handoff-desc">Pertanyaan Anda memerlukan penanganan langsung dari Admin Pengelola Desa Jayamakmur.</p>
                    <a href="${waUrl}" target="_blank" class="cs-btn-connect-wa">
                        <span>💬</span> Chat Langsung via WhatsApp Admin
                    </a>
                    <a href="bantuan.html" style="font-size:0.78rem; text-align:center; color:#e65c00; text-decoration:none; font-weight:700;">Atau Kirim Tiket Laporan di Halaman Bantuan &rarr;</a>
                </div>
            `;
        }

        msgDiv.innerHTML = `
            <div class="cs-msg-bubble">${formatMarkdownText(msg.text)} ${handoffCardHtml}</div>
            ${chipsHtml}
            <span class="cs-msg-time">${msg.time}</span>
        `;

        container.appendChild(msgDiv);
    });

    container.scrollTop = container.scrollHeight;
}

// Simulasi AI Engine & Keyword Classifier
function processUserIntent(userText) {
    showTypingIndicator();

    const lower = userText.toLowerCase();

    setTimeout(() => {
        removeTypingIndicator();

        // Check for Admin Handoff Request (Human Customer Service)
        if (lower.includes('admin') || lower.includes('manusia') || lower.includes('orang') || lower.includes('cs asli') || lower.includes('kontak wa') || lower.includes('hubungi admin')) {
            triggerHumanAdminTransfer(userText);
            return;
        }

        // Katalog / Produk Intent
        if (lower.includes('katalog') || lower.includes('produk') || lower.includes('cari') || lower.includes('toko') || lower.includes('beli')) {
            const text = "Anda bisa menjelajahi seluruh produk unggulan (Kuliner, Kerajinan Tangan, & Layanan Jasa) di halaman **Katalog UMKM**.\n\n[Klik di sini untuk buka Katalog UMKM](Main page.html)";
            const chips = [
                { text: "🍱 Rekomendasi Kuliner", action: "kuliner" },
                { text: "👤 Bicara dengan Admin", action: "admin_handoff" }
            ];
            addBotMessage(text, chips);
            return;
        }

        // Pendaftaran UMKM Intent
        if (lower.includes('daftar') || lower.includes('tambah') || lower.includes('registrasi') || lower.includes('buka toko') || lower.includes('gabung')) {
            const text = "Untuk mendaftarkan UMKM baru Anda ke platform DigiJaya:\n1. Masuk ke halaman **Kelola UMKM / Login** di pojok kanan atas.\n2. Atau hubungi tim Admin Desa Jayamakmur untuk dibantu proses verifikasi berkas secara gratis.";
            const chips = [
                { text: "🔑 Buka Halaman Login", action: "login_page" },
                { text: "👤 Hubungi Admin Desa", action: "admin_handoff" }
            ];
            addBotMessage(text, chips);
            return;
        }


        // Bug / Error / Kendala Intent
        if (lower.includes('bug') || lower.includes('error') || lower.includes('kendala') || lower.includes('rusak') || lower.includes('lapor')) {
            const text = "Jika Anda menemukan masalah teknis atau bug tampilan pada website, Anda dapat mengirimkan laporan lengkap beserta foto di halaman **Layanan Bantuan**.\n\n[Buka Form Laporan Bug](bantuan.html)";
            const chips = [
                { text: "👤 Chat dengan Admin WA", action: "admin_handoff" }
            ];
            addBotMessage(text, chips);
            return;
        }

        // Kuliner Intent
        if (lower.includes('kuliner') || lower.includes('makanan') || lower.includes('seblak') || lower.includes('bakso') || lower.includes('opak') || lower.includes('es')) {
            const text = "Desa Jayamakmur memiliki banyak kuliner khas lezat seperti **Opak Renyah Ibu Eli**, **Seblak & Bakso Mang Ulis**, **Es Doger**, dan **Es Teler Creamy**!\n\n[Lihat Katalog Kategori Kuliner](Main page.html?category=Kuliner)";
            const chips = [
                { text: "🛍️ Seluruh Katalog", action: "katalog" }
            ];
            addBotMessage(text, chips);
            return;
        }

        // Default Response with Helpful Chips
        const text = "Terima kasih telah bertanya! Saya dapat membantu Anda seputar katalog produk, cara pendaftaran UMKM, atau menghubungkan Anda dengan **Admin Desa** jika membutuhkan bantuan khusus.";
        const chips = [
            { text: "🛍️ Katalog Produk", action: "katalog" },
            { text: "🏪 Cara Daftar UMKM", action: "daftar" },
            { text: "👤 Hubungi Admin", action: "admin_handoff" }
        ];
        addBotMessage(text, chips);

    }, 700);
}

// Transfer ke Admin Orang Asli
function triggerHumanAdminTransfer(userContext = '') {
    const text = "Tentu! Saya akan menghubungkan Anda secara langsung dengan **Admin Customer Service** Desa Jayamakmur.\n\nSilakan klik tombol hijau di bawah ini untuk membuka percakapan WhatsApp dengan Admin resmi kami:";
    addBotMessage(text, [], true, userContext);
}

function showTypingIndicator() {
    const container = document.getElementById('csMessagesContainer');
    if (!container || document.getElementById('csTypingElem')) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'csTypingElem';
    typingDiv.className = 'cs-msg cs-msg-bot';
    typingDiv.innerHTML = `
        <div class="cs-typing">
            <span class="cs-typing-dot"></span>
            <span class="cs-typing-dot"></span>
            <span class="cs-typing-dot"></span>
        </div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const elem = document.getElementById('csTypingElem');
    if (elem) elem.remove();
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatMarkdownText(str) {
    if (!str) return '';
    return str
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#e65c00; font-weight:800; text-decoration:underline;">$1</a>')
        .replace(/\n/g, '<br>');
}
