export class Umkm {
    constructor({ id, nama, kategori, deskripsi, whatsapp, gambar, galeri, alamat, mapsUrl, password }) {
        this.id = id;
        this.nama = nama;
        this.kategori = kategori;
        this.deskripsi = deskripsi;
        this.whatsapp = whatsapp;
        this.gambar = gambar;
        this.galeri = galeri || [];
        this.alamat = alamat || "Desa Jayamakmur, Karawang";
        this.mapsUrl = mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((this.nama.includes('Jahit Pak Ceming') ? 'Toko Jahit Pak RT. Ceming' : this.nama) + ' Jayamakmur Karawang')}`;
        this.password = password || "owner123";
    }

    getWhatsAppLink() {
        const pesan = encodeURIComponent(`Halo, saya ingin menanyakan informasi tentang UMKM ${this.nama}.`);
        return `https://wa.me/${this.whatsapp}?text=${pesan}`;
    }

    getGoogleMapsLink() {
        if (this.mapsUrl && this.mapsUrl.trim() !== '') {
            return this.mapsUrl;
        }
        const searchName = this.nama.includes('Jahit Pak Ceming') ? 'Toko Jahit Pak RT. Ceming' : this.nama;
        return `https://maps.google.com/?q=${encodeURIComponent(searchName + ' Jayamakmur Karawang')}`;
    }
}