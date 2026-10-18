// ============================
// KODAM XXIX/MAMBRUK — SUPER PREMIUM Interactive Scripts
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // --- Live Military Clock (WIT - Waktu Indonesia Timur / UTC+9) ---
    function updateLiveClock() {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        let timeStr = '';
        let dateStr = '';

        try {
            const timeFormatter = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Jayapura',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            timeStr = timeFormatter.format(now);

            const parts = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Jayapura',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).formatToParts(now);

            let dayName = '', dayNum = '', monthName = '', yearNum = '';
            parts.forEach(p => {
                if (p.type === 'weekday') dayName = p.value;
                if (p.type === 'day') dayNum = p.value;
                if (p.type === 'month') monthName = p.value;
                if (p.type === 'year') yearNum = p.value;
            });
            dateStr = `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
        } catch (e) {
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const wit = new Date(utc + (9 * 3600000));
            const hh = String(wit.getHours()).padStart(2, '0');
            const mm = String(wit.getMinutes()).padStart(2, '0');
            const ss = String(wit.getSeconds()).padStart(2, '0');
            timeStr = `${hh}:${mm}:${ss}`;
            dateStr = `${days[wit.getDay()]}, ${wit.getDate()} ${months[wit.getMonth()]} ${wit.getFullYear()}`;
        }

        const navTimes = document.querySelectorAll('.nav-clock-time, #navClockTime');
        for (let i = 0; i < navTimes.length; i++) {
            navTimes[i].textContent = timeStr;
        }

        const heroDisplays = document.querySelectorAll('.hero-clock-display, #heroClock, .hud-clock-time');
        for (let i = 0; i < heroDisplays.length; i++) {
            heroDisplays[i].textContent = timeStr;
        }

        const heroDates = document.querySelectorAll('.hero-clock-date, #heroClockDate');
        for (let i = 0; i < heroDates.length; i++) {
            heroDates[i].textContent = dateStr;
        }
    }

    // Jalankan segera dan set interval tiap detik
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // --- Preloader with Typing Effect (Safe Null Check) ---
    const preloader = document.getElementById('preloader');
    const preloaderTyping = document.getElementById('preloaderTyping');
    const preloaderBar = document.getElementById('preloaderBar');

    if (preloader && preloaderTyping && preloaderBar) {
        const preloaderText = 'KODAM XXIX / MAMBRUK';
        let charIndex = 0;
        let progress = 0;

        const typeText = () => {
            if (charIndex < preloaderText.length) {
                preloaderTyping.textContent += preloaderText[charIndex];
                charIndex++;
                setTimeout(typeText, 60 + Math.random() * 40);
            }
        };

        typeText();

        const progressInterval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress > 100) progress = 100;
            preloaderBar.style.width = progress + '%';
            if (progress >= 100) clearInterval(progressInterval);
        }, 100);

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 2200);
        });

        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 4000);
    }

    // --- Custom Cursor Glow (Safe Null Check) ---
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const isInnerPage = document.body.classList.contains('inner-page');

    const handleScroll = () => {
        if (window.scrollY > 80 || isInnerPage) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking for single-page index hash sections
        if (!isInnerPage) {
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            if (current) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${current}`) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Back to Top ---
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu on regular nav links and dropdown items, but not when tapping the dropdown toggle on mobile
        navLinks.forEach(link => {
            if (!link.classList.contains('nav-dropdown-toggle')) {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                });
            }
        });

        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // --- Smooth Scroll for Internal Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- Hero Particles (Enhanced Safe Null Check) ---
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${5 + Math.random() * 8}s`;
            const size = 1 + Math.random() * 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Counter Animation with Progress Rings ---
    const counters = document.querySelectorAll('.stat-number');
    const rings = document.querySelectorAll('.stat-ring-fill');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        const statsBar = document.querySelector('.stats-bar');
        if (!statsBar) return;
        const rect = statsBar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;

            // Animate counters
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2500;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString('id-ID');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString('id-ID');
                    }
                };

                updateCounter();
            });

            // Animate progress rings
            rings.forEach(ring => {
                const percent = parseInt(ring.getAttribute('data-percent'));
                const circumference = 2 * Math.PI * 42; // r=42
                const offset = circumference - (percent / 100) * circumference;
                ring.style.strokeDashoffset = offset;
                ring.classList.add('animated');
            });
        }
    };

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.about-card, .unit-card, .news-card, .gallery-item, .contact-item, .contact-form-wrapper, .stat-item, .timeline-item'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${(index % 4) * 120}ms`;
        observer.observe(el);
    });

    // --- Reveal Text Animation ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.reveal-text').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            btn.innerHTML = `
                <span>Pesan Terkirim!</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            btn.style.background = 'linear-gradient(135deg, var(--green-neon), var(--teal-neon))';
            btn.style.boxShadow = '0 4px 30px rgba(0,230,118,0.3)';

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.style.boxShadow = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // --- Hero Shield 3D Parallax ---
    window.addEventListener('mousemove', (e) => {
        const heroShield = document.querySelector('.hero-shield');
        if (!heroShield) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        heroShield.style.transform = `translateY(${-12 + y * 0.4}px) rotateY(${x * 0.8}deg) rotateX(${-y * 0.8}deg)`;
    });

    // --- Gallery 3D Tilt Effect ---
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
            item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // --- Card 3D Tilt for Glass Cards ---
    document.querySelectorAll('.about-card, .unit-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
            card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px) scale(1.01)`;

            // Move glow
            const glow = card.querySelector('.card-glow');
            if (glow) {
                const glowX = ((e.clientX - rect.left) / rect.width) * 100;
                glow.style.background = `linear-gradient(90deg, transparent, rgba(0,230,118,${0.1 + (glowX / 500)}) ${glowX}%, transparent)`;
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '';
                glow.style.background = '';
            }
        });
    });

    // --- HUD Coordinate Animation ---
    const hudLat = document.getElementById('hudLat');
    const hudLong = document.getElementById('hudLong');

    if (hudLat && hudLong) {
        setInterval(() => {
            const latVariation = (-0.8615 + (Math.random() - 0.5) * 0.002).toFixed(4);
            const longVariation = (134.0620 + (Math.random() - 0.5) * 0.002).toFixed(4);
            hudLat.textContent = latVariation;
            hudLong.textContent = longVariation;
        }, 2000);
    }

    // --- Section Parallax Scroll ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.section-blob').forEach(blob => {
            const speed = 0.03;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });

    // --- CTA Section Particles ---
    const ctaParticles = document.getElementById('ctaParticles');
    if (ctaParticles) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 6}s`;
            const size = 1 + Math.random() * 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            ctaParticles.appendChild(particle);
        }
    }

    // --- Magnetic Effect on Buttons ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            btn.style.transform = `translateY(-3px) translate(${x}px, ${y}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // --- Smooth Navbar Link Hover (underline sweep) ---
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // --- Parallax orbs on scroll ---
    const orbs = document.querySelectorAll('.floating-orb');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.05;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });

    // --- Section header tags animation ---
    const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s var(--ease-out) forwards';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-tag').forEach(tag => {
        tag.style.opacity = '0';
        tagObserver.observe(tag);
    });
});

