
"use strict";

// ==========================================
// UNLOX - INDIA WEATHER EXPLORER
// Weather data powered by Open-Meteo
// ==========================================

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherMessage = document.getElementById("weatherMessage");
const weatherResult = document.getElementById("weatherResult");
const searchButton = document.getElementById("searchButton");


// Weather code descriptions and icons
const weatherCodes = {
    0: ["Clear Sky", "☀️"],
    1: ["Mainly Clear", "🌤️"],
    2: ["Partly Cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Depositing Rime Fog", "🌫️"],
    51: ["Light Drizzle", "🌦️"],
    53: ["Moderate Drizzle", "🌦️"],
    55: ["Dense Drizzle", "🌧️"],
    56: ["Freezing Drizzle", "🌧️"],
    57: ["Heavy Freezing Drizzle", "🌧️"],
    61: ["Slight Rain", "🌧️"],
    63: ["Moderate Rain", "🌧️"],
    65: ["Heavy Rain", "🌧️"],
    66: ["Freezing Rain", "🌧️"],
    67: ["Heavy Freezing Rain", "🌧️"],
    71: ["Slight Snowfall", "❄️"],
    73: ["Moderate Snowfall", "❄️"],
    75: ["Heavy Snowfall", "❄️"],
    77: ["Snow Grains", "❄️"],
    80: ["Rain Showers", "🌦️"],
    81: ["Moderate Rain Showers", "🌧️"],
    82: ["Heavy Rain Showers", "🌧️"],
    85: ["Snow Showers", "❄️"],
    86: ["Heavy Snow Showers", "❄️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with Hail", "⛈️"],
    99: ["Severe Thunderstorm", "⛈️"]
};


// Get weather description
function getWeatherDescription(code) {
    return weatherCodes[code] || ["Weather Unavailable", "🌍"];
}


// ==========================================
// 1. FIND AN INDIAN CITY
// ==========================================

