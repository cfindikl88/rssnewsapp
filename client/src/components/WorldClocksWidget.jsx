import React, { useState, useEffect, useMemo, useCallback } from 'react';

const WorldClocksWidget = () => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState({});

    // Memoize cities array to maintain stable reference
    const cities = useMemo(() => [
        { name: 'İstanbul', timezone: 'Europe/Istanbul', flag: '🇹🇷', lat: 41.01, lon: 28.98, dst: false },
        { name: 'Londra', timezone: 'Europe/London', flag: '🇬🇧', lat: 51.51, lon: -0.13, dst: true },
        { name: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪', lat: 25.20, lon: 55.27, dst: false },
        { name: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷', lat: 48.86, lon: 2.35, dst: true },
        { name: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵', lat: 35.68, lon: 139.69, dst: false },
        { name: 'New York', timezone: 'America/New_York', flag: '🇺🇸', lat: 40.71, lon: -74.01, dst: true },
        { name: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸', lat: 34.05, lon: -118.24, dst: true },
    ], []);

    // Weather code to emoji mapping
    const getWeatherEmoji = (code) => {
        if (code === 0) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 48) return '🌫️';
        if (code <= 57) return '🌧️';
        if (code <= 67) return '🌧️';
        if (code <= 77) return '❄️';
        if (code <= 82) return '🌧️';
        if (code <= 86) return '🌨️';
        if (code >= 95) return '⛈️';
        return '🌡️';
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch weather data callback
    const fetchWeather = useCallback(async () => {
        const weatherData = {};
        for (const city of cities) {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`
                );
                const data = await response.json();
                weatherData[city.name] = {
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code
                };
            } catch {
                weatherData[city.name] = null;
            }
        }
        setWeather(weatherData);
    }, [cities]);


    // Fetch weather on mount and periodically
    useEffect(() => {
        fetchWeather();
        // Refresh weather every 10 minutes
        const weatherInterval = setInterval(fetchWeather, 600000);
        return () => clearInterval(weatherInterval);
    }, [fetchWeather]);

    const getTimeForCity = (timezone) => {
        return time.toLocaleTimeString('tr-TR', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getDateForCity = (timezone) => {
        return time.toLocaleDateString('tr-TR', {
            timeZone: timezone,
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-gradient-to-br from-theme-bg-tertiary to-theme-bg-quaternary rounded-2xl p-4 mb-4 border border-theme-border-light shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌍</span>
                <h3 className="text-lg font-bold text-theme-text-primary">Dünya Saatleri</h3>
            </div>

            <div className="space-y-3">
                {cities.map((city) => {
                    const cityWeather = weather[city.name];
                    return (
                        <div
                            key={city.name}
                            className="flex items-center justify-between bg-theme-bg-secondary/50 rounded-xl px-3 py-2.5 hover:bg-theme-bg-secondary transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{city.flag}</span>
                                <div>
                                    <div className="font-semibold text-theme-text-primary text-sm flex items-center gap-1.5">
                                        {city.name}
                                        {city.dst && (
                                            <span
                                                className="text-xs cursor-help"
                                                title="🌿 Yaz Saati (DST) | ⚡ ~%1 enerji tasarrufu | 💡 Akşam aydınlatma maliyetini azaltır | 🌅 İlkbaharda +1 saat ileri"
                                            >
                                                🌿
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-theme-text-muted">
                                        {getDateForCity(city.timezone)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Weather */}
                                {cityWeather && (
                                    <div className="flex items-center gap-1 text-sm text-theme-text-secondary">
                                        <span>{getWeatherEmoji(cityWeather.code)}</span>
                                        <span className="font-medium">{cityWeather.temp}°C</span>
                                    </div>
                                )}
                                {/* Time */}
                                <div className="font-mono font-bold text-theme-text-primary text-lg tabular-nums group-hover:text-theme-accent-primary transition-colors">
                                    {getTimeForCity(city.timezone)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorldClocksWidget;
