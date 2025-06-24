// Enhanced travel_recommendation.js with performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const navCenter = document.getElementById('navCenter');
    const navRight = document.getElementById('navRight');
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
    const destinationInput = document.getElementById('destinationInput');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const imageSearchBtn = document.getElementById('imageSearchBtn');
    const imageUpload = document.getElementById('imageUpload');
    
    let travelData = null;
    let menuOpen = false;
    let favorites = JSON.parse(localStorage.getItem('travelFavorites')) || [];
    let tripPlan = JSON.parse(localStorage.getItem('tripPlan')) || [];
    let reviews = JSON.parse(localStorage.getItem('destinationReviews')) || {};
    let activeFilters = {
        priceRange: { min: 0, max: 5000 },
        duration: '',
        activities: [],
        season: ''
    };

    // Fetch travel data with caching
    async function fetchTravelData() {
        try {
            if (window.cachedFetch) {
                travelData = await window.cachedFetch('./travel_recommendation_api.json');
            } else {
                const response = await fetch('./travel_recommendation_api.json');
                travelData = await response.json();
            }
            console.log('Travel data loaded:', travelData);
        } catch (error) {
            console.error('Error fetching travel data:', error);
        }
    }

    // Debounced search function
    const debouncedSearch = window.debounce ? window.debounce(searchRecommendations, 300) : searchRecommendations;

    // Enhanced display results with lazy loading
    function displayResults(results) {
        let resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'searchResults';
            resultsContainer.className = 'search-results';
            const navHeader = document.querySelector('.bg-green-800');
            if (navHeader) {
                navHeader.style.position = 'relative';
                navHeader.appendChild(resultsContainer);
            }
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No recommendations found.</div>';
            return;
        }

        const filteredResults = applyFiltersToResults(results);
        const limitedResults = filteredResults.slice(0, 10);
        
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h3>Recommendations</h3>
                <button onclick="window.showFavorites()" class="favorites-btn">
                    <i class="fas fa-heart"></i> My Favorites (${favorites.length})
                </button>
                <button onclick="window.showTrendingDestinations()" class="trending-btn">
                    <i class="fas fa-fire"></i> Trending
                </button>
            </div>
            ${limitedResults.map(item => `
                <div class="result-card">
                    <img class="lazy" data-src="https://picsum.photos/400/200?random=${item.id || Math.random()}" alt="${item.name}" style="background: #f0f0f0; min-height: 200px;">
                    <div class="result-content">
                        <h4>${item.name}</h4>
                        <p class="result-type">${item.type || 'Destination'}</p>
                        <p class="result-description">${item.description}</p>
                        ${item.country ? `<p class="result-country">📍 ${item.country}</p>` : ''}
                        <div class="action-buttons">
                            <button onclick="window.toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="favorite-btn ${isFavorite(item) ? 'favorited' : ''}">
                                <i class="fas fa-heart"></i> ${isFavorite(item) ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        
        // Initialize lazy loading for new images
        setTimeout(() => {
            const lazyImages = resultsContainer.querySelectorAll('img.lazy');
            lazyImages.forEach(img => {
                if (window.imageObserver) {
                    window.imageObserver.observe(img);
                } else {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
            });
        }, 100);
        
        resultsContainer.dataset.results = JSON.stringify(results);
    }

    // Basic search function
    function searchRecommendations() {
        const query = destinationInput.value.toLowerCase().trim();
        if (!query || !travelData) return;

        const results = [];
        
        // Search in countries
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                if (country.name.toLowerCase().includes(query)) {
                    country.cities.forEach(city => results.push({...city, type: 'city', country: country.name}));
                }
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        results.push({...city, type: 'city', country: country.name});
                    }
                });
            });
        }

        displayResults(results);
    }

    // Basic functions
    function clearResults() {
        if (destinationInput) {
            destinationInput.value = '';
        }
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    function isFavorite(item) {
        const itemId = `${item.name}-${item.country || item.type}`;
        return favorites.some(fav => fav.id === itemId);
    }

    function applyFiltersToResults(results) {
        return results; // Simplified
    }

    // Event listeners with debouncing
    if (btnSearch) btnSearch.addEventListener('click', searchRecommendations);
    if (btnClear) btnClear.addEventListener('click', clearResults);
    if (destinationInput) {
        destinationInput.addEventListener('input', debouncedSearch);
        destinationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchRecommendations();
        });
    }

    // Basic window functions
    window.toggleFavorite = function(item) {
        const itemId = `${item.name}-${item.country || item.type}`;
        const existingIndex = favorites.findIndex(fav => fav.id === itemId);
        
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
        } else {
            favorites.push({...item, id: itemId});
        }
        
        localStorage.setItem('travelFavorites', JSON.stringify(favorites));
        const currentResults = document.getElementById('searchResults')?.dataset.results;
        if (currentResults) {
            displayResults(JSON.parse(currentResults));
        }
    };

    window.showFavorites = function() {
        displayResults(favorites);
    };

    window.showTrendingDestinations = function() {
        const trending = [
            { name: 'Tokyo', type: 'city', country: 'Japan', description: 'Ultra-modern metropolis' },
            { name: 'Paris', type: 'city', country: 'France', description: 'City of Light' },
            { name: 'Maldives', type: 'beach', country: 'Maldives', description: 'Tropical paradise' }
        ];
        displayResults(trending);
    };

    // Initialize
    fetchTravelData();
});