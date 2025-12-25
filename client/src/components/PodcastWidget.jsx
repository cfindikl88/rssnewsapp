import React, { useEffect } from 'react';
import usePodcasts from '../hooks/usePodcasts';
import { useTranslation } from '../contexts/useLanguage';

const PodcastWidget = ({ onPlayEpisode }) => {
    const { t } = useTranslation();
    const { episodes, loading, fetchEpisodes, playEpisode, currentlyPlaying } = usePodcasts();

    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

    const handlePlay = (episode) => {
        playEpisode(episode);
        if (onPlayEpisode) {
            onPlayEpisode(episode);
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Bugün';
        if (diffDays === 1) return 'Dün';
        if (diffDays < 7) return `${diffDays} gün önce`;
        return `${Math.floor(diffDays / 7)} hafta önce`;
    };

    return (
        <div className="p-4 bg-glass-200 rounded-2xl border border-glass-200">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
                {t('podcasts')}
            </h3>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-3">
                            <div className="w-12 h-12 bg-glass-300 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-glass-300 rounded w-3/4"></div>
                                <div className="h-2 bg-glass-300 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {episodes.slice(0, 3).map((episode) => (
                        <div
                            key={episode.id}
                            className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all ${currentlyPlaying?.id === episode.id
                                ? 'bg-green-900/30 border border-green-500/30'
                                : 'bg-glass-100 hover:bg-glass-300'
                                }`}
                            onClick={() => handlePlay(episode)}
                        >
                            {/* Play Button */}
                            <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center ${currentlyPlaying?.id === episode.id
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-gradient-to-br from-purple-500 to-blue-500'
                                }`}>
                                {currentlyPlaying?.id === episode.id ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <rect x="6" y="4" width="4" height="16" rx="1" />
                                        <rect x="14" y="4" width="4" height="16" rx="1" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-white line-clamp-1">
                                    {episode.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                    <span className="text-purple-400">{episode.podcast}</span>
                                    <span>•</span>
                                    <span>{episode.duration}</span>
                                    <span>•</span>
                                    <span>{getTimeAgo(episode.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {episodes.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-400 text-sm">
                    Podcast bulunamadı
                </div>
            )}
        </div>
    );
};

export default PodcastWidget;
