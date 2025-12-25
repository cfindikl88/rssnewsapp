import { useState, useEffect } from 'react';

const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem('rss_bookmarks');
        return saved ? JSON.parse(saved) : [];
    });

    // We keep showBookmarks here assuming it's tightly coupled with the "Bookmark View" mode.
    // However, purely generic useBookmarks might just return the list. 
    // For this specific app refactor, treating it as "Bookmark Manager" which includes the "Viewing" state is pragmatic.
    const [showBookmarks, setShowBookmarks] = useState(false);

    useEffect(() => {
        localStorage.setItem('rss_bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const toggleBookmark = (article) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.link === article.link);
            if (exists) return prev.filter(b => b.link !== article.link);
            return [...prev, article];
        });
    };

    return {
        bookmarks,
        showBookmarks,
        setShowBookmarks,
        toggleBookmark
    };
};

export default useBookmarks;
