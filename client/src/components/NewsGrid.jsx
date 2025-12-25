import React, { useState, useEffect, useRef, useCallback } from 'react';

const NewsCard = ({ article, isBookmarked, onToggleBookmark, onReadArticle, onDeleteArticle, isRecommended }) => {
    const [summary, setSummary] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleSummarize = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (summary) {
            setSummary(null); // Toggle off
            return;
        }

        setIsSummarizing(true);
        // Simulate AI delay
        setTimeout(() => {
            const text = (article.contentSnippet || article.content || '').replace(/<[^>]*>/g, '');
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            const aiSummary = sentences.slice(0, 3).join(' ') + (sentences.length > 3 ? '...' : '');
            setSummary(aiSummary);
            setIsSummarizing(false);
        }, 1500);
    };

    const date = new Date(article.pubDate).toLocaleDateString('tr-TR', {
        month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="relative group h-full">
            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteArticle(article);
                }}
                className="absolute top-4 left-4 z-20 p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-all shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100"
                title="Haberi Kaldır"
                aria-label={`Remove article: ${article.title}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Bookmark Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleBookmark(article);
                }}
                className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all shadow-xl backdrop-blur-md ${isBookmarked
                    ? 'bg-yellow-500 text-white hover:bg-yellow-400'
                    : 'bg-theme-bg-quaternary text-theme-text-muted hover:bg-white hover:text-yellow-500'
                    }`}
                title="Favorilere Ekle/Çıkar"
                aria-label={isBookmarked ? `Remove ${article.title} from bookmarks` : `Add ${article.title} to bookmarks`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </button>

            <div
                role="article"
                aria-label={`Article: ${article.title}`}
                className="block bg-theme-bg-secondary hover:bg-theme-bg-tertiary border border-theme-border-medium rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 h-full flex flex-col"
            >
                {article.imageUrl && (
                    <div className="h-48 w-full overflow-hidden relative cursor-pointer" onClick={() => onReadArticle(article)}>
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                )}

                <div className={`flex justify-between items-start mb-3 ${article.imageUrl ? 'mt-4 px-6' : 'p-6 pb-0'}`}>
                    <div className="flex gap-2 items-center">
                        <span className="px-2 py-1 bg-theme-accent-primary/20 text-theme-accent-primary text-xs rounded-md font-medium">
                            {article.feedName || 'Haber'}
                        </span>
                        {isRecommended && (
                            <span className="px-2 py-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-500/40 text-pink-200 text-xs rounded-md font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                                Tavsiye
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-theme-text-muted whitespace-nowrap ml-2">{date}</span>
                        <span className="text-[10px] text-theme-text-muted mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {article.readTime} dk okuma
                        </span>
                    </div>
                </div>

                <div className="px-6 pb-6 flex-1 flex flex-col">
                    <h3
                        className="text-lg font-bold text-theme-text-primary mb-2 leading-tight group-hover:text-theme-text-accent transition-colors line-clamp-2 cursor-pointer"
                        onClick={() => onReadArticle(article)}
                    >
                        {article.title}
                    </h3>

                    <p className="text-sm text-theme-text-secondary line-clamp-[8] mb-4 flex-1">
                        {article.contentSnippet}
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                        <button
                            onClick={handleSummarize}
                            className={`p-2 rounded-lg transition-colors ${summary ? 'bg-indigo-500/20 text-indigo-300' : 'bg-theme-bg-tertiary hover:bg-theme-bg-quaternary text-theme-text-muted hover:text-indigo-400'
                                }`}
                            title="AI ile Özetle"
                            aria-label={`Generate AI summary for ${article.title}`}
                        >
                            {isSummarizing ? (
                                <div className="w-5 h-5 animate-spin border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            )}
                        </button>
                        <button
                            onClick={() => onReadArticle(article)}
                            className="flex-1 py-2 bg-theme-accent-primary/20 hover:bg-theme-accent-primary/40 text-theme-text-primary text-sm font-medium rounded-lg transition-colors text-center"
                            aria-label={`Read article: ${article.title}`}
                        >
                            Oku
                        </button>
                        <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-theme-bg-tertiary hover:bg-theme-bg-quaternary text-theme-text-secondary text-sm font-medium rounded-lg transition-colors text-center"
                            aria-label={`Go to source article: ${article.title}`}
                        >
                            Kaynağa Git
                        </a>
                        <a
                            href={`https://translate.google.com/translate?sl=auto&tl=tr&u=${encodeURIComponent(article.link)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-theme-bg-tertiary hover:bg-theme-bg-quaternary text-theme-text-muted hover:text-blue-400 rounded-lg transition-colors"
                            title="Türkçe'ye Çevir"
                            aria-label={`Translate ${article.title} to Turkish`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                        </a>
                    </div>

                    {summary && (
                        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-fadeIn">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Özeti</span>
                            </div>
                            <p className="text-sm text-theme-text-secondary leading-relaxed italic">
                                "{summary}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewsGrid = ({ articles, loading, bookmarks = [], onToggleBookmark, onReadArticle, onDeleteArticle, recommendations = [] }) => {
    const [visibleCount, setVisibleCount] = useState(12);
    const observerTarget = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleCount < articles.length) {
            setVisibleCount(prev => prev + 12);
        }
    }, [visibleCount, articles.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '200px',
            threshold: 0.1
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [handleObserver]);

    // Reset visible count when articles change substantially (e.g. filter change)
    useEffect(() => {
        setVisibleCount(12);
    }, [articles.length]);

    if (loading && articles.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-accent-primary"></div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-theme-text-muted">
                <p className="text-xl">Haber bulunamadı.</p>
                <p className="text-sm mt-2">Sol taraftan yeni kaynak ekleyebilirsiniz!</p>
            </div>
        );
    }

    const visibleArticles = articles.slice(0, visibleCount);

    return (
        <div className="flex flex-col">
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
                role="feed"
                aria-label="News articles"
                aria-busy={loading ? 'true' : 'false'}
            >
                {visibleArticles.map((article, idx) => {
                    const isBookmarked = bookmarks.some(b => b.link === article.link);
                    const isRecommended = recommendations.some(r => r.link === article.link);
                    return (
                        <NewsCard
                            key={`${article.link}-${idx}`}
                            article={article}
                            isBookmarked={isBookmarked}
                            onToggleBookmark={onToggleBookmark}
                            onReadArticle={onReadArticle}
                            onDeleteArticle={onDeleteArticle}
                            isRecommended={isRecommended}
                        />
                    );
                })}
            </div>

            {/* Sentinel element for Infinite Scroll */}
            <div
                ref={observerTarget}
                className="h-20 w-full flex items-center justify-center"
            >
                {visibleCount < articles.length && (
                    <div className="animate-pulse text-theme-text-muted text-sm font-medium">
                        Daha fazla haber yükleniyor...
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsGrid;
