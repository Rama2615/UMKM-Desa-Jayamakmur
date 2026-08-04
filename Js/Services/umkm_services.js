import { Umkm } from '../models/umkm.js';
import { DUMMY_UMKM } from '../data/fallback_data.js';

// ==========================================================================
// KONFIGURASI KREDENSIAL SUPABASE
// ==========================================================================
const SUPABASE_URL = "https://xqjyetbdslkfrcfyvtzc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanlldGJkc2xrZnJjZnl2dHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDAxNDAsImV4cCI6MjEwMDUxNjE0MH0.KPDwnBffnbF6SR-MGYLhBPJ-IJtb9GZ0s-HuBVM1Svo";

let supabaseClient = null;

export class UmkmService {
    constructor() {
        this.daftarUmkm = [];
    }

    // Fungsi pembantu untuk menginisialisasi klien Supabase secara dinamis
    async getSupabase() {
        if (supabaseClient) return supabaseClient;
        if (!SUPABASE_URL || SUPABASE_URL === "MASUKKAN_SUPABASE_URL_ANDA" || 
            !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === "MASUKKAN_SUPABASE_ANON_KEY_ANDA") {
            return null; // Fallback ke mode lokal jika kredensial kosong
        }
        
        try {
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return supabaseClient;
        } catch (e) {
            console.error("Gagal menginisialisasi SDK Supabase:", e);
            return null;
        }
    }

    async fetchAllUmkm() {
        try {
            // 1. Coba ambil data langsung dari Supabase Cloud lebih awal
            const supabase = await this.getSupabase();
            if (supabase) {
                try {
                    const { data, error } = await supabase
                        .from('umkms')
                        .select('*')
                        .order('nama', { ascending: true });
                    
                    if (!error && data && data.length > 0) {
                        this.daftarUmkm = data.map(item => new Umkm({
                            ...item,
                            mapsUrl: item.mapsUrl || item.mapsurl || item.maps_url
                        }));
                        this.saveToLocalStorage();
                        this.syncWithSupabaseInBackground();
                        return this.daftarUmkm;
                    }
                } catch (sbErr) {
                    console.warn("Koneksi Supabase Cloud awal gagal, menggunakan cache lokal:", sbErr);
                }
            }

            // 2. Fallback: Muat data lokal jika offline atau Supabase belum siap
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

            this.syncWithSupabaseInBackground();
        } catch (err) {
            console.error("Fail-safe fallback triggered:", err);
            this.daftarUmkm = DUMMY_UMKM.map(item => new Umkm(item));
        }

        return this.daftarUmkm;
    }

