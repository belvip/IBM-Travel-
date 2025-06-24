// Updated displayResults function with share button
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

    const limitedResults = results.slice(0, 10);
    
    resultsContainer.innerHTML = `
        <div class="results-header">
            <h3>Recommendations</h3>
            <button onclick="window.showFavorites()" class="favorites-btn">
                <i class="fas fa-heart"></i> My Favorites
            </button>
            <button onclick="window.showTrendingDestinations()" class="trending-btn">
                <i class="fas fa-fire"></i> Trending
            </button>
        </div>
        ${limitedResults.map(item => `
            <div class="result-card">
                <img src="https://picsum.photos/400/200?random=${item.id || Math.random()}" alt="${item.name}">
                <div class="result-content">
                    <h4>${item.name}</h4>
                    <p class="result-type">${item.type || 'Destination'}</p>
                    <p class="result-description">${item.description}</p>
                    ${item.country ? `<p class="result-country">📍 ${item.country}</p>` : ''}
                    <div class="action-buttons">
                        <button onclick="window.toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="favorite-btn">
                            <i class="fas fa-heart"></i> Save
                        </button>
                        <button onclick="window.shareDestination(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="share-btn-inline">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    `;
    
    resultsContainer.dataset.results = JSON.stringify(results);
}

// Add this to the existing travel_recommendation.js
if (typeof window !== 'undefined') {
    window.displayResultsWithShare = displayResults;
}