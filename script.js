document.addEventListener("DOMContentLoaded", function () {
    const APPID =
      "066f6ca8fa7b5d4bee39e2a2c96dab0b";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units={units}&q={city name}&appid={API key}"
    let form = document.querySelector("form")

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let submitBtn = document.getElementById("submit");

        let cityName = document.getElementById("cityName").value;
    })
});