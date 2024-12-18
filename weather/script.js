function getWeather() {
    const apiKey = "a6cd8082195605f8e52a122a199e53e4"; // Your Weatherstack API key
    const city = document.getElementById("city").value;
  
    if (!city) {
      alert("Please enter a city");
      return;
    }
  
    const currentWeatherUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    const forecastUrl = `http://api.weatherstack.com/forecast?access_key=${apiKey}&query=${city}`;
  
    // Fetch current weather data
    fetch(currentWeatherUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error in current weather response:", data.error);
          alert(data.error.info || "Error fetching current weather data. Please check the city name.");
          return;
        }
        displayWeather(data);
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
        alert("Error fetching current weather data. Please try again.");
      });
  
    // Fetch forecast data
    fetch(forecastUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Forecast API Response:", data); // Debug log
  
        if (data.error) {
          console.error("Error in forecast response:", data.error);
          alert(data.error.info || "Error fetching forecast data. Please check the city name.");
          return;
        }
  
        if (!data.forecast || Object.keys(data.forecast).length === 0) {
          console.error("No forecast data available in the response.");
          alert("No forecast data available for this city. Please try another city.");
          return;
        }
  
        displayHourlyForecast(data.forecast);
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
        alert("Error fetching forecast data. Please try again.");
      });
  }
  
  function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
  
    // Clear previous content
    weatherInfoDiv.innerHTML = "";
    tempDivInfo.innerHTML = "";
  
    if (!data.current) {
      weatherInfoDiv.innerHTML = `<p>City not found or no data available</p>`;
      return;
    }
  
    const cityName = data.location.name;
    const temperature = data.current.temperature;
    const description = data.current.weather_descriptions[0];
    const iconurl = data.current.weather_icons[0];
  
    // Display weather info
    tempDivInfo.innerHTML = `<p>${temperature}&deg;C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
  
    // Display weather icon
    weatherIcon.src = iconurl;
    weatherIcon.style.display = "block";
  }
  
  function displayHourlyForecast(forecast) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
  
    // Clear previous forecast
    hourlyForecastDiv.innerHTML = "";
  
    if (!forecast) {
      hourlyForecastDiv.innerHTML = `<p>No forecast data available</p>`;
      return;
    }
  
    // Iterate through the days in the forecast object
    const forecastKeys = Object.keys(forecast);
    forecastKeys.forEach((date) => {
      const dayData = forecast[date];
      const hourlyItem = document.createElement("div");
      hourlyItem.classList.add("hourly-item");
  
      const time = document.createElement("p");
      time.textContent = date;
  
      const icon = document.createElement("img");
      icon.src = dayData.weather_icons[0];
      icon.alt = dayData.weather_descriptions[0];
  
      const temp = document.createElement("p");
      temp.textContent = `${dayData.avgtemp}&deg;C`; // Using avgtemp since Weatherstack doesn't provide hourly data
  
      hourlyItem.appendChild(time);
      hourlyItem.appendChild(icon);
      hourlyItem.appendChild(temp);
  
      hourlyForecastDiv.appendChild(hourlyItem);
    });
  }
  