import { useContext, useCallback } from 'react';
import LanguageContext from './LanguageContext';

// Translation dictionary
const translations = {
    tr: {
        // Header
        search: 'Haber ara...',
        all: 'Tümü',
        today: 'Bugün',
        thisWeek: 'Bu Hafta',
        refresh: 'Yenile',
        latestNews: 'Son Dakika',
        myFavorites: 'Favorilerim',
        recentEarthquakes: 'Son Depremler (AFAD)',
        newsListed: 'haber listeleniyor',

        // Feed List
        newsCategories: 'Haber Kategorileri',
        favorites: 'Favorilerim',
        earthquakes: 'Son Depremler',
        recommendations: 'Size Özel',
        newsSources: 'Haber Kaynakları',
        addSource: 'Kaynak Ekle',
        enterRssLink: 'RSS Linki Girin',
        addFeed: 'Ekle',
        feedName: 'Kaynak Adı',

        // Article Modal
        close: 'Kapat',
        goToSource: 'Kaynağa Git →',
        aiSummary: 'AI Özeti',
        listen: 'Haberi Dinle',
        stop: 'Durdur',
        share: 'Paylaş',
        saveOffline: 'Çevrimdışı Kaydet',
        saved: 'Kaydedildi',

        // Widgets
        weather: 'Hava Durumu',
        calendar: 'Takvim',
        countdown: 'Geri Sayım',
        marketSummary: 'Piyasa Özeti',
        quoteOfDay: 'Günün Sözü',
        wordOfDay: 'Günün Kelimesi',
        quizOfDay: 'Günün Sorusu',
        todayInHistory: 'Tarihte Bugün',
        footballMatches: 'Büyük Takımlar',
        videoNews: 'Video Haberler',
        podcasts: 'Podcast',
        readingStats: 'Okuma İstatistikleri',

        // Reading Stats
        articlesRead: 'Okunan Haber',
        timeSpent: 'Harcanan Süre',
        minutes: 'dakika',
        readingStreak: 'Okuma Serisi',
        days: 'gün',
        topCategories: 'En Çok Okunan Kategoriler',

        // Sharing
        shareOn: 'Paylaş',
        copyLink: 'Linki Kopyala',
        copied: 'Kopyalandı!',
        shareVia: 'ile paylaş',

        // Notifications
        notifications: 'Bildirimler',
        enableNotifications: 'Bildirimleri Aç',
        disableNotifications: 'Bildirimleri Kapat',
        breakingNews: 'Son Dakika Bildirimleri',

        // Newsletter
        generateDigest: 'Özet Oluştur',
        newsletterDigest: 'Haber Özeti',
        copyHtml: 'HTML Kopyala',

        // Offline
        offline: 'Çevrimdışı',
        youAreOffline: 'İnternet bağlantınız yok',
        savedArticles: 'Kayıtlı Haberler',

        // General
        loading: 'Yükleniyor...',
        noResults: 'Haber bulunamadı',
        error: 'Hata',
        retry: 'Tekrar Dene',
        settings: 'Ayarlar',
        theme: 'Tema',
        darkMode: 'Karanlık Mod',
        lightMode: 'Aydınlık Mod',
        language: 'Dil',

        // Podcast
        nowPlaying: 'Şimdi Çalıyor',
        episode: 'Bölüm',
        duration: 'Süre',

        // Audio/Video
        audioLoadError: 'Ses yüklenemedi',
        moreOnYouTube: "YouTube'da Daha Fazla",
    },
    en: {
        // Header
        search: 'Search news...',
        all: 'All',
        today: 'Today',
        thisWeek: 'This Week',
        refresh: 'Refresh',
        latestNews: 'Latest News',
        myFavorites: 'My Favorites',
        recentEarthquakes: 'Recent Earthquakes (AFAD)',
        newsListed: 'news listed',

        // Feed List  
        newsCategories: 'News Categories',
        favorites: 'My Favorites',
        earthquakes: 'Recent Earthquakes',
        recommendations: 'For You',
        newsSources: 'News Sources',
        addSource: 'Add Source',
        enterRssLink: 'Enter RSS Link',
        addFeed: 'Add',
        feedName: 'Feed Name',

        // Article Modal
        close: 'Close',
        goToSource: 'Go to Source →',
        aiSummary: 'AI Summary',
        listen: 'Listen',
        stop: 'Stop',
        share: 'Share',
        saveOffline: 'Save Offline',
        saved: 'Saved',

        // Widgets
        weather: 'Weather',
        calendar: 'Calendar',
        countdown: 'Countdown',
        marketSummary: 'Market Summary',
        quoteOfDay: 'Quote of the Day',
        wordOfDay: 'Word of the Day',
        quizOfDay: 'Quiz of the Day',
        todayInHistory: 'Today in History',
        footballMatches: 'Big Teams',
        videoNews: 'Video News',
        podcasts: 'Podcasts',
        readingStats: 'Reading Stats',

        // Reading Stats
        articlesRead: 'Articles Read',
        timeSpent: 'Time Spent',
        minutes: 'min',
        readingStreak: 'Reading Streak',
        days: 'days',
        topCategories: 'Top Categories',

        // Sharing
        shareOn: 'Share',
        copyLink: 'Copy Link',
        copied: 'Copied!',
        shareVia: 'Share via',

        // Notifications
        notifications: 'Notifications',
        enableNotifications: 'Enable Notifications',
        disableNotifications: 'Disable Notifications',
        breakingNews: 'Breaking News Alerts',

        // Newsletter
        generateDigest: 'Generate Digest',
        newsletterDigest: 'News Digest',
        copyHtml: 'Copy HTML',

        // Offline
        offline: 'Offline',
        youAreOffline: 'No internet connection',
        savedArticles: 'Saved Articles',

        // General
        loading: 'Loading...',
        noResults: 'No news found',
        error: 'Error',
        retry: 'Retry',
        settings: 'Settings',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language',

        // Podcast
        nowPlaying: 'Now Playing',
        episode: 'Episode',
        duration: 'Duration',

        // Audio/Video
        audioLoadError: 'Audio failed to load',
        moreOnYouTube: 'More on YouTube',
    }
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const useTranslation = () => {
    const { uiLanguage } = useLanguage();

    const t = useCallback((key) => {
        return translations[uiLanguage]?.[key] || translations.tr[key] || key;
    }, [uiLanguage]);

    return { t };
};

export default useLanguage;
