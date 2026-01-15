const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 150 }; // Radius for interaction

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const numberOfParticles = (width * height) / 9000; // Density based on screen size
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

window.addEventListener('resize', init);
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1; // Particle size between 1 and 4
        this.speedX = Math.random() * 0.5 - 0.25; // Random speed between -0.25 and 0.25
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = 'rgba(255, 255, 255, 0.3)'; // Faint white color
    }

    update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap particles around the screen
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Push particle away from the cursor
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxSpeed = 10;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * maxSpeed;
                const directionY = forceDirectionY * force * maxSpeed;

                this.x -= directionX * 0.1; // Apply a small push
                this.y -= directionY * 0.1;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Connect particles within a certain distance
            if (distance < 100) {
                opacityValue = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.1})`; // Very faint lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height); // Clear canvas

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    connect(); // Draw connections between particles
}

init();
animate();
