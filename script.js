function initNetworkCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'networkCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    const isMobile = width < 768;
    const particleCount = isMobile ? Math.floor((width * height) / 20000) : Math.floor((width * height) / 9000);
    const connectionDistance = isMobile ? 120 : 160;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 1.5 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#00e5ff';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.35})`;
                    ctx.lineWidth = 0.8;
                    ctx.shadowBlur = 0;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    const openingSequence = document.getElementById('opening-sequence');
    if (openingSequence) {
        // 세션 중에 이미 오프닝을 봤는지 확인
        if (sessionStorage.getItem('hasSeenIntro')) {
            openingSequence.remove();
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
            
            setTimeout(() => {
                openingSequence.classList.add('opened');
            }, 1500);

            setTimeout(() => {
                document.body.style.overflow = '';
                openingSequence.remove();
                // 오프닝을 봤음을 세션에 저장
                sessionStorage.setItem('hasSeenIntro', 'true');
            }, 3500);
        }
    }

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach(el => observer.observe(el));

    // Interactive Background Glow
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    initNetworkCanvas();

    // Global Robot Background & Schematic Injection
    const injectGlobalBackground = () => {
        if (!document.querySelector('.robot-bg-overlay')) {
            const bgOverlay = document.createElement('div');
            bgOverlay.className = 'robot-bg-overlay';
            document.body.prepend(bgOverlay);

            const schematicSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            schematicSvg.setAttribute('class', 'schematic-arm');
            schematicSvg.setAttribute('viewBox', '0 0 800 800');
            schematicSvg.setAttribute('fill', 'none');
            schematicSvg.innerHTML = `
                <path d="M100 700 L300 650 L450 400 L600 350 L750 150" stroke-dasharray="10 5" />
                <circle cx="100" cy="700" r="40" />
                <circle cx="300" cy="650" r="30" />
                <circle cx="450" cy="400" r="25" />
                <rect x="580" y="330" width="40" height="40" transform="rotate(45 600 350)" />
                <g class="gripper">
                    <path d="M750 150 L780 120 M750 150 L720 180" stroke-width="3" />
                    <path d="M780 120 L800 140 M720 180 L700 160" />
                </g>
                <text x="320" y="640">JOINT_B_ROTATION: 45.2deg</text>
                <text x="470" y="390">AXIS_C_STABILITY: NOMINAL</text>
                <line x1="0" y1="0" x2="800" y2="800" stroke="rgba(0, 229, 255, 0.05)" stroke-width="0.5" />
                <line x1="800" y1="0" x2="0" y2="800" stroke="rgba(0, 229, 255, 0.05)" stroke-width="0.5" />
            `;
            document.body.prepend(schematicSvg);
        }
    };
    injectGlobalBackground();

    // Global Floating Quick Menu Injection
    if (!document.querySelector('.floating-menu')) {
        const floatingMenu = document.createElement('div');
        floatingMenu.className = 'floating-menu animate-in visible';
        floatingMenu.style.opacity = '1';
        floatingMenu.style.transform = 'translateY(-50%) scale(1)';
        floatingMenu.innerHTML = `
            <div class="floating-menu-header">AMK<br>CE</div>
            <a href="tech_stack.html" class="floating-item">
                <span style="font-family: 'JetBrains Mono'; font-size: 1.1rem; margin-bottom: 2px;">01</span>
                스택
            </a>
            <a href="project_artifacts.html" class="floating-item">
                <span style="font-family: 'JetBrains Mono'; font-size: 1.1rem; margin-bottom: 2px;">02</span>
                산출물
            </a>
            <a href="community.html" class="floating-item">
                <span style="font-family: 'JetBrains Mono'; font-size: 1.1rem; margin-bottom: 2px;">03</span>
                게시판
            </a>
            <a href="links.html" class="floating-item">
                <span style="font-family: 'JetBrains Mono'; font-size: 1.1rem; margin-bottom: 2px;">04</span>
                링크
            </a>
            <a href="#" class="floating-item top-btn" onclick="window.scrollTo({top:0, behavior:'smooth'}); return false;">
                TOP
            </a>
        `;
        document.body.appendChild(floatingMenu);
    }
});

// Semester Tab Switching
function showSemester(semesterId) {
    // Hide all semester contents
    const contents = document.querySelectorAll('.semester-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected content and activate button
    document.getElementById(semesterId).classList.add('active');
    event.currentTarget.classList.add('active');
}

