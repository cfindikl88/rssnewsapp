import { useState, useEffect, useCallback } from 'react';

const useNotifications = () => {
    // Initialize permission directly - no need for useEffect
    const [permission, setPermission] = useState(() => {
        return 'Notification' in window ? Notification.permission : 'denied';
    });
    const [isSubscribed, setIsSubscribed] = useState(() => {
        return localStorage.getItem('notifications_enabled') === 'true';
    });
    const [notifyCategories, setNotifyCategories] = useState(() => {
        const saved = localStorage.getItem('notify_categories');
        return saved ? JSON.parse(saved) : ['Son Dakika', 'Dünya', 'Ekonomi'];
    });

    // Persist settings
    useEffect(() => {
        localStorage.setItem('notifications_enabled', isSubscribed.toString());
    }, [isSubscribed]);

    useEffect(() => {
        localStorage.setItem('notify_categories', JSON.stringify(notifyCategories));
    }, [notifyCategories]);

    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                setIsSubscribed(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }, []);

    const toggleNotifications = useCallback(async () => {
        if (permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) return false;
        }

        setIsSubscribed(prev => !prev);
        return true;
    }, [permission, requestPermission]);

    const showNotification = useCallback((title, options = {}) => {
        if (permission !== 'granted' || !isSubscribed) return;

        const notification = new Notification(title, {
            icon: '/rss_app_icon.png',
            badge: '/rss_app_icon.png',
            tag: options.tag || 'rss-news',
            renotify: true,
            ...options
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
            if (options.onClick) options.onClick();
        };

        return notification;
    }, [permission, isSubscribed]);

    const notifyBreakingNews = useCallback((article) => {
        if (!isSubscribed) return;

        // Check if article matches any notify categories
        const shouldNotify = (article.categories || []).some(cat =>
            notifyCategories.includes(cat)
        );

        if (!shouldNotify && !article.title?.toLowerCase().includes('son dakika')) {
            return;
        }

        showNotification(article.title, {
            body: article.contentSnippet?.slice(0, 100) + '...' || '',
            tag: article.link,
            data: { url: article.link },
            onClick: () => {
                // Will be handled by the app
            }
        });
    }, [isSubscribed, notifyCategories, showNotification]);

    const toggleCategory = useCallback((category) => {
        setNotifyCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });
    }, []);

    return {
        permission,
        isSubscribed,
        notifyCategories,
        requestPermission,
        toggleNotifications,
        showNotification,
        notifyBreakingNews,
        toggleCategory,
        isSupported: 'Notification' in window
    };
};

export default useNotifications;
