// ============================================================
// 법무법인 정도 - main.js
// ============================================================
const FOUNDED_YEAR = 2011;


document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Header scroll effect ──────────────────────────────
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();


    // ── 2. Hamburger / Mobile nav ────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    hamburger.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });

    // 모바일 링크 클릭 시 닫기
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });


    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // 같은 부모의 형제들이면 stagger 적용
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.is-visible)')];
                const idx = siblings.indexOf(entry.target);
                const delay = Math.min(idx * 80, 400);

                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    const stats = document.querySelectorAll('.stat strong');

    const countUp = (el, target, suffix) => {
        const duration = 1800;
        const start = performance.now();
        const isFloat = target % 1 !== 0;

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const current = isFloat
                ? (eased * target).toFixed(1)
                : Math.floor(eased * target);
            el.innerHTML = current + `<span>${suffix}</span>`;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const statData = [
        { target: new Date().getFullYear() - FOUNDED_YEAR, suffix: '년' },
        { target: 1200, suffix: '+' },
        { target: 92, suffix: '%' },
        { target: 38, suffix: '명' },
    ];

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach((el, i) => {
                    if (statData[i]) countUp(el, statData[i].target, statData[i].suffix);
                });
                statObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) statObserver.observe(statsSection);


    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let current = 0;
    let autoInterval;

    const showTestimonial = (idx) => {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        testimonials[idx].classList.add('active');
        dots[idx].classList.add('active');
        current = idx;
    };

    const nextTestimonial = () => {
        showTestimonial((current + 1) % testimonials.length);
    };

    const startAuto = () => {
        autoInterval = setInterval(nextTestimonial, 5000);
    };

    const stopAuto = () => clearInterval(autoInterval);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(Number(dot.dataset.idx));
            stopAuto();
            startAuto();
        });
    });

    showTestimonial(0);
    startAuto();

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type=submit]');
            btn.textContent = '제출 중...';
            btn.disabled = true;

            // 실제 서버 연동 전 시뮬레이션
            setTimeout(() => {
                showToast('상담 신청이 완료되었습니다. 빠른 시일 내 연락드리겠습니다.');
                form.reset();
                btn.textContent = '상담 신청하기';
                btn.disabled = false;
            }, 1200);
        });
    }

    const showToast = (message) => {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('show'));
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__list a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.style.color = 'var(--gold, #C9A84C)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => navObserver.observe(s));


		const years = new Date().getFullYear() - FOUNDED_YEAR;

		document.querySelectorAll('.years').forEach(el => {
				el.textContent = years;
		});

		const statYearsEl = document.querySelector('.years');
		
		document.getElementById('testimonialPrev').addEventListener('click', () => {
			showTestimonial((current - 1 + testimonials.length) % testimonials.length);
			stopAuto();
			startAuto();
		});

		document.getElementById('testimonialNext').addEventListener('click', () => {
			showTestimonial((current + 1) % testimonials.length);
			stopAuto();
			startAuto();
		});
});
