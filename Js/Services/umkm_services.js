import { Umkm } from '../models/umkm.js?v=3';
import { DUMMY_UMKM } from '../data/fallback_data.js?v=3';

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
        const supabase = await this.getSupabase();
        
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('umkms')
                    .select('*')
                    .order('nama', { ascending: true });
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    this.daftarUmkm = data.map(item => new Umkm({
                        ...item,
                        mapsUrl: item.mapsUrl || item.mapsurl || item.maps_url
                    }));
                    return this.daftarUmkm;
                }
            } catch (err) {
                console.error("Gagal memuat data dari Supabase, menggunakan lokal:", err);
            }
        }

        // --- CEK LOCALSTORAGE (UNTUK MENJAGA PERSISTENSI HAPUS/EDIT SAAT REFRESH) ---
        const isInitialized = localStorage.getItem('umkm_v25_init');
        const cachedData = localStorage.getItem('umkm_data');

        if (isInitialized && cachedData !== null) {
            try {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed)) {
                    this.daftarUmkm = parsed.map(item => new Umkm(item));
                    this.reindexUmkm();
                    this.saveToLocalStorage();
                    return this.daftarUmkm;
                }
            } catch (e) {
                console.error("Gagal membaca umkm_data dari localStorage:", e);
            }
        }

        // --- INITIALIZATION PERTAMA DARI DATABASE/UMKM.JSON ---
        try {
            const response = await fetch('Database/umkm.json');
            if (response.ok) {
                const dataMentah = await response.json();
                this.daftarUmkm = dataMentah.map(item => new Umkm(item));
            } else {
                this.daftarUmkm = DUMMY_UMKM.map(item => new Umkm(item));
            }
        } catch (error) {
            this.daftarUmkm = DUMMY_UMKM.map(item => new Umkm(item));
        }

        this.reindexUmkm();
        localStorage.setItem('umkm_v25_init', 'true');
        this.saveToLocalStorage();
        return this.daftarUmkm;
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
        const selectedCategory = category || '';

        let results = this.daftarUmkm.filter(item => {
            const matchKeyword = !lowerCaseKeyword || 
                                 item.nama.toLowerCase().includes(lowerCaseKeyword);
            
            const matchKategori = !selectedCategory || 
                                   selectedCategory === 'Semua' || 
                                   item.kategori === selectedCategory;
            
            return matchKeyword && matchKategori;
        });

        // Terapkan Logika Sorting
        results.sort((a, b) => {
            if (sortBy === 'id-asc') {
                return Number(a.id) - Number(b.id);
            } else if (sortBy === 'id-desc') {
                return Number(b.id) - Number(a.id);
            } else if (sortBy === 'nama-desc') {
                return b.nama.localeCompare(a.nama);
            }
            return a.nama.localeCompare(b.nama);
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
                const { data, error } = await supabase
                    .from('umkms')
                    .insert([newRecord])
                    .select();
                
                if (error) throw error;
                const added = new Umkm(data[0]);
                this.daftarUmkm.push(added);
                this.saveToLocalStorage();
                return added;
            } catch (err) {
                console.error("Gagal menambahkan data ke Supabase, simpan lokal:", err);
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