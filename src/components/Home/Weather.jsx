import { Sun } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { IoIosCloudOutline } from 'react-icons/io'

const Weather = () => {
  const [weather, setWeather] = useState({
    city: 'Loading...',
    temperature: '--',
    loading: true
  });

  // fetchWeatherByCoords accepts an optional cityName to avoid reverse-geocoding
  const fetchWeatherByCoords = async (lat, lon, cityName = null) => {
    try {
      // Using a free weather API that doesn't require API key
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto&current_weather=true`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      
      const data = await response.json();
      
      // Get city name using reverse geocoding
      let finalCity = cityName || 'Unknown Location';
      if (!cityName) {
        const geoResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          finalCity = geoData.city || geoData.locality || geoData.principalSubdivision || finalCity;
        }
      }
      // open-meteo: prefer current_weather.temperature, fallback to hourly temperature if needed
      const temp = data?.current_weather?.temperature ?? data?.current?.temperature_2m ?? (data?.hourly?.temperature_2m ? data.hourly.temperature_2m[0] : null);

      setWeather({
        city: finalCity,
        temperature: temp !== null && temp !== undefined ? Math.round(temp) : '--',
        loading: false
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather({
        city: 'Weather Unavailable',
        temperature: '--',
        loading: false
      });
    }
  };

  const fetchWeatherByIP = async () => {
    try {
      // Fallback: Get location by IP
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (!ipResponse.ok) throw new Error('IP location failed');
      
      const ipData = await ipResponse.json();
      // Use city from IP provider if available to avoid extra reverse-geocoding
      const ipCity = ipData.city || ipData.region || ipData.country_name || null;
      await fetchWeatherByCoords(ipData.latitude, ipData.longitude, ipCity);
    } catch (error) {
      console.error('Error with IP-based location:', error);
      setWeather({
        city: 'Location Unavailable',
        temperature: '--',
        loading: false
      });
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation denied or failed, using IP location:', error);
          fetchWeatherByIP();
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      console.warn('Geolocation not supported, using IP location');
      fetchWeatherByIP();
    }
  }, []);

  return (
    <div className="hidden md:flex absolute top-8 left-1/3 transform -translate-x-1/2 z-50">
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg mb-0">{weather.city}</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-6 h-6 text-yellow-400 -mt-6" strokeWidth={1.5} />
            <IoIosCloudOutline className="w-14 h-14 text-black-400 font-light -ml-6" strokeWidth={0.2} />
            <p className="text-xl font-semibold text-gray-800" style={{ marginTop: '-30px' }}>
              {weather.loading ? '...' : `${weather.temperature}°C`}
            </p>
          </div>
        </div>
      </div>
  )
}

export default Weather