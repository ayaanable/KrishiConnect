const OPENWEATHERMAP_API_KEY = "b3e602416ec776acc42e33ae558c0419"; // Get yours from https://openweathermap.org/appid
const USE_WEATHER_API = OPENWEATHERMAP_API_KEY && OPENWEATHERMAP_API_KEY !== "b3e602416ec776acc42e33ae558c0419";

// --- Mock Data (Used as Fallback or if APIs are disabled/fail) ---
const MOCK_USERS = {
    // Store users locally for demo. Real app needs backend.
    // Structure: username: { password, name, location, crops: [], lat?, lon? }
};

const MOCK_WEATHER_DATA = {
    // Added more locations with approximate coordinates for geocoding simulation
    "Panipat, Haryana, Punjab": { temp: 32, condition: "Sunny", humidity: 65, windSpeed: 10, forecast: [{ day: "Tomorrow", temp: 33, condition: "Partly Cloudy" }, { day: "Day After", temp: 31, condition: "Light Rain" }], lat: 29.3909, lon: 76.9635 },
    "Ludhiana, Punjab": { temp: 30, condition: "Clear", humidity: 60, windSpeed: 12, forecast: [{ day: "Tomorrow", temp: 31, condition: "Sunny" }, { day: "Day After", temp: 30, condition: "Clear" }], lat: 30.9010, lon: 75.8573 },
    "Lucknow, Uttar Pradesh": { temp: 35, condition: "Haze", humidity: 55, windSpeed: 8, forecast: [{ day: "Tomorrow", temp: 36, condition: "Haze" }, { day: "Day After", temp: 34, condition: "Sunny" }], lat: 26.8467, lon: 80.9462 },
    "Pune, Maharashtra": { temp: 28, condition: "Partly Cloudy", humidity: 70, windSpeed: 15, forecast: [{ day: "Tomorrow", temp: 29, condition: "Cloudy" }, { day: "Day After", temp: 28, condition: "Light Rain" }], lat: 18.5204, lon: 73.8567 }
};

const MOCK_MARKET_PRICES = [
    // Added timestamp for dynamism feel
    { id: 1, crop: "Rice (Basmati)", mandi: "Panipat Mandi", price: 3500, unit: "Quintal", trend: "up", timestamp: Date.now() - 3600000 },
    { id: 2, crop: "Wheat", mandi: "Karnal Mandi", price: 2100, unit: "Quintal", trend: "stable", timestamp: Date.now() - 7200000 },
    { id: 3, crop: "Tomato", mandi: "Local Market", price: 40, unit: "Kg", trend: "down", timestamp: Date.now() - 1800000 },
    { id: 4, crop: "Maize", mandi: "Ludhiana Mandi", price: 1950, unit: "Quintal", trend: "up", timestamp: Date.now() - 4800000 },
    { id: 5, crop: "Cotton", mandi: "Sirsa Mandi", price: 7500, unit: "Quintal", trend: "stable", timestamp: Date.now() - 86400000 },
    { id: 6, crop: "Wheat", mandi: "Ludhiana Mandi", price: 2150, unit: "Quintal", trend: "up", timestamp: Date.now() - 3000000 },
    { id: 7, crop: "Onion", mandi: "Pune Market", price: 1800, unit: "Quintal", trend: "down", timestamp: Date.now() - 24 * 3600000 },
    { id: 8, crop: "Potato", mandi: "Lucknow Mandi", price: 1500, unit: "Quintal", trend: "stable", timestamp: Date.now() - 12 * 3600000 },
];

const MOCK_ALERTS = {
    // Location specific alerts
    "Panipat, Haryana": [
        { id: 1, type: "warning", message: "High temperatures expected tomorrow afternoon. Ensure adequate irrigation for Rice.", timestamp: Date.now() - 9000000 },
        { id: 3, type: "pest", message: "Reports of Yellow Stem Borer in nearby regions. Monitor your Rice crop.", timestamp: Date.now() - 86400000 * 2 },
    ],
    "Ludhiana, Punjab": [
        { id: 2, type: "info", message: "New government subsidy announced for drip irrigation systems. Check eligibility.", timestamp: Date.now() - 18000000 },
        { id: 4, type: "info", message: "Cotton sowing window approaching. Prepare fields.", timestamp: Date.now() - 86400000 * 3 },
    ],
    "Pune, Maharashtra": [
        { id: 5, type: "info", message: "Forecast indicates light rain possible later this week. Plan accordingly.", timestamp: Date.now() - 3600000 * 6 },
    ],
    // Generic alerts (shown if no location match) - can be added later
};

