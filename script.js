// --- Nav toggle ---
const hamburger = document.querySelector('.hamburger');
const navRight = document.querySelector('.nav-right');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navRight.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navRight.classList.remove('open');
        });
    });
}

// --- Scroll reveal ---
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// --- Gallery filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.g-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach(card => {
            if (f === 'all' || card.dataset.category === f) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
let lbIndex = 0;

function visibleCards() {
    return [...cards].filter(c => !c.classList.contains('hidden'));
}

function openLb(i) {
    const vis = visibleCards();
    lbIndex = i;
    const card = vis[lbIndex];
    if (!card) return;
    lbImg.src = card.querySelector('img').src;
    lbCaption.textContent = card.querySelector('.g-overlay span')?.textContent || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

cards.forEach(card => {
    card.addEventListener('click', () => {
        const vis = visibleCards();
        openLb(vis.indexOf(card));
    });
});

document.querySelector('.lb-close')?.addEventListener('click', closeLb);
document.querySelector('.lb-prev')?.addEventListener('click', () => {
    const vis = visibleCards();
    lbIndex = (lbIndex - 1 + vis.length) % vis.length;
    openLb(lbIndex);
});
document.querySelector('.lb-next')?.addEventListener('click', () => {
    const vis = visibleCards();
    lbIndex = (lbIndex + 1) % vis.length;
    openLb(lbIndex);
});

lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { const v = visibleCards(); lbIndex = (lbIndex - 1 + v.length) % v.length; openLb(lbIndex); }
    if (e.key === 'ArrowRight') { const v = visibleCards(); lbIndex = (lbIndex + 1) % v.length; openLb(lbIndex); }
});

// --- Contact form validation ---
const form = document.getElementById('contact-form');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;

        const name = document.getElementById('name');
        const nameErr = document.getElementById('name-error');
        if (!name.value.trim()) { err(name, nameErr, 'Name is required'); ok = false; }
        else clear(name, nameErr);

        const email = document.getElementById('email');
        const emailErr = document.getElementById('email-error');
        const pat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) { err(email, emailErr, 'Email is required'); ok = false; }
        else if (!pat.test(email.value)) { err(email, emailErr, 'Enter a valid email'); ok = false; }
        else clear(email, emailErr);

        const msg = document.getElementById('message');
        const msgErr = document.getElementById('message-error');
        if (!msg.value.trim()) { err(msg, msgErr, 'Message is required'); ok = false; }
        else clear(msg, msgErr);

        if (ok) {
            alert('Thanks for reaching out! I\'ll get back to you soon.');
            form.reset();
        }
    });

    ['name','email','message'].forEach(id => {
        const el = document.getElementById(id);
        const er = document.getElementById(id + '-error');
        el?.addEventListener('input', () => clear(el, er));
    });
}

function err(el, span, msg) { el.classList.add('invalid'); span.textContent = msg; }
function clear(el, span) { el.classList.remove('invalid'); span.textContent = ''; }
