import React, { useState, useEffect } from 'react';
import { getTopTeamsMatches } from '../services/footballService';

const FootballMatchesWidget = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch matches on mount and every 6 hours
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const data = await getTopTeamsMatches();
                setMatches(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching matches:', err);
                setError('Maçlar yüklenemedi');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchMatches();

        // Auto-refresh every 6 hours
        const interval = setInterval(fetchMatches, 6 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading && matches.length === 0) {
        return (
            <div className="bg-glass-200 rounded-xl p-4 mb-6 shadow-lg border border-glass-300">
                <div className="mb-4 pb-3 border-b border-white/10">
                    <h3 className="text-sm font-bold text-purple-300 tracking-wider uppercase">
                        ⚽ Büyük Takımlar
                    </h3>
                </div>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    <p className="text-gray-400 text-sm mt-3">Maçlar yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-glass-200 rounded-xl p-4 mb-6 shadow-lg border border-glass-300">
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-purple-300 tracking-wider uppercase">
                        ⚽ Büyük Takımlar
                    </h3>
                    {error && (
                        <span className="text-[9px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            Önbellek
                        </span>
                    )}
                </div>
            </div>

            {/* Matches list */}
            <div className="space-y-4">
                {matches.map((match) => (
                    <div key={match.id} className="bg-white/5 rounded-lg p-3 border border-white/10 relative overflow-hidden group/match">
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                            {match.status === 'live' && (
                                <div className="flex items-center gap-1 bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                    </span>
                                    CANLI {match.minute}'
                                </div>
                            )}
                            {match.status === 'finished' && (
                                <div className="bg-gray-500/20 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-500/30">
                                    MS
                                </div>
                            )}
                        </div>

                        {/* Teams and Score/Time */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="text-white font-bold text-sm truncate">
                                    {match.homeTeam}
                                </div>
                                <div className="text-gray-400 text-xs truncate">
                                    {match.awayTeam}
                                </div>
                            </div>

                            <div className="flex flex-col items-end min-w-[60px]">
                                {(match.status === 'live' || match.status === 'finished') ? (
                                    <div className="text-lg font-black tracking-tighter text-white tabular-nums">
                                        {match.score}
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <div className="text-purple-300 font-bold text-sm">{match.time}</div>
                                        <div className="text-[10px] text-gray-500">{match.date}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Odds or Details */}
                        {match.status === 'upcoming' ? (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                <div className="bg-emerald-600/10 rounded-md py-1 px-2 text-center border border-emerald-500/20">
                                    <div className="text-[8px] text-gray-500 uppercase">1</div>
                                    <div className="text-emerald-400 font-bold text-xs">{match.odds.home}</div>
                                </div>
                                <div className="bg-blue-600/10 rounded-md py-1 px-2 text-center border border-blue-500/20">
                                    <div className="text-[8px] text-gray-500 uppercase">X</div>
                                    <div className="text-blue-400 font-bold text-xs">{match.odds.draw}</div>
                                </div>
                                <div className="bg-red-600/10 rounded-md py-1 px-2 text-center border border-red-500/20">
                                    <div className="text-[8px] text-gray-500 uppercase">2</div>
                                    <div className="text-red-400 font-bold text-xs">{match.odds.away}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
                                <span className="text-[10px] text-gray-500 italic">Maç {match.status === 'live' ? 'devam ediyor' : 'sonuçlandı'}</span>
                                <button className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors font-medium">İstatistikler →</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FootballMatchesWidget;