const MOCK_KNOWLEDGE_ARTICLES = [
    { id: 1, title: "Effective Water Management Techniques", summary: "Learn about drip irrigation, rainwater harvesting, and soil moisture conservation to optimize water usage.", tags: ["water", "irrigation", "conservation"] },
    { id: 2, title: "Understanding Soil Health", summary: "Discover the importance of soil testing, organic matter, and crop rotation for sustainable agriculture.", tags: ["soil", "health", "testing", "organic"] },
    { id: 3, title: "Guide to PM-KISAN Scheme", summary: "Eligibility criteria, application process, and benefits of the Pradhan Mantri Kisan Samman Nidhi scheme.", tags: ["scheme", "government", "subsidy", "pm-kisan"] },
    { id: 4, title: "Integrated Pest Management (IPM)", summary: "Control pests effectively while minimizing environmental impact using biological controls and monitoring.", tags: ["pest", "ipm", "organic", "control"] },
    { id: 5, title: "Choosing the Right Seeds", summary: "Factors to consider when selecting seeds, including climate suitability, disease resistance, and yield potential.", tags: ["seeds", "variety", "yield"] },
    { id: 6, title: "Benefits of Crop Rotation", summary: "Improve soil fertility, reduce pests and diseases, and enhance biodiversity through planned crop rotation.", tags: ["crop rotation", "soil", "fertility"] },
    { id: 7, title: "Introduction to Organic Farming", summary: "Principles and practices of organic farming, focusing on natural inputs and ecological balance.", tags: ["organic", "farming", "sustainable"] },
    { id: 8, title: "Government Schemes for Farmers", summary: "An overview of various central and state government schemes available to support farmers.", tags: ["scheme", "government", "support"] },
];

// Store forum posts in memory for this demo
let mockForumPosts = [
    { id: 1, title: "Best fertilizer for Wheat?", author: "Sita Devi", content: "What is everyone using for wheat fertilization this season in Punjab?", timestamp: new Date(Date.now() - 86400000), replies: [{ author: "Admin", content: "Consider soil testing first, but DAP is common." }] },
    { id: 2, title: "Low Rice Yield Issue", author: "Ramesh Kumar", content: "My Basmati yield was lower than expected last season in Haryana. Any tips?", timestamp: new Date(Date.now() - 172800000), replies: [] },
    { id: 3, title: "Organic pesticide recommendations?", author: "Amit Singh", content: "Looking for effective organic ways to control aphids on my vegetable crops.", timestamp: new Date(Date.now() - 2 * 86400000), replies: [{ author: "Expert", content: "Neem oil spray or introducing ladybugs can be effective." }] },
];
let nextPostId = 4; // Start next ID after existing mock posts

// --- Application State & Logic ---
let currentUser = null; // Store logged-in user info { username, name, location, crops?, lat?, lon? }
let mapInstance = null; // To hold the Leaflet map object

// --- DOM Elements (Cached for performance) ---
const pages = document.querySelectorAll('.page');
const landingNav = document.getElementById('landing-nav');
const mainNav = document.getElementById('main-nav');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');
const welcomeMessage = document.getElementById('welcome-message');
const userLocation = document.getElementById('user-location');
const weatherContent = document.getElementById('weather-content');
const marketPricesSummary = document.getElementById('market-prices-summary');
const alertsContent = document.getElementById('alerts-content');
const marketPricesTableBody = document.getElementById('market-prices-table-body');
const marketSelectMandi = document.getElementById('market-select-mandi');
const forumPostsContainer = document.getElementById('forum-posts-container');
const newPostForm = document.getElementById('new-post-form');
const cropImageUpload = document.getElementById('crop-image-upload');
const cropDiagnosisResult = document.getElementById('crop-diagnosis-result');
const diagnosisLoading = document.getElementById('diagnosis-loading');
const cropDoctorMessage = document.getElementById('crop-doctor-message'); // Message area
const diseaseName = document.getElementById('disease-name');
const diseaseInfo = document.getElementById('disease-info');
const diseaseRemedy = document.getElementById('disease-remedy');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');
const knowledgeArticlesContainer = document.getElementById('knowledge-articles-container');
const mapContainer = document.getElementById('map');

