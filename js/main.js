// Menu hamburger
document.querySelector('.hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('active');
});

// Animation au défilement
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .feature, .contact-container').forEach(el => {
    observer.observe(el);
});

// Gestionnaire de formulaire avec reCAPTCHA optimisé
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Exécuter reCAPTCHA uniquement lors de la soumission
        const token = await new Promise((resolve) => {
            grecaptcha.ready(() => {
                grecaptcha.execute('VOTRE_SITE_KEY', {
                    action: 'submit'
                }).then(resolve);
            });
        });

        // Vérification côté client
        if (!token) {
            throw new Error('Validation reCAPTCHA échouée');
        }

        // Reste du code de soumission...
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
});

// Fonction pour initialiser les écouteurs d'événements du formulaire
function initFormListeners() {
    // Réinitialiser les écouteurs d'événements pour le formulaire
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            // ... le code de gestion du submit ...
        });
    }

    // Réinitialiser la validation de l'email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function(e) {
            // ... le code de validation de l'email ...
        });
    }
}

// Initialiser les écouteurs au chargement de la page
document.addEventListener('DOMContentLoaded', initFormListeners);

// Validation en temps réel de l'email
document.getElementById('email').addEventListener('input', function(e) {
    const email = this.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com)(?!yahoo\.com)(?!hotmail\.com)(?!outlook\.com)(?!aol\.com)(?!mail\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (email && !emailRegex.test(email)) {
        this.setCustomValidity('Veuillez utiliser une adresse email professionnelle');
        this.classList.add('invalid-email');
    } else {
        this.setCustomValidity('');
        this.classList.remove('invalid-email');
    }
});

// Initialisation de Google Maps
function initMap() {
    // Coordonnées des bureaux
    const toulouse = { lat: 43.604652, lng: 1.444209 };
    const montreal = { lat: 45.501689, lng: -73.567256 };
    
    // Options de la carte
    const mapOptions = {
        zoom: 4,
        center: { lat: 44.0, lng: -37.0 }, // Centre entre Toulouse et Montréal
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{ "color": "#f5f5f5" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#e9e9e9" }]
            }
        ]
    };
    
    // Création de la carte
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    // Ajout des marqueurs
    new google.maps.Marker({
        position: toulouse,
        map: map,
        title: "Bureau de Toulouse",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#2196f3",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
        }
    });
    
    new google.maps.Marker({
        position: montreal,
        map: map,
        title: "Bureau de Montréal",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#2196f3",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
        }
    });
}

// Initialisation de la carte quand la page est chargée
window.initMap = initMap;

// Gestion des cookies first-party
const CookieManager = {
    // Définir un cookie first-party
    set(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure`;
    },

    // Obtenir un cookie
    get(name) {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    },

    // Supprimer un cookie
    delete(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict;Secure`;
    }
};

// Gestionnaire de consentement aux cookies
const CookieConsent = {
    init() {
        if (!localStorage.getItem('cookieConsent')) {
            this.showBanner();
        }
    },

    showBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>Nous utilisons uniquement les cookies essentiels et reCAPTCHA pour protéger notre formulaire. 
                   Aucun cookie tiers n'est utilisé pour le tracking.</p>
                <button onclick="CookieConsent.accept()">Accepter</button>
                <button onclick="CookieConsent.reject()">Refuser</button>
            </div>
        `;
        document.body.appendChild(banner);
    },

    accept() {
        localStorage.setItem('cookieConsent', 'accepted');
        this.hideBanner();
    },

    reject() {
        localStorage.setItem('cookieConsent', 'rejected');
        this.hideBanner();
    },

    hideBanner() {
        document.querySelector('.cookie-banner').remove();
    }
};

// Initialiser le gestionnaire de consentement
document.addEventListener('DOMContentLoaded', () => {
    CookieConsent.init();
});

// Gestionnaire de consentement conforme à TCF v2.0
const ConsentManager = {
    purposes: {
        analytics: {
            id: 1,
            name: 'Mesure d\'audience',
            description: 'Nous utilisons ces cookies pour analyser le trafic et améliorer notre site.',
            required: false
        },
        marketing: {
            id: 2,
            name: 'Marketing',
            description: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes.',
            required: false
        },
        functional: {
            id: 3,
            name: 'Fonctionnalités',
            description: 'Ces cookies permettent d\'améliorer les fonctionnalités du site.',
            required: false
        },
        necessary: {
            id: 4,
            name: 'Nécessaires',
            description: 'Ces cookies sont essentiels au fonctionnement du site.',
            required: true
        }
    },

    vendors: {
        google: {
            id: 'google',
            name: 'Google',
            purposes: [1, 2],
            policyUrl: 'https://policies.google.com/privacy'
        },
        plausible: {
            id: 'plausible',
            name: 'Plausible Analytics',
            purposes: [1],
            policyUrl: 'https://plausible.io/privacy'
        }
    },

    init() {
        if (!this.hasConsent()) {
            this.showConsentBanner();
        }
    },

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <h2>Paramètres de confidentialité</h2>
                <p>Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez personnaliser vos choix ci-dessous.</p>
                
                <div class="consent-purposes">
                    ${Object.values(this.purposes).map(purpose => `
                        <div class="purpose-item">
                            <label class="purpose-label">
                                <input type="checkbox" 
                                       name="purpose_${purpose.id}"
                                       ${purpose.required ? 'checked disabled' : ''}
                                       data-purpose="${purpose.id}">
                                <span>${purpose.name}</span>
                            </label>
                            <p class="purpose-description">${purpose.description}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="vendors-list">
                    <h3>Nos partenaires</h3>
                    ${Object.values(this.vendors).map(vendor => `
                        <div class="vendor-item">
                            <label class="vendor-label">
                                <input type="checkbox" 
                                       name="vendor_${vendor.id}"
                                       data-vendor="${vendor.id}">
                                <span>${vendor.name}</span>
                            </label>
                            <a href="${vendor.policyUrl}" target="_blank" rel="noopener">Politique de confidentialité</a>
                        </div>
                    `).join('')}
                </div>

                <div class="consent-actions">
                    <button class="accept-all">Tout accepter</button>
                    <button class="accept-selected">Accepter la sélection</button>
                    <button class="reject-all">Tout refuser</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        this.attachEventListeners(banner);
    },

    attachEventListeners(banner) {
        banner.querySelector('.accept-all').addEventListener('click', () => {
            this.acceptAll();
            banner.remove();
        });

        banner.querySelector('.accept-selected').addEventListener('click', () => {
            this.saveSelectedConsent(banner);
            banner.remove();
        });

        banner.querySelector('.reject-all').addEventListener('click', () => {
            this.rejectAll();
            banner.remove();
        });
    },

    acceptAll() {
        const consent = {};
        Object.keys(this.purposes).forEach(purpose => {
            consent[purpose] = true;
        });
        this.saveConsent(consent);
        this.enableServices(consent);
    },

    rejectAll() {
        const consent = {};
        Object.keys(this.purposes).forEach(purpose => {
            consent[purpose] = this.purposes[purpose].required;
        });
        this.saveConsent(consent);
        this.enableServices(consent);
    },

    saveSelectedConsent(banner) {
        const consent = {};
        banner.querySelectorAll('[data-purpose]').forEach(checkbox => {
            consent[checkbox.dataset.purpose] = checkbox.checked;
        });
        this.saveConsent(consent);
        this.enableServices(consent);
    },

    saveConsent(consent) {
        const tcData = {
            tcString: this.generateTCString(consent),
            gdprApplies: true,
            purpose: consent,
            vendor: {},
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('tcData', JSON.stringify(tcData));
        this.dispatchConsentUpdate(tcData);
    },

    generateTCString(consent) {
        // Génération d'un TC String conforme à TCF v2.0
        // Cette implémentation est simplifiée
        return btoa(JSON.stringify(consent));
    },

    dispatchConsentUpdate(tcData) {
        window.__tcfapi('setConsent', 2, () => {}, tcData);
    },

    hasConsent() {
        return localStorage.getItem('tcData') !== null;
    },

    enableServices(consent) {
        if (consent.analytics) {
            this.enableAnalytics();
        }
        if (consent.marketing) {
            this.enableMarketing();
        }
        // Activer d'autres services selon le consentement
    },

    enableAnalytics() {
        // Initialisation de l'analytics avec respect du consentement
        const script = document.createElement('script');
        script.src = '/js/analytics.js';
        script.setAttribute('data-respect-dnt', 'true');
        script.setAttribute('data-domains', window.location.hostname);
        document.head.appendChild(script);
    },

    enableMarketing() {
        // Initialisation des services marketing avec respect du consentement
    }
};

// Initialisation du TCF
window.__tcfapi = window.__tcfapi || function() {
    (window.__tcfapi.a = window.__tcfapi.a || []).push(arguments);
};

// Initialisation du gestionnaire de consentement
document.addEventListener('DOMContentLoaded', () => {
    ConsentManager.init();
});

// Mise à jour du cookie consent existant
window.cookieconsent.initialise({
    palette: {
        popup: { background: "#0b2a60" },
        button: { background: "#2196f3" }
    },
    type: 'opt-in',
    position: 'bottom-right',
    content: {
        message: "Nous utilisons uniquement des cookies essentiels",
        dismiss: "Accepter",
        deny: "Refuser",
        link: "En savoir plus",
        href: "/politique-confidentialite",
        policy: "Politique de cookies"
    },
    onInitialise: function(status) {
        if (status === 'allow') CookieConsent.accept();
        if (status === 'deny') CookieConsent.reject();
    },
    onStatusChange: function(status) {
        if (status === 'allow') CookieConsent.accept();
        if (status === 'deny') CookieConsent.reject();
    }
});

// Utiliser des fonctions modernes et éviter jQuery
const init = () => {
    // Délégation d'événements
    document.body.addEventListener('click', (e) => {
        // Gestion du menu
        if (e.target.closest('.hamburger')) {
            toggleMenu();
        }
        
        // Autres gestionnaires...
    });
};

// Chargement différé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Lazy loading des images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback pour les navigateurs plus anciens
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});

// Optimisation des animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
});

// Gestionnaire global des erreurs
window.onerror = function(msg, url, lineNo, columnNo, error) {
    // Ne pas logger les erreurs de ressources en production
    if (!url && !lineNo) return;
    
    console.error({
        message: msg,
        source: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    
    return false;
};

// Gestionnaire pour les erreurs de ressources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
        console.warn(`Erreur de chargement de la ressource: ${e.target.src || e.target.href}`);
        
        // Réessayer de charger les ressources critiques
        if (e.target.getAttribute('data-critical') === 'true') {
            retryLoadResource(e.target);
        }
    }
}, true);

// Fonction pour réessayer le chargement
function retryLoadResource(element, maxRetries = 3) {
    let retries = 0;
    const src = element.src || element.href;
    
    function attempt() {
        if (retries >= maxRetries) {
            console.error(`Échec du chargement après ${maxRetries} tentatives:`, src);
            return;
        }
        
        retries++;
        const newElement = element.cloneNode(true);
        newElement.onerror = attempt;
        element.parentNode.replaceChild(newElement, element);
    }
    
    attempt();
}

// Vérification des ressources critiques
function checkCriticalResources() {
    // Vérifier Font Awesome
    if (!document.querySelector('.fa')) {
        loadFontAwesome();
    }
    
    // Vérifier le CSS principal
    if (!document.querySelector('link[href*="main.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles/main.min.css';
        link.setAttribute('data-critical', 'true');
        document.head.appendChild(link);
    }
}

// Chargement sécurisé de Font Awesome
function loadFontAwesome() {
    const styles = [
        'fontawesome.min.css',
        'solid.min.css',
        'brands.min.css'
    ];
    
    styles.forEach(style => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/${style}`;
        link.setAttribute('data-critical', 'true');
        link.onerror = () => retryLoadResource(link);
        document.head.appendChild(link);
    });
}

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
        checkCriticalResources();
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
    }
});

// Nettoyage des erreurs de console
console.clear = function() {
    // Empêcher le nettoyage de la console en production
    if (process.env.NODE_ENV === 'production') return;
    console.clear.apply(console, arguments);
};

// Gestionnaire pour les promesses rejetées
window.addEventListener('unhandledrejection', function(event) {
    console.warn('Promesse rejetée non gérée:', event.reason);
    event.preventDefault();
});

// Gestion optimisée des WebSockets
let ws;

function initWebSocket() {
    if (!ws && window.isActive) {
        ws = new WebSocket('wss://your-server.com');
        
        ws.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
        };

        ws.onclose = (event) => {
            console.warn('WebSocket fermé:', event.code, event.reason);
            ws = null;
            if (window.isActive) {
                setTimeout(initWebSocket, 3000);
            }
        };
    }
}

// Gestion du cycle de vie de la page
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Fermer proprement le WebSocket quand la page est cachée
        if (ws) {
            ws.close();
            ws = null;
        }
    } else if (document.visibilityState === 'visible') {
        // Réinitialiser la connexion quand la page redevient visible
        initWebSocket();
    }
});

// Gestion du bfcache
window.addEventListener('pageshow', (event) => {
    window.isActive = true;
    if (event.persisted) {
        // La page a été restaurée depuis le bfcache
        initWebSocket();
    }
});

window.addEventListener('pagehide', () => {
    window.isActive = false;
    if (ws) {
        ws.close();
        ws = null;
    }
});

// Gestion optimisée des ressources
document.addEventListener('DOMContentLoaded', () => {
    // Nettoyer les ressources non essentielles
    window.addEventListener('pagehide', () => {
        // Arrêter les animations
        document.querySelectorAll('.animating').forEach(el => {
            el.classList.remove('animating');
        });
        
        // Arrêter les timers
        clearAllTimers();
        
        // Fermer les connexions
        closeAllConnections();
    });
});

function clearAllTimers() {
    // Votre code pour nettoyer les timers
}

function closeAllConnections() {
    // Votre code pour fermer les connexions
} 