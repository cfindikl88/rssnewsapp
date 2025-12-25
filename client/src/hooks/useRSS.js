import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/feeds';

const useRSS = () => {
    // Load feeds from localStorage or default
    const [feeds, setFeeds] = useState(() => {
        const saved = localStorage.getItem('rss_feeds');
        const defaultFeeds = [
            { url: 'https://feeds.bbci.co.uk/turkce/rss.xml', name: 'BBC Türkçe', lang: 'tr' },
            { url: 'https://www.webtekno.com/rss.xml', name: 'Webtekno', lang: 'tr' },
            { url: 'https://webrazzi.com/feed', name: 'Webrazzi', lang: 'tr' },
            { url: 'https://hardwareplus.com.tr/feed', name: 'Hardware Plus', lang: 'tr' },
            { url: 'https://www.log.com.tr/feed', name: 'LOG', lang: 'tr' },
            { url: 'https://www.ntv.com.tr/son-dakika.rss', name: 'NTV', lang: 'tr' },
            { url: 'https://www.trthaber.com/xml/son-dakika.xml', name: 'TRT Haber', lang: 'tr' },
            { url: 'https://shiftdelete.net/feed', name: 'ShiftDelete', lang: 'tr' },
            { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World', lang: 'en' },
            { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World', lang: 'en' },
            { url: 'https://techcrunch.com/feed/', name: 'TechCrunch', lang: 'en' },
            { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', lang: 'en' },
            { url: 'https://www.bloomberg.com/feeds/bview/rss', name: 'Bloomberg', lang: 'en' }
        ];

        if (!saved) return defaultFeeds;

        // Migrating existing feeds to have lang property if missing
        const parsed = JSON.parse(saved);
        return parsed.map(f => {
            if (f.lang) return f;

            // Simple heuristic for language detection
            const url = f.url.toLowerCase();
            if (url.includes('bbc.co.uk/news') || url.includes('nytimes.com') || url.includes('reuters.com') || url.includes('techcrunch.com') || url.includes('theverge.com') || url.includes('cnn.com')) {
                return { ...f, lang: 'en' };
            }
            return { ...f, lang: 'tr' };
        });
    });

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        localStorage.setItem('rss_feeds', JSON.stringify(feeds));
    }, [feeds]);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        let allArticles = [];

        // Keywords for auto-categorization
        const categoryKeywords = {
            'Teknoloji': ['apple', 'google', 'microsoft', 'iphone', 'android', 'yapay zeka', 'telefon', 'bilgisayar', 'yazılım', 'donanım', 'samsung', 'xiaomi', 'teknoloji', 'app', 'ios', 'windows', 'oyun', 'epic games', 'steam', 'playstation', 'xbox', 'nintendo', 'gaming', 'fortnite', 'valorant', 'game'],
            'Ekonomi': ['dolar', 'euro', 'altın', 'borsa', 'faiz', 'merkez bankası', 'enflasyon', 'zam', 'piyasa', 'bitcoin', 'kripto', 'ekonomi', 'banka', 'maliye'],
            'Spor': ['futbol', 'galatasaray', 'fenerbahçe', 'beşiktaş', 'trabzonspor', 'spor', 'maç', 'lig', 'şampiyon', 'transfer', 'basketbol', 'voleybol'],
            'Siyaset': ['erdoğan', 'imamoğlu', 'ak parti', 'chp', 'tbmm', 'bakan', 'seçim', 'parti', 'siyaset', 'meclis', 'başkan'],
            'Dünya': ['abd', 'rusya', 'ukrayna', 'israil', 'filistin', 'gazze', 'avrupa', 'suriye', 'çin', 'dünya', 'savaş'],
            'Sağlık': ['sağlık bakanlığı', 'corona', 'covid', 'grip', 'kanser', 'kalp', 'ameliyat', 'ilaç', 'eczane']
        };

        try {
            const promises = feeds.map(async (feed) => {
                try {
                    const res = await fetch(`${API_BASE}?url=${encodeURIComponent(feed.url)}`);
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    return (data.items || []).map(item => {
                        let cats = item.categories?.map(c => typeof c === 'string' ? c.trim() : c?.name).filter(Boolean) || [];

                        // Auto-categorize if empty or to augment
                        const textCheck = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();

                        Object.entries(categoryKeywords).forEach(([cat, keywords]) => {
                            if (keywords.some(k => textCheck.includes(k))) {
                                if (!cats.includes(cat)) cats.push(cat);
                            }
                        });

                        // Extract Image
                        let imageUrl = null;
                        if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
                            imageUrl = item.enclosure.url;
                        } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
                            imageUrl = item['media:content'].$.url;
                        } else if (item.content || item['content:encoded']) {
                            const imgMatch = (item.content || item['content:encoded']).match(/src="([^"]+)"/);
                            if (imgMatch) imageUrl = imgMatch[1];
                        }

                        // Estimate read time
                        const text = (item.title + ' ' + (item.contentSnippet || item.content || '')).replace(/<[^>]*>/g, '');
                        const wordCount = text.split(/\s+/).length;
                        const readTime = Math.max(1, Math.ceil(wordCount / 200));

                        return {
                            ...item,
                            feedName: feed.name,
                            categories: cats,
                            imageUrl,
                            id: item.guid || item.link, // Ensure unique ID
                            lang: feed.lang || 'tr',
                            readTime
                        };
                    });
                } catch (err) {
                    console.error(`Error fetching ${feed.name}:`, err);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            allArticles = results.flat();

            // Sort by date descending
            allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            setArticles(allArticles);

            // Extract unique categories for sidebar
            const allCats = allArticles.flatMap(a => a.categories || []);
            const catCounts = allCats.reduce((acc, cat) => {
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, {});

            const sortedCats = Object.keys(catCounts)
                .sort((a, b) => catCounts[b] - catCounts[a])
                .slice(0, 15);

            setCategories(sortedCats);

        } catch (error) {
            console.error('Global fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [feeds]);

    useEffect(() => {
        fetchArticles();
        // Auto refresh every 15 minutes
        const interval = setInterval(fetchArticles, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchArticles]);

    const addFeed = ({ url, name, lang = 'tr' }) => {
        if (feeds.some(f => f.url === url)) return;
        setFeeds([...feeds, { url, name, lang }]);
    };

    const removeFeed = (url) => {
        setFeeds(feeds.filter(f => f.url !== url));
    };

    return {
        articles,
        loading,
        categories,
        fetchArticles,
        feeds,
        addFeed,
        removeFeed
    };
};

export default useRSS;
