import React, { useState, useEffect, useMemo } from 'react';
import FeedList from './components/FeedList';
import NewsGrid from './components/NewsGrid';
import ArticleModal from './components/ArticleModal';
import ErrorBoundary from './components/ErrorBoundary';
import useRSS from './hooks/useRSS';
import useBookmarks from './hooks/useBookmarks';
import useRecommendations from './hooks/useRecommendations';
import NewsTicker from './components/NewsTicker';
import EarthquakeListView from './components/EarthquakeListView';
import { useTheme } from './contexts/useTheme';
import { useLanguage, useTranslation } from './contexts/useLanguage';

const App = () => {
  // Custom Hooks
  const {
    feeds, addFeed, removeFeed,
    articles, loading, fetchArticles,
    categories
  } = useRSS();

  const {
    bookmarks, showBookmarks, setShowBookmarks, toggleBookmark
  } = useBookmarks();

  const {
    trackRead, getRecommendations, getRecommendationReason
  } = useRecommendations();

  // Theme and Language
  const { toggleTheme } = useTheme();
  const { uiLanguage, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  // UI State
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week
  const [readingArticle, setReadingArticle] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all'); // all, tr, en
  const [recommendations, setRecommendations] = useState([]);
  const [showEarthquakes, setShowEarthquakes] = useState(false);

  // Deleted Articles Management
  const [deletedArticles, setDeletedArticles] = useState(() => {
    const saved = localStorage.getItem('deleted_articles');
    return saved ? JSON.parse(saved) : [];
  });

  const handleDeleteArticle = (article) => {
    const newDeleted = [...deletedArticles, article.link];
    setDeletedArticles(newDeleted);
    localStorage.setItem('deleted_articles', JSON.stringify(newDeleted));
  };

  // Filter Logic with useMemo for performance optimization
  const filteredArticles = useMemo(() => {
    return (showBookmarks ? bookmarks : articles).filter(article => {
      // 0. Deleted Filter - exclude deleted articles
      if (deletedArticles.includes(article.link)) return false;

      // 1. Context Filter
      if (!showBookmarks) {
        if (selectedFeed && article.feedName !== feeds.find(f => f.url === selectedFeed)?.name) return false;
        if (selectedCategory && !article.categories?.includes(selectedCategory)) return false;
      }

      // 2. Search Filter
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const titleMatch = article.title?.toLowerCase().includes(lowerTerm);
        const contentMatch = article.contentSnippet?.toLowerCase().includes(lowerTerm);
        if (!titleMatch && !contentMatch) return false;
      }

      // 3. Date Filter
      if (dateFilter !== 'all') {
        const artDate = new Date(article.pubDate);
        const now = new Date();
        const isToday = artDate.toDateString() === now.toDateString();

        if (dateFilter === 'today' && !isToday) return false;
        if (dateFilter === 'week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          if (artDate < oneWeekAgo) return false;
        }
      }

      // 4. Language Filter
      if (selectedLanguage !== 'all' && article.lang !== selectedLanguage) return false;

      // 5. Smart Earthquake Filter - Remove clickbait earthquake news since we have AFAD widget
      const clickbaitPatterns = [
        'deprem mi oldu',
        'az önce nerede deprem oldu',
        'son dakika deprem',
        'sallandık mı',
        'korkutan deprem',
        'şiddetli deprem',
        'deprem açıklaması'
      ];
      const lowerTitle = article.title?.toLowerCase() || '';
      if (clickbaitPatterns.some(pattern => lowerTitle.includes(pattern))) {
        return false;
      }

      return true;
    });
  }, [showBookmarks, bookmarks, articles, deletedArticles, selectedFeed, feeds, selectedCategory, searchTerm, dateFilter, selectedLanguage]);

  // Calculate recommendations when articles change
  useEffect(() => {
    if (articles.length > 0) {
      const recs = getRecommendations(articles, 5);
      setRecommendations(recs);
    }
  }, [articles, getRecommendations]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Theme with 'D' key (shift optional, case insensitive)
      if (e.key.toLowerCase() === 'd' && !e.target.matches('input, textarea')) {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // Handlers
  const handleSelectBookmark = () => {
    setShowBookmarks(true);
    setSelectedFeed(null);
    setSelectedCategory(null);
    setShowEarthquakes(false);
  }

  const handleSelectFeed = (url) => {
    setSelectedFeed(url);
    setSelectedCategory(null);
    setShowBookmarks(false);
    setShowEarthquakes(false);
  }

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedFeed(null);
    setShowBookmarks(false);
    setShowEarthquakes(false);
  }

  const handleSelectEarthquakes = () => {
    setShowEarthquakes(true);
    setShowBookmarks(false);
    setSelectedFeed(null);
    setSelectedCategory(null);
  }

  const handleReadArticle = (article) => {
    trackRead(article);
    setReadingArticle(article);
  }

  const getHeaderTitle = () => {
    if (showEarthquakes) return 'Son Depremler (AFAD)';
    if (showBookmarks) return 'Favorilerim';
    if (selectedFeed) return feeds.find(f => f.url === selectedFeed)?.name || 'Feed';
    if (selectedCategory) return `#${selectedCategory}`;
    return 'Son Dakika';
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden text-theme-text-primary">
        <FeedList
          feeds={feeds}
          onAddFeed={addFeed}
          onRemoveFeed={removeFeed}
          onSelectFeed={handleSelectFeed}
          selectedFeed={selectedFeed}
          categories={categories}
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
          onSelectBookmarks={handleSelectBookmark}
          showBookmarks={showBookmarks}
          onSelectEarthquakes={handleSelectEarthquakes}
          showEarthquakes={showEarthquakes}
          recommendations={recommendations}
          bookmarks={bookmarks}
          onReadArticle={handleReadArticle}
          getRecommendationReason={getRecommendationReason}
        />

        <main className="flex-1 flex flex-col h-full relative overflow-hidden backdrop-blur-3xl bg-theme-bg-primary">
          <NewsTicker news={articles} onReadArticle={handleReadArticle} />
          <header className="px-8 py-6 border-b border-theme-border-medium flex flex-col md:flex-row justify-between items-center gap-4 bg-theme-bg-secondary/80 backdrop-blur-md z-10">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-theme-text-primary to-theme-accent-primary">
                {getHeaderTitle()}
              </h1>
              <span className="text-xs text-theme-text-muted mt-1">
                {filteredArticles.length} haber listeleniyor
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Haber ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-theme-bg-tertiary border border-theme-border-medium rounded-lg pl-9 pr-4 py-2 text-sm text-theme-text-primary placeholder-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-accent-primary w-48 md:w-64 transition-all"
                />
                <svg className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-theme-bg-tertiary border border-theme-border-medium rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-theme-accent-primary cursor-pointer"
              >
                <option value="all">Tümü</option>
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
              </select>

              {/* News Ticker Toggle or Language Selection */}
              <div className="flex bg-theme-bg-tertiary rounded-lg p-1 border border-theme-border-medium">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLanguage === 'all' ? 'bg-theme-accent-primary text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setSelectedLanguage('tr')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLanguage === 'tr' ? 'bg-theme-accent-primary text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                >
                  TR
                </button>
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLanguage === 'en' ? 'bg-theme-accent-primary text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                >
                  EN
                </button>
              </div>

              {/* UI Language Toggle */}
              <div className="flex bg-theme-bg-tertiary rounded-lg p-1 border border-theme-border-medium">
                <button
                  onClick={() => uiLanguage === 'tr' ? toggleLanguage() : null}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${uiLanguage === 'en' ? 'bg-theme-accent-primary text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                >
                  🌐 EN
                </button>
                <button
                  onClick={() => uiLanguage === 'en' ? toggleLanguage() : null}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${uiLanguage === 'tr' ? 'bg-theme-accent-primary text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                >
                  🇹🇷 TR
                </button>
              </div>



              <button
                onClick={fetchArticles}
                className="p-2 bg-theme-bg-tertiary hover:bg-theme-bg-quaternary rounded-lg text-theme-text-primary transition-colors border border-theme-border-medium"
                title={t('refresh')}
                aria-label={t('refresh')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {showEarthquakes ? (
              <EarthquakeListView />
            ) : (
              <NewsGrid
                articles={filteredArticles}
                loading={loading}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
                onReadArticle={handleReadArticle}
                onDeleteArticle={handleDeleteArticle}
                recommendations={recommendations}
              />
            )}
          </div>

          {readingArticle && (
            <ArticleModal
              article={readingArticle}
              onClose={() => setReadingArticle(null)}
              onArticleOpened={trackRead}
              allArticles={articles}
              onSelectArticle={handleReadArticle}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
