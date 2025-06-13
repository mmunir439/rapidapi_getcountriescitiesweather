"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Fetch all countries on mount
  useEffect(() => {
    async function fetchCountries() {
      const url = "https://country-state-city-search-rest-api.p.rapidapi.com/allcountries";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "country-state-city-search-rest-api.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setCountries(result);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);

  // Fetch cities for the selected country
  async function getCities(countryCode) {
    if (!countryCode) return;

    const url = `https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode?countrycode=${countryCode.toUpperCase()}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "country-state-city-search-rest-api.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setCities(result);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  // Fetch weather for the selected city's lat/lon
  async function getWeather() {
    if (!selectedCity) return;

    const url = `https://open-weather13.p.rapidapi.com/latlon?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&lang=EN`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "94ac3d5291mshedab46e79469db2p14012djsn7cd0340378d6", // Replace this with env variable for production
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setWeather(result);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }

  return (
    <div className="countries">
      <h1>Weather Finder</h1>

      <select
        value={selectedCountryCode}
        onChange={(e) => {
          setSelectedCountryCode(e.target.value);
          setSelectedCity(null); // reset selected city
          setCities([]);
          setWeather(null);
        }}
      >
        <option value="">Select your country</option>
        {countries.map((value) => (
          <option key={value.isoCode} value={value.isoCode}>
            {value.name}
          </option>
        ))}
      </select>

      <button onClick={() => getCities(selectedCountryCode)} className="b1">
        Get Cities
      </button>

      {cities.length > 0 && (
        <div>
          <select
            onChange={(e) => {
              const selected = cities.find((c) => c.name === e.target.value);
              setSelectedCity(selected);
              setWeather(null);
            }}
          >
            <option value="">Select your city</option>
            {cities.map((city, index) => (
              <option key={index} value={city.name}>
                {city.name} (Lat: {city.latitude}, Lon: {city.longitude})
              </option>
            ))}
          </select>

          <button className="b1" onClick={getWeather} disabled={!selectedCity}>
            Get Weather
          </button>
        </div>
      )}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <hr />
          <h2 style={{ fontWeight: "bold" }}>Weather in {selectedCity?.name}</h2>
          <hr />
          <p>Temperature: {weather.main?.temp} °C</p>
          <p>Feels like: {weather.main?.feels_like} °C</p>
          <p>Humidity: {weather.main?.humidity}%</p>
          <p>Condition: {weather.weather?.[0]?.description}</p>
        </div>
      )}
    </div>
  );
}
