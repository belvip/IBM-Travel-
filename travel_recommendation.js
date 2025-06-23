document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const navCenter = document.getElementById('navCenter');
    const navRight = document.getElementById('navRight');
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
    const destinationInput = document.getElementById('destinationInput');
    
    let travelData = null;
    let menuOpen = false;
    let favorites = JSON.parse(localStorage.getItem('travelFavorites')) || [];

    // Keyword mapping for variations
    const keywordMap = {
        'beach': ['beach', 'beaches', 'coast', 'coastal'],
        'temple': ['temple', 'temples', 'shrine', 'shrines', 'historical_sites', 'historical site'],
        'country': ['country', 'countries', 'nation', 'nations'],
        'park': ['park', 'parks', 'national park', 'national parks', 'reserve'],
        'culture': ['culture', 'cultural', 'festival', 'experience', 'cultural_experiences']
    };

    // Fetch travel data
    async function fetchTravelData() {
        try {
            const response = await fetch('./travel_recommendation_api.json');
            travelData = await response.json();
            console.log('Travel data loaded:', travelData);
        } catch (error) {
            console.error('Error fetching travel data:', error);
        }
    }

    // Task 10: Display current time in Africa/Douala
    function displayDoualaTime() {
        const options = { 
            timeZone: 'Africa/Douala', 
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric',
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        };
        const doualaTime = new Date().toLocaleTimeString('en-US', options);
        console.log("Current time in Douala, Cameroon:", doualaTime);
        return doualaTime;
    }

    // Normalize search query
    function normalizeQuery(query) {
        const normalized = query.toLowerCase().trim();
        
        // Check for keyword variations
        for (const [key, variations] of Object.entries(keywordMap)) {
            if (variations.some(variation => normalized.includes(variation))) {
                return key;
            }
        }
        return normalized;
    }

    // Search function
    function searchRecommendations() {
        const query = destinationInput.value.toLowerCase().trim();
        if (!query || !travelData) return;

        const normalizedQuery = normalizeQuery(query);
        const results = [];

        // Search by keyword categories
        if (normalizedQuery === 'beach') {
            travelData.beaches.forEach(item => {
                results.push({...item, type: 'beach'});
            });
        } else if (normalizedQuery === 'temple') {
            travelData.historical_sites.forEach(item => {
                results.push({...item, type: 'historical site'});
            });
        } else if (normalizedQuery === 'country') {
            travelData.countries.forEach(country => {
                country.cities.forEach(city => {
                    results.push({...city, type: 'city', country: country.name});
                });
            });
        } else if (normalizedQuery === 'park') {
            travelData.national_parks.forEach(item => {
                results.push({...item, type: 'national park'});
            });
        } else if (normalizedQuery === 'culture') {
            travelData.cultural_experiences.forEach(item => {
                results.push({...item, type: 'cultural experience'});
            });
        } else {
            // General search in all categories
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

            // Search in other categories
            ['historical_sites', 'beaches', 'national_parks', 'cultural_experiences', 'unesco_sites'].forEach(category => {
                travelData[category].forEach(item => {
                    if (item.name.toLowerCase().includes(query) || 
                        (item.country && item.country.toLowerCase().includes(query))) {
                        results.push({...item, type: category.replace('_', ' ')});
                    }
                });
            });
        }

        displayResults(results);
    }

    // Display results
    function displayResults(results) {
        let resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'searchResults';
            resultsContainer.className = 'search-results';
            // Position under the search bar
            const navHeader = document.querySelector('.bg-green-800');
            if (navHeader) {
                navHeader.style.position = 'relative';
                navHeader.appendChild(resultsContainer);
            } else {
                document.body.appendChild(resultsContainer);
            }
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No recommendations found.</div>';
            return;
        }

        // Limit to first 2 results as per Task 8 requirement
        const limitedResults = results.slice(0, 10);
        const currentTime = displayDoualaTime();
        
        resultsContainer.innerHTML = `
            <div class="time-display">
                <i class="fas fa-clock"></i> Douala Time: ${currentTime}
            </div>
            <div class="results-header">
                <h3>Recommendations</h3>
                <button onclick="window.showFavorites()" class="favorites-btn">
                    <i class="fas fa-heart"></i> My Favorites (${favorites.length})
                </button>
            </div>
            ${limitedResults.map(item => `
                <div class="result-card">
                    <img src="https://picsum.photos/400/200?random=${item.id || Math.random()}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x200/333/fff?text=No+Image'">
                    <div class="result-content">
                        <h4>${item.name}</h4>
                        <p class="result-type">${item.type || 'Destination'}</p>
                        <p class="result-description">${item.description}</p>
                        ${item.country ? `<p class="result-country">📍 ${item.country}</p>` : ''}
                        ${item.highlights ? `<div class="highlights"><strong>Highlights:</strong> ${item.highlights.join(', ')}</div>` : ''}
                        ${item.activities ? `<div class="highlights"><strong>Activities:</strong> ${item.activities.join(', ')}</div>` : ''}
                        ${item.animals ? `<div class="highlights"><strong>Animals:</strong> ${item.animals.join(', ')}</div>` : ''}
                        ${item.period ? `<div class="highlights"><strong>Period:</strong> ${item.period}</div>` : ''}
                        ${item.year_inscribed ? `<div class="highlights"><strong>UNESCO Year:</strong> ${item.year_inscribed}</div>` : ''}
                        ${item.significance ? `<div class="highlights"><strong>Significance:</strong> ${item.significance}</div>` : ''}
                        <button onclick="window.toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="favorite-btn ${isFavorite(item) ? 'favorited' : ''}">
                            <i class="fas fa-heart"></i> ${isFavorite(item) ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
        
        resultsContainer.dataset.results = JSON.stringify(limitedResults);
    }

    // Clear results - Task 9 implementation
    function clearResults() {
        // Clear the search input field
        if (destinationInput) {
            destinationInput.value = '';
            destinationInput.focus();
        }
        
        // Remove all displayed search results
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.style.opacity = '0';
            setTimeout(() => {
                resultsContainer.innerHTML = '';
                resultsContainer.style.opacity = '1';
            }, 200);
        }
        
        // Reset search interface to initial state
        console.log('Search results cleared - Task 9 completed');
    }

    // Mobile menu toggle
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            menuOpen = !menuOpen;
            if (menuOpen) {
                navCenter.classList.remove('hidden');
                if (navRight) navRight.classList.remove('hidden');
                mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
            } else {
                navCenter.classList.add('hidden');
                if (navRight) navRight.classList.add('hidden');
                mobileMenuButton.innerHTML = '<i class="fa-solid fa-bars-staggered text-xl"></i>';
            }
        });
    }

    // Event listeners
    if (btnSearch) btnSearch.addEventListener('click', searchRecommendations);
    if (btnClear) btnClear.addEventListener('click', clearResults);
    if (destinationInput) {
        destinationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchRecommendations();
        });
    }

    // Favorites functionality
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
    }
    
    function isFavorite(item) {
        const itemId = `${item.name}-${item.country || item.type}`;
        return favorites.some(fav => fav.id === itemId);
    }
    
    window.showFavorites = function() {
        displayResults(favorites);
    }

    // Initialize
    fetchTravelData();
    displayDoualaTime();
});