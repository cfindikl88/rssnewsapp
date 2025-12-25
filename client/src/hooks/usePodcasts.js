import { useState, useCallback } from 'react';

const API_BASE = '/api/feeds';

const DEFAULT_PODCASTS = [
    {
        url: 'https://feed.podbean.com/ipimedia/feed.xml', // Aposto 6:30
        name: 'Aposto 6:30',
        lang: 'tr'
    },
    {
        url: 'https://feeds.megaphone.fm/kisa-dalga-bulten', // Kısa Dalga Bülten
        name: 'Kısa Dalga',
        lang: 'tr'
    }
];

const usePodcasts = () => {
    const [podcasts, setPodcasts] = useState(() => {
        // Force reset to defaults if old data exists to ensure users get new feeds
        return DEFAULT_PODCASTS;
    });

    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const fetchEpisodes = useCallback(async () => {
        setLoading(true);
        try {
            const allEpisodes = [];

            for (const podcast of podcasts) {
                try {
                    // Use the same backend proxy as RSS feeds to bypass CORS
                    const res = await fetch(`${API_BASE}?url=${encodeURIComponent(podcast.url)}`);
                    if (!res.ok) continue;

                    const data = await res.json();

                    const podcastEpisodes = (data.items || []).slice(0, 3).map(item => {
                        // Attempt to find duration
                        let duration = '??:??';
                        if (item.itunes && item.itunes.duration) {
                            duration = item.itunes.duration;
                        } else if (item.enclosure && item.enclosure.length) {
                            // Crude estimate if length is bytes, but usually it's better to just leave it if unknown
                            // duration = Math.floor(item.enclosure.length / 1024 / 1024) + 'mb';
                        }

                        return {
                            id: item.guid || item.link,
                            title: item.title,
                            podcast: podcast.name,
                            description: item.contentSnippet || item.content,
                            audioUrl: item.enclosure?.url,
                            duration: duration,
                            publishedAt: item.isoDate || item.pubDate,
                            imageUrl: item.itunes?.image || data.image?.url
                        };
                    }).filter(ep => ep.audioUrl); // Only include episodes with audio

                    allEpisodes.push(...podcastEpisodes);
                } catch (err) {
                    console.error(`Failed to fetch podcast ${podcast.name}:`, err);
                }
            }

            // Sort by date new to old
            allEpisodes.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            setEpisodes(allEpisodes);

        } catch (error) {
            console.error('Podcast fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [podcasts]);

    const playEpisode = useCallback((episode) => {
        setCurrentlyPlaying(episode);
    }, []);

    const stopPlaying = useCallback(() => {
        setCurrentlyPlaying(null);
    }, []);

    const addPodcast = useCallback(({ url, name, lang = 'tr' }) => {
        setPodcasts(prev => {
            if (prev.some(p => p.url === url)) return prev;
            const updated = [...prev, { url, name, lang }];
            localStorage.setItem('podcast_feeds', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removePodcast = useCallback((url) => {
        setPodcasts(prev => {
            const updated = prev.filter(p => p.url !== url);
            localStorage.setItem('podcast_feeds', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        if (typeof seconds === 'string' && seconds.includes(':')) return seconds; // Already formatted
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        podcasts,
        episodes,
        loading,
        currentlyPlaying,
        fetchEpisodes,
        playEpisode,
        stopPlaying,
        addPodcast,
        removePodcast,
        formatDuration
    };
};

export default usePodcasts;
