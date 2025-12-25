import React, { useState, Suspense, lazy } from 'react';
import WidgetErrorBoundary from './WidgetErrorBoundary';

// Lazy load widgets for better initial load performance
const MarketWidget = lazy(() => import('./MarketWidget'));
const WeatherWidget = lazy(() => import('./WeatherWidget'));
const CalendarWidget = lazy(() => import('./CalendarWidget'));
const QuoteOfDayWidget = lazy(() => import('./QuoteOfDayWidget'));
const EnglishWordWidget = lazy(() => import('./EnglishWordWidget'));
const QuizOfDayWidget = lazy(() => import('./QuizOfDayWidget'));
const HistoricalEventsWidget = lazy(() => import('./HistoricalEventsWidget'));
const MarketSummary = lazy(() => import('./MarketSummary'));
const Countdown2026 = lazy(() => import('./Countdown2026'));
const RecommendationsWidget = lazy(() => import('./RecommendationsWidget'));
const EarthquakeWidget = lazy(() => import('./EarthquakeWidget'));
const WorldClocksWidget = lazy(() => import('./WorldClocksWidget'));
const ReadingStatsWidget = lazy(() => import('./ReadingStatsWidget'));

const NotificationSettings = lazy(() => import('./NotificationSettings'));

// Loading skeleton for widgets
const WidgetSkeleton = () => (
    <div className="mb-6 bg-theme-bg-tertiary/50 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-theme-bg-quaternary rounded w-1/3 mb-3"></div>
        <div className="h-16 bg-theme-bg-quaternary rounded"></div>
    </div>
);

