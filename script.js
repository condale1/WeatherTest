document.addEventListener("DOMContentLoaded", function () {
  const APPID = "066f6ca8fa7b5d4bee39e2a2c96dab0b";
  const weatherForm = document.getElementById("weatherForm");
  const unitSwitch = document.getElementById("unitSwitch");
  const cityNameInput = document.getElementById("cityName");
  const weatherOutput = document.querySelector(".weatherOutput"); 
  const suggestionsList = document.getElementById("suggestionsList");

  cityNameInput.addEventListener("input", function () {
    const inputText = cityNameInput.value.trim();

    if (inputText.length >= 3) {
      clearSuggestions();

      const autoCompleteService = new google.maps.places.AutocompleteService();
      const request = {
        input: inputText,
      };

      autoCompleteService.getPlacePredictions(request, function (predictions, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const suggestions = predictions.map(prediction => ({
            name: prediction.description,
          }));
          displaySuggestions(suggestions, cityNameInput);
        } else {
          console.error("Error fetching city suggestions:", status);
          clearSuggestions();
        }
      });
    } else {
      clearSuggestions();
    }
  });

  cityNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const selectedSuggestion = document.querySelector(".suggestion.selected");
      if (selectedSuggestion) {
        cityNameInput.value = selectedSuggestion.textContent;
        clearSuggestions();
      }
    }
  });

    suggestionsList.addEventListener("click", function (event) {
      if (event.target && event.target.nodeName === "LI") {
        cityNameInput.value = event.target.textContent;
        suggestionsList.style.display = "none";
        cityNameInput.focus(); // Move focus back to input field
        console.log(event.target.textContent);
      }
    });

  weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Form submitted");

    const cityName = cityNameInput.value;
    console.log("City name:", cityName);

    const units = unitSwitch.checked ? "imperial" : "metric";
    console.log("Units selected:", units);

    try {
      const weatherData = await getWeather(units, cityName, APPID);
      console.log("Weather data:", weatherData);

      const temperature = weatherData.main.temp;
      const unitLabel = units === "imperial" ? "°F" : "°C";
      const windSpeedLabel = units === "imperial" ? "mph" : "m/s";
      const tempElement = weatherOutput.querySelector(".temp");
      const cityElement = weatherOutput.querySelector(".city");
      const windElement = weatherOutput.querySelector(".wind");
      const humidityElement = weatherOutput.querySelector(".humidity");
      const weatherIcon = weatherOutput.querySelector(".weather-icon");
      const weatherCondition = weatherData.weather[0].main;

      switch (weatherCondition) {
        case "Clear":
          weatherIcon.src = "svg/sun-fill.svg";
          break;
        case "Clouds":
          weatherIcon.src = "svg/cloud-fill.svg";
          break;
        case "Rain":
          weatherIcon.src = "svg/cloud-drizzle-fill";
          break;
        case "Thunder":
          weatherIcon.src = "svg/cloud-lightning-rain-fill.svg";
          break;
        case "Snow":
          weatherIcon.src = "svg/cloud-snow-fill.svg";
          break;
        default:
          weatherIcon.src = "svg/cloud-fill.svg";
          break;
      }

      tempElement.textContent = `${temperature.toFixed(1)} ${unitLabel}`;
      cityElement.textContent = `${weatherData.name}`;
      windElement.textContent = `${weatherData.wind.speed} ${windSpeedLabel}`;
      humidityElement.textContent = `${weatherData.main.humidity}%`;
      console.log(weatherCondition);

      weatherOutput.removeAttribute("hidden");
    } catch (error) {
      console.error("An error occurred:", error);
      weatherOutput.textContent = "An error occurred. Please try again.";
    }
  });
});

async function getWeather(units, cityName, appId) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${units}&q=${cityName}&appid=${appId}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function displaySuggestions(suggestions, cityNameInput) {
  clearSuggestions();
  suggestions.forEach((suggestion, index) => {
    const li = document.createElement("li");
    li.textContent = suggestion.name;
    li.classList.add("list-group-item", "suggestion", "bg-transparent");
    suggestionsList.appendChild(li);

    li.addEventListener("mouseover", function () {
      highlightSuggestion(index);
    });

    li.addEventListener("click", function () {
      selectedSuggestion = suggestion.name;
      cityNameInput.value = selectedSuggestion;
      clearSuggestions();
      cityNameInput.blur(); // Hide keyboard on mobile
    });
  });

  suggestionsList.style.display = "block";
}

function highlightSuggestion(index) {
  const suggestions = suggestionsList.querySelectorAll(".suggestion");
  suggestions.forEach((suggestion, i) => {
    if (i === index) {
      suggestion.classList.add("selected");
    } else {
      suggestion.classList.remove("selected");
    }
  });
}

function clearSuggestions() {
  suggestionsList.innerHTML = "";
  suggestionsList.style.display = "none";
}