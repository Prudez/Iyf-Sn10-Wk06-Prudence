const API_KEY = "e3c828e4f519219e5409ecc50c3df209";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const searchHistoryList = document.getElementById("search-history");

// Elements to update
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const MAX_HISTORY = 5;
let recentCities = [];

// Fetch weather from API
async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        showLoading();
        hideError();

        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found");
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        displayWeather(data);
        saveToHistory(city);

    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

// Display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    temperature.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
    description.textContent = `Condition: ${data.weather[0].description}`;
    feelsLike.textContent = `${data.main.feels_like.toFixed(1)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    weatherDisplay.classList.remove("hidden");

    // Optional: Background based on weather
    document.body.style.background = getBackgroundGradient(data.weather[0].main);
}

// Background gradient based on weather
function getBackgroundGradient(weatherMain) {
    switch (weatherMain.toLowerCase()) {
        case "clear": return "linear-gradient(to right, #2980b9, #6dd5fa)";
        case "clouds": return "linear-gradient(to right, #bdc3c7, #2c3e50)";
        case "rain": return "linear-gradient(to right, #000046, #1cb5e0)";
        case "snow": return "linear-gradient(to right, #83a4d4, #b6fbff)";
        case "thunderstorm": return "linear-gradient(to right, #373b44, #4286f4)";
        default: return "linear-gradient(to right, #2980b9, #6dd5fa)";
    }
}

// Loading & Error
function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}

function hideError() {
    error.classList.add("hidden");
}

// Recent searches
function saveToHistory(city) {
    recentCities = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    recentCities = recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
    recentCities.unshift(city);
    if (recentCities.length > MAX_HISTORY) recentCities = recentCities.slice(0, MAX_HISTORY);
    localStorage.setItem("weatherHistory", JSON.stringify(recentCities));
    renderHistory();
}

function loadHistory() {
    recentCities = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    renderHistory();
}

function renderHistory() {
    searchHistoryList.innerHTML = recentCities.map(city => `
        <li><button class="history-btn">${city}</button></li>
    `).join("");

    document.querySelectorAll(".history-btn").forEach(btn => {
        btn.addEventListener("click", () => getWeather(btn.textContent));
    });
}

// Event listeners
form.addEventListener("submit", e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

// Initialize
loadHistory();