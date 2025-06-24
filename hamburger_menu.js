// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const navCenter = document.getElementById('navCenter');
    const navRight = document.getElementById('navRight');
    let menuOpen = false;

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            menuOpen = !menuOpen;
            if (menuOpen) {
                navCenter.classList.remove('hidden');
                navRight.classList.remove('hidden');
            } else {
                navCenter.classList.add('hidden');
                navRight.classList.add('hidden');
            }
        });
    }
});