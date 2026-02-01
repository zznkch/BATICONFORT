// script.js - Version ultra-optimisée et moderne
'use strict';

class BaticonfortApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadHandler();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupPortfolioFilters();
        this.setupImageModal();
        this.setupAnimations();
        this.setupPerformance();
    }

    setupLoadHandler() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
        } else {
            this.onDOMLoaded();
        }
    }

    onDOMLoaded() {
        // Hide loader
        requestAnimationFrame(() => {
            setTimeout(() => {
                const loader = document.querySelector('.loader');
                if (loader) {
                    loader.classList.add('hidden');
                    setTimeout(() => loader.remove(), 500);
                }
            }, 800);
        });

        // Initialize components
        this.initCounters();
        this.initLazyImages();
    }

    setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;

    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
        menuToggle.setAttribute('aria-expanded', isActive);
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

    setupScrollEffects() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        const backToTop = document.querySelector('.back-to-top');

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            // Navbar scroll effect
            if (navbar) {
                if (currentScroll > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                if (currentScroll > lastScroll && currentScroll > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            // Back to top button
            if (backToTop) {
                if (currentScroll > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }

            lastScroll = currentScroll;
        };

        // Debounce scroll handler
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Back to top functionality
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = value.replace(/(\d{2})(?=\d)/, '$1 ');
            if (value.length > 5) value = value.replace(/(\d{2})(\d{2})(?=\d)/, '$1 $2 ');
            if (value.length > 8) value = value.replace(/(\d{2})(\d{2})(\d{2})(?=\d)/, '$1 $2 $3 ');
            e.target.value = value.substring(0, 14);
        });
    }

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validation
        const errors = this.validateFormData(data);
        if (errors.length) {
            this.showNotification(errors.join('<br>'), 'error');
            return;
        }

        // Submit state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Préparation du mail...';
        submitBtn.disabled = true;

        // Construction de l'email
        const subject = encodeURIComponent(`Demande de devis - ${data.name} - ${data.service}`);
        
        const body = encodeURIComponent(`
Bonjour BATICONFORT,

Je vous contacte suite à ma demande de devis sur votre site web.

INFORMATIONS CLIENT :
- Nom : ${data.name}
- Email : ${data.email}
- Téléphone : ${data.phone}
- Ville : ${data.city}

DÉTAILS DU PROJET :
- Type de travaux : ${data.service}
- Surface : ${data.surface}
- Description : ${data.message}

Cordialement,
${data.name}
        `.trim());

        // Ouvrir l'application de messagerie par défaut
        const mailtoLink = `mailto:bati_confort@outlook.fr?subject=${subject}&body=${body}`;
        
        // Afficher une notification
        this.showNotification(
            `✅ <strong>Formulaire validé !</strong><br><br>
            Votre application de messagerie va s'ouvrir automatiquement.<br>
            Il ne vous reste plus qu'à cliquer sur "Envoyer".`,
            'success'
        );

        // Ouvrir le client mail après un court délai
        setTimeout(() => {
            window.location.href = mailtoLink;
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Réactiver le bouton après un délai supplémentaire
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Afficher un message de confirmation
                this.showNotification(
                    `📧 <strong>Email préparé avec succès !</strong><br><br>
                    Si votre application de messagerie ne s'est pas ouverte :<br>
                    • Vérifiez votre bloqueur de popups<br>
                    • Envoyez un email à <strong>bati_confort@outlook.fr</strong><br>
                    • Appelez-nous au <strong>07 71 61 46 57</strong>`,
                    'info'
                );
            }, 2000);
        }, 1500);

        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'Contact',
                'event_label': 'Formulaire de contact'
            });
        }
    });
}

    validateFormData(data) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9\s]{10,14}$/;

        if (!data.name?.trim() || data.name.trim().length < 2) {
            errors.push("Le nom doit contenir au moins 2 caractères");
        }

        if (!data.email || !emailRegex.test(data.email)) {
            errors.push("Veuillez entrer une adresse email valide");
        }

        if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.push("Le numéro de téléphone doit contenir 10 chiffres");
        }

        if (!data.city?.trim() || data.city.trim().length < 2) {
            errors.push("Veuillez entrer votre ville");
        }

        if (!data.service) {
            errors.push("Veuillez sélectionner un type de travaux");
        }

        if (!data.message?.trim() || data.message.trim().length < 10) {
            errors.push("La description doit contenir au moins 10 caractères");
        }

        if (!data.surface) {
            errors.push("Veuillez estimer la surface à traiter");
        }

        if (!data.consent) {
            errors.push("Veuillez accepter la politique de confidentialité");
        }

        return errors;
    }

    setupPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (!filterButtons.length || !portfolioItems.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.dataset.filter;

                // Filter items with animation
                portfolioItems.forEach(item => {
                    const matches = filterValue === 'all' || item.dataset.category === filterValue;
                    
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        item.style.display = matches ? 'block' : 'none';
                        
                        if (matches) {
                            requestAnimationFrame(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            });
                        }
                    }, 200);
                });
            });
        });
    }

    setupImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.getElementById('modalClose');
        const portfolioImages = document.querySelectorAll('.portfolio-image');

        if (!modal || !modalImage || !modalClose) return;

        const openModal = (src, alt) => {
            modalImage.src = src;
            modalImage.alt = alt;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        // Open modal on image click
        portfolioImages.forEach(img => {
            img.addEventListener('click', () => openModal(img.src, img.alt));
        });

        // Close modal
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close with escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.service-card, .team-member, .value-card, .portfolio-item, .guarantee-card').forEach(el => {
            observer.observe(el);
        });

        // Animate stats on index page
        this.initCounters();
    }

    initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const target = parseInt(stat.textContent);
                    let current = 0;
                    const increment = target / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                        }
                    }, 30);
                    
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    initLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (!lazyImages.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    setupPerformance() {
        // Preload critical images
        const criticalImages = document.querySelectorAll('.profile-image, .service-detail-image img');
        criticalImages.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const preload = document.createElement('link');
                preload.rel = 'preload';
                preload.as = 'image';
                preload.href = src;
                document.head.appendChild(preload);
            }
        });

        // Handle image errors
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f8f9fa"/><text x="50%" y="50%" font-family="Montserrat" font-size="18" fill="%237f8c8d" text-anchor="middle" dy=".3em">BATICONFORT Plâtrerie</text></svg>';
                this.alt = 'Image BATICONFORT';
                this.classList.add('image-error');
            });
        });

        // Performance monitoring
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(`Performance: ${Math.round(perfData.loadEventEnd - perfData.startTime)}ms`);
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
                <div class="notification-text">${message}</div>
            </div>
            <button class="notification-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
        `;

        // Add styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .custom-notification {
                    position: fixed;
                    top: clamp(80px, 12vw, 120px);
                    right: clamp(20px, 3vw, 30px);
                    background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
                    color: white;
                    padding: clamp(20px, 3vw, 25px);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-hover);
                    z-index: 9999;
                    max-width: min(450px, 90vw);
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: clamp(15px, 2vw, 20px);
                    animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                .notification-content {
                    display: flex;
                    align-items: flex-start;
                    gap: clamp(15px, 2vw, 20px);
                    flex: 1;
                }
                
                .notification-content i {
                    font-size: clamp(1.5rem, 2vw, 1.8rem);
                    margin-top: 2px;
                    flex-shrink: 0;
                }
                
                .notification-text {
                    flex: 1;
                    font-size: clamp(0.95rem, 1.2vw, 1.05rem);
                    line-height: 1.6;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: clamp(1rem, 1.3vw, 1.2rem);
                    padding: 5px;
                    opacity: 0.7;
                    transition: opacity 0.3s;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                @media (max-width: 768px) {
                    .custom-notification {
                        top: auto;
                        bottom: clamp(20px, 3vw, 30px);
                        right: clamp(15px, 2vw, 20px);
                        left: clamp(15px, 2vw, 20px);
                        max-width: none;
                        animation: slideInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    
                    @keyframes slideInUp {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    @keyframes slideOutDown {
                        from { transform: translateY(0); opacity: 1; }
                        to { transform: translateY(100%); opacity: 0; }
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto close
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize app
if (typeof window !== 'undefined') {
    window.baticonfortApp = new BaticonfortApp();
}