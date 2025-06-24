// Travel Buddies - Connect with other travelers
document.addEventListener('DOMContentLoaded', function() {
    let travelBuddies = JSON.parse(localStorage.getItem('travelBuddies')) || [];
    let myProfile = JSON.parse(localStorage.getItem('myTravelProfile')) || null;

    // Mock travel buddies data
    const mockBuddies = [
        { id: 1, name: 'Sarah Johnson', age: 28, location: 'New York', interests: ['Beach', 'Culture'], destination: 'Tokyo', travelDate: '2024-03-15', avatar: '👩‍🦰' },
        { id: 2, name: 'Mike Chen', age: 32, location: 'London', interests: ['Adventure', 'Food'], destination: 'Thailand', travelDate: '2024-04-20', avatar: '👨‍💼' },
        { id: 3, name: 'Emma Wilson', age: 25, location: 'Sydney', interests: ['Photography', 'Nature'], destination: 'Iceland', travelDate: '2024-05-10', avatar: '👩‍🎨' },
        { id: 4, name: 'Carlos Rodriguez', age: 30, location: 'Madrid', interests: ['History', 'Art'], destination: 'Rome', travelDate: '2024-06-05', avatar: '👨‍🎓' }
    ];

    window.showTravelBuddies = function() {
        const modal = document.createElement('div');
        modal.className = 'buddies-modal';
        modal.innerHTML = `
            <div class="buddies-modal-content">
                <div class="buddies-header">
                    <h3>Travel Buddies</h3>
                    <div class="buddies-actions">
                        <button onclick="window.showCreateProfile()" class="create-profile-btn">
                            <i class="fas fa-user-plus"></i> ${myProfile ? 'Edit Profile' : 'Create Profile'}
                        </button>
                        <button onclick="window.closeBuddiesModal()" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                ${!myProfile ? `
                    <div class="no-profile">
                        <p>Create your travel profile to connect with other travelers!</p>
                    </div>
                ` : ''}
                
                <div class="buddies-list">
                    ${mockBuddies.map(buddy => `
                        <div class="buddy-card">
                            <div class="buddy-avatar">${buddy.avatar}</div>
                            <div class="buddy-info">
                                <h4>${buddy.name}</h4>
                                <p class="buddy-location"><i class="fas fa-map-marker-alt"></i> ${buddy.location}</p>
                                <p class="buddy-destination"><i class="fas fa-plane"></i> Going to ${buddy.destination}</p>
                                <p class="buddy-date"><i class="fas fa-calendar"></i> ${buddy.travelDate}</p>
                                <div class="buddy-interests">
                                    ${buddy.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                                </div>
                            </div>
                            <div class="buddy-actions">
                                <button onclick="window.connectWithBuddy(${buddy.id})" class="connect-btn">
                                    <i class="fas fa-user-plus"></i> Connect
                                </button>
                                <button onclick="window.sendMessage(${buddy.id})" class="message-btn">
                                    <i class="fas fa-envelope"></i> Message
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    };

    window.showCreateProfile = function() {
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        modal.innerHTML = `
            <div class="profile-modal-content">
                <h3>${myProfile ? 'Edit' : 'Create'} Travel Profile</h3>
                
                <form id="profileForm">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="profileName" value="${myProfile?.name || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="profileAge" value="${myProfile?.age || ''}" min="18" max="100" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" id="profileLocation" value="${myProfile?.location || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Travel Interests</label>
                        <div class="interests-grid">
                            ${['Beach', 'Adventure', 'Culture', 'Food', 'Photography', 'Nature', 'History', 'Art'].map(interest => `
                                <label class="interest-checkbox">
                                    <input type="checkbox" value="${interest}" ${myProfile?.interests?.includes(interest) ? 'checked' : ''}>
                                    <span>${interest}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Next Destination</label>
                        <input type="text" id="profileDestination" value="${myProfile?.destination || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Travel Date</label>
                        <input type="date" id="profileDate" value="${myProfile?.travelDate || ''}" required>
                    </div>
                    
                    <div class="profile-actions">
                        <button type="submit" class="save-profile-btn">Save Profile</button>
                        <button type="button" onclick="window.closeProfileModal()" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const interests = Array.from(document.querySelectorAll('.interest-checkbox input:checked')).map(cb => cb.value);
            
            myProfile = {
                name: document.getElementById('profileName').value,
                age: parseInt(document.getElementById('profileAge').value),
                location: document.getElementById('profileLocation').value,
                interests: interests,
                destination: document.getElementById('profileDestination').value,
                travelDate: document.getElementById('profileDate').value,
                avatar: '👤'
            };
            
            localStorage.setItem('myTravelProfile', JSON.stringify(myProfile));
            window.closeProfileModal();
            alert('Profile saved successfully!');
        });
    };

    window.connectWithBuddy = function(buddyId) {
        if (!myProfile) {
            alert('Please create your profile first to connect with other travelers!');
            window.showCreateProfile();
            return;
        }
        
        const buddy = mockBuddies.find(b => b.id === buddyId);
        if (buddy) {
            alert(`Connection request sent to ${buddy.name}! 🤝`);
        }
    };

    window.sendMessage = function(buddyId) {
        if (!myProfile) {
            alert('Please create your profile first to message other travelers!');
            window.showCreateProfile();
            return;
        }
        
        const buddy = mockBuddies.find(b => b.id === buddyId);
        if (buddy) {
            const message = prompt(`Send a message to ${buddy.name}:`);
            if (message) {
                alert(`Message sent to ${buddy.name}! 💬`);
            }
        }
    };

    window.closeBuddiesModal = function() {
        const modal = document.querySelector('.buddies-modal');
        if (modal) modal.remove();
    };

    window.closeProfileModal = function() {
        const modal = document.querySelector('.profile-modal');
        if (modal) modal.remove();
    };
});