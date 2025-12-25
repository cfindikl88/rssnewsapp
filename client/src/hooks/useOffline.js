import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'rss_offline_db';
const STORE_NAME = 'offline_articles';
const DB_VERSION = 1;

// Open IndexedDB
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'link' });
            }
        };
    });
};

const useOffline = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineArticles, setOfflineArticles] = useState([]);
    const [savedLinks, setSavedLinks] = useState(new Set());

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Load offline articles function
    const loadOfflineArticles = useCallback(async () => {
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const articles = request.result || [];
                setOfflineArticles(articles);
                setSavedLinks(new Set(articles.map(a => a.link)));
            };
        } catch (error) {
            console.error('Failed to load offline articles:', error);
        }
    }, []);

    // Load offline articles on mount
    useEffect(() => {
        loadOfflineArticles();
    }, [loadOfflineArticles]);

    const saveArticleOffline = useCallback(async (article) => {
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Add savedAt timestamp
            const articleToSave = {
                ...article,
                savedAt: new Date().toISOString()
            };

            store.put(articleToSave);

            await new Promise((resolve, reject) => {
                transaction.oncomplete = resolve;
                transaction.onerror = () => reject(transaction.error);
            });

            // Update state
            setOfflineArticles(prev => {
                const exists = prev.find(a => a.link === article.link);
                if (exists) return prev;
                return [...prev, articleToSave];
            });
            setSavedLinks(prev => new Set([...prev, article.link]));

            return true;
        } catch (error) {
            console.error('Failed to save article offline:', error);
            return false;
        }
    }, []);

    const removeOfflineArticle = useCallback(async (articleLink) => {
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            store.delete(articleLink);

            await new Promise((resolve, reject) => {
                transaction.oncomplete = resolve;
                transaction.onerror = () => reject(transaction.error);
            });

            // Update state
            setOfflineArticles(prev => prev.filter(a => a.link !== articleLink));
            setSavedLinks(prev => {
                const newSet = new Set(prev);
                newSet.delete(articleLink);
                return newSet;
            });

            return true;
        } catch (error) {
            console.error('Failed to remove offline article:', error);
            return false;
        }
    }, []);

    const isArticleSaved = useCallback((articleLink) => {
        return savedLinks.has(articleLink);
    }, [savedLinks]);

    const getOfflineArticle = useCallback(async (articleLink) => {
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(articleLink);

            return new Promise((resolve) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            });
        } catch (error) {
            console.error('Failed to get offline article:', error);
            return null;
        }
    }, []);

    return {
        isOnline,
        offlineArticles,
        saveArticleOffline,
        removeOfflineArticle,
        isArticleSaved,
        getOfflineArticle,
        offlineCount: offlineArticles.length
    };
};

export default useOffline;