// --- Routing ---
function navigateTo(pageId) {
    // Simple check if page element exists
    if (!document.getElementById(`page-${pageId}`)) {
        console.error(`Navigation Error: Page with ID 'page-${pageId}' not found.`);
        alert('Sorry, that section is not available.'); // User feedback
        return;
    }

    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageId}`);

    if (targetPage) {
        targetPage.classList.add('active');
        // Initialize map only when dashboard becomes active and user is logged in
        if (pageId === 'dashboard' && currentUser) {
            initializeMap();
        }
    } else {
        // Fallback logic (should ideally not be needed with the check above)
        const defaultPageId = currentUser ? 'dashboard' : 'landing';
        const defaultPage = document.getElementById(`page-${defaultPageId}`);
        if (defaultPage) defaultPage.classList.add('active');
        if (defaultPageId === 'dashboard' && currentUser) {
            initializeMap();
        }
    }

    updateActiveNavLinks(pageId);
    window.scrollTo(0, 0); // Scroll to top
}

function updateActiveNavLinks(pageId) {
    const currentNav = currentUser ? mainNav : landingNav;
    currentNav.querySelectorAll('.nav-link, button[data-page]').forEach(link => {
        const linkPage = link.dataset.page || (link.matches('a') ? link.getAttribute('href')?.substring(1) : null);

        link.classList.remove('active', 'bg-white/20'); // Remove generic and specific active styles

        if (linkPage === pageId) {
            link.classList.add('active');
            if (link.closest('#main-nav')) {
                link.classList.add('bg-white/20'); // Add specific style only for main nav
            }
        }
    });
}


// --- Authentication & User Management ---

/**
 * Retrieves users from local storage, initializing if necessary.
 */
function getUsersFromStorage() {
    try {
        const storedUsers = localStorage.getItem('krishiUsers');
        return storedUsers ? JSON.parse(storedUsers) : MOCK_USERS; // Use mock as initial if nothing stored
    } catch (e) {
        console.error("Error reading users from local storage:", e);
        return MOCK_USERS; // Fallback to mock data on error
    }
}

/**
 * Saves the current user object to local storage.
 */
function saveUsersToStorage(users) {
    try {
        localStorage.setItem('krishiUsers', JSON.stringify(users));
    } catch (e) {
        console.error("Error saving users to local storage:", e);
    }
}

/**
 * Simulates geocoding by looking up location string in MOCK_WEATHER_DATA.
 * Returns { lat, lon } or null if not found.
 */
function simulateGeocode(locationString) {
    const locationData = MOCK_WEATHER_DATA[locationString];
    if (locationData && locationData.lat && locationData.lon) {
        return { lat: locationData.lat, lon: locationData.lon };
    }
    // Try partial matching (e.g., "Panipat" from "Panipat, Haryana") - very basic
    const city = locationString.split(',')[0].trim();
    for (const key in MOCK_WEATHER_DATA) {
        if (key.toLowerCase().includes(city.toLowerCase())) {
            const data = MOCK_WEATHER_DATA[key];
            if (data.lat && data.lon) return { lat: data.lat, lon: data.lon };
        }
    }
    return null; // Not found
}


function handleLogin(event) {
    event.preventDefault();
    const username = loginForm.username.value.trim().toLowerCase();
    const password = loginForm.password.value;
    loginError.textContent = '';

    const users = getUsersFromStorage();
    const user = users[username];

    // IMPORTANT: In a real application, compare hashed passwords!
    if (user && user.password === password) {
        currentUser = { username, ...user };

        // Simulate geocoding if lat/lon are missing
        if (!currentUser.lat || !currentUser.lon) {
            const coords = simulateGeocode(currentUser.location);
            if (coords) {
                currentUser.lat = coords.lat;
                currentUser.lon = coords.lon;
            }
        }

        localStorage.setItem('krishiUser', JSON.stringify(currentUser)); // Store current user session
        showLoggedInState();
        navigateTo('dashboard');
        loginForm.reset();
    } else {
        loginError.textContent = 'Invalid username or password.';
    }
}

function handleSignup(event) {
    event.preventDefault();
    signupError.textContent = '';
    const name = document.getElementById('signup-name').value.trim();
    const username = document.getElementById('signup-username').value.trim().toLowerCase();
    const location = document.getElementById('signup-location').value.trim();
    const password = document.getElementById('signup-password').value;

    // Basic Validation
    if (!name || !username || !location || !password) {
        signupError.textContent = 'Please fill in all fields.';
        return;
    }
    if (username.includes(" ") || !/^[a-z0-9_]+$/.test(username)) {
        signupError.textContent = 'Username can only contain lowercase letters, numbers, and underscores.';
        return;
    }
    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    let users = getUsersFromStorage();

    if (users[username]) {
        signupError.textContent = 'Username already exists. Please choose another.';
        return;
    }

    // Simulate geocoding for the new user
    const coords = simulateGeocode(location);
    let lat = coords ? coords.lat : null;
    let lon = coords ? coords.lon : null;

    // Add new user (Storing plain password is BAD PRACTICE for real apps!)
    users[username] = { password, name, location, lat, lon, crops: [] };
    saveUsersToStorage(users);

    // --- Direct Login ---
    currentUser = { username, name, location, lat, lon, crops: [] };
    localStorage.setItem('krishiUser', JSON.stringify(currentUser)); // Store current user session

    alert('Signup successful! Welcome to KrishiConnect.');
    showLoggedInState();
    navigateTo('dashboard');
    signupForm.reset();
}


function handleLogout() {
    currentUser = null;
    localStorage.removeItem('krishiUser');
    if (mapInstance) {
        try {
            mapInstance.remove(); // Cleanly remove map
        } catch (e) { console.error("Error removing map:", e); }
        mapInstance = null;
    }
    showLoggedOutState();
    navigateTo('landing');
}

function checkLoginStatus() {
    const storedUser = localStorage.getItem('krishiUser');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            if (currentUser && currentUser.username) {
                // Simulate geocoding on load if needed
                if ((!currentUser.lat || !currentUser.lon) && currentUser.location) {
                    const coords = simulateGeocode(currentUser.location);
                    if (coords) {
                        currentUser.lat = coords.lat;
                        currentUser.lon = coords.lon;
                        localStorage.setItem('krishiUser', JSON.stringify(currentUser)); // Update stored user
                    }
                }
                showLoggedInState();
                navigateTo('dashboard');
                return;
            } else {
                localStorage.removeItem('krishiUser');
                currentUser = null;
            }
        } catch (e) {
            console.error("Error parsing stored user data:", e);
            localStorage.removeItem('krishiUser');
            currentUser = null;
        }
    }
    showLoggedOutState();
    navigateTo('landing');
}


function showLoggedInState() {
    landingNav.classList.add('hidden');
    mainNav.classList.remove('hidden');
    loadAllDynamicData(); // Load data needed for logged-in state
}

function showLoggedOutState() {
    mainNav.classList.add('hidden');
    landingNav.classList.remove('hidden');
}

// --- Data Loading & Display ---

function loadAllDynamicData() {
    if (!currentUser) return;
    loadDashboardData(); // This now includes weather API call attempt
    loadMarketPricesData(); // Initial load of full table
    loadForumPosts(); // Initial load of full forum
    loadKnowledgeBase(); // Initial load of full knowledge base
    populateMandiFilter();
}

async function loadDashboardData() {
    if (!currentUser) return;

    // Welcome Message & Location
    welcomeMessage.textContent = `Welcome, ${currentUser.name}!`;
    userLocation.innerHTML = `<i class="fas fa-map-marker-alt mr-1 text-gray-500"></i> ${currentUser.location || 'Location not set'}`;

    // --- Load Weather ---
    weatherContent.innerHTML = '<p class="loading-placeholder">Loading weather...</p>';
    let weatherData = null;
    let weatherSource = "mock"; // Track where data came from

    // Try API first if enabled and location exists
    if (USE_WEATHER_API && currentUser.location) {
        try {
            // Use city name search directly with OpenWeatherMap API
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(currentUser.location)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
            if (!response.ok) {
                // Handle common errors like 404 (city not found) or 401 (invalid key)
                if (response.status === 404) {
                    console.warn(`Weather API: Location '${currentUser.location}' not found.`);
                    throw new Error(`Location not found by API`);
                } else if (response.status === 401) {
                    console.error("Weather API: Invalid API Key.");
                    throw new Error(`Invalid API Key`);
                } else {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
            }
            const apiData = await response.json();
            weatherData = {
                temp: Math.round(apiData.main.temp),
                condition: apiData.weather[0]?.description || 'N/A',
                humidity: apiData.main.humidity,
                windSpeed: Math.round(apiData.wind.speed * 3.6), // m/s to km/h
                icon: apiData.weather[0]?.icon,
                // Forecast requires a different API call (One Call API or 5 day / 3 hour forecast)
                // Using mock forecast for simplicity in this demo
                forecast: MOCK_WEATHER_DATA[currentUser.location]?.forecast || []
            };
            weatherSource = "API";

            // Update user's lat/lon from API response if missing
            if ((!currentUser.lat || !currentUser.lon) && apiData.coord) {
                currentUser.lat = apiData.coord.lat;
                currentUser.lon = apiData.coord.lon;
                localStorage.setItem('krishiUser', JSON.stringify(currentUser)); // Update storage
                console.log("Updated user coordinates from weather API.");
            }

        } catch (error) {
            console.error("Weather API fetch failed:", error.message);
            // Fallback to mock data if API fails
            weatherData = MOCK_WEATHER_DATA[currentUser.location];
            weatherContent.innerHTML = `<p class="text-xs text-red-500 mb-1">Live weather failed (${error.message}). Showing mock data.</p>`; // Show error before mock data
        }
    } else {
        // Use mock data if API is disabled or location is missing
        weatherData = MOCK_WEATHER_DATA[currentUser.location];
        if (!USE_WEATHER_API) console.log("Weather API is disabled or key missing. Using mock data.");
    }

    // Display Weather Data
    if (weatherData) {
        let forecastHtml = weatherData.forecast.map(f => `<li class="flex justify-between text-xs"><span>${f.day}:</span> <span>${f.temp}°C, ${f.condition}</span></li>`).join('');
        // Prepend existing error message if it exists
        const existingError = weatherContent.querySelector('.text-red-500') ? weatherContent.innerHTML : '';
        weatherContent.innerHTML = existingError + `
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-3xl font-bold text-gray-800">${weatherData.temp}°C</div>
                        ${weatherData.icon ? `<img src="https://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="${weatherData.condition}" title="${weatherData.condition}" class="w-12 h-12 -mr-2">` : `<i class="fas ${getWeatherIconClass(weatherData.condition)} text-3xl" title="${weatherData.condition}"></i>`}
                    </div>
                    <p class="text-md capitalize mb-1">${weatherData.condition}</p>
                    <p class="text-xs text-gray-600">Humidity: ${weatherData.humidity}% | Wind: ${weatherData.windSpeed} km/h</p>
                    ${forecastHtml ? `<hr class="my-2 border-gray-200" />
                    <h4 class="font-semibold mb-1 text-sm">Forecast (Mock):</h4>
                    <ul class="space-y-1">${forecastHtml}</ul>` : ''}
                    <p class="text-xs text-gray-400 mt-2">Source: ${weatherSource}</p>
                `;
    } else {
        weatherContent.innerHTML = '<p class="text-sm text-gray-500">Weather data unavailable for this location.</p>';
    }

    // --- Load Market Prices Summary ---
    marketPricesSummary.innerHTML = '<p class="loading-placeholder">Loading prices...</p>';
    const userCrops = currentUser.crops || [];
    // Use a copy of mock prices to avoid modifying original
    const pricesCopy = [...MOCK_MARKET_PRICES];
    const relevantPrices = pricesCopy
        .sort((a, b) => b.timestamp - a.timestamp) // Sort by recent first
        .filter(price =>
            userCrops.some(crop => price.crop.toLowerCase().includes(crop.toLowerCase())) || MOCK_MARKET_PRICES.indexOf(price) < 3
        ).slice(0, 3); // Show max 3

    let pricesHtml = relevantPrices.map(item => `
                <li class="border-b border-gray-100 py-1 last:border-b-0 text-sm">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">${item.crop}</span>
                        <span class="text-green-700 font-semibold">
                            ₹${item.price}/${item.unit} ${getTrendIndicator(item.trend)}
                        </span>
                    </div>
                    <div class="text-xs text-gray-500">${item.mandi} (${timeAgo(item.timestamp)})</div>
                </li>`).join('');
    marketPricesSummary.innerHTML = `<ul class="space-y-2">${pricesHtml || '<p class="text-sm text-gray-500">No relevant price data.</p>'}</ul>`;

    // --- Load Alerts ---
    alertsContent.innerHTML = '<p class="loading-placeholder">Loading alerts...</p>';
    const alerts = MOCK_ALERTS[currentUser.location] || [];
    let alertsHtml = alerts.sort((a, b) => b.timestamp - a.timestamp).map(alert => `
                <li class="p-2 rounded text-sm ${getAlertStyle(alert.type)} mb-2 shadow-sm">
                   <p class="font-medium text-xs uppercase tracking-wide">${alert.type}</p>
                   <p class="text-sm mt-1">${alert.message}</p>
                   <p class="text-xs text-gray-500 mt-1 text-right">(${timeAgo(alert.timestamp)})</p>
                </li>`).join('');
    alertsContent.innerHTML = `<ul class="space-y-1">${alertsHtml || '<p class="text-sm text-gray-500">No current alerts.</p>'}</ul>`;

    // Initialize map after data load if dashboard is active
    if (document.getElementById('page-dashboard').classList.contains('active')) {
        initializeMap();
    }
}

function loadMarketPricesData(filterCrop = '', filterMandi = '') {
    const filteredPrices = MOCK_MARKET_PRICES.filter(item => {
        const cropMatch = !filterCrop || item.crop.toLowerCase().includes(filterCrop.toLowerCase());
        const mandiMatch = !filterMandi || item.mandi === filterMandi;
        return cropMatch && mandiMatch;
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent

    let tableHtml = filteredPrices.map(item => `
                <tr class="border-b border-gray-200">
                    <td class="py-3 px-4 text-left whitespace-nowrap">${item.crop}</td>
                    <td class="py-3 px-4 text-left">${item.mandi}</td>
                    <td class="py-3 px-4 text-center font-medium">₹${item.price}</td>
                    <td class="py-3 px-4 text-center">${item.unit}</td>
                    <td class="py-3 px-4 text-center">${getTrendIndicator(item.trend, true)}</td>
                    <td class="py-3 px-4 text-center text-xs text-gray-500">${timeAgo(item.timestamp)}</td>
                </tr>
            `).join('');
    marketPricesTableBody.innerHTML = tableHtml || '<tr><td colspan="6" class="text-center p-4 text-gray-500">No matching market data found.</td></tr>';
}

function populateMandiFilter() {
    const mandis = [...new Set(MOCK_MARKET_PRICES.map(item => item.mandi))].sort();
    // Clear previous options except the default one
    marketSelectMandi.innerHTML = '<option value="">All Mandis</option>';
    mandis.forEach(mandi => {
        const option = document.createElement('option');
        option.value = mandi;
        option.textContent = mandi;
        marketSelectMandi.appendChild(option);
    });
}

function filterMarketPrices() {
    const cropFilter = document.getElementById('market-search-crop').value;
    const mandiFilter = marketSelectMandi.value;
    loadMarketPricesData(cropFilter, mandiFilter);
}

function loadKnowledgeBase(filterText = '') {
    const filteredArticles = MOCK_KNOWLEDGE_ARTICLES.filter(article => {
        const searchText = filterText.toLowerCase();
        return !filterText ||
            article.title.toLowerCase().includes(searchText) ||
            article.summary.toLowerCase().includes(searchText) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchText));
    });

    let articlesHtml = filteredArticles.map(article => `
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col border border-gray-200">
                    <h3 class="font-semibold text-lg mb-2 text-indigo-700">${article.title}</h3>
                    <p class="text-gray-600 text-sm mb-3 flex-grow">${article.summary}</p>
                    <div class="mt-auto pt-3 border-t border-gray-100">
                         <div class="text-xs text-gray-500 mb-2">
                             Tags: ${article.tags.map(tag => `<span class="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs mr-1 mb-1">${tag}</span>`).join('')}
                         </div>
                        <a href="#" class="text-sm text-green-600 hover:text-green-800 font-medium" onclick="alert('Reading article ${article.id} - Not implemented')">Read More &raquo;</a>
                    </div>
                </div>
             `).join('');
    knowledgeArticlesContainer.innerHTML = articlesHtml || '<p class="text-center text-gray-500 md:col-span-2 lg:col-span-3">No articles found matching your search.</p>';
}

function filterKnowledgeArticles() {
    const filter = document.getElementById('knowledge-search').value;
    loadKnowledgeBase(filter);
}


function loadForumPosts(filterText = '') {
    const filteredPosts = mockForumPosts.filter(post => {
        const searchText = filterText.toLowerCase();
        return !filterText ||
            post.title.toLowerCase().includes(searchText) ||
            post.content.toLowerCase().includes(searchText) ||
            post.author.toLowerCase().includes(searchText);
    });

    let postsHtml = filteredPosts.sort((a, b) => b.timestamp - a.timestamp).map(post => `
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 class="font-semibold text-md mb-1 text-purple-700">${post.title}</h4>
                    <p class="text-sm text-gray-800 mb-2 whitespace-pre-wrap">${post.content}</p>
                    <div class="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
                         <p class="text-xs text-gray-500">Posted by ${post.author} (${timeAgo(post.timestamp)})</p>
                         <button class="text-xs text-blue-600 hover:underline" onclick="alert('Reply functionality not implemented')">Reply (${post.replies.length})</button>
                    </div>
                    ${post.replies.length > 0 ? `<div class="mt-2 pt-2 pl-4 border-l-2 border-gray-200 space-y-2">
                        ${post.replies.map(reply => `<div class="text-xs text-gray-600"><strong class="text-gray-700">${reply.author}:</strong> ${reply.content}</div>`).join('')}
                    </div>` : ''}
                     </div>
            `).join('');
    forumPostsContainer.innerHTML = postsHtml || '<p class="text-center text-gray-500">No forum posts found matching your search.</p>';
}

function filterForumPosts() {
    const filter = document.getElementById('forum-search').value;
    loadForumPosts(filter);
}


function handleNewPost(event) {
    event.preventDefault();
    if (!currentUser) return; // Should not happen if form is visible

    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (title && content) {
        const newPost = {
            id: nextPostId++,
            title: title,
            author: currentUser.name, // Use logged-in user's name
            content: content,
            timestamp: new Date(),
            replies: []
        };
        mockForumPosts.unshift(newPost); // Add to the beginning of the array
        loadForumPosts(); // Reload posts to show the new one
        newPostForm.reset(); // Clear the form
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    // Clear previous results and messages
    cropDiagnosisResult.classList.add('hidden');
    imagePreviewContainer.classList.add('hidden');
    cropDoctorMessage.textContent = ''; // Clear error message area
    diagnosisLoading.classList.add('hidden');

    if (!file) {
        console.log("No file selected.");
        return;
    }

    // Basic file type check based on extension
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
    if (!allowedExtensions.exec(file.name)) {
        console.warn("Invalid file type selected:", file.name);
        cropDoctorMessage.textContent = 'Invalid file type. Please upload a JPG, JPEG, PNG, or WEBP image.';
        cropImageUpload.value = ''; // Reset file input
        return;
    }

    // Proceed if it's a valid image type
    console.log("Image selected:", file.name);

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreviewContainer.classList.remove('hidden');
    }
    reader.readAsDataURL(file);

    // --- Simulate AI processing ---
    diagnosisLoading.classList.remove('hidden'); // Show loading indicator

    setTimeout(() => {
        diagnosisLoading.classList.add('hidden'); // Hide loading indicator

        // Mock Diagnosis (Slightly improved logic based on filename hints)
        let mockDisease = "Unknown Condition (Mock)";
        let mockInfo = "Could not identify a specific condition based on the provided image name.";
        let mockRemedy = "Ensure the image is clear and shows the affected area well. Consult a local expert for accurate diagnosis.";

        const fileNameLower = file.name.toLowerCase();

        if (fileNameLower.includes("blight")) {
            mockDisease = "Leaf Blight (Mock)";
            mockInfo = "Caused by fungal spores, typically appearing as water-soaked spots that enlarge and turn brown. Common in humid conditions.";
            mockRemedy = "Remove and destroy infected leaves immediately. Ensure proper plant spacing for air circulation. Apply appropriate fungicide as recommended by local experts. Avoid overhead watering.";
        } else if (fileNameLower.includes("healthy")) {
            mockDisease = "Healthy Leaf (Mock)";
            mockInfo = "The leaf appears healthy with no significant signs of common diseases or nutrient deficiencies.";
            mockRemedy = "Continue good farming practices. Monitor plants regularly for any changes.";
        } else if (fileNameLower.includes("rust")) {
            mockDisease = "Leaf Rust (Mock)";
            mockInfo = "Fungal disease characterized by small, orange-to-brown pustules on the leaf surface. Can spread rapidly.";
            mockRemedy = "Use resistant crop varieties if available. Apply recommended fungicides preventatively or at first sign of infection. Remove infected plant debris after harvest.";
        } else if (fileNameLower.includes("yellow") || fileNameLower.includes("deficiency")) {
            mockDisease = "Nutrient Deficiency (Mock - e.g., Nitrogen)";
            mockInfo = "General yellowing of leaves, often starting with older ones. Could indicate a lack of Nitrogen or other essential nutrients.";
            mockRemedy = "Conduct a soil test to confirm deficiency. Apply appropriate fertilizer based on soil test results. Improve soil organic matter.";
        } else if (fileNameLower.includes("spot")) {
            mockDisease = "Leaf Spot (Mock)";
            mockInfo = "Various fungal or bacterial infections causing spots on leaves. Appearance varies.";
            mockRemedy = "Improve air circulation. Avoid wetting foliage. Apply appropriate fungicide or bactericide if necessary. Remove severely infected leaves.";
        }


        diseaseName.textContent = mockDisease;
        diseaseInfo.textContent = mockInfo;
        diseaseRemedy.textContent = mockRemedy;
        cropDiagnosisResult.classList.remove('hidden');
    }, 1500); // Simulate processing time
}


// --- Map Initialization ---
function initializeMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded.");
        mapContainer.innerHTML = '<p class="text-center text-red-500 p-4">Error: Mapping library failed to load.</p>';
        return;
    }

    // Check if user and coordinates are available
    if (!currentUser || typeof currentUser.lat !== 'number' || typeof currentUser.lon !== 'number') {
        mapContainer.innerHTML = '<p class="text-center text-gray-500 p-4">Location data (Latitude/Longitude) not available for map display. Please ensure your location is set correctly in your profile (or during signup).</p>';
        if (mapInstance) { // Remove existing map if coords become invalid
            try { mapInstance.remove(); } catch (e) { }
            mapInstance = null;
        }
        return;
    }

    // If map already exists and coordinates are the same, do nothing
    if (mapInstance && mapInstance.getCenter().lat === currentUser.lat && mapInstance.getCenter().lng === currentUser.lon) {
        return;
    }

    // If map exists but needs recentering
    if (mapInstance) {
        try {
            mapInstance.setView([currentUser.lat, currentUser.lon], 13);
            // Update marker position if needed (optional, usually done on creation)
        } catch (e) { console.error("Error recentering map:", e); }
        return;
    }


    // Create new map instance
    try {
        mapContainer.innerHTML = ''; // Clear loading/error message
        mapInstance = L.map('map').setView([currentUser.lat, currentUser.lon], 13); // Default zoom level 13

        // Add Satellite Tile Layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 18, // Allow closer zoom
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(mapInstance);

        // Add a marker for the user's location
        L.marker([currentUser.lat, currentUser.lon]).addTo(mapInstance)
            .bindPopup(`<b>${currentUser.name}'s Location</b><br>${currentUser.location || 'Coordinates provided'}`)
            .openPopup(); // Open popup by default

        // Optional: Add scale control
        L.control.scale({ imperial: false }).addTo(mapInstance);

    } catch (error) {
        console.error("Failed to initialize map:", error);
        mapContainer.innerHTML = '<p class="text-center text-red-500 p-4">Error loading map display.</p>';
        mapInstance = null; // Reset instance on error
    }
}


