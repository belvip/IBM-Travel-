<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>About us</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"  crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="/dist/output.css" rel="stylesheet">
    <link href="./index.css" rel="stylesheet">
    <link rel="stylesheet" href="index.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
    
</head>
<body >
    <div class="bg-gray-700 flex flex-col md:flex-row justify-between items-center p-4">
        <div class="nav-left flex items-center justify-between w-full md:w-auto">
            <div class="flex items-center space-x-2">
                <i class="fa-solid fa-plane text-white text-2xl"></i>
                <span class="text-white text-xl font-bold">TravelBoom</span>
            </div>
            <button id="mobileMenuButton" class="text-white md:hidden">
                <i class="fa-solid fa-bars-staggered text-xl"></i>
            </button>
        </div>

        <nav id="navCenter" class="hidden md:block mb-4 md:mb-0">
            <ul class="links flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <li>
                    <a href="./travel_recommendation.html" class="text-white hover:text-gray-300">Home</a>
                </li>
                <li>
                    <a href="./about.html" class="text-white hover:text-gray-300">About us</a>
                </li>
                <li>
                    <a href="./contact.html" class="text-white hover:text-gray-300">Contact us</a>
                </li>
            </ul>
        </nav>
        

    </div>

    <!-- About Us Content -->
    <main class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
            <!-- Company Information Section -->
            <section class="mb-16">
                <div class="text-center mb-12">
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About TravelBoom</h1>
                    <div class="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
                </div>
                
                <div class="max-w-4xl mx-auto">
                    <p class="text-lg text-gray-700 leading-relaxed mb-6">
                        Welcome to TravelBoom, your premier destination for discovering extraordinary travel experiences around the world. Founded with a passion for exploration and cultural discovery, we specialize in curating personalized travel recommendations that transform ordinary trips into unforgettable adventures.
                    </p>
                    <p class="text-lg text-gray-700 leading-relaxed mb-6">
                        Our mission is to inspire and empower travelers to explore diverse cultures, breathtaking landscapes, and hidden gems across the globe. We believe that travel is not just about visiting new places, but about creating meaningful connections and lasting memories that enrich your life.
                    </p>
                    <p class="text-lg text-gray-700 leading-relaxed">
                        With years of expertise in the travel industry, TravelBoom combines cutting-edge technology with personalized service to deliver recommendations tailored to your unique preferences and travel style.
                    </p>
                </div>
            </section>

            <!-- Team Members Section -->
            <section>
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
                    <div class="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Team Member 1 -->
                    <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-user text-3xl text-gray-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Sarah Johnson</h3>
                        <p class="text-red-500 font-semibold mb-3">CEO & Founder</p>
                        <p class="text-gray-600">Passionate traveler with 15+ years of experience in the tourism industry. Sarah leads our vision of making travel accessible and meaningful for everyone.</p>
                    </div>

                    <!-- Team Member 2 -->
                    <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-user text-3xl text-gray-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Michael Chen</h3>
                        <p class="text-red-500 font-semibold mb-3">Head of Technology</p>
                        <p class="text-gray-600">Tech enthusiast who develops innovative solutions to enhance your travel planning experience. Michael ensures our platform stays cutting-edge.</p>
                    </div>

                    <!-- Team Member 3 -->
                    <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-user text-3xl text-gray-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Emma Rodriguez</h3>
                        <p class="text-red-500 font-semibold mb-3">Travel Specialist</p>
                        <p class="text-gray-600">Cultural expert and destination specialist who curates authentic travel experiences. Emma's recommendations open doors to hidden gems worldwide.</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <script src="./travel_recommendation.js"></script>
</body>
</html>