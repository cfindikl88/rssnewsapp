import React, { useState, useEffect, useCallback } from 'react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Istanbul Coordinates
    const LAT = 41.0082;
    const LON = 28.9784;

    const fetchWeather = useCallback(async () => {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`);
            const data = await res.json();
            setWeather(data);
            setLoading(false);
        } catch (err) {
            console.error("Weather fetch error:", err);
            setLoading(false);
        }
    }, []);

     
    useEffect(() => {
        fetchWeather();
        // Update every hour
        const interval = setInterval(fetchWeather, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWeather]);

    // Weather Codes to Icons/Labels mapping (Simplified WMO codes)
    const getWeatherInfo = (code) => {
        if (code === 0) return { label: 'Açık', icon: '☀️' };
        if (code >= 1 && code <= 3) return { label: 'Parçalı Bulutlu', icon: '⛅' };
        if (code >= 45 && code <= 48) return { label: 'Sisli', icon: '🌫️' };
        if (code >= 51 && code <= 67) return { label: 'Yağmurlu', icon: '🌧️' };
        if (code >= 71 && code <= 77) return { label: 'Karlı', icon: '❄️' };
        if (code >= 80 && code <= 82) return { label: 'Sağanak', icon: '🌦️' };
        if (code >= 95 && code <= 99) return { label: 'Fırtına', icon: '⛈️' };
        return { label: 'Bilinmiyor', icon: '❓' };
    };

    const getDayName = (dateString) => {
        const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    if (loading) return null; // Hide if loading to avoid jumping layout or show skeleton

    if (!weather || !weather.current_weather) return null;

    const current = weather.current_weather;
    const info = getWeatherInfo(current.weathercode);
    const daily = weather.daily || {};

    return (
        <div className="mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-4 border border-blue-400/20 shadow-lg relative group">
            {/* Decorative Background blob */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-all"></div>

            <div className="relative z-10">
                {/* Current Weather - Hero Section */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">İstanbul</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{info.icon}</span>
                            <div>
                                <div className="text-2xl font-bold text-white leading-none">{Math.round(current.temperature)}°</div>
                                <div className="text-xs text-blue-100 mt-0.5">{info.label}</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-blue-200/80 mb-1">Bugün</div>
                        <div className="text-sm font-medium text-white">
                            {Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°
                        </div>
                        <div className="text-[10px] text-blue-300/60 mt-2">Rüzgar: {current.windspeed} km/s</div>
                    </div>
                </div>

                {/* 5-Day Forecast */}
                <div className="border-t border-blue-400/20 pt-3">
                    <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">5 Günlük Tahmin</h4>
                    <div className="grid grid-cols-5 gap-2">
                        {daily.time && daily.time.slice(0, 5).map((date, index) => {
                            const dayInfo = getWeatherInfo(daily.weathercode[index]);
                            const isToday = index === 0;

                            return (
                                <div
                                    key={date}
                                    className={`text-center p-2 rounded-lg transition-all ${isToday
                                        ? 'bg-blue-500/30 border border-blue-400/40'
                                        : 'bg-glass-200 hover:bg-glass-300'
                                        }`}
                                >
                                    <div className="text-[10px] text-blue-200 font-medium mb-1">
                                        {isToday ? 'Bugün' : getDayName(date)}
                                    </div>
                                    <div className="text-xl mb-1">{dayInfo.icon}</div>
                                    <div className="text-[10px] text-white font-bold">
                                        {Math.round(daily.temperature_2m_max[index])}°
                                    </div>
                                    <div className="text-[10px] text-blue-300/70">
                                        {Math.round(daily.temperature_2m_min[index])}°
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
