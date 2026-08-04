/**
 * 3D Parallax & Specular Light Tilt Engine
 * DigiJaya - Interaktivitas 3D Perspektif & Pantulan Cahaya
 */

export function init3DTiltEngine(selector = '[data-tilt-3d]') {
    let elements = [];
    if (typeof selector === 'string') {
        elements = document.querySelectorAll(selector);
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
        elements = selector;
    } else if (selector instanceof Element) {
        elements = [selector];
    } else if (selector && selector.length) {
        elements = Array.from(selector);
    }

    elements.forEach(el => {
        if (!el || !el.dataset || el.dataset.tiltInitialized) return;
        el.dataset.tiltInitialized = 'true';

        // Konfigurasi Parameter 3D
        const maxTilt = parseFloat(el.dataset.maxTilt) || 12; // derajat miring
        const perspective = parseInt(el.dataset.perspective, 10) || 1000;
        const scale = parseFloat(el.dataset.scale) || 1.03;
        const speed = parseInt(el.dataset.speed, 10) || 400; // ms transition

        // Buat elemen pantulan cahaya 3D Glare jika belum ada
        let glare = el.querySelector('.tilt-3d-glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'tilt-3d-glare';
            glare.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                pointer-events: none;
                background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 75%);
                opacity: 0;
                transition: opacity ${speed}ms ease;
                z-index: 5;
            `;
            if (getComputedStyle(el).position === 'static') {
                el.style.position = 'relative';
            }
            el.appendChild(glare);
        }

        // Terapkan properti 3D pada elemen
        el.style.transformStyle = 'preserve-3d';
        el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow ${speed}ms ease`;

        let isHovered = false;
        let transitionTimeout = null;

        el.addEventListener('mouseenter', () => {
            isHovered = true;
            el.style.transition = 'transform 200ms cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 200ms ease';
            if (glare) glare.style.opacity = '1';
            
            if (transitionTimeout) clearTimeout(transitionTimeout);
            transitionTimeout = setTimeout(() => {
                if (isHovered) {
                    el.style.transition = 'box-shadow 200ms ease';
                }
            }, 200);
        });

        el.addEventListener('mousemove', (e) => {
            if (!isHovered) return;

            const rect = el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Hitung koordinat relatif (-1 sampai +1) dari titik tengah
            const xVal = (mouseX / width - 0.5) * 2;
            const yVal = (mouseY / height - 0.5) * 2;

            // Hitung sudut rotasi 3D
            const rotateX = (-yVal * maxTilt).toFixed(2);
            const rotateY = (xVal * maxTilt).toFixed(2);

            // Terapkan transformasi 3D tanpa lag transisi
            el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
            
            // Efek bayangan dinamis 3D
            const shadowX = (-xVal * 12).toFixed(1);
            const shadowY = (-yVal * 16).toFixed(1);
            el.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(27, 77, 62, 0.12)`;

            // Posisikan sumber cahaya glare
            if (glare) {
                const glareX = ((mouseX / width) * 100).toFixed(1);
                const glareY = ((mouseY / height) * 100).toFixed(1);
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            isHovered = false;
            if (transitionTimeout) clearTimeout(transitionTimeout);
            el.style.transition = `transform ${speed}ms ease, box-shadow ${speed}ms ease`;
            el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.boxShadow = '';
            if (glare) glare.style.opacity = '0';
        });
    });
}
