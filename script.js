// OpenWeatherMap API Configuration
// Get your free API key from: https://openweathermap.org/api
const API_KEY = '765626d832628e4cc8efc48bef0c7426'; // Replace with your API key if needed
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Get DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// Weather display elements
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const visibility = document.getElementById('visibility');

// Event listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Fetch weather data from API
async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading();
    hideError();
    hideWeather();

    try {
        const response = await fetch(
            `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Display weather data on the UI
function displayWeather(data) {
    // City and country
    cityName.textContent = data.name;
    country.textContent = data.sys.country;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Temperature and description
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    
    // Weather details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    showWeather();
}

// UI helper functions
function showWeather() {
    weatherDisplay.classList.add('show');
}

function hideWeather() {
    weatherDisplay.classList.remove('show');
}

function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.remove('show');
}

// Optional: Load default city on page load
window.addEventListener('load', () => {
    cityInput.value = ''; // Empty input
    cityInput.focus();    // Cursor ready to type
});