import React, { useMemo } from 'react';

// Calculate timestamp at component load time (module level)
const INITIAL_TIMESTAMP = Date.now();

const SimilarArticles = ({ currentArticle, allArticles, onSelectArticle }) => {
    // Extract significant keywords from text
    function extractKeywords(text) {
        if (!text) return new Set();

        const stopWords = new Set([
            'bir', 've', 'için', 'ile', 'de', 'da', 'bu', 'o', 'ne', 'mi', 'mu',
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been'
        ]);

        return new Set(
            text
                .toLowerCase()
                .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 3 && !stopWords.has(w))
        );
    }

    // Calculate similar articles based on categories and keywords
    const similarArticles = useMemo(() => {
        if (!currentArticle || !allArticles?.length) return [];

        // Get current article's features
        const currentCategories = new Set(currentArticle.categories || []);
        const currentWords = extractKeywords(currentArticle.title + ' ' + (currentArticle.contentSnippet || ''));

        // Score each article
        const scored = allArticles
            .filter(a => a.link !== currentArticle.link) // Exclude current
            .map(article => {
                let score = 0;

                // Category overlap (high weight)
                const articleCategories = article.categories || [];
                const categoryOverlap = articleCategories.filter(c => currentCategories.has(c)).length;
                score += categoryOverlap * 10;

                // Same source bonus
                if (article.feedName === currentArticle.feedName) {
                    score += 5;
                }

                // Keyword overlap
                const articleWords = extractKeywords(article.title + ' ' + (article.contentSnippet || ''));
                const keywordOverlap = [...currentWords].filter(w => articleWords.has(w)).length;
                score += keywordOverlap * 2;

                // Recency bonus (prefer newer articles) - use module-level timestamp
                const daysDiff = (INITIAL_TIMESTAMP - new Date(article.pubDate).getTime()) / (1000 * 60 * 60 * 24);
                if (daysDiff < 1) score += 3;
                else if (daysDiff < 3) score += 2;
                else if (daysDiff < 7) score += 1;

                return { article, score };
            })
            .filter(({ score }) => score > 0) // Only keep related articles
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(({ article }) => article);

        return scored;
    }, [currentArticle, allArticles]);

    if (similarArticles.length === 0) return null;

    return (
        <div className="mt-6 pt-6 border-t border-glass-200">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Benzer Haberler
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {similarArticles.map(article => (
                    <div
                        key={article.link}
                        onClick={() => onSelectArticle(article)}
                        className="flex-shrink-0 w-48 p-3 bg-glass-200 rounded-xl cursor-pointer hover:bg-glass-300 transition-all group"
                    >
                        {/* Thumbnail */}
                        {article.imageUrl && (
                            <div className="h-20 mb-2 rounded-lg overflow-hidden bg-gray-800">
                                <img
                                    src={article.imageUrl}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>
                        )}

                        {/* Title */}
                        <h4 className="text-xs font-medium text-white line-clamp-2 leading-tight mb-1">
                            {article.title}
                        </h4>

                        {/* Meta */}
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span className="text-purple-400">{article.feedName}</span>
                            {article.categories?.[0] && (
                                <>
                                    <span>•</span>
                                    <span>{article.categories[0]}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarArticles;
