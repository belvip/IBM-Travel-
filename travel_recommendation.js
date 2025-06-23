document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const navCenter = document.getElementById('navCenter');
    const navRight = document.getElementById('navRight');
    let menuOpen = false;

    mobileMenuButton.addEventListener('click', function() {
        menuOpen = !menuOpen;

        if(menuOpen){
            // display menu
            navCenter.classList.remove('hidden');
            navRight.classList.remove('hidden');
            mobileMenuButton.innerHTML = '<i class="fas fa-close text-xl"></i>';

            // Change layout for mobile
            navCenter.classList.add('block', 'w-full', 'mt-4');
            navRight.classList.add('flex', 'flex-col', 'w-full', 'mt-4', 'space-y-4');
            navRight.querySelector('div').classList.add('flex', 'flex-row', 'space-x-0');
        }else{
            // hide menu
            navCenter.classList.add('hidden');
            navRight.classList.add('hidden');
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';

            // Change layout for desktop
            navCenter.classList.remove('block', 'w-full', 'mt-4');
            navRight.classList.remove('flex', 'flex-col', 'w-full', 'mt-4', 'space-y-4');
            navRight.querySelector('div').classList.remove('flex', 'flex-row', 'space-x-0');
        }

    });

    // Fermer le menu si on redimensionne l'écran vers une taille desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { 
            if (menuOpen) {
                menuOpen = false;
                mobileMenuButton.innerHTML = '<i class="fa-solid fa-bars-staggered text-xl"></i>';
            }
            navCenter.classList.remove('hidden', 'block', 'w-full', 'mt-4');
            navRight.classList.remove('hidden', 'flex', 'flex-col', 'w-full', 'mt-4', 'space-y-4');
            navRight.querySelector('div').classList.remove('flex', 'flex-col', 'space-y-4', 'space-x-0');
        }
    });
})


//<script src="https://cdn.tailwindcss.com"></script>