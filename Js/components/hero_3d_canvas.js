/**
 * Interactive 3D WebGL Hero Canvas Engine
 * DigiJaya - Visualisasi 3D Interaktif Partikel Glowing, Geometri & Gelombang Kursor
 */

export function initHero3DCanvas(canvasId = 'hero-3d-canvas') {
    const canvas = document.getElementById(canvasId);
    if (canvas.dataset.canvasInitialized) return;
    canvas.dataset.canvasInitialized = 'true';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 480);

    // Listener Resize Canvas
    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        initNodes();
    });

    // Posisi Kursor Mouse
    let mouse = {
        x: width / 2,
        y: height / 2,
        targetX: width / 2,
        targetY: height / 2,
        radius: 200
    };

    let shockwaves = [];

    // Listener Gerakan & Klik Mouse
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
        
        shockwaves.push({
            x: clickX,
            y: clickY,
            radius: 5,
            maxRadius: 250,
            opacity: 0.9,
            speed: 5
        });
    });

    // Skema Warna Terang & Glowing (Cyan, Orange, Gold, White)
    const colors = [
        'rgba(45, 212, 191, ',   // Bright Cyan #2dd4bf
        'rgba(255, 117, 26, ',   // Vibrant Orange #ff751a
        'rgba(251, 191, 36, ',   // Bright Gold #fbbf24
        'rgba(255, 255, 255, '   // Pure White #ffffff
    ];

    let nodes = [];
    const NODE_COUNT = Math.min(Math.floor(width / 24), 35);

    class Node3D {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * width * 1.3;
            this.y = (Math.random() - 0.5) * height * 1.3;
            this.z = Math.random() * 550 + 80; // Z depth

            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.vz = (Math.random() - 0.5) * 0.5;

            this.baseRadius = Math.random() * 3 + 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.pulseSpeed = Math.random() * 0.04 + 0.015;
            this.pulseAngle = Math.random() * Math.PI * 2;
        }

        update(rotX, rotY) {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;

            this.pulseAngle += this.pulseSpeed;

            if (Math.abs(this.x) > width * 0.65) this.vx *= -1;
            if (Math.abs(this.y) > height * 0.65) this.vy *= -1;
            if (this.z < 50 || this.z > 650) this.vz *= -1;

            const fov = 420;
            const scale = fov / (fov + this.z);

            const projX = (this.x + rotX * (650 - this.z) * 0.06) * scale + width / 2;
            const projY = (this.y + rotY * (650 - this.z) * 0.06) * scale + height / 2;
            const radius = Math.max(0.8, this.baseRadius * scale * (1 + Math.sin(this.pulseAngle) * 0.3));

            const dx = projX - mouse.x;
            const dy = projY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let pushX = 0;
            let pushY = 0;

            if (dist < mouse.radius) {
                const force = (1 - dist / mouse.radius) * 18;
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

    function animate() {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        const rotX = (mouse.x / width - 0.5) * 2;
        const rotY = (mouse.y / height - 0.5) * 2;

        ctx.clearRect(0, 0, width, height);

        const projectedNodes = nodes.map(node => node.update(rotX, rotY));
        projectedNodes.sort((a, b) => b.z - a.z);

        // Gambar Garis Hubungan 3D Constellation Mesh
        const maxDist = 145;
        ctx.lineWidth = 0.8;

        for (let i = 0; i < projectedNodes.length; i++) {
            for (let j = i + 1; j < projectedNodes.length; j++) {
                const p1 = projectedNodes[i];
                const p2 = projectedNodes[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.4 * p1.scale;
                    ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
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
            ctx.strokeStyle = `rgba(255, 117, 26, ${sw.opacity})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(255, 117, 26, 0.8)';
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.restore();
        }

        // Render Titik Partikel 3D Glowing
        projectedNodes.forEach(p => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            const alpha = Math.min(1, (1 - p.z / 700) * 1.3);
            ctx.fillStyle = `${p.color}${alpha})`;
            ctx.shadowColor = `${p.color}0.8)`;
            ctx.shadowBlur = p.radius * 4;
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
