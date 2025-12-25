import React from 'react';

const RecommendationsWidget = ({ recommendations, onReadArticle, getRecommendationReason }) => {
    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                    Size Özel
                </h3>
            </div>

            <div className="space-y-3">
                {recommendations.map((article, idx) => {
                    const reason = getRecommendationReason(article);
                    const date = new Date(article.pubDate).toLocaleDateString('tr-TR', {
                        month: 'short', day: 'numeric'
                    });

                    return (
                        <div
                            key={`rec-${article.link}-${idx}`}
                            onClick={() => onReadArticle(article)}
                            className="group cursor-pointer bg-glass-100 hover:bg-glass-200 border border-glass-200 rounded-xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-900/20"
                        >
                            <div className="flex gap-3">
                                {/* Thumbnail */}
                                {article.imageUrl && (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={article.imageUrl}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => e.target.parentElement.style.display = 'none'}
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1 group-hover:text-purple-300 transition-colors">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-purple-300 font-medium">
                                            ✨ {reason}
                                        </span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-400">{date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecommendationsWidget;
