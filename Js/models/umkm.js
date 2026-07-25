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
        this.mapsUrl = mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(this.nama + ' Desa Jayamakmur')}`;
        this.password = password || "owner123";
    }

    getWhatsAppLink() {
        const pesan = encodeURIComponent(`Halo, saya ingin menanyakan informasi tentang UMKM ${this.nama}.`);
        return `https://wa.me/${this.whatsapp}?text=${pesan}`;
    }

    getGoogleMapsLink() {
        return this.mapsUrl;
    }
}