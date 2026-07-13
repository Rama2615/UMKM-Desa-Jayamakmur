export class UmkmCard {
    constructor(umkm) {
        this.umkm = umkm;
    }

    render() {
        return `
            <div class="card-umkm" data-id="${this.umkm.id}">
                <div class="card-image-wrapper">
                    <a href="Detail produk.html?id=${this.umkm.id}">
                        <img src="assets/images/umkm/${this.umkm.gambar}" alt="${this.umkm.nama}" onerror="this.src='https://placehold.co/600x400?text=Foto+UMKM'">
                    </a>
                </div>
                <div class="card-content">
                    <span class="badge-${this.umkm.kategori.toLowerCase()}">${this.umkm.kategori}</span>
                    <h3 class="card-title">
                        <a href="Detail produk.html?id=${this.umkm.id}" style="text-decoration: none; color: inherit;">
                            ${this.umkm.nama}
                        </a>
                    </h3>
                    <p class="card-description">${this.umkm.deskripsi}</p>
                    <a href="${this.umkm.getWhatsAppLink()}" target="_blank" class="btn-whatsapp">
                        Hubungi Penjual
                    </a>
                </div>
            </div>
        `;
    }
}