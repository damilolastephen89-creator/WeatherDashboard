export default async function handler(req, res) {
  const { city } = req.query;

  // api/weather.js

const API_KEY = "b8a1c4525cae2bd095742c501c0e27b2"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(city) {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error("Weather data not available");
    }
    const data = await response.json();
    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
