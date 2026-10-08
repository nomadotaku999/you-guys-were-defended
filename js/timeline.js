// ============================================================
// 사건 연대기 - timeline.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. 아이템 reveal (스크롤 진입 시 등장) ─────────────
    const revealEls = document.querySelectorAll('.reveal-tl');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    // ── 2. 중앙 스파인 채우기 (스크롤 진행률 따라 골드 라인 증가) ──
    const spine = document.getElementById('timelineSpine');
    const spineFill = document.getElementById('spineFill');
    const timelineSection = document.querySelector('.timeline');

    if (spine && spineFill && timelineSection) {
        const updateSpine = () => {
            const rect = timelineSection.getBoundingClientRect();
            const sectionHeight = timelineSection.offsetHeight;
            const viewportH = window.innerHeight;

            // 섹션이 화면에 들어온 비율 계산
            const scrolled = viewportH - rect.top;
            const progress = Math.min(Math.max(scrolled / sectionHeight, 0), 1);

            spineFill.style.height = (progress * 100) + '%';
        };

        window.addEventListener('scroll', updateSpine, { passive: true });
        window.addEventListener('resize', updateSpine);
        updateSpine();
    }

});
