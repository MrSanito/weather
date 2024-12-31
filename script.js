const cityInput = document.getElementById("city-input");
const suggestionsList = document.getElementById("suggestions");
const weatherDisplay = document.getElementById("weather-display");
const cityNameEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const weatherDescriptionEl = document.getElementById("weather-description");

let timeout;

// Fetch city suggestions
async function fetchCitySuggestions(query) {
  const apiKey = "2486715d577f88810651be7a48062f34"; // Replace with your OpenWeatherMap API key
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch city suggestions");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch weather details
async function fetchWeather(lat, lon) {
  const apiKey = "2486715d577f88810651be7a48062f34"; // Replace with your OpenWeatherMap API key
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch weather data");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Render city suggestions
function renderSuggestions(cities) {
  suggestionsList.innerHTML = ""; // Clear suggestions
  cities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;
    li.className =
      "p-2 cursor-pointer hover:bg-blue-200 border-b last:border-none";
    li.addEventListener("click", async () => {
      cityInput.value = city.name;
      suggestionsList.innerHTML = "";
      const weather = await fetchWeather(city.lat, city.lon);
      displayWeather(city.name, weather);
    });
    suggestionsList.appendChild(li);
  });
}

// Display weather details
function displayWeather(city, weather) {
  if (!weather) return;
  cityNameEl.textContent = city;
  temperatureEl.textContent = `Temperature: ${weather.main.temp}°C`;
  weatherDescriptionEl.textContent = `Weather: ${weather.weather[0].description}`;
  weatherDisplay.classList.remove("hidden");
}

// Debounce function
function debounce(func, delay) {
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Input event listener
cityInput.addEventListener(
  "input",
  debounce(async () => {
    const query = cityInput.value.trim();
    if (query.length > 2) {
      const cities = await fetchCitySuggestions(query);
      renderSuggestions(cities);
    } else {
      suggestionsList.innerHTML = "";
    }
  }, 300)
);
