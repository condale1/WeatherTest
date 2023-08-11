document.addEventListener("DOMContentLoaded", function () {
  let APPID = "066f6ca8fa7b5d4bee39e2a2c96dab0b";
  let weatherForm = document.getElementById("weatherForm");
  let unitSwitch = document.getElementById("unitSwitch");
  let cityNameInput = document.getElementById("cityName");
  let weatherOutput = document.querySelector(".weatherOutput"); // Get the weather output container

  weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Form submitted");

    let cityName = cityNameInput.value;
    console.log("City name:", cityName);

    let units = unitSwitch.checked ? "imperial" : "metric";
    console.log("Units selected:", units);

    try {
      let weatherData = await getWeather(units, cityName, APPID);
      console.log("Weather data:", weatherData);

      let temperature = weatherData.main.temp;
      let unitLabel = units === "imperial" ? "°F" : "°C";

      let tempElement = weatherOutput.querySelector(".temp");
      let cityElement = weatherOutput.querySelector(".city");
      let windElement = weatherOutput.querySelector(".wind");
      let humidityElement = weatherOutput.querySelector(".humidity");
      let weatherIcon = weatherOutput.querySelector(".weather-icon");
      let weatherCondition = weatherData.weather[0].main;

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
      windElement.textContent = `${weatherData.wind.speed} m/s`;
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${units}&q=${cityName}&appid=${appId}`;
  let response = await fetch(apiUrl);
  let data = await response.json();
  return data;
}
