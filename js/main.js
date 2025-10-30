/**
 * JavaScript principal - DOTTA Mensajería
 */

(function() {
    'use strict';

    // ========================
    // Configuración
    // ========================
    const CONFIG = {
        whatsappNumber: '34900000000', // Cambiar por número real
        phoneNumber: '+34900000000',   // Cambiar por número real
        scrollOffset: 80
    };

    // ========================
    // Smooth Scroll para enlaces internos
    // ========================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorar # solo
                if (href === '#' || href === '#!') {
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const targetPosition = target.offsetTop - CONFIG.scrollOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Cerrar navbar en móvil
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });
        });
    }

    // ========================
    // Navbar transparente al hacer scroll
    // ========================
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================
    // Animación de números (contadores)
    // ========================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60 FPS
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }

    // ========================
    // Intersection Observer para animaciones
    // ========================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Animar contadores si tienen la clase counter
                    if (entry.target.classList.contains('stat-box')) {
                        const counterElement = entry.target.querySelector('h3');
                        const targetValue = parseInt(counterElement.textContent);
                        if (!isNaN(targetValue)) {
                            animateCounter(counterElement, targetValue);
                        }
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos con animaciones
        document.querySelectorAll('.service-card, .process-card, .feature-item, .stat-box').forEach(el => {
            observer.observe(el);
        });
    }

    // ========================
    // Formulario de contacto
    // ========================
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Aquí puedes enviar los datos a tu backend
            // Por ahora, simulamos el envío
            
            // Mostrar mensaje de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            submitBtn.disabled = true;

            // Simular envío (reemplazar con tu lógica real)
            setTimeout(() => {
                alert('¡Gracias por contactarnos! Te responderemos pronto.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });
        });
    }

    // ========================
    // WhatsApp: Abrir chat con mensaje predefinido
    // ========================
    function initWhatsAppButton() {
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Mensaje predefinido
                const defaultMessage = encodeURIComponent('Hola, me gustaría solicitar información sobre sus servicios de mensajería.');
                const currentHref = this.getAttribute('href');
                
                // Si no tiene parámetro de texto, añadirlo
                if (!currentHref.includes('?text=')) {
                    this.setAttribute('href', currentHref + '?text=' + defaultMessage);
                }
            });
        });
    }

    // ========================
    // Click en teléfono (Analytics)
    // ========================
    function initPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Llamada telefónica iniciada:', this.getAttribute('href'));
                // Aquí puedes enviar evento a Google Analytics si lo tienes configurado
                // gtag('event', 'click', { 'event_category': 'phone', 'event_label': 'call' });
            });
        });
    }

    // ========================
    // Lazy loading de imágenes
    // ========================
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // El navegador soporta lazy loading nativo
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback para navegadores antiguos
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ========================
    // Botón volver arriba
    // ========================
    function initScrollToTop() {
        // Crear botón si no existe
        let scrollTopBtn = document.getElementById('scrollTopBtn');
        
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scrollTopBtn';
            scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollTopBtn.className = 'scroll-to-top';
            scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
            document.body.appendChild(scrollTopBtn);

            // Estilos inline (o añadirlos a CSS)
            Object.assign(scrollTopBtn.style, {
                position: 'fixed',
                bottom: '100px',
                right: '30px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                zIndex: '999',
                transition: 'all 0.3s ease',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            });
        }

        // Mostrar/ocultar según scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        // Click para subir
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================
    // Prevenir envío de formularios vacíos
    // ========================
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }

    // ========================
    // Inicialización
    // ========================
    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        console.log('DOTTA Website - Inicializando...');
        
        initSmoothScroll();
        initNavbarScroll();
        initScrollAnimations();
        initContactForm();
        initWhatsAppButton();
        initPhoneTracking();
        initLazyLoading();
        initScrollToTop();
        initFormValidation();
        
        console.log('DOTTA Website - Listo ✓');
    }

    // Iniciar
    init();

    // ========================
    // Exponer funciones globales si es necesario
    // ========================
    window.DOTTA = {
        config: CONFIG,
        refreshAnimations: initScrollAnimations
    };

})();