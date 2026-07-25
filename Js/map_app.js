import { UmkmService } from './Services/umkm_services.js?v=3';
import { initTheme } from './theme.js?v=3';

// Inisialisasi tema saat halaman dimuat
initTheme();

const service = new UmkmService();
let map = null;
let allUmkms = [];
let markersList = []; // Menyimpan instances penanda MapLibre
let currentCategory = 'Semua';
let currentSearch = '';

// Pusat Desa Jayamakmur (Format MapLibre: [Longitude, Latitude])
const VILLAGE_CENTER = [107.4121, -6.2874];

// Batas wilayah Kecamatan Jayamakmur (Format MapLibre: [[minLng, minLat], [maxLng, maxLat]])
const MAP_BOUNDS = [
    [107.36, -6.33], // Pojok Barat Daya
    [107.46, -6.24]  // Pojok Timur Laut
];

// Koordinat Batas Outline Wilayah Desa Jayamakmur (GeoJSON Polygon)
const VILLAGE_BOUNDARY = [
    [107.402, -6.294],
    [107.400, -6.280],
    [107.410, -6.276],
    [107.424, -6.277],
    [107.426, -6.288],
    [107.422, -6.296],
    [107.412, -6.300],
    [107.402, -6.294] // Titik penutup
];

// Fungsi mendapatkan URL style peta berdasarkan tema aktif
function getMapStyleUrl() {
    const isDark = document.body.classList.contains('dark-mode');
    // Menggunakan Voyager (Berwarna) untuk terang dan Dark Matter untuk gelap (100% Free & No Keys Required)
    return isDark 
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
}

async function initMapApp() {
    // 1. Inisialisasi Peta 3D MapLibre
    map = new maplibregl.Map({
        container: 'map',
        style: getMapStyleUrl(),
        center: VILLAGE_CENTER,
        zoom: 14.5,
        pitch: 55,       // Kemiringan kamera 3D (55 derajat)
        bearing: -15,    // Rotasi arah kompas peta (-15 derajat)
        maxBounds: MAP_BOUNDS, // Batasi wilayah geser peta
        minZoom: 13,
        maxZoom: 18
    });

    // Tambah kontrol navigasi (Zoom +/- dan tombol kompas putar)
    map.addControl(new maplibregl.NavigationControl({
        showCompass: true
    }), 'bottom-right');

    // Menggambar ulang boundary & marker setiap kali style dimuat (termasuk saat toggle tema)
    map.on('style.load', () => {
        drawVillageBoundary();
        renderMapData();
    });

    // Listen ke tombol ubah tema gelap/terang
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTimeout(() => {
                map.setStyle(getMapStyleUrl());
            }, 100);
        });
    }

    // 2. Load data UMKM
    allUmkms = await service.fetchAllUmkm();

    setupFilters();
}

// Fungsi menggambar garis batas outline wilayah desa (GeoJSON)
function drawVillageBoundary() {
    if (!map) return;

    // Bersihkan source/layer jika sudah ada
    if (map.getLayer('boundary-fill')) map.removeLayer('boundary-fill');
    if (map.getLayer('boundary-outline')) map.removeLayer('boundary-outline');
    if (map.getSource('village-boundary')) map.removeSource('village-boundary');

    map.addSource('village-boundary', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [VILLAGE_BOUNDARY]
            }
        }
    });

    // 1. Tambahkan warna transparan di dalam wilayah desa
    map.addLayer({
        'id': 'boundary-fill',
        'type': 'fill',
        'source': 'village-boundary',
        'layout': {},
        'paint': {
            'fill-color': '#0d9488',
            'fill-opacity': 0.08
        }
    });

    // 2. Tambahkan garis batas (outline) berwarna menyala
    map.addLayer({
        'id': 'boundary-outline',
        'type': 'line',
        'source': 'village-boundary',
        'layout': {},
        'paint': {
            'line-color': '#0d9488',
            'line-width': 3,
            'line-dasharray': [2, 2] // Efek garis putus-putus
        }
    });
}

