document.addEventListener('DOMContentLoaded', function() {
    const menuOpen = document.getElementById('menu-open');
    const menuClose = document.getElementById('menu-close');
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    
    // Function to toggle menu visibility
    function toggleMenu() {
        menuOpen.classList.toggle('hidden');
        menuClose.classList.toggle('hidden');
        navCenter.classList.toggle('hidden');
        navRight.classList.toggle('hidden');
    }
    
    // Event listeners for menu icons
    menuOpen.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { // md breakpoint in Tailwind
            navCenter.classList.remove('hidden');
            navRight.classList.remove('hidden');
            menuOpen.classList.remove('hidden');
            menuClose.classList.add('hidden');
        } else {
            navCenter.classList.add('hidden');
            navRight.classList.add('hidden');
            menuOpen.classList.remove('hidden');
            menuClose.classList.add('hidden');
        }
    });
});