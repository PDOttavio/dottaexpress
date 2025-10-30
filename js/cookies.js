/**
 * Sistema de gestión de cookies conforme a RGPD/LOPD
 * Obligatorio en España según la Ley de Servicios de la Sociedad de la Información (LSSI)
 */

(function() {
    'use strict';

    // Configuración
    const COOKIE_NAME = 'dotta_cookie_consent';
    const COOKIE_DURATION = 365; // días
    
    // Elementos del DOM
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');

    /**
     * Establece una cookie
     */
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
    }

    /**
     * Obtiene el valor de una cookie
     */
    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        
        for(let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    /**
     * Elimina una cookie
     */
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    /**
     * Muestra el banner de cookies
     */
    function showCookieBanner() {
        if (cookieBanner) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 500);
        }
    }

    /**
     * Oculta el banner de cookies
     */
    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
    }

    /**
     * Acepta las cookies
     */
    function acceptCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_DURATION);
        hideCookieBanner();
        
        // Aquí puedes inicializar servicios de terceros
        initThirdPartyServices();
        
        // Mensaje de confirmación (opcional)
        console.log('Cookies aceptadas - Servicios de terceros habilitados');
    }

    /**
     * Rechaza las cookies
     */
    function rejectCookies() {
        setCookie(COOKIE_NAME, 'rejected', COOKIE_DURATION);
        hideCookieBanner();
        
        // Eliminar cookies de terceros si existen
        removeThirdPartyCookies();
        
        console.log('Cookies rechazadas - Solo cookies esenciales');
    }

    /**
     * Inicializa servicios de terceros (Google Analytics, etc.)
     */
    function initThirdPartyServices() {
        // Ejemplo: Google Analytics
        // Descomenta y añade tu ID de seguimiento
        /*
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'TU-ID-DE-ANALYTICS');
        */

        // Ejemplo: Facebook Pixel
        /*
        !function(f,b,e,v,n,t,s){...}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'TU-PIXEL-ID');
        fbq('track', 'PageView');
        */

        // Ejemplo: Hotjar
        /*
        (function(h,o,t,j,a,r){...})(window,document,
        'https://static.hotjar.com/c/hotjar-','.js?sv=');
        */
    }

    /**
     * Elimina cookies de terceros
     */
    function removeThirdPartyCookies() {
        // Eliminar cookies de Google Analytics
        deleteCookie('_ga');
        deleteCookie('_gat');
        deleteCookie('_gid');
        
        // Añade aquí otras cookies de terceros que uses
    }

    /**
     * Verifica el estado del consentimiento
     */
    function checkConsentStatus() {
        const consent = getCookie(COOKIE_NAME);
        
        if (consent === 'accepted') {
            initThirdPartyServices();
            return 'accepted';
        } else if (consent === 'rejected') {
            return 'rejected';
        } else {
            showCookieBanner();
            return 'pending';
        }
    }

    /**
     * Permite revocar el consentimiento
     */
    function revokeCookies() {
        deleteCookie(COOKIE_NAME);
        removeThirdPartyCookies();
        showCookieBanner();
    }

    // Exponer función global para revocar consentimiento
    window.revokeCookieConsent = revokeCookies;

    // Event Listeners
    if (acceptBtn) {
        acceptBtn.addEventListener('click', acceptCookies);
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', rejectCookies);
    }

    // Inicialización cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkConsentStatus);
    } else {
        checkConsentStatus();
    }

    // Cerrar banner con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cookieBanner && cookieBanner.classList.contains('show')) {
            // No cerrar automáticamente, el usuario debe decidir
            acceptBtn.focus();
        }
    });

})();