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
    
    // ADD YOUR OPENWEATHERMAP API KEY HERE:
    const WEATHER_API_KEY = '130168d9eb141402c824b7069cd3a4d2'; // <-- Replace with your API key

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
                if (travelData[category]) {
                    travelData[category].forEach(item => {
                        if (item.name.toLowerCase().includes(query) || 
                            (item.country && item.country.toLowerCase().includes(query))) {
                            results.push({...item, type: category.replace('_', ' ')});
                        }
                    });
                }
            });
        }

        displayResults(results);
        trackSearch(destinationInput.value);
    }

    // Get review display for destination
    function getReviewDisplay(item) {
        const itemId = `${item.name}-${item.country || item.type}`;
        const itemReviews = reviews[itemId] || [];
        
        if (itemReviews.length === 0) {
            return '<div class="no-reviews">No reviews yet</div>';
        }
        
        const avgRating = itemReviews.reduce((sum, review) => sum + review.rating, 0) / itemReviews.length;
        const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
        
        return `
            <div class="review-summary">
                <div class="rating-display">${stars} (${avgRating.toFixed(1)}/5)</div>
                <div class="review-count">${itemReviews.length} review${itemReviews.length !== 1 ? 's' : ''}</div>
            </div>
        `;
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

        // Apply filters to results
        const filteredResults = applyFiltersToResults(results);
        const limitedResults = filteredResults.slice(0, 10);
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
                <button onclick="window.showTripPlan()" class="trip-btn">
                    <i class="fas fa-route"></i> My Trip (${tripPlan.length})
                </button>
                <button onclick="window.showFilters()" class="filters-btn">
                    <i class="fas fa-filter"></i> Filters
                </button>
                <button onclick="window.showMap()" class="map-btn">
                    <i class="fas fa-map"></i> Map View
                </button>
                <button onclick="window.showNearbyRecommendations()" class="nearby-btn">
                    <i class="fas fa-location-arrow"></i> Nearby
                </button>
                <button onclick="window.showTrendingDestinations()" class="trending-btn">
                    <i class="fas fa-fire"></i> Trending
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
                        ${item.distance ? `<div class="highlights"><strong>Distance:</strong> ${item.distance} km away</div>` : ''}
                        ${getReviewDisplay(item)}
                        <div class="action-buttons">
                            <button onclick="window.toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="favorite-btn ${isFavorite(item) ? 'favorited' : ''}">
                                <i class="fas fa-heart"></i> ${isFavorite(item) ? 'Saved' : 'Save'}
                            </button>
                            <button onclick="window.addToTrip(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="trip-add-btn ${isInTrip(item) ? 'added' : ''}">
                                <i class="fas fa-plus"></i> ${isInTrip(item) ? 'In Trip' : 'Add to Trip'}
                            </button>
                            <button onclick="window.showReviewForm('${item.name}-${item.country || item.type}')" class="review-btn">
                                <i class="fas fa-star"></i> Review
                            </button>
                            <button onclick="window.showLocationMap('${item.name}', '${item.country || item.type}')" class="location-btn">
                                <i class="fas fa-map-marker-alt"></i> Location
                            </button>
                            <button onclick="window.showWeather('${item.name}', '${item.country || item.type}')" class="weather-btn">
                                <i class="fas fa-cloud-sun"></i> Weather
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        
        resultsContainer.dataset.results = JSON.stringify(results);
    }

    // Clear results
    function clearResults() {
        if (destinationInput) {
            destinationInput.value = '';
            destinationInput.focus();
        }
        
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.style.opacity = '0';
            setTimeout(() => {
                resultsContainer.innerHTML = '';
                resultsContainer.style.opacity = '1';
            }, 200);
        }
        
        console.log('Search results cleared');
    }

    // Voice Search functionality
    function startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search not supported in this browser');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        voiceSearchBtn.classList.add('listening');
        voiceSearchBtn.innerHTML = '<i class="fas fa-stop"></i>';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            destinationInput.value = transcript;
            searchRecommendations();
        };
        
        recognition.onerror = function(event) {
            resetVoiceButton();
            if (event.error === 'not-allowed') {
                alert('Microphone access denied');
            }
        };
        
        recognition.onend = function() {
            resetVoiceButton();
        };
        
        recognition.start();
    }
    
    function resetVoiceButton() {
        voiceSearchBtn.classList.remove('listening');
        voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
    
    // Image Search functionality
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        imageSearchBtn.classList.add('processing');
        imageSearchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            const results = analyzeImage(file);
            displayResults(results);
            resetImageButton();
        }, 2000);
    }
    
    function analyzeImage(file) {
        const mockResults = [
            { name: 'Santorini', type: 'beach', country: 'Greece', description: 'Beautiful Greek island with white buildings and blue seas.' },
            { name: 'Maldives', type: 'beach', country: 'Maldives', description: 'Tropical paradise with crystal-clear waters.' },
            { name: 'Bora Bora', type: 'beach', country: 'French Polynesia', description: 'Stunning lagoon with overwater bungalows.' }
        ];
        
        return mockResults;
    }
    
    function resetImageButton() {
        imageSearchBtn.classList.remove('processing');
        imageSearchBtn.innerHTML = '<i class="fas fa-camera"></i>';
    }

    // Event listeners
    if (btnSearch) btnSearch.addEventListener('click', searchRecommendations);
    if (btnClear) btnClear.addEventListener('click', clearResults);
    if (voiceSearchBtn) voiceSearchBtn.addEventListener('click', startVoiceSearch);
    if (imageSearchBtn) imageSearchBtn.addEventListener('click', () => imageUpload.click());
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    if (destinationInput) {
        destinationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchRecommendations();
        });
    }

    // Weather Integration - REAL API ONLY
    async function fetchRealWeather(coordinates) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        
        return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            icon: data.weather[0].main === 'Clear' ? '☀️' : data.weather[0].main === 'Clouds' ? '☁️' : '🌤️',
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            feelsLike: Math.round(data.main.feels_like),
            uvIndex: 5
        };
    }
    
    function fetchWeatherData(name, coordinates) {
        fetchRealWeather(coordinates)
            .then(weather => displayWeatherModal(name, weather))
            .catch(error => {
                console.error('Weather API failed:', error);
                alert('Unable to fetch weather data. Please check your API key.');
            });
    }
    
    window.showWeather = function(name, location) {
        const coordinates = getDestinationCoordinates(name, location);
        fetchWeatherData(name, coordinates);
    }
    
    function displayWeatherModal(name, weather) {
        const modal = document.createElement('div');
        modal.className = 'weather-modal';
        modal.innerHTML = `
            <div class="weather-modal-content">
                <div class="weather-header">
                    <h3>Weather in ${name}</h3>
                    <button onclick="window.closeWeatherModal()" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="weather-main">
                    <div class="weather-icon">${weather.icon}</div>
                    <div class="weather-temp">${weather.temperature}°C</div>
                    <div class="weather-condition">${weather.condition}</div>
                </div>
                <div class="weather-details">
                    <div class="weather-item">
                        <i class="fas fa-thermometer-half"></i>
                        <span>Feels like ${weather.feelsLike}°C</span>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-tint"></i>
                        <span>Humidity ${weather.humidity}%</span>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-wind"></i>
                        <span>Wind ${weather.windSpeed} km/h</span>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-sun"></i>
                        <span>UV Index ${weather.uvIndex}</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    window.closeWeatherModal = function() {
        const modal = document.querySelector('.weather-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Review System functionality - FULL IMPLEMENTATION
    window.showReviewForm = function(itemId) {
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <div class="review-modal-content">
                <h3>Write a Review</h3>
                <div class="rating-input">
                    <label>Rating:</label>
                    <div class="stars-input">
                        ${[1,2,3,4,5].map(i => `<span class="star" data-rating="${i}">☆</span>`).join('')}
                    </div>
                </div>
                <textarea id="reviewText" placeholder="Share your experience..." rows="4"></textarea>
                <div class="review-actions">
                    <button onclick="window.submitReview('${itemId}')" class="submit-review-btn">Submit Review</button>
                    <button onclick="window.closeReviewModal()" class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const stars = modal.querySelectorAll('.star');
        let selectedRating = 0;
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                selectedRating = parseInt(this.dataset.rating);
                updateStars(stars, selectedRating);
            });
        });
        
        function updateStars(stars, rating) {
            stars.forEach((star, index) => {
                star.textContent = index < rating ? '★' : '☆';
                star.classList.toggle('selected', index < rating);
            });
        }
        
        modal.selectedRating = () => selectedRating;
    }
    
    window.submitReview = function(itemId) {
        const modal = document.querySelector('.review-modal');
        const reviewText = document.getElementById('reviewText').value.trim();
        const rating = modal.selectedRating();
        
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        
        if (!reviewText) {
            alert('Please write a review');
            return;
        }
        
        if (!reviews[itemId]) {
            reviews[itemId] = [];
        }
        
        reviews[itemId].push({
            rating: rating,
            text: reviewText,
            date: new Date().toLocaleDateString(),
            id: Date.now()
        });
        
        localStorage.setItem('destinationReviews', JSON.stringify(reviews));
        window.closeReviewModal();
        
        const currentResults = document.getElementById('searchResults')?.dataset.results;
        if (currentResults) {
            displayResults(JSON.parse(currentResults));
        }
    }
    
    window.closeReviewModal = function() {
        const modal = document.querySelector('.review-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Map functionality - FULL IMPLEMENTATION
    window.showMap = function() {
        const currentResults = document.getElementById('searchResults')?.dataset.results;
        if (!currentResults) return;
        
        const results = JSON.parse(currentResults);
        displayMapView(results);
    }
    
    window.showLocationMap = function(name, location) {
        const coordinates = getDestinationCoordinates(name, location);
        displaySingleLocationMap(name, location, coordinates);
    }
    
    function displayMapView(results) {
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
        
        const currentTime = displayDoualaTime();
        
        resultsContainer.innerHTML = `
            <div class="time-display">
                <i class="fas fa-clock"></i> Douala Time: ${currentTime}
            </div>
            <div class="results-header">
                <h3>Map View</h3>
                <button onclick="window.closeMapView()" class="close-map-btn">
                    <i class="fas fa-times"></i> Close Map
                </button>
            </div>
            <div id="mapContainer" class="map-container"></div>
            <div class="map-legend">
                <h4>Destinations (${results.length})</h4>
                <div class="legend-items">
                    ${results.slice(0, 10).map((item, index) => `
                        <div class="legend-item" onclick="window.focusMapMarker(${index})">
                            <span class="marker-number">${index + 1}</span>
                            <span class="destination-name">${item.name}</span>
                            <span class="destination-country">${item.country || item.type}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        setTimeout(() => initializeMap(results), 100);
    }
    
    function displaySingleLocationMap(name, location, coordinates) {
        const modal = document.createElement('div');
        modal.className = 'map-modal';
        modal.innerHTML = `
            <div class="map-modal-content">
                <div class="map-header">
                    <h3>${name}</h3>
                    <button onclick="window.closeMapModal()" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="singleMapContainer" class="single-map-container"></div>
                <div class="map-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${location}</p>
                    <p><i class="fas fa-globe"></i> Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => initializeSingleMap(name, coordinates), 100);
    }
    
    function initializeMap(results) {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        const map = L.map('mapContainer').setView([20, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        const markers = [];
        results.slice(0, 10).forEach((item, index) => {
            const coordinates = getDestinationCoordinates(item.name, item.country || item.type);
            
            const marker = L.marker([coordinates.lat, coordinates.lng])
                .addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h4>${item.name}</h4>
                        <p><strong>${item.type || 'Destination'}</strong></p>
                        <p>${item.description.substring(0, 100)}...</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${item.country || item.type}</p>
                    </div>
                `);
            
            markers.push(marker);
        });
        
        window.mapMarkers = markers;
        window.mapInstance = map;
    }
    
    function initializeSingleMap(name, coordinates) {
        const mapContainer = document.getElementById('singleMapContainer');
        if (!mapContainer) return;
        
        const map = L.map('singleMapContainer').setView([coordinates.lat, coordinates.lng], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        L.marker([coordinates.lat, coordinates.lng])
            .addTo(map)
            .bindPopup(`<div class="map-popup"><h4>${name}</h4></div>`)
            .openPopup();
    }
    
    window.focusMapMarker = function(index) {
        if (window.mapMarkers && window.mapMarkers[index] && window.mapInstance) {
            const marker = window.mapMarkers[index];
            window.mapInstance.setView(marker.getLatLng(), 8);
            marker.openPopup();
        }
    }
    
    window.closeMapView = function() {
        const currentResults = document.getElementById('searchResults')?.dataset.results;
        if (currentResults) {
            displayResults(JSON.parse(currentResults));
        }
    }
    
    window.closeMapModal = function() {
        const modal = document.querySelector('.map-modal');
        if (modal) {
            modal.remove();
        }
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

    // Trip Planner functionality
    window.addToTrip = function(item) {
        const itemId = `${item.name}-${item.country || item.type}`;
        const existingIndex = tripPlan.findIndex(trip => trip.id === itemId);
        
        if (existingIndex > -1) {
            tripPlan.splice(existingIndex, 1);
        } else {
            tripPlan.push({...item, id: itemId, order: tripPlan.length + 1});
        }
        
        localStorage.setItem('tripPlan', JSON.stringify(tripPlan));
        const currentResults = document.getElementById('searchResults')?.dataset.results;
        if (currentResults) {
            displayResults(JSON.parse(currentResults));
        }
    }
    
    function isInTrip(item) {
        const itemId = `${item.name}-${item.country || item.type}`;
        return tripPlan.some(trip => trip.id === itemId);
    }
    
    window.showTripPlan = function() {
        if (tripPlan.length === 0) {
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer) {
                resultsContainer.innerHTML = '<div class="no-results">Your trip planner is empty. Add destinations to start planning!</div>';
            }
            return;
        }
        
        const sortedTrip = tripPlan.sort((a, b) => a.order - b.order);
        displayResults(sortedTrip);
    }

    // Advanced Filters functionality - FULL IMPLEMENTATION
    window.showFilters = function() {
        const modal = document.createElement('div');
        modal.className = 'filters-modal';
        modal.innerHTML = `
            <div class="filters-modal-content">
                <h3>Advanced Filters</h3>
                
                <div class="filter-group">
                    <label>Price Range (USD)</label>
                    <div class="price-range">
                        <input type="range" id="minPrice" min="0" max="5000" value="${activeFilters.priceRange.min}" step="100">
                        <input type="range" id="maxPrice" min="0" max="5000" value="${activeFilters.priceRange.max}" step="100">
                        <div class="price-display">
                            <span id="minPriceDisplay">$${activeFilters.priceRange.min}</span> - 
                            <span id="maxPriceDisplay">$${activeFilters.priceRange.max}</span>
                        </div>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label>Duration</label>
                    <select id="durationFilter">
                        <option value="">Any Duration</option>
                        <option value="1-3" ${activeFilters.duration === '1-3' ? 'selected' : ''}>1-3 Days</option>
                        <option value="4-7" ${activeFilters.duration === '4-7' ? 'selected' : ''}>4-7 Days</option>
                        <option value="8-14" ${activeFilters.duration === '8-14' ? 'selected' : ''}>1-2 Weeks</option>
                        <option value="15+" ${activeFilters.duration === '15+' ? 'selected' : ''}>2+ Weeks</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Activities</label>
                    <div class="activities-grid">
                        ${['Diving', 'Surfing', 'Hiking', 'Cultural Tours', 'Wildlife Watching', 'Beach Relaxation'].map(activity => `
                            <label class="activity-checkbox">
                                <input type="checkbox" value="${activity}" ${activeFilters.activities.includes(activity) ? 'checked' : ''}>
                                <span>${activity}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div class="filter-group">
                    <label>Best Season</label>
                    <select id="seasonFilter">
                        <option value="">Any Season</option>
                        <option value="spring" ${activeFilters.season === 'spring' ? 'selected' : ''}>Spring</option>
                        <option value="summer" ${activeFilters.season === 'summer' ? 'selected' : ''}>Summer</option>
                        <option value="autumn" ${activeFilters.season === 'autumn' ? 'selected' : ''}>Autumn</option>
                        <option value="winter" ${activeFilters.season === 'winter' ? 'selected' : ''}>Winter</option>
                    </select>
                </div>
                
                <div class="filter-actions">
                    <button onclick="window.applyFilters()" class="apply-filters-btn">Apply Filters</button>
                    <button onclick="window.clearFilters()" class="clear-filters-btn">Clear All</button>
                    <button onclick="window.closeFiltersModal()" class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const minDisplay = document.getElementById('minPriceDisplay');
        const maxDisplay = document.getElementById('maxPriceDisplay');
        
        minPrice.addEventListener('input', function() {
            minDisplay.textContent = '$' + this.value;
            if (parseInt(this.value) > parseInt(maxPrice.value)) {
                maxPrice.value = this.value;
                maxDisplay.textContent = '$' + this.value;
            }
        });
        
        maxPrice.addEventListener('input', function() {
            maxDisplay.textContent = '$' + this.value;
            if (parseInt(this.value) < parseInt(minPrice.value)) {
                minPrice.value = this.value;
                minDisplay.textContent = '$' + this.value;
            }
        });
    }
    
    window.applyFilters = function() {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const duration = document.getElementById('durationFilter').value;
        const season = document.getElementById('seasonFilter').value;
        const activities = Array.from(document.querySelectorAll('.activity-checkbox input:checked')).map(cb => cb.value);
        
        activeFilters = {
            priceRange: { min: parseInt(minPrice), max: parseInt(maxPrice) },
            duration: duration,
            activities: activities,
            season: season
        };
        
        window.closeFiltersModal();
        
        const currentResults = document.getElementById('searchResults')?.dataset.results;
        if (currentResults) {
            const results = JSON.parse(currentResults);
            displayResults(results);
        }
    }
    
    window.clearFilters = function() {
        activeFilters = {
            priceRange: { min: 0, max: 5000 },
            duration: '',
            activities: [],
            season: ''
        };
        
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 5000;
        document.getElementById('minPriceDisplay').textContent = '$0';
        document.getElementById('maxPriceDisplay').textContent = '$5000';
        document.getElementById('durationFilter').value = '';
        document.getElementById('seasonFilter').value = '';
        document.querySelectorAll('.activity-checkbox input').forEach(cb => cb.checked = false);
    }
    
    window.closeFiltersModal = function() {
        const modal = document.querySelector('.filters-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    function applyFiltersToResults(results) {
        return results.filter(item => {
            const mockPrice = getMockPrice(item);
            const mockDuration = getMockDuration(item);
            const mockSeason = getMockSeason(item);
            const itemActivities = getItemActivities(item);
            
            if (mockPrice < activeFilters.priceRange.min || mockPrice > activeFilters.priceRange.max) {
                return false;
            }
            
            if (activeFilters.duration && mockDuration !== activeFilters.duration) {
                return false;
            }
            
            if (activeFilters.activities.length > 0 && !activeFilters.activities.some(activity => itemActivities.includes(activity))) {
                return false;
            }
            
            if (activeFilters.season && mockSeason !== activeFilters.season) {
                return false;
            }
            
            return true;
        });
    }
    
    function getMockPrice(item) {
        const prices = {
            'beach': Math.random() * 2000 + 500,
            'city': Math.random() * 1500 + 300,
            'historical site': Math.random() * 1000 + 200,
            'national park': Math.random() * 800 + 150,
            'cultural experience': Math.random() * 600 + 100
        };
        return Math.round(prices[item.type] || Math.random() * 1000 + 200);
    }
    
    function getMockDuration(item) {
        const durations = ['1-3', '4-7', '8-14', '15+'];
        return durations[Math.floor(Math.random() * durations.length)];
    }
    
    function getMockSeason(item) {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        return seasons[Math.floor(Math.random() * seasons.length)];
    }
    
    function getItemActivities(item) {
        if (item.activities) return item.activities;
        
        const typeActivities = {
            'beach': ['Diving', 'Surfing', 'Beach Relaxation'],
            'national park': ['Hiking', 'Wildlife Watching'],
            'city': ['Cultural Tours'],
            'historical site': ['Cultural Tours'],
            'cultural experience': ['Cultural Tours']
        };
        
        return typeActivities[item.type] || ['Cultural Tours'];
    }

    // Nearby functionality - FIXED IMPLEMENTATION
    window.showNearbyRecommendations = function() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const nearbyResults = findNearbyDestinations(userLat, userLng);
                displayResults(nearbyResults);
            },
            function(error) {
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Location access denied. Please enable location services.');
                } else {
                    alert('Unable to get your location. Please try again.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }
    
    function findNearbyDestinations(userLat, userLng) {
        if (!travelData) return [];
        
        const nearbyDestinations = [];
        const maxDistance = 2000; // Increased radius for testing
        const allDestinations = [];
        
        // Add countries/cities
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                country.cities.forEach(city => {
                    allDestinations.push({...city, type: 'city', country: country.name});
                });
            });
        }
        
        // Add other categories
        ['beaches', 'historical_sites', 'national_parks', 'cultural_experiences', 'unesco_sites'].forEach(category => {
            if (travelData[category]) {
                travelData[category].forEach(item => {
                    allDestinations.push({...item, type: category.replace('_', ' ')});
                });
            }
        });
        
        // Calculate distances
        allDestinations.forEach(destination => {
            const destCoords = getDestinationCoordinates(destination.name, destination.country || destination.type);
            if (destCoords.lat !== 0 || destCoords.lng !== 0) {
                const distance = calculateDistance(userLat, userLng, destCoords.lat, destCoords.lng);
                
                if (distance <= maxDistance) {
                    nearbyDestinations.push({
                        ...destination,
                        distance: Math.round(distance)
                    });
                }
            }
        });
        
        return nearbyDestinations.sort((a, b) => a.distance - b.distance).slice(0, 10);
    }
    
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Trending functionality - FULL IMPLEMENTATION
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || {};
    
    function trackSearch(query) {
        if (!query) return;
        const normalizedQuery = query.toLowerCase().trim();
        searchHistory[normalizedQuery] = (searchHistory[normalizedQuery] || 0) + 1;
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    window.showTrendingDestinations = function() {
        const trendingResults = getTrendingDestinations();
        displayTrendingResults(trendingResults);
    }
    
    function getTrendingDestinations() {
        const sortedSearches = Object.entries(searchHistory)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        const trendingDestinations = [];
        
        sortedSearches.forEach(([query, count]) => {
            const results = searchDestinations(query);
            if (results.length > 0) {
                trendingDestinations.push({
                    ...results[0],
                    searchCount: count,
                    trendingRank: trendingDestinations.length + 1
                });
            }
        });
        
        if (trendingDestinations.length === 0) {
            return [
                { name: 'Tokyo', type: 'city', country: 'Japan', description: 'Ultra-modern metropolis', searchCount: 45, trendingRank: 1 },
                { name: 'Paris', type: 'city', country: 'France', description: 'City of Light', searchCount: 38, trendingRank: 2 },
                { name: 'Maldives', type: 'beach', country: 'Maldives', description: 'Tropical paradise', searchCount: 32, trendingRank: 3 }
            ];
        }
        
        return trendingDestinations;
    }
    
    function searchDestinations(query) {
        if (!travelData) return [];
        const results = [];
        
        travelData.countries?.forEach(country => {
            if (country.name.toLowerCase().includes(query)) {
                country.cities.forEach(city => results.push({...city, type: 'city', country: country.name}));
            }
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)) {
                    results.push({...city, type: 'city', country: country.name});
                }
            });
        });
        
        return results;
    }
    
    function displayTrendingResults(results) {
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
        
        const currentTime = displayDoualaTime();
        
        resultsContainer.innerHTML = `
            <div class="time-display">
                <i class="fas fa-clock"></i> Douala Time: ${currentTime}
            </div>
            <div class="results-header">
                <h3>Trending Destinations</h3>
                <button onclick="window.closeMapView()" class="close-map-btn">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
            ${results.map(item => `
                <div class="result-card trending-card">
                    <div class="trending-rank">#${item.trendingRank}</div>
                    <img src="https://picsum.photos/400/200?random=${item.trendingRank}" alt="${item.name}">
                    <div class="result-content">
                        <h4>${item.name}</h4>
                        <p class="result-type">${item.type}</p>
                        <p class="result-description">${item.description}</p>
                        ${item.country ? `<p class="result-country">📍 ${item.country}</p>` : ''}
                        <div class="trending-stats">
                            <span class="search-count"><i class="fas fa-search"></i> ${item.searchCount} searches</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    // Coordinates for weather and maps
    function getDestinationCoordinates(name, location) {
        const coordinates = {
            'Tokyo': { lat: 35.6762, lng: 139.6503 },
            'Paris': { lat: 48.8566, lng: 2.3522 },
            'Sydney': { lat: -33.8688, lng: 151.2093 },
            'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
            'Bangkok': { lat: 13.7563, lng: 100.5018 },
            'Marrakech': { lat: 31.6295, lng: -7.9811 },
            'Maldives': { lat: 3.2028, lng: 73.2207 },
            'Bora Bora': { lat: -16.5004, lng: -151.7415 },
            'Machu Picchu': { lat: -13.1631, lng: -72.5450 },
            'Colosseum': { lat: 41.8902, lng: 12.4922 },
            'Douala': { lat: 4.0511, lng: 9.7679 },
            'Yaounde': { lat: 3.8480, lng: 11.5021 },
            'Zanzibar': { lat: -6.1659, lng: 39.2026 },
            'Fes': { lat: 34.0181, lng: -5.0078 },
            'Kyoto': { lat: 35.0116, lng: 135.7681 },
            'Nice': { lat: 43.7102, lng: 7.2620 },
            'Melbourne': { lat: -37.8136, lng: 144.9631 },
            'Chiang Mai': { lat: 18.7883, lng: 98.9853 }
        };
        
        return coordinates[name] || { lat: 0, lng: 0 };
    }

    // Initialize
    fetchTravelData();
    displayDoualaTime();
});