export class Umkm {
    // Constructor menerima objek data mentah dari JSON
    constructor({ id, nama, kategori, deskripsi, whatsapp, gambar }) {
        this.id = id;
        this.nama = nama;
        this.kategori = kategori;
        this.deskripsi = deskripsi;
        this.whatsapp = whatsapp;
        this.gambar = gambar;
    }

    // Method khusus untuk membuat link chat WhatsApp otomatis langsung ke penjual
    getWhatsAppLink() {
        // Format link: https://wa.me/628xxx?text=Halo...
        const pesan = encodeURIComponent(`Halo, saya tertarik dengan produk dari UMKM ${this.nama}. Bisa tahu informasi lebih lanjut?`);
        return `https://wa.me/${this.whatsapp}?text=${pesan}`;
    }
}