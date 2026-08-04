export class Umkm {
    constructor(data = {}) {
        const item = data || {};
        this.id = item.id || Date.now();
        this.nama = item.nama || 'UMKM Jayamakmur';
        this.kategori = item.kategori || 'Kuliner';
        this.deskripsi = item.deskripsi || 'Deskripsi UMKM Desa Jayamakmur';
        this.whatsapp = item.whatsapp || '';
        this.gambar = item.gambar || '';
        this.galeri = Array.isArray(item.galeri) ? item.galeri : [];
        this.alamat = item.alamat || "Desa Jayamakmur, Karawang";
        
        const safeName = (this.nama || '').toString();
        const searchName = safeName.includes('Jahit Pak Ceming') ? 'Toko Jahit Pak RT. Ceming' : safeName;
        this.mapsUrl = item.mapsUrl || item.mapsurl || item.maps_url || `https://maps.google.com/?q=${encodeURIComponent(searchName + ' Jayamakmur Karawang')}`;
        this.password = item.password || "owner123";
    }

    getWhatsAppLink() {
        const safeName = (this.nama || '').toString();
        const pesan = encodeURIComponent(`Halo, saya ingin menanyakan informasi tentang UMKM ${safeName}.`);
        return `https://wa.me/${this.whatsapp || ''}?text=${pesan}`;
    }

    getGoogleMapsLink() {
        if (this.mapsUrl && typeof this.mapsUrl === 'string' && this.mapsUrl.trim() !== '') {
            return this.mapsUrl;
        }
        const safeName = (this.nama || '').toString();
        const searchName = safeName.includes('Jahit Pak Ceming') ? 'Toko Jahit Pak RT. Ceming' : safeName;
        return `https://maps.google.com/?q=${encodeURIComponent(searchName + ' Jayamakmur Karawang')}`;
    }
}