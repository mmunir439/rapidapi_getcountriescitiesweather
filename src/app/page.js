"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Fetch countries on load
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

  // Get cities by selected country code
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

  return (
    <div className="countries">
      {countries.length > 0 ? (
        <h1 id="countriesfetching">Fetched countries</h1>
      ) : (
        <h1 id="loading">Loading...</h1>
      )}

      <select
        value={selectedCountryCode}
        onChange={(e) => setSelectedCountryCode(e.target.value)}
      >
        <option value="">Select your country</option>
        {countries.map((value) => (
          <option key={value.isoCode} value={value.isoCode}>
            {value.name}
          </option>
        ))}
      </select>
      {countries.length > 0 ?
        <button onClick={() => getCities(selectedCountryCode)} className="b1">
          Get Cities
        </button> : ""}

      <div>
        {cities.length > 0 ? (
          <select>
            <option value="">select your ciity</option>
            {cities.map((city, index) => (
              <option key={index}>{city.name}</option>
            ))}
          </select>
        ) : (
          selectedCountryCode && <p>No cities found or not yet loaded.</p>
        )}
        {cities.length > 0 ? <button className="b1">get weather</button> : ""}
      </div>
    </div>
  );
}
