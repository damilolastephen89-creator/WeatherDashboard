const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

import React, { useEffect, useState } from "react";

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const city = "Lagos";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => setWeather(data))
      .catch(error => console.error("Error fetching weather:", error));
  }, []);

  return (
    <div>
      <h1>Weather Dashboard</h1>
      {weather ? (
        <div>
          <p>City: {weather.name}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

export default App;
