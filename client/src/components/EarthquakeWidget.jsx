import React, { useState, useEffect } from 'react';
import { getEarthquakes } from '../services/earthquakeService';

const EarthquakeWidget = () => {
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarthquakes = async () => {
            const data = await getEarthquakes();
            setEarthquakes(data.slice(0, 5)); // Just top 5
            setLoading(false);
        };
        fetchEarthquakes();
        const interval = setInterval(fetchEarthquakes, 5 * 60 * 1000); // Every 5 mins
        return () => clearInterval(interval);
    }, []);

    const getMagnitudeColor = (mag) => {
        const val = parseFloat(mag);
        if (val >= 5.0) return 'text-red-500 bg-red-500/10 border-red-500/30';
        if (val >= 4.0) return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
        if (val >= 3.0) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    };

    if (loading && earthquakes.length === 0) {
        return (
            <div className="bg-glass-200 rounded-2xl p-4 mb-6 border border-glass-100 animate-pulse">
                <div className="h-4 bg-glass-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-glass-300 rounded-xl"></div>
                    <div className="h-12 bg-glass-300 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (earthquakes.length === 0) return null;

    return (
        <div className="bg-glass-200 rounded-2xl p-5 mb-6 border border-glass-100 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    SON DEPREMLER (AFAD)
                </h3>
                <span className="text-[10px] text-gray-500 font-medium">CANLI</span>
            </div>

            <div className="space-y-3">
                {earthquakes.map((eq, idx) => (
                    <div key={idx} className="group relative bg-black/20 hover:bg-black/40 border border-white/5 p-3 rounded-xl transition-all duration-300">
                        <div className="flex items-start gap-3">
                            <div className={`shrink-0 w-10 h-10 rounded-lg border font-bold flex items-center justify-center text-sm ${getMagnitudeColor(eq.magnitude)}`}>
                                {eq.magnitude}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-gray-200 truncate group-hover:text-white transition-colors">
                                    {eq.location}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-gray-500">Derinlik: {eq.depth} km</span>
                                    <span className="text-[10px] text-gray-500">•</span>
                                    <span className="text-[10px] text-gray-500">{eq.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <a
                href="https://deprem.afad.gov.tr/last-earthquakes.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-4 text-[10px] text-purple-400 hover:text-purple-300 font-bold transition-colors uppercase tracking-wider"
            >
                TÜM LİSTEYİ GÖR →
            </a>
        </div>
    );
};

export default EarthquakeWidget;
