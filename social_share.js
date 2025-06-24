// Social Media Sharing for Destinations
document.addEventListener('DOMContentLoaded', function() {
    
    window.shareDestination = function(destination, platform = null) {
        const shareData = {
            title: `Check out ${destination.name}!`,
            text: `I found this amazing destination: ${destination.name} - ${destination.description}`,
            url: window.location.href,
            hashtags: ['travel', 'destination', destination.type?.replace(' ', '').toLowerCase()].filter(Boolean)
        };

        if (platform) {
            shareToSpecificPlatform(shareData, platform, destination);
        } else {
            showShareModal(shareData, destination);
        }
    };

    function shareToSpecificPlatform(shareData, platform, destination) {
        const encodedText = encodeURIComponent(shareData.text);
        const encodedUrl = encodeURIComponent(shareData.url);
        const hashtags = shareData.hashtags.join(',');
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${hashtags}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodeURIComponent(shareData.title)}&summary=${encodedText}`,
            whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    function showShareModal(shareData, destination) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-header">
                    <h3>Share ${destination.name}</h3>
                    <button onclick="window.closeShareModal()" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="destination-preview">
                    <img src="https://picsum.photos/300/150?random=${destination.id || Math.random()}" alt="${destination.name}">
                    <div class="preview-info">
                        <h4>${destination.name}</h4>
                        <p>${destination.description.substring(0, 100)}...</p>
                        ${destination.country ? `<span class="location"><i class="fas fa-map-marker-alt"></i> ${destination.country}</span>` : ''}
                    </div>
                </div>
                
                <div class="share-options">
                    <h4>Share on:</h4>
                    <div class="social-buttons">
                        <button onclick="window.shareDestination(${JSON.stringify(destination).replace(/"/g, '&quot;')}, 'facebook')" class="share-btn facebook">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </button>
                        <button onclick="window.shareDestination(${JSON.stringify(destination).replace(/"/g, '&quot;')}, 'twitter')" class="share-btn twitter">
                            <i class="fab fa-twitter"></i> Twitter
                        </button>
                        <button onclick="window.shareDestination(${JSON.stringify(destination).replace(/"/g, '&quot;')}, 'linkedin')" class="share-btn linkedin">
                            <i class="fab fa-linkedin-in"></i> LinkedIn
                        </button>
                        <button onclick="window.shareDestination(${JSON.stringify(destination).replace(/"/g, '&quot;')}, 'whatsapp')" class="share-btn whatsapp">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </button>
                        <button onclick="window.shareDestination(${JSON.stringify(destination).replace(/"/g, '&quot;')}, 'telegram')" class="share-btn telegram">
                            <i class="fab fa-telegram-plane"></i> Telegram
                        </button>
                    </div>
                </div>
                
                <div class="share-link">
                    <h4>Or copy link:</h4>
                    <div class="link-container">
                        <input type="text" id="shareLink" value="${window.location.href}" readonly>
                        <button onclick="window.copyShareLink()" class="copy-btn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
                
                <div class="native-share">
                    <button onclick="window.nativeShare(${JSON.stringify(shareData).replace(/"/g, '&quot;')})" class="native-share-btn">
                        <i class="fas fa-share"></i> More Options
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    window.copyShareLink = function() {
        const linkInput = document.getElementById('shareLink');
        linkInput.select();
        document.execCommand('copy');
        
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    };

    window.nativeShare = function(shareData) {
        if (navigator.share) {
            navigator.share({
                title: shareData.title,
                text: shareData.text,
                url: shareData.url
            }).catch(err => console.log('Error sharing:', err));
        } else {
            alert('Native sharing not supported on this device');
        }
    };

    window.closeShareModal = function() {
        const modal = document.querySelector('.share-modal');
        if (modal) modal.remove();
    };

    // Add share buttons to existing result cards
    const originalDisplayResults = window.displayResults;
    if (originalDisplayResults) {
        window.displayResults = function(results) {
            originalDisplayResults(results);
            
            // Add share buttons to result cards
            setTimeout(() => {
                const resultCards = document.querySelectorAll('.result-card');
                resultCards.forEach((card, index) => {
                    if (results[index] && !card.querySelector('.share-btn-inline')) {
                        const actionButtons = card.querySelector('.action-buttons');
                        if (actionButtons) {
                            const shareBtn = document.createElement('button');
                            shareBtn.className = 'share-btn-inline';
                            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                            shareBtn.onclick = () => window.shareDestination(results[index]);
                            actionButtons.appendChild(shareBtn);
                        }
                    }
                });
            }, 100);
        };
    }
});