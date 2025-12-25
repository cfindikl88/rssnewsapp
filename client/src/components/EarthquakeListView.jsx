import React, { useState, useEffect } from 'react';
import { getEarthquakes } from '../services/earthquakeService';

const EarthquakeListView = () => {
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarthquakes = async () => {
            setLoading(true);
            const data = await getEarthquakes();
            setEarthquakes(data);
            setLoading(false);
        };
        fetchEarthquakes();
    }, []);

    const getMagnitudeColor = (mag) => {
        const val = parseFloat(mag);
        if (val >= 5.0) return 'from-red-600 to-red-400 border-red-500/50 text-white';
        if (val >= 4.0) return 'from-orange-500 to-orange-400 border-orange-500/50 text-white';
        if (val >= 3.0) return 'from-yellow-500 to-yellow-400 border-yellow-500/50 text-white';
        return 'from-blue-500/20 to-blue-400/20 border-blue-500/30 text-blue-200';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Son Depremler (AFAD)
                    </h2>
                    <p className="text-gray-400 mt-2">Türkiye'deki son 24 saatlik sismik hareketlilik</p>
                </div>
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold animate-pulse">
                    CANLI VERİ
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {earthquakes.map((eq) => (
                    <div key={eq.id} className="group relative bg-glass-100 hover:bg-glass-200 border border-glass-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/10 overflow-hidden">
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full transition-all group-hover:scale-150 ${parseFloat(eq.magnitude) >= 4.0 ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-xl font-black bg-gradient-to-br shadow-lg ${getMagnitudeColor(eq.magnitude)}`}>
                                    {eq.magnitude}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Derinlik</div>
                                    <div className="text-lg font-bold text-white leading-none mt-1">{eq.depth} <span className="text-[10px] text-gray-500">km</span></div>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
                                {eq.location}
                            </h3>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Tarih / Saat</span>
                                    <span className="text-gray-300 font-medium">{new Date(eq.date).toLocaleString('tr-TR')}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Koordinatlar</span>
                                    <span className="text-gray-300 font-medium">{eq.latitude}, {eq.longitude}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Tip</span>
                                    <span className="text-gray-300 font-medium">{eq.type}</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive "Map" (Placeholder/Stylistic) */}
                        <div className="mt-4 pt-4 flex justify-end">
                            <a
                                href={`https://www.google.com/maps?q=${eq.latitude},${eq.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-glass-200 hover:bg-glass-300 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Haritada Gör"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EarthquakeListView;
