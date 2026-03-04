// ===== Hamburger Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

// ===== Scroll Animations (Intersection Observer) =====
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => observer.observe(el));

// ===== Gallery Category Filter =====
const filterButtons = document.querySelectorAll('.filter-btn');
const photoCards = document.querySelectorAll('.photo-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Show/hide photos with animation
        photoCards.forEach((card) => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentPhotoIndex = 0;
let visiblePhotos = [];

function getVisiblePhotos() {
    return Array.from(photoCards).filter(card => !card.classList.contains('hidden'));
}

function openLightbox(index) {
    visiblePhotos = getVisiblePhotos();
    currentPhotoIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    const card = visiblePhotos[currentPhotoIndex];
    if (!card) return;
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('.handwritten')?.textContent || '';

    lightboxImg.src = imgSrc;
    if (lightboxCaption) {
        lightboxCaption.textContent = title;
    }
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    updateLightboxImage();
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % visiblePhotos.length;
    updateLightboxImage();
}

// Open lightbox when clicking a photo card
photoCards.forEach((card) => {
    card.addEventListener('click', () => {
        const visible = getVisiblePhotos();
        const visibleIndex = visible.indexOf(card);
        openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
});

// Lightbox controls
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);
if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);

// Close lightbox by clicking outside image
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
});

// ===== Contact Form Validation =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate Name
        const name = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        if (name.value.trim() === '') {
            showError(name, nameError, 'please enter your name!');
            isValid = false;
        } else {
            clearError(name, nameError);
        }

        // Validate Email
        const email = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError(email, emailError, 'please enter your email!');
            isValid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            showError(email, emailError, 'hmm, that doesn\'t look like a valid email');
            isValid = false;
        } else {
            clearError(email, emailError);
        }

        // Validate Message
        const message = document.getElementById('message');
        const messageError = document.getElementById('message-error');
        if (message.value.trim() === '') {
            showError(message, messageError, 'don\'t forget to write a message!');
            isValid = false;
        } else {
            clearError(message, messageError);
        }

        // If all valid, show success
        if (isValid) {
            alert('Thanks for reaching out! I\'ll get back to you soon :)');
            contactForm.reset();
        }
    });

    // Clear error on input
    ['name', 'email', 'message'].forEach(id => {
        const input = document.getElementById(id);
        const error = document.getElementById(id + '-error');
        if (input) {
            input.addEventListener('input', () => clearError(input, error));
        }
    });
}

function showError(input, errorSpan, message) {
    input.classList.add('invalid');
    errorSpan.textContent = message;
}

function clearError(input, errorSpan) {
    input.classList.remove('invalid');
    errorSpan.textContent = '';
}

// ===== Random slight rotation on polaroid gallery cards =====
document.querySelectorAll('.polaroid-card').forEach((card) => {
    const randomRotation = (Math.random() - 0.5) * 4; // -2 to 2 degrees
    card.style.transform = `rotate(${randomRotation}deg)`;
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'rotate(0deg) translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotate(${randomRotation}deg)`;
    });
});