// --- Helper Functions ---
function getWeatherIconClass(condition) {
    const condLower = condition?.toLowerCase() || "";
    if (condLower.includes("rain") || condLower.includes("shower")) return "fas fa-cloud-showers-heavy text-blue-500";
    if (condLower.includes("cloud")) return "fas fa-cloud text-gray-500";
    if (condLower.includes("sunny") || condLower.includes("clear")) return "fas fa-sun text-yellow-500";
    if (condLower.includes("thunder") || condLower.includes("storm")) return "fas fa-bolt text-yellow-600"; // Changed icon
    if (condLower.includes("snow")) return "fas fa-snowflake text-blue-300";
    if (condLower.includes("haze") || condLower.includes("fog") || condLower.includes("mist")) return "fas fa-smog text-gray-400";
    return "fas fa-question-circle text-gray-400"; // Default
}

function getTrendIndicator(trend, useIcon = false) {
    const iconClass = "inline-block ml-1 w-3 h-3";
    if (trend === "up") return useIcon ? `<i class="fas fa-arrow-up text-green-500 ${iconClass}" title="Price Up"></i>` : '<span class="text-green-500 ml-1">▲</span>';
    if (trend === "down") return useIcon ? `<i class="fas fa-arrow-down text-red-500 ${iconClass}" title="Price Down"></i>` : '<span class="text-red-500 ml-1">▼</span>';
    return useIcon ? `<i class="fas fa-minus text-gray-500 ${iconClass}" title="Price Stable"></i>` : '<span class="text-gray-500 ml-1">●</span>'; // Stable
}