const FeedList = ({ feeds, onAddFeed, onRemoveFeed, onSelectFeed, selectedFeed, categories = [], onSelectCategory, selectedCategory, onSelectBookmarks, showBookmarks, onSelectEarthquakes, showEarthquakes, recommendations = [], onReadArticle, getRecommendationReason, bookmarks = [] }) => {
    const [newUrl, setNewUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newUrl) {
            setIsAdding(true);
            try {
                // Basic URL validation
                new URL(newUrl);
                await onAddFeed({ url: newUrl, name: new URL(newUrl).hostname.replace('www.', '') });
                setNewUrl('');
            } catch {
                alert('Geçersiz URL!');
            } finally {
                setIsAdding(false);
            }
        }
    };

    return (
        <div
            className="w-full md:w-80 p-6 bg-theme-bg-secondary backdrop-blur-md border-r border-theme-border-light flex flex-col h-full overflow-y-auto custom-scrollbar"
            role="navigation"
            aria-label="News sources and widgets"
        >
            <Suspense fallback={<WidgetSkeleton />}>
                <WidgetErrorBoundary widgetName="World Clocks">
                    <WorldClocksWidget />
                </WidgetErrorBoundary>
            </Suspense>
            <div className="mb-4" />

            <Suspense fallback={<WidgetSkeleton />}>
                <WidgetErrorBoundary widgetName="Calendar">
                    <CalendarWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Earthquake">
                    <EarthquakeWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Weather">
                    <WeatherWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Countdown 2026">
                    <Countdown2026 />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Market Summary">
                    <MarketSummary />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Quote of Day">
                    <QuoteOfDayWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="English Word">
                    <EnglishWordWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Quiz of Day">
                    <QuizOfDayWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Historical Events">
                    <HistoricalEventsWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Notification Settings">
                    <NotificationSettings />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Market Widget">
                    <MarketWidget />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary widgetName="Reading Stats">
                    <ReadingStatsWidget />
                </WidgetErrorBoundary>
            </Suspense>


            {/* Bookmarks Toggle */}
            <button
                onClick={onSelectBookmarks}
                className={`w-full text-left px-4 py-3 rounded-xl mb-3 flex items-center gap-3 transition-all group ${showBookmarks
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-200'
                    : 'bg-theme-bg-tertiary hover:bg-theme-bg-quaternary text-theme-text-secondary'
                    }`}
                aria-label={`View bookmarks (${bookmarks.length} saved)`}
                aria-pressed={showBookmarks}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <span className={`text-xl ${showBookmarks ? 'text-yellow-500 dark:text-yellow-400' : 'text-theme-text-muted group-hover:text-yellow-500 transition-colors'}`}>★</span>
                        <span className="font-bold tracking-wide">Favorilerim</span>
                    </div>
                    {bookmarks.length > 0 && (
                        <span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">
                            {bookmarks.length}
                        </span>
                    )}
                </div>
            </button>

            {/* Earthquakes Toggle */}
            <button
                onClick={onSelectEarthquakes}
                className={`w-full text-left px-4 py-3 rounded-xl mb-6 flex items-center gap-3 transition-all group ${showEarthquakes
                    ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-600 dark:text-red-200'
                    : 'bg-theme-bg-tertiary hover:bg-theme-bg-quaternary text-theme-text-secondary'
                    }`}
                aria-label="View recent earthquakes"
                aria-pressed={showEarthquakes}
            >
                <span className={`text-xl ${showEarthquakes ? 'text-red-500' : 'text-theme-text-muted group-hover:text-red-500 transition-colors'}`}>🌋</span>
                <span className="font-bold tracking-wide">Son Depremler</span>
            </button>

            <h2 className="text-xl font-bold mb-6 text-theme-text-primary tracking-wide">Kategoriler</h2>
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat
                            ? 'bg-theme-accent-primary text-white shadow-lg shadow-purple-900/40'
                            : 'bg-theme-bg-tertiary text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-bg-quaternary'
                            }`}
                        aria-label={`Filter by ${cat} category`}
                        aria-pressed={selectedCategory === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-6 text-theme-text-primary tracking-wide">Haber Kaynakları</h2>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col gap-2">
                    <input
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="RSS Linki Girin..."
                        className="w-full bg-theme-bg-tertiary border border-theme-border-medium rounded-lg px-4 py-2 text-sm text-theme-text-primary placeholder-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-accent-primary transition-all"
                        aria-label="RSS feed URL"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isAdding}
                        className={`w-full py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/50 ${isAdding ? 'bg-purple-800 text-gray-300 cursor-wait' : 'bg-theme-accent-primary hover:bg-purple-700 text-white'
                            }`}
                        aria-label="Add new RSS feed source"
                    >
                        {isAdding ? 'Ekleniyor...' : 'Kaynağı Ekle'}
                    </button>
                </div>
            </form>

            {/* Recommendations Widget */}
            {recommendations.length > 0 && (
                <div className="mb-6">
                    <RecommendationsWidget
                        recommendations={recommendations}
                        onReadArticle={onReadArticle}
                        getRecommendationReason={getRecommendationReason}
                    />
                </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <button
                    onClick={() => { onSelectFeed(null); onSelectCategory(null); }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedFeed === null && selectedCategory === null
                        ? 'bg-theme-accent-primary/80 shadow-lg shadow-purple-900/30 text-white'
                        : 'hover:bg-theme-bg-tertiary text-theme-text-secondary hover:text-theme-text-primary'
                        } `}
                >
                    <span className="font-medium">Tüm Haberler</span>
                </button>

                {feeds.map((feed, index) => (
                    <div
                        key={index}
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedFeed === feed.url
                            ? 'bg-theme-accent-primary/80 shadow-lg shadow-purple-900/30 text-white'
                            : 'hover:bg-theme-bg-tertiary text-theme-text-secondary hover:text-theme-text-primary'
                            } `}
                    >
                        <button
                            onClick={() => { onSelectFeed(feed.url); onSelectCategory(null); }}
                            className="flex-1 text-left truncate mr-2"
                            title={feed.url}
                        >
                            {feed.name}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFeed(feed.url);
                            }}
                            className="text-theme-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove feed"
                        >
                            ✕
                        </button>
                    </div>
                ))}

            </div>
            <div className="pb-8"></div>
        </div>
    );
};

export default FeedList;
