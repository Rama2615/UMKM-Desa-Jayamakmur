/**
 * Interactive 3D WebGL Hero Canvas Engine
 * JayamakmurHub - Visualisasi 3D Interaktif Partikel, Geometri & Gelombang Kursor
 */

export function initHero3DCanvas(canvasId = 'hero-3d-canvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 480);

    // Tetapkan listener resize
    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        initNodes();
    });

    // Variabel Posisi Kursor & Interaktivitas
    let mouse = {
        x: width / 2,
        y: height / 2,
        targetX: width / 2,
        targetY: height / 2,
        radius: 180,
        isClicking: false
    };

    let shockwaves = [];

    // Dengarkan gerakan mouse di area Hero
    const heroContainer = canvas.parentElement || document.body;

    heroContainer.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
    });

    heroContainer.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Buat efek gelombang kejut 3D (Shockwave pulse)
        shockwaves.push({
            x: clickX,
            y: clickY,
            radius: 5,
            maxRadius: 220,
            opacity: 0.8,
            speed: 4
        });
    });

    // 3D Nodes (Titik Partikel 3D dalam Ruang Tiga Dimensi)
    let nodes = [];
    const NODE_COUNT = Math.min(Math.floor(width / 14), 85);

    // Skema Warna Brand JayamakmurHub
    const colors = [
        'rgba(27, 77, 62, ',    // Teal Utama #1b4d3e
        'rgba(230, 92, 0, ',    // Orange #e65c00
        'rgba(245, 158, 11, ',  // Gold #f59e0b
        'rgba(45, 212, 191, '   // Teal Terang #2dd4bf
    ];

    class Node3D {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * width * 1.2;
            this.y = (Math.random() - 0.5) * height * 1.2;
            this.z = Math.random() * 600 + 100; // Kedalaman 3D (Z-axis)

            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.vz = (Math.random() - 0.5) * 0.4;

            this.baseRadius = Math.random() * 2.5 + 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.pulseSpeed = Math.random() * 0.03 + 0.01;
            this.pulseAngle = Math.random() * Math.PI * 2;
        }

        update(rotX, rotY) {
            // Pergerakan alami 3D
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;

            this.pulseAngle += this.pulseSpeed;

            // Pemantulan batas 3D
            if (Math.abs(this.x) > width * 0.6) this.vx *= -1;
            if (Math.abs(this.y) > height * 0.6) this.vy *= -1;
            if (this.z < 50 || this.z > 700) this.vz *= -1;

            // Proyeksi 3D Perspektif (3D Perspective Projection Math)
            const fov = 400; // Focal length
            const scale = fov / (fov + this.z);

            // Terapkan rotasi parallax kursor
            const projX = (this.x + rotX * (700 - this.z) * 0.05) * scale + width / 2;
            const projY = (this.y + rotY * (700 - this.z) * 0.05) * scale + height / 2;
            const radius = Math.max(0.5, this.baseRadius * scale * (1 + Math.sin(this.pulseAngle) * 0.25));

            // Interaksi gaya dorong kursor mouse
            const dx = projX - mouse.x;
            const dy = projY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let pushX = 0;
            let pushY = 0;

            if (dist < mouse.radius) {
                const force = (1 - dist / mouse.radius) * 15;
                pushX = (dx / dist) * force;
                pushY = (dy / dist) * force;
            }

            return {
                x: projX + pushX,
                y: projY + pushY,
                z: this.z,
                scale: scale,
                radius: radius,
                color: this.color
            };
        }
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push(new Node3D());
        }
    }

    initNodes();

    let animationFrameId = null;

    // Loop Animasi 3D Utama
    function animate() {
        // Interpolasi halus gerakan mouse (Smooth easing)
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        const rotX = (mouse.x / width - 0.5) * 2;
        const rotY = (mouse.y / height - 0.5) * 2;

        ctx.clearRect(0, 0, width, height);

        // Update & proyeksi seluruh titik 3D
        const projectedNodes = nodes.map(node => node.update(rotX, rotY));

        // Urutkan berdasarkan kedalaman Z untuk efek 3D rendering yang tepat (Depth sorting)
        projectedNodes.sort((a, b) => b.z - a.z);

        // Gambar Garis Hubungan 3D Constellation Mesh
        const maxDist = 130;
        ctx.lineWidth = 0.6;

        for (let i = 0; i < projectedNodes.length; i++) {
            for (let j = i + 1; j < projectedNodes.length; j++) {
                const p1 = projectedNodes[i];
                const p2 = projectedNodes[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.25 * (p1.scale);
                    ctx.strokeStyle = `rgba(27, 77, 62, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Render Gelombang Kejut 3D (Shockwaves)
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += sw.speed;
            sw.opacity -= 0.015;

            if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(230, 92, 0, ${sw.opacity})`;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = 'rgba(230, 92, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
        }

        // Render Titik Partikel 3D Glowing
        projectedNodes.forEach(p => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            const alpha = Math.min(1, (1 - p.z / 750) * 1.2);
            ctx.fillStyle = `${p.color}${alpha})`;
            ctx.shadowColor = `${p.color}0.6)`;
            ctx.shadowBlur = p.radius * 3;
            ctx.fill();
            ctx.restore();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
}