    async syncWithSupabaseInBackground() {
        try {
            const supabase = await this.getSupabase();
            if (!supabase) return;

            const { data, error } = await supabase
                .from('umkms')
                .select('*')
                .order('nama', { ascending: true });
            
            if (!error && data && data.length > 0) {
                const currentIds = JSON.stringify(this.daftarUmkm.map(i => i.id));
                const newIds = JSON.stringify(data.map(i => i.id));
                
                this.daftarUmkm = data.map(item => new Umkm({
                    ...item,
                    mapsUrl: item.mapsUrl || item.mapsurl || item.maps_url
                }));
                this.saveToLocalStorage();
                
                if (currentIds !== newIds) {
                    window.dispatchEvent(new CustomEvent('umkmDataChanged', { detail: { timestamp: Date.now() } }));
                }
            }
        } catch (err) {
            // Abaikan kesalahan di background
        }

        // Polling berkala 10 detik
        if (!window._umkmSyncInterval) {
            window._umkmSyncInterval = setInterval(() => {
                this.syncWithSupabaseInBackground();
            }, 10000);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('umkm_data', JSON.stringify(this.daftarUmkm));
        localStorage.setItem('umkm_last_update', Date.now().toString());
        this.broadcastChange();
    }

    broadcastChange() {
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('umkm_data_sync');
                channel.postMessage({ type: 'UMKM_DATA_CHANGED', timestamp: Date.now() });
                channel.close();
            }
        } catch (e) {
            console.log("BroadcastChannel error:", e);
        }
        window.dispatchEvent(new CustomEvent('umkmDataChanged', { detail: { timestamp: Date.now() } }));
    }

    onDataChanged(callback) {
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('umkm_data_sync');
            channel.onmessage = (event) => {
                if (event.data && event.data.type === 'UMKM_DATA_CHANGED') {
                    callback();
                }
            };
        }
        window.addEventListener('storage', (e) => {
            if (e.key === 'umkm_data' || e.key === 'umkm_last_update') {
                callback();
            }
        });
        window.addEventListener('umkmDataChanged', () => {
            callback();
        });
    }

    getUmkmById(id) {
        const numericId = Number(id);
        return this.daftarUmkm.find(item => item.id === numericId || item.id === id);
    }

    getFilteredUmkm(keyword = '', category = '', sortBy = 'nama-asc') {
        const lowerCaseKeyword = keyword ? keyword.toLowerCase().trim() : '';
        const selectedCategory = category ? category.trim() : '';
        const selCatLower = selectedCategory.toLowerCase();

        let results = (this.daftarUmkm || []).filter(item => {
            if (!item) return false;
            const itemNama = (item.nama || '').toLowerCase();
            const itemDeskripsi = (item.deskripsi || '').toLowerCase();
            const itemKategori = (item.kategori || '').toLowerCase();

            const matchKeyword = !lowerCaseKeyword || 
                                 itemNama.includes(lowerCaseKeyword) ||
                                 itemDeskripsi.includes(lowerCaseKeyword);
            
            const matchKategori = !selectedCategory || 
                                   selectedCategory === 'Semua' || 
                                   itemKategori === selCatLower ||
                                   (selCatLower.includes('jasa') && itemKategori.includes('jasa')) ||
                                   (selCatLower.includes('kerajinan') && itemKategori.includes('kerajinan')) ||
                                   (selCatLower.includes('kuliner') && itemKategori.includes('kuliner'));
            
            return matchKeyword && matchKategori;
        });

        // Terapkan Logika Sorting
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
        const supabase = await this.getSupabase();
        
        const newRecord = {
            nama: umkmData.nama,
            kategori: umkmData.kategori,
            deskripsi: umkmData.deskripsi,
            whatsapp: umkmData.whatsapp,
            gambar: umkmData.gambar || 'placeholder.jpg',
            galeri: umkmData.galeri || [],
            alamat: umkmData.alamat,
            mapsUrl: umkmData.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(umkmData.nama + ' Desa Jayamakmur')}`,
            password: umkmData.password || 'owner123'
        };

        if (supabase) {
            try {
                // Percobaan 1: Insert dengan newRecord lengkap
                let { data, error } = await supabase
                    .from('umkms')
                    .insert([newRecord])
                    .select();
                
                // Percobaan 2: Jika gagal karena nama kolom mapsUrl, coba dengan mapsurl
                if (error && (error.message || '').includes('mapsUrl')) {
                    const fallbackRecord = { ...newRecord };
                    delete fallbackRecord.mapsUrl;
                    fallbackRecord.mapsurl = newRecord.mapsUrl;
                    const retry = await supabase.from('umkms').insert([fallbackRecord]).select();
                    data = retry.data;
                    error = retry.error;
                }

                if (error) {
                    console.error("Supabase Cloud insert error:", error);
                    throw error;
                }
                
                const addedRecord = (data && data.length > 0) ? data[0] : { id: Date.now(), ...newRecord };
                const added = new Umkm(addedRecord);
                added._isCloudSynced = true;
                this.daftarUmkm.push(added);
                this.saveToLocalStorage();
                return added;
            } catch (err) {
                console.error("Peringatan: Gagal menyimpan ke Supabase Cloud (Data dialihkan ke penyimpanan lokal):", err);
            }
        }

        // Fallback Lokal
        const nextId = this.daftarUmkm.length > 0 
            ? Math.max(...this.daftarUmkm.map(item => Number(item.id) || 0)) + 1 
            : 1;
        
        const localNewUmkm = new Umkm({ id: nextId, ...newRecord });
        this.daftarUmkm.push(localNewUmkm);
        this.saveToLocalStorage();
        return localNewUmkm;
    }

    async updateUmkm(id, updatedData) {
        const supabase = await this.getSupabase();
        const numericId = Number(id);

        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('umkms')
                    .update(updatedData)
                    .eq('id', id)
                    .select();
                
                if (error) throw error;
                
                // Update daftar memori lokal
                const index = this.daftarUmkm.findIndex(item => item.id === numericId || item.id === id);
                if (index !== -1) {
                    this.daftarUmkm[index] = new Umkm(data[0]);
                    this.saveToLocalStorage();
                    return this.daftarUmkm[index];
                }
            } catch (err) {
                console.error("Gagal mengupdate data ke Supabase, simpan lokal:", err);
            }
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
        const supabase = await this.getSupabase();
        const numericId = Number(id);

        if (supabase) {
            try {
                const { error } = await supabase
                    .from('umkms')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                
                this.daftarUmkm = this.daftarUmkm.filter(item => item.id !== numericId && item.id !== id);
                this.reindexUmkm();
                this.saveToLocalStorage();
                return true;
            } catch (err) {
                console.error("Gagal menghapus data dari Supabase, hapus lokal:", err);
            }
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