function getAlertStyle(type) {
    switch (type) {
        case 'warning': return 'border-l-4 border-yellow-400 bg-yellow-50 text-yellow-800';
        case 'info': return 'border-l-4 border-blue-400 bg-blue-50 text-blue-800';
        case 'pest': return 'border-l-4 border-red-400 bg-red-50 text-red-800';
        case 'success': return 'border-l-4 border-green-400 bg-green-50 text-green-800';
        default: return 'border-l-4 border-gray-400 bg-gray-50 text-gray-800';
    }
}

function timeAgo(timestamp) {
    if (!timestamp) return ''; // Handle cases where timestamp might be missing
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 0) return 'just now'; // Handle invalid dates or future dates

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    if (diffInDays === 1) return `Yesterday`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInWeeks < 5) return `${diffInWeeks} wk ago`; // Up to 4 weeks
    if (diffInMonths < 12) return `${diffInMonths} mo ago`;
    return past.toLocaleDateString(); // Older than a year, show full date
}


// --- Event Listeners ---
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);
logoutButton.addEventListener('click', handleLogout);
newPostForm.addEventListener('submit', handleNewPost);
cropImageUpload.addEventListener('change', handleImageUpload);

// Navigation link clicks using event delegation on body
document.body.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-page], button[data-page]');
    if (link && link.dataset.page) {
        const nav = currentUser ? mainNav : landingNav;
        // Ensure the click is within the *visible* nav or is a page navigation button
        // Also allow clicks on non-nav buttons that navigate (like dashboard cards)
        if (nav.contains(link) || link.classList.contains('btn') || link.closest('.dashboard-card')) {
            event.preventDefault();
            if (link.id !== 'logout-button') { // Logout handled separately
                navigateTo(link.dataset.page);
            }
        }
    }
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', checkLoginStatus);