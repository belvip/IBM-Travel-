// Simple share functionality
window.shareDestination = function(destination) {
    const shareText = `Check out ${destination.name}! ${destination.description}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: `Visit ${destination.name}`,
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            alert('Destination link copied to clipboard!');
        }).catch(() => {
            alert(`Share this destination: ${shareText} ${shareUrl}`);
        });
    }
};

// Add share buttons to search results
document.addEventListener('DOMContentLoaded', function() {
    // Override the existing displayResults function
    const originalScript = document.querySelector('script[src="./travel_recommendation.js"]');
    if (originalScript) {
        setTimeout(() => {
            // Add CSS for share button
            const style = document.createElement('style');
            style.textContent = `
                .share-btn-simple {
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 8px;
                }
            `;
            document.head.appendChild(style);
            
            // Monitor for search results and add share buttons
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        const resultCards = document.querySelectorAll('.result-card');
                        resultCards.forEach((card, index) => {
                            if (!card.querySelector('.share-btn-simple')) {
                                const actionButtons = card.querySelector('.action-buttons');
                                if (actionButtons) {
                                    const shareBtn = document.createElement('button');
                                    shareBtn.className = 'share-btn-simple';
                                    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                                    shareBtn.onclick = function() {
                                        const title = card.querySelector('h4').textContent;
                                        const description = card.querySelector('.result-description').textContent;
                                        const country = card.querySelector('.result-country')?.textContent || '';
                                        window.shareDestination({
                                            name: title,
                                            description: description,
                                            country: country
                                        });
                                    };
                                    actionButtons.appendChild(shareBtn);
                                }
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 1000);
    }
});