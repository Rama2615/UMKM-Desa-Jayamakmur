import { Umkm } from '../models/umkm.js';

export class UmkmService {
    constructor() {
        this.daftarUmkm = []; // Tempat menyimpan semua objek data UMKM
    }

    // Method untuk mengambil data dari file umkm.json
    async fetchAllUmkm() {
        try {
            const response = await fetch('Database/umkm.json');            if (!response.ok) {
                throw new Error('Gagal mengambil data dari database local.');
            }
            const dataMentah = await response.json();
            
            // Mengubah data JSON mentah menjadi Objek ber-tipe Class Umkm
            this.daftarUmkm = dataMentah.map(item => new Umkm(item));
            return this.daftarUmkm;
        } catch (error) {
            console.error("Terjadi kesalahan di UmkmService:", error);
            return [];
        }
    }

    // Fitur: Cari UMKM berdasarkan nama
    searchByName(keyword) {
        if (!keyword) return this.daftarUmkm;
        
        const lowerCaseKeyword = keyword.toLowerCase();
        return this.daftarUmkm.filter(umkm => 
            umkm.nama.toLowerCase().includes(lowerCaseKeyword)
        );
    }

    // Fitur: Filter UMKM berdasarkan kategori (misal: Kuliner, Kerajinan)
    filterByCategory(category) {
        if (!category || category === 'Semua') return this.daftarUmkm;
        
        return this.daftarUmkm.filter(umkm => umkm.kategori === category);
    }
}