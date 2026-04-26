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

        // Schematic Arm Interaction Logic
        const schematicArm = document.querySelector('.schematic-arm');
        if (schematicArm) {
            // Overall position is fixed (parallax removed)
            schematicArm.style.transform = 'none';

            // Joint Movement Simulation
            const mouseFactorX = (e.clientX / window.innerWidth - 0.5);
            const mouseFactorY = (e.clientY / window.innerHeight - 0.5);

            const j2 = schematicArm.querySelector('.joint-l2');
            const j3 = schematicArm.querySelector('.joint-l3');
            const j4 = schematicArm.querySelector('.joint-l4');

            if (j2) j2.setAttribute('transform', `translate(150, 700) rotate(${-45 + mouseFactorX * 30 + mouseFactorY * 10})`);
            if (j3) j3.setAttribute('transform', `translate(220, 0) rotate(${-25 + mouseFactorX * 40 - mouseFactorY * 20})`);
            if (j4) j4.setAttribute('transform', `translate(200, 0) rotate(${35 + mouseFactorX * 50 + mouseFactorY * 30})`);
        }
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
            schematicSvg.setAttribute('viewBox', '0 0 1000 1000');
            schematicSvg.setAttribute('fill', 'none');
            
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.innerHTML = `
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(0, 229, 255, 0.5)" />
                </marker>
            `;
            schematicSvg.appendChild(defs);

            schematicSvg.innerHTML += `
                <!-- Coordinate Axes -->
                <g stroke="rgba(255, 255, 255, 0.2)" stroke-width="2">
                    <line x1="150" y1="850" x2="450" y2="850" marker-end="url(#arrow)" />
                    <line x1="150" y1="850" x2="150" y2="550" marker-end="url(#arrow)" />
                </g>
                <text x="465" y="855" fill="rgba(255, 255, 255, 0.5)" font-family="JetBrains Mono" font-size="24">X</text>
                <text x="135" y="535" fill="rgba(255, 255, 255, 0.5)" font-family="JetBrains Mono" font-size="24">Y</text>

                <!-- Base -->
                <line x1="100" y1="850" x2="200" y2="850" stroke="rgba(255, 255, 255, 0.8)" stroke-width="8" />

                <!-- Robot Arm Hierarchical Structure -->
                <!-- Link 1 (Fixed) -->
                <rect x="135" y="700" width="30" height="150" fill="#050505" stroke="rgba(255, 255, 255, 0.3)" />
                <line x1="150" y1="700" x2="150" y2="850" stroke="rgba(255, 0, 0, 0.3)" stroke-dasharray="5 5" />
                <text x="100" y="780" fill="rgba(255, 255, 255, 0.7)" font-family="JetBrains Mono" font-size="22">L1</text>

                <!-- Joint 2 Group (Attached to end of L1) -->
                <g class="joint-l2" transform="translate(150, 700) rotate(-45)">
                    <rect x="0" y="-15" width="220" height="30" fill="#050505" stroke="rgba(255, 255, 255, 0.3)" />
                    <line x1="0" y1="0" x2="220" y2="0" stroke="rgba(255, 0, 0, 0.3)" stroke-dasharray="5 5" />
                    <text x="100" y="-30" fill="rgba(255, 255, 255, 0.7)" font-family="JetBrains Mono" font-size="22">L2</text>
                    <circle cx="0" cy="0" r="25" fill="#000" stroke="rgba(255, 255, 255, 0.8)" stroke-width="3" />

                    <!-- Joint 3 Group (Attached to end of L2) -->
                    <g class="joint-l3" transform="translate(220, 0) rotate(-25)">
                        <rect x="0" y="-15" width="200" height="30" fill="#050505" stroke="rgba(255, 255, 255, 0.3)" />
                        <line x1="0" y1="0" x2="200" y2="0" stroke="rgba(255, 0, 0, 0.3)" stroke-dasharray="5 5" />
                        <text x="100" y="-30" fill="rgba(255, 255, 255, 0.7)" font-family="JetBrains Mono" font-size="22">L3</text>
                        <circle cx="0" cy="0" r="25" fill="#000" stroke="rgba(255, 255, 255, 0.8)" stroke-width="3" />

                        <!-- Joint 4 Group (Attached to end of L3) -->
                        <g class="joint-l4" transform="translate(200, 0) rotate(35)">
                            <rect x="0" y="-15" width="180" height="30" fill="#050505" stroke="rgba(255, 255, 255, 0.3)" />
                            <line x1="0" y1="0" x2="180" y2="0" stroke="rgba(255, 0, 0, 0.3)" stroke-dasharray="5 5" />
                            <text x="90" y="-30" fill="rgba(255, 255, 255, 0.7)" font-family="JetBrains Mono" font-size="22">L4</text>
                            <circle cx="0" cy="0" r="25" fill="#000" stroke="rgba(255, 255, 255, 0.8)" stroke-width="3" />

                            <!-- End Effector -->
                            <g transform="translate(180, 0)">
                                <path d="M0 -15 L20 -15 L35 -30 M0 15 L20 15 L35 30" stroke="rgba(255, 255, 255, 0.8)" stroke-width="6" fill="none" />
                                <circle cx="35" cy="0" r="10" fill="rgba(255, 255, 255, 0.9)" />
                            </g>
                        </g>
                    </g>
                </g>


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

