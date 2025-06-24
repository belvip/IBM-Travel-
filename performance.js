// Performance Optimization - Lazy Loading & Caching
document.addEventListener('DOMContentLoaded', function() {
    
    // Image Lazy Loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Cache Management
    const cache = {
        data: new Map(),
        
        set(key, value, ttl = 300000) { // 5 minutes default
            const expiry = Date.now() + ttl;
            this.data.set(key, { value, expiry });
        },
        
        get(key) {
            const item = this.data.get(key);
            if (!item) return null;
            
            if (Date.now() > item.expiry) {
                this.data.delete(key);
                return null;
            }
            
            return item.value;
        },
        
        clear() {
            this.data.clear();
        }
    };

    // Enhanced fetch with caching
    window.cachedFetch = async function(url, options = {}) {
        const cacheKey = `fetch_${url}_${JSON.stringify(options)}`;
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return Promise.resolve(cached);
        }
        
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    // Debounce function for search
    window.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Preload critical resources
    const preloadLinks = [
        './travel_recommendation_api.json',
        'https://api.exchangerate-api.com/v4/latest/USD'
    ];

    preloadLinks.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });

    // Expose cache for other modules
    window.performanceCache = cache;
});