// Fungsi mendapatkan koordinat [Longitude, Latitude]
function getCoordinates(umkm) {
    if (umkm.mapsUrl) {
        const coordRegex = /([-+]?\d{1,2}\.\d+)\s*,\s*([-+]?\d{1,3}\.\d+)/;
        const match = umkm.mapsUrl.match(coordRegex);
        if (match) {
            // Balik urutan ke [Longitude, Latitude] untuk MapLibre
            return [parseFloat(match[2]), parseFloat(match[1])];
        }
    }
    
    // Fallback koordinat wilayah dusun
    const alamat = umkm.alamat.toLowerCase();
    const baseLng = 107.4121;
    const baseLat = -6.2874;
    const randOffset = () => (Math.random() - 0.5) * 0.005;

    if (alamat.includes('krajan')) {
        return [107.4120 + randOffset(), -6.2840 + randOffset()];
    } else if (alamat.includes('babakan')) {
        return [107.4080 + randOffset(), -6.2890 + randOffset()];
    } else if (alamat.includes('sukamaju')) {
        return [107.4170 + randOffset(), -6.2820 + randOffset()];
    } else if (alamat.includes('mekarsari')) {
        return [107.4130 + randOffset(), -6.2930 + randOffset()];
    } else if (alamat.includes('raya utama')) {
        return [107.4110 + randOffset(), -6.2870 + randOffset()];
    } else if (alamat.includes('pasar')) {
        return [107.4140 + randOffset(), -6.2860 + randOffset()];
    }
    
    return [baseLng + randOffset(), baseLat + randOffset()];
}

function renderMapData() {
    // 1. Bersihkan seluruh penanda lama
    markersList.forEach(m => m.remove());
    markersList = [];

    const listContainer = document.getElementById('mapUmkmList');
    if (listContainer) listContainer.innerHTML = '';

    // 2. Filter data
    const filtered = allUmkms.filter(item => {
        const matchCategory = currentCategory === 'Semua' || item.kategori === currentCategory;
        const matchSearch = item.nama.toLowerCase().includes(currentSearch.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        if (listContainer) {
            listContainer.innerHTML = `<p style="text-align: center; color: #888; font-size: 0.85rem; padding: 20px;">Tidak ada UMKM yang cocok.</p>`;
        }
        return;
    }

    filtered.forEach(umkm => {
        const coords = getCoordinates(umkm);

        // --- A. PENANDA (MARKER) 3D PETA ---
        const popupContent = `
            <div class="popup-umkm-card">
                <img src="assets/images/${umkm.gambar}" alt="${umkm.nama}" onerror="this.src='https://placehold.co/600x400?text=Foto+UMKM'">
                <h4>${umkm.nama}</h4>
                <p>📍 ${umkm.alamat}</p>
                <a href="Detail produk.html?id=${umkm.id}" class="popup-umkm-btn">Lihat Detail Usaha &rarr;</a>
            </div>
        `;

        const emoji = umkm.kategori === 'Kuliner' ? '🍱' : 
                      umkm.kategori === 'Kerajinan' ? '🎨' : '🛠️';

        // Buat elemen penanda kustom
        const el = document.createElement('div');
        el.className = 'custom-leaflet-marker'; // Tetap gunakan kelas yang sama agar gaya CSS di peta.html tidak berubah
        el.innerHTML = `
            <div class="custom-marker-pin marker-${umkm.kategori.toLowerCase()}">
                <span class="marker-emoji">${emoji}</span>
                <div class="marker-pulse"></div>
            </div>
        `;

        // Buat Popup MapLibre
        const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(popupContent);

        // Pasang Penanda ke Peta
        const marker = new maplibregl.Marker({ element: el })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map);

        markersList.push(marker);

        // --- B. RENDERING DATA KE SIDEBAR ---
        if (listContainer) {
            const card = document.createElement('div');
            card.className = 'map-list-card';
            card.dataset.id = umkm.id;
            card.innerHTML = `
                <img class="map-card-img" src="assets/images/${umkm.gambar}" alt="${umkm.nama}" onerror="this.src='https://placehold.co/100x100?text=UMKM'">
                <div class="map-card-info">
                    <div class="map-card-category">${umkm.kategori}</div>
                    <div class="map-card-title">${umkm.nama}</div>
                    <div class="map-card-addr">📍 ${umkm.alamat}</div>
                </div>
            `;

            // Event listener saat card di klik
            card.addEventListener('click', () => {
                document.querySelectorAll('.map-list-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Efek terbang 3D (flyTo) kamera MapLibre
                map.flyTo({
                    center: coords,
                    zoom: 16.5,
                    pitch: 55,
                    bearing: -15,
                    duration: 1500,
                    essential: true
                });

                // Buka popup setelah kamera sampai
                setTimeout(() => {
                    marker.togglePopup();
                }, 1000);
            });

            listContainer.appendChild(card);
        }
    });
}

function setupFilters() {
    const searchInput = document.getElementById('mapSearchInput');
    const tabs = document.querySelectorAll('.map-tab');

    // Live search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            renderMapData();
        });
    }

    // Tabs filter
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentCategory = tab.dataset.category;
            renderMapData();
        });
    });
}

// Jalankan ketika DOM siap
window.addEventListener('DOMContentLoaded', initMapApp);