async function getCityCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json&countryCode=IN`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for the city. Please try again.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(
            "Indian city not found. Please enter a valid city in India."
        );
    }

    // Extra validation: accept only Indian results.
    const indianCities = data.results.filter(
        location => location.country_code === "IN"
    );

    if (indianCities.length === 0) {
        throw new Error(
            "This location is not in India. Please search for an Indian city."
        );
    }

    // Prefer exact city-name match.
    const selectedCity = indianCities.find(
        location => location.name.toLowerCase() === city.toLowerCase()
    ) || indianCities[0];

    const {
        latitude,
        longitude,
        name,
        country,
        admin1
    } = selectedCity;

    return {
        latitude,
        longitude,
        name,
        country,
        admin1
    };
}


// ==========================================
// 2. FETCH REAL WEATHER DATA
// ==========================================

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,precipitation_probability,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
        `&timezone=auto&forecast_days=7`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to retrieve weather data. Please try again.");
    }

    return await response.json();
}


// ==========================================
// 3. FORMAT DATE AND TIME
// ==========================================

function formatTime(dateTime) {

    if (!dateTime) return "--:--";

    const date = new Date(dateTime);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}


function formatDate(dateString) {

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}


// ==========================================
// 4. DISPLAY CURRENT WEATHER
// ==========================================

function displayCurrentWeather(location, weatherData) {

    const current = weatherData.current;

    const [description, icon] =
        getWeatherDescription(current.weather_code);

    document.getElementById("cityName").textContent =
        `${location.name}${location.admin1 ? ", " + location.admin1 : ""}, India`;

    document.getElementById("weatherDescription").textContent =
        description;

    document.getElementById("weatherIcon").textContent = icon;

    document.getElementById("temperature").textContent =
        `${Math.round(current.temperature_2m)}°C`;

    document.getElementById("feelsLike").textContent =
        `${Math.round(current.apparent_temperature)}°C`;

    document.getElementById("humidity").textContent =
        `${current.relative_humidity_2m}%`;

    document.getElementById("windSpeed").textContent =
        `${current.wind_speed_10m} km/h`;

    document.getElementById("precipitation").textContent =
        `${current.precipitation} mm`;

    document.getElementById("weatherDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("weatherTime").textContent =
        `Last updated: ${formatTime(current.time)} · Local time in ${location.name}`;

    const daily = weatherData.daily;

    document.getElementById("sunrise").textContent =
        formatTime(daily.sunrise[0]);

    document.getElementById("sunset").textContent =
        formatTime(daily.sunset[0]);
}


// ==========================================
// 5. DISPLAY HOURLY FORECAST
// ==========================================

function displayHourlyForecast(weatherData) {

    const hourlyContainer =
        document.getElementById("hourlyForecast");

    const hourly = weatherData.hourly;

    const currentTime = new Date(weatherData.current.time);

    // Find the first forecast hour at or after current time.
    let startIndex = hourly.time.findIndex(
        time => new Date(time) >= currentTime
    );

    if (startIndex === -1) {
        startIndex = 0;
    }

    const forecastHTML = Array.from({ length: 6 }, (_, index) => {

        const i = startIndex + index;

        if (i >= hourly.time.length) return "";

        const [description, icon] =
            getWeatherDescription(hourly.weather_code[i]);

        const label = index === 0
            ? "Now"
            : formatTime(hourly.time[i]);

        return `
            <article class="forecast-card">
                <span>${label}</span>
                <strong class="forecast-icon">${icon}</strong>
                <strong>${Math.round(hourly.temperature_2m[i])}°C</strong>
                <small>${hourly.precipitation_probability[i] ?? 0}% rain</small>
            </article>
        `;
    }).join("");

    hourlyContainer.innerHTML = forecastHTML;
}


// ==========================================
// 6. DISPLAY SEVEN-DAY FORECAST
// ==========================================

function displayWeeklyForecast(weatherData) {

    const weeklyContainer =
        document.getElementById("weeklyForecast");

    const daily = weatherData.daily;

    const forecastHTML = daily.time.map((date, index) => {

        const [description, icon] =
            getWeatherDescription(daily.weather_code[index]);

        const dayName = index === 0
            ? "Today"
            : formatDate(date);

        return `
            <article class="weekly-card">

                <div class="weekly-day">
                    <strong>${dayName}</strong>
                    <small>${description}</small>
                </div>

                <span class="weekly-icon">${icon}</span>

                <div class="weekly-temperatures">
                    <strong>${Math.round(daily.temperature_2m_max[index])}°</strong>
                    <span>${Math.round(daily.temperature_2m_min[index])}°</span>
                </div>

                <small class="weekly-rain">
                    ${daily.precipitation_probability_max[index] ?? 0}% rain
                </small>

            </article>
        `;
    }).join("");

    weeklyContainer.innerHTML = forecastHTML;
}


// ==========================================
// 7. DISPLAY ALL WEATHER INFORMATION
// ==========================================

function displayWeather(location, weatherData) {

    displayCurrentWeather(location, weatherData);

    displayHourlyForecast(weatherData);

    displayWeeklyForecast(weatherData);

    weatherResult.classList.remove("hidden");
}


// ==========================================
// 8. SEARCH WEATHER
// ==========================================

async function searchWeather(city) {

    if (!city.trim()) {
        weatherMessage.textContent = "Please enter an Indian city name.";
        return;
    }

    weatherMessage.textContent =
        `Finding live weather for ${city}...`;

    weatherResult.classList.add("hidden");

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    try {

        const location = await getCityCoordinates(city);

        const weatherData = await getWeather(
            location.latitude,
            location.longitude
        );

        displayWeather(location, weatherData);

        weatherMessage.textContent =
            `Showing live weather for ${location.name}, India.`;

    } catch (error) {

        weatherMessage.textContent = error.message;

    } finally {

        searchButton.disabled = false;
        searchButton.textContent = "Search";

    }
}


// ==========================================
// 9. SEARCH FORM EVENT
// ==========================================

weatherForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    await searchWeather(city);

});


// ==========================================
// 10. POPULAR CITY BUTTONS
// ==========================================

document.querySelectorAll(".city-chip").forEach(button => {

    button.addEventListener("click", async () => {

        const city = button.dataset.city;

        cityInput.value = city;

        await searchWeather(city);

    });

});


// ==========================================
// 11. LOAD DEFAULT INDIAN CITY
// ==========================================

window.addEventListener("DOMContentLoaded", () => {

    cityInput.value = "New Delhi";

    searchWeather("New Delhi");

});
