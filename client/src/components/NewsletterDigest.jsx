import React, { useState, useMemo } from 'react';
import { useTranslation } from '../contexts/useLanguage';

const NewsletterDigest = ({ articles, onClose }) => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        articleCount: 10,
        timeRange: 'today', // today, week
        categories: [],
        includeImages: true
    });
    const [copied, setCopied] = useState(false);

    // Filter and prepare articles
    const digestArticles = useMemo(() => {
        let filtered = [...articles];

        // Time filter
        const now = new Date();
        if (settings.timeRange === 'today') {
            filtered = filtered.filter(a => {
                const diff = now - new Date(a.pubDate);
                return diff < 24 * 60 * 60 * 1000;
            });
        } else if (settings.timeRange === 'week') {
            filtered = filtered.filter(a => {
                const diff = now - new Date(a.pubDate);
                return diff < 7 * 24 * 60 * 60 * 1000;
            });
        }

        // Category filter
        if (settings.categories.length > 0) {
            filtered = filtered.filter(a =>
                a.categories?.some(c => settings.categories.includes(c))
            );
        }

        // Sort by date and limit
        filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        return filtered.slice(0, settings.articleCount);
    }, [articles, settings]);

    const generateHTML = () => {
        const dateStr = new Date().toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Haber Özeti - ${dateStr}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0 0 10px 0; font-size: 24px; }
        .header p { margin: 0; opacity: 0.9; }
        .article { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .article img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; }
        .article h2 { margin: 0 0 8px 0; font-size: 16px; line-height: 1.4; }
        .article h2 a { color: #333; text-decoration: none; }
        .article h2 a:hover { color: #667eea; }
        .article .meta { font-size: 12px; color: #666; margin-bottom: 10px; }
        .article .snippet { font-size: 14px; color: #555; line-height: 1.6; }
        .article .categories { margin-top: 10px; }
        .article .category { display: inline-block; background: #f0f0f0; padding: 4px 10px; border-radius: 12px; font-size: 11px; color: #666; margin-right: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📰 Günlük Haber Özeti</h1>
        <p>${dateStr}</p>
    </div>
    
    ${digestArticles.map(article => `
    <div class="article">
        ${settings.includeImages && article.imageUrl ? `<img src="${article.imageUrl}" alt="">` : ''}
        <h2><a href="${article.link}" target="_blank">${article.title}</a></h2>
        <div class="meta">${article.feedName} • ${new Date(article.pubDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
        <div class="snippet">${(article.contentSnippet || '').slice(0, 200)}...</div>
        ${article.categories?.length ? `
        <div class="categories">
            ${article.categories.slice(0, 3).map(c => `<span class="category">${c}</span>`).join('')}
        </div>
        ` : ''}
    </div>
    `).join('')}
    
    <div class="footer">
        RSS News Collector ile oluşturuldu
    </div>
</body>
</html>`;
    };

    const handleCopyHTML = async () => {
        try {
            await navigator.clipboard.writeText(generateHTML());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const html = generateHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `haber-ozeti-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-gray-900 border border-glass-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-glass-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {t('newsletterDigest')}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {digestArticles.length} haber seçildi
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-glass-200 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Settings */}
                <div className="p-6 border-b border-glass-200 bg-glass-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Haber Sayısı</label>
                            <select
                                value={settings.articleCount}
                                onChange={(e) => setSettings(s => ({ ...s, articleCount: parseInt(e.target.value) }))}
                                className="w-full bg-glass-200 border border-glass-200 rounded-lg px-3 py-2 text-sm text-white"
                            >
                                <option value={5}>5 haber</option>
                                <option value={10}>10 haber</option>
                                <option value={15}>15 haber</option>
                                <option value={20}>20 haber</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Zaman Aralığı</label>
                            <select
                                value={settings.timeRange}
                                onChange={(e) => setSettings(s => ({ ...s, timeRange: e.target.value }))}
                                className="w-full bg-glass-200 border border-glass-200 rounded-lg px-3 py-2 text-sm text-white"
                            >
                                <option value="today">{t('today')}</option>
                                <option value="week">{t('thisWeek')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="includeImages"
                            checked={settings.includeImages}
                            onChange={(e) => setSettings(s => ({ ...s, includeImages: e.target.checked }))}
                            className="rounded"
                        />
                        <label htmlFor="includeImages" className="text-sm text-gray-300">Görselleri dahil et</label>
                    </div>
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Önizleme</h3>
                    <div className="space-y-3">
                        {digestArticles.map((article, idx) => (
                            <div key={article.link} className="flex gap-3 p-3 bg-glass-200 rounded-xl">
                                <span className="text-lg font-bold text-purple-400">{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white line-clamp-1">{article.title}</h4>
                                    <p className="text-xs text-gray-400">{article.feedName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-glass-200 flex gap-3">
                    <button
                        onClick={handleCopyHTML}
                        className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {t('copied')}
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                {t('copyHtml')}
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2.5 bg-glass-200 hover:bg-glass-300 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        İndir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsletterDigest;
