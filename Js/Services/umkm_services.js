import { Umkm } from '../models/umkm.js';
import { DUMMY_UMKM } from '../data/fallback_data.js';

// ==========================================================================
// KONFIGURASI KREDENSIAL SUPABASE REST API (DIRECT NATIVE FETCH)
// ==========================================================================
const SUPABASE_URL = "https://xqjyetbdslkfrcfyvtzc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanlldGJkc2xrZnJjZnl2dHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDAxNDAsImV4cCI6MjEwMDUxNjE0MH0.KPDwnBffnbF6SR-MGYLhBPJ-IJtb9GZ0s-HuBVM1Svo";

export class UmkmService {
    constructor() {
        this.daftarUmkm = [];
        this.listeners = [];
    }

    onDataChanged(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    }

    broadcastChange() {
        this.listeners.forEach(cb => {
            try { cb(this.daftarUmkm); } catch (e) { console.error(e); }
        });
        window.dispatchEvent(new CustomEvent('umkmDataChanged', { detail: { timestamp: Date.now() } }));
    }

    // Direct Native REST API Headers
    getApiHeaders(includePrefer = false) {
        const headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
        };
        if (includePrefer) {
            headers["Prefer"] = "return=representation";
        }
        return headers;
    }

    async fetchAllUmkm() {
        try {
            // 1. CEK PERSISTENSI CLOUD SUPABASE VIA DIRECT NATIVE REST API (< 300ms)
            const response = await fetch(`${SUPABASE_URL}/rest/v1/umkms?select=*&order=nama.asc`, {
                method: 'GET',
                headers: this.getApiHeaders()
            });

            if (response.ok) {
                const cloudData = await response.json();
                if (Array.isArray(cloudData) && cloudData.length > 0) {
                    this.daftarUmkm = cloudData.map(item => new Umkm({
                        ...item,
                        mapsUrl: item.mapsUrl || item.mapsurl || item.maps_url
                    }));
                    this.saveToLocalStorage();
                    this.startBackgroundSync();
                    return this.daftarUmkm;
                }
            } else {
                console.warn("Respon REST API Supabase bukan OK:", response.status);
            }
        } catch (err) {
            console.warn("Direct fetch Supabase REST API gagal (Offline/Fallback):", err);
        }

        // 2. FALLBACK LOKAL: BACA DARI LOCALSTORAGE JIKA OFFLINE
        const cachedData = localStorage.getItem('umkm_data');
        if (cachedData !== null) {
            try {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.daftarUmkm = parsed.map(item => new Umkm(item));
                    this.reindexUmkm();
                }
            } catch (e) {
                console.error("Gagal membaca umkm_data dari localStorage:", e);
            }
        }

        if (!Array.isArray(this.daftarUmkm) || this.daftarUmkm.length === 0) {
            try {
                const response = await fetch('Database/umkm.json');
                if (response.ok) {
                    const dataMentah = await response.json();
                    if (Array.isArray(dataMentah) && dataMentah.length > 0) {
                        this.daftarUmkm = dataMentah.map(item => new Umkm(item));
                    } else {
                        this.daftarUmkm = DUMMY_UMKM.map(item => new Umkm(item));
                    }
                } else {
                    this.daftarUmkm = DUMMY_UMKM.map(item => new Umkm(item));
                }
            } catch (error) {
                this.daftarUmkm = DUMMY_UMKM.map(item => new Umkm(item));
            }
            this.reindexUmkm();
            this.saveToLocalStorage();
        }

        this.startBackgroundSync();
        return this.daftarUmkm;
    }

    startBackgroundSync() {
        if (window._umkmSyncInterval) return;
        window._umkmSyncInterval = setInterval(async () => {
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/umkms?select=*&order=nama.asc`, {
                    method: 'GET',
                    headers: this.getApiHeaders()
                });
                if (response.ok) {
                    const cloudData = await response.json();
                    if (Array.isArray(cloudData) && cloudData.length > 0) {
                        const currentSerialized = JSON.stringify(this.daftarUmkm.map(i => i.id + i.nama));
                        const newSerialized = JSON.stringify(cloudData.map(i => i.id + i.nama));
                        
                        if (currentSerialized !== newSerialized) {
                            this.daftarUmkm = cloudData.map(item => new Umkm({
                                ...item,
                                mapsUrl: item.mapsUrl || item.mapsurl || item.maps_url
                            }));
                            this.saveToLocalStorage();
                        }
                    }
                }
            } catch (e) {}
        }, 8000);
    }

    saveToLocalStorage() {
        localStorage.setItem('umkm_data', JSON.stringify(this.daftarUmkm));
        localStorage.setItem('umkm_last_update', Date.now().toString());
        this.broadcastChange();
    }

    getUmkmById(id) {
        const numericId = Number(id);
        return this.daftarUmkm.find(item => item.id === numericId || item.id === id) || null;
    }

    getFilteredUmkm(keyword = '', selectedCategory = '', sortBy = 'nama-asc') {
        let results = [...this.daftarUmkm];

        const keyLower = (keyword || '').toLowerCase().trim();
        const selCatLower = (selectedCategory || '').toLowerCase().trim();

        results = results.filter(item => {
            const itemNama = (item.nama || '').toLowerCase();
            const itemDeskripsi = (item.deskripsi || '').toLowerCase();
            const itemAlamat = (item.alamat || '').toLowerCase();
            const itemKategori = (item.kategori || '').toLowerCase();

            const matchKeyword = !keyLower || 
                itemNama.includes(keyLower) || 
                itemDeskripsi.includes(keyLower) || 
                itemAlamat.includes(keyLower) ||
                itemKategori.includes(keyLower);

            const matchKategori = !selectedCategory || 
                selectedCategory === 'Semua' || 
                itemKategori === selCatLower ||
                (selCatLower.includes('jasa') && itemKategori.includes('jasa')) ||
                (selCatLower.includes('kerajinan') && itemKategori.includes('kerajinan')) ||
                (selCatLower.includes('kuliner') && itemKategori.includes('kuliner'));

            return matchKeyword && matchKategori;
        });

        results.sort((a, b) => {
            const nameA = (a.nama || '').toString();
            const nameB = (b.nama || '').toString();
            if (sortBy === 'id-asc') {
                return Number(a.id) - Number(b.id);
            } else if (sortBy === 'id-desc') {
                return Number(b.id) - Number(a.id);
            } else if (sortBy === 'nama-desc') {
                return nameB.localeCompare(nameA);
            }
            return nameA.localeCompare(nameB);
        });

        return results;
    }

    async addUmkm(umkmData) {
        const payload = {
            nama: umkmData.nama || '',
            kategori: umkmData.kategori || 'Kuliner',
            deskripsi: umkmData.deskripsi || '',
            whatsapp: umkmData.whatsapp || '',
            gambar: umkmData.gambar || 'placeholder.jpg',
            galeri: umkmData.galeri || [],
            alamat: umkmData.alamat || '',
            mapsurl: umkmData.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((umkmData.nama || '') + ' Desa Jayamakmur')}`,
            password: umkmData.password || 'owner123'
        };

        try {
            // DIRECT REST API INSERT TO SUPABASE CLOUD
            const response = await fetch(`${SUPABASE_URL}/rest/v1/umkms`, {
                method: 'POST',
                headers: this.getApiHeaders(true),
                body: JSON.stringify([payload])
            });

            if (response.ok) {
                const cloudRes = await response.json();
                const addedRecord = (cloudRes && cloudRes.length > 0) ? cloudRes[0] : payload;
                const added = new Umkm(addedRecord);
                added._isCloudSynced = true;
                this.daftarUmkm.push(added);
                this.saveToLocalStorage();
                return added;
            } else {
                const errText = await response.text();
                console.error("Supabase REST API Insert HTTP Error:", response.status, errText);
                throw new Error(`Cloud Error HTTP ${response.status}: ${errText}`);
            }
        } catch (err) {
            console.error("Gagal insert ke Supabase Cloud via Direct REST API:", err);
            const nextId = this.daftarUmkm.length > 0 
                ? Math.max(...this.daftarUmkm.map(item => Number(item.id) || 0)) + 1 
                : 1;
            
            const localNewUmkm = new Umkm({ id: nextId, ...payload });
            localNewUmkm._isCloudSynced = false;
            localNewUmkm._cloudErrorMsg = err.message || String(err);
            this.daftarUmkm.push(localNewUmkm);
            this.saveToLocalStorage();
            return localNewUmkm;
        }
    }

    async updateUmkm(id, updatedData) {
        const numericId = Number(id);

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/umkms?id=eq.${id}`, {
                method: 'PATCH',
                headers: this.getApiHeaders(true),
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const cloudRes = await response.json();
                const updatedRecord = (cloudRes && cloudRes.length > 0) ? cloudRes[0] : updatedData;
                const index = this.daftarUmkm.findIndex(item => item.id === numericId || item.id === id);
                if (index !== -1) {
                    this.daftarUmkm[index] = new Umkm(updatedRecord);
                    this.saveToLocalStorage();
                    return this.daftarUmkm[index];
                }
            } else {
                console.error("Supabase REST API Update Error:", response.status);
            }
        } catch (err) {
            console.error("Gagal update ke Supabase REST API:", err);
        }

        // Fallback Lokal
        const index = this.daftarUmkm.findIndex(item => item.id === numericId || item.id === id);
        if (index !== -1) {
            const current = this.daftarUmkm[index];
            this.daftarUmkm[index] = new Umkm({
                id: current.id,
                nama: updatedData.nama !== undefined ? updatedData.nama : current.nama,
                kategori: updatedData.kategori !== undefined ? updatedData.kategori : current.kategori,
                deskripsi: updatedData.deskripsi !== undefined ? updatedData.deskripsi : current.deskripsi,
                whatsapp: updatedData.whatsapp !== undefined ? updatedData.whatsapp : current.whatsapp,
                gambar: updatedData.gambar !== undefined ? updatedData.gambar : current.gambar,
                galeri: updatedData.galeri !== undefined ? updatedData.galeri : current.galeri,
                alamat: updatedData.alamat !== undefined ? updatedData.alamat : current.alamat,
                mapsUrl: updatedData.mapsUrl !== undefined ? updatedData.mapsUrl : current.mapsUrl,
                password: updatedData.password !== undefined ? updatedData.password : current.password
            });
            this.saveToLocalStorage();
            return this.daftarUmkm[index];
        }
        return null;
    }

    reindexUmkm() {
        this.daftarUmkm.forEach((item, index) => {
            item.id = index + 1;
        });
    }

    async deleteUmkm(id) {
        const numericId = Number(id);

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/umkms?id=eq.${id}`, {
                method: 'DELETE',
                headers: this.getApiHeaders()
            });

            if (response.ok) {
                this.daftarUmkm = this.daftarUmkm.filter(item => item.id !== numericId && item.id !== id);
                this.reindexUmkm();
                this.saveToLocalStorage();
                return true;
            }
        } catch (err) {
            console.error("Gagal delete dari Supabase REST API:", err);
        }

        // Fallback Lokal
        const initialLength = this.daftarUmkm.length;
        this.daftarUmkm = this.daftarUmkm.filter(item => item.id !== numericId && item.id !== id);
        if (this.daftarUmkm.length !== initialLength) {
            this.reindexUmkm();
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    searchByName(keyword) {
        if (!keyword) return this.daftarUmkm;
        const lowerCaseKeyword = keyword.toLowerCase();
        return this.daftarUmkm.filter(umkm => 
            umkm.nama.toLowerCase().includes(lowerCaseKeyword)
        );
    }

    filterByCategory(category) {
        if (!category || category === 'Semua') return this.daftarUmkm;
        return this.daftarUmkm.filter(umkm => umkm.kategori === category);
    }
}