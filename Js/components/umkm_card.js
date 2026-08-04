import { getImagePath } from '../utils/image_uploader.js?v=3';

export class UmkmCard {
    constructor(umkm) {
        this.umkm = umkm;
    }

    render() {
        const favorites = JSON.parse(localStorage.getItem('umkm_favorites')) || [];
        const isFavorite = favorites.includes(Number(this.umkm.id));
        const favoriteClass = isFavorite ? 'active' : '';
        const rawCategory = (this.umkm.kategori || '').toLowerCase();
        const badgeClass = rawCategory.includes('kerajinan') ? 'badge-kerajinan' : rawCategory.includes('jasa') ? 'badge-jasa' : 'badge-kuliner';

        return `
            <div class="card-umkm" data-id="${this.umkm.id}">
                <button type="button" class="btn-favorite ${favoriteClass}" data-id="${this.umkm.id}" title="Simpan ke Favorit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <a href="Detail produk.html?id=${this.umkm.id}" class="card-main-link">
                    <div class="card-image-wrapper">
                        <img src="${imageSrc}" alt="${this.umkm.nama}" onerror="this.src='https://placehold.co/600x400?text=Foto+UMKM'">
                    </div>
                    <div class="card-content">
                        <div class="card-meta">
                            <span class="${badgeClass}">${this.umkm.kategori}</span>
                        </div>
                        <h3 class="card-title">${this.umkm.nama}</h3>
                        <p class="card-location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            ${this.umkm.alamat}
                        </p>
                        <p class="card-description">${this.umkm.deskripsi}</p>
                    </div>
                </a>
                <div class="card-action">
                    <a href="Detail produk.html?id=${this.umkm.id}" class="btn-detail">
                        Lihat Profil & Lokasi 📌
                    </a>
                    <button type="button" class="btn-share" data-id="${this.umkm.id}" data-nama="${this.umkm.nama}" title="Bagikan profil UMKM ini">
                        Bagikan 🔗
                    </button>
                </div>
            </div>
        `;
    }
}