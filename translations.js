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
        clear: "Clear",
        // About page
        aboutUs: "About us",
        aboutPara1: "Welcome to TravelBoom, your premier destination for discovering extraordinary travel experiences around the world. Founded with a passion for exploration and cultural discovery, we specialize in curating personalized travel recommendations that transform ordinary trips into unforgettable adventures.",
        aboutPara2: "Our mission is to inspire and empower travelers to explore diverse cultures, breathtaking landscapes, and hidden gems across the globe. We believe that travel is not just about visiting new places, but about creating meaningful connections and lasting memories that enrich your life.",
        aboutPara3: "With years of expertise in the travel industry, TravelBoom combines cutting-edge technology with personalized service to deliver recommendations tailored to your unique preferences and travel style.",
        our: "Our",
        team: "Team",
        sarahRole: "Sara is responsible for",
        celinaRole: "Celina Thomas is responsible for",
        mikeRole: "Mike Tyson is responsible for",
        teamLead: "Team Lead",
        deliveryHead: "Delivery Head",
        // Contact page
        contactUs: "Contact Us",
        getInTouch: "Get in touch with us",
        name: "Name",
        email: "Email",
        message: "Message",
        namePlaceholder: "Your name",
        emailPlaceholder: "Your email",
        messagePlaceholder: "Your message",
        sendMessage: "Send Message"
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
        clear: "Effacer",
        // About page
        aboutUs: "À propos de nous",
        aboutPara1: "Bienvenue chez TravelBoom, votre destination de choix pour découvrir des expériences de voyage extraordinaires à travers le monde. Fondée avec une passion pour l'exploration et la découverte culturelle, nous nous spécialisons dans la création de recommandations de voyage personnalisées qui transforment les voyages ordinaires en aventures inoubliables.",
        aboutPara2: "Notre mission est d'inspirer et d'autonomiser les voyageurs à explorer diverses cultures, des paysages à couper le souffle et des joyaux cachés à travers le globe. Nous croyons que voyager ne consiste pas seulement à visiter de nouveaux endroits, mais à créer des connexions significatives et des souvenirs durables qui enrichissent votre vie.",
        aboutPara3: "Avec des années d'expertise dans l'industrie du voyage, TravelBoom combine une technologie de pointe avec un service personnalisé pour offrir des recommandations adaptées à vos préférences uniques et votre style de voyage.",
        our: "Notre",
        team: "Équipe",
        sarahRole: "Sara est responsable de",
        celinaRole: "Celina Thomas est responsable de",
        mikeRole: "Mike Tyson est responsable de",
        teamLead: "Chef d'équipe",
        deliveryHead: "Chef de livraison",
        // Contact page
        contactUs: "Contactez-nous",
        getInTouch: "Entrez en contact avec nous",
        name: "Nom",
        email: "Email",
        message: "Message",
        namePlaceholder: "Votre nom",
        emailPlaceholder: "Votre email",
        messagePlaceholder: "Votre message",
        sendMessage: "Envoyer le message"
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
        clear: "Limpiar",
        // About page
        aboutUs: "Acerca de nosotros",
        aboutPara1: "Bienvenido a TravelBoom, tu destino principal para descubrir experiencias de viaje extraordinarias alrededor del mundo. Fundada con una pasión por la exploración y el descubrimiento cultural, nos especializamos en crear recomendaciones de viaje personalizadas que transforman viajes ordinarios en aventuras inolvidables.",
        aboutPara2: "Nuestra misión es inspirar y empoderar a los viajeros para explorar diversas culturas, paisajes impresionantes y gemas ocultas en todo el mundo. Creemos que viajar no se trata solo de visitar nuevos lugares, sino de crear conexiones significativas y recuerdos duraderos que enriquecen tu vida.",
        aboutPara3: "Con años de experiencia en la industria de viajes, TravelBoom combina tecnología de vanguardia con servicio personalizado para entregar recomendaciones adaptadas a tus preferencias únicas y estilo de viaje.",
        our: "Nuestro",
        team: "Equipo",
        sarahRole: "Sara es responsable de",
        celinaRole: "Celina Thomas es responsable de",
        mikeRole: "Mike Tyson es responsable de",
        teamLead: "Líder de Equipo",
        deliveryHead: "Jefe de Entrega",
        // Contact page
        contactUs: "Contáctanos",
        getInTouch: "Ponte en contacto con nosotros",
        name: "Nombre",
        email: "Email",
        message: "Mensaje",
        namePlaceholder: "Tu nombre",
        emailPlaceholder: "Tu email",
        messagePlaceholder: "Tu mensaje",
        sendMessage: "Enviar Mensaje"
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
                if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                    element.placeholder = translations[lang][key];
                } else if (element.tagName === 'TEXTAREA') {
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