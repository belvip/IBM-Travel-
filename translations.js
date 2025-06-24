// Multi-language translations
const translations = {
    en: {
        home: "Home",
        about: "About",
        contact: "Contact",
        explore: "Explore",
        dream: "Dream",
        destination: "Destination",
        paragraph: "It encourages exploration of unfamiliar territories, embracing diverse cultures and landscapes, while pursuing the desired destination that captivates the heart and ignites a sense of wonder.",
        bookNow: "Book Now",
        currency: "Currency",
        searchPlaceholder: "Search destinations",
        search: "Search",
        clear: "Clear"
    },
    fr: {
        home: "Accueil",
        about: "À propos",
        contact: "Contact",
        explore: "Explorer",
        dream: "Rêver",
        destination: "Destination",
        paragraph: "Il encourage l'exploration de territoires inconnus, embrassant diverses cultures et paysages, tout en poursuivant la destination désirée qui captive le cœur et allume un sentiment d'émerveillement.",
        bookNow: "Réserver",
        currency: "Devise",
        searchPlaceholder: "Rechercher des destinations",
        search: "Rechercher",
        clear: "Effacer"
    },
    es: {
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
        explore: "Explorar",
        dream: "Soñar",
        destination: "Destino",
        paragraph: "Fomenta la exploración de territorios desconocidos, abrazando diversas culturas y paisajes, mientras persigue el destino deseado que cautiva el corazón y enciende una sensación de asombro.",
        bookNow: "Reservar",
        currency: "Moneda",
        searchPlaceholder: "Buscar destinos",
        search: "Buscar",
        clear: "Limpiar"
    }
};

// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    const languageSelectDesktop = document.getElementById('languageSelectDesktop');
    const currentLang = localStorage.getItem('language') || 'en';
    
    // Set initial language for both selectors
    if (languageSelect) languageSelect.value = currentLang;
    if (languageSelectDesktop) languageSelectDesktop.value = currentLang;
    
    translatePage(currentLang);
    
    // Mobile language selector
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('language', selectedLang);
            if (languageSelectDesktop) languageSelectDesktop.value = selectedLang;
            translatePage(selectedLang);
        });
    }
    
    // Desktop language selector
    if (languageSelectDesktop) {
        languageSelectDesktop.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('language', selectedLang);
            if (languageSelect) languageSelect.value = selectedLang;
            translatePage(selectedLang);
        });
    }
    
    function translatePage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update document language
        document.documentElement.lang = lang;
    }
});