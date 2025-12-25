import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/useTheme';
import { useTranslation } from '../contexts/useLanguage';
import { generateSummary } from '../services/aiService';
import ShareButton from './ShareButton';
import SimilarArticles from './SimilarArticles';
import DOMPurify from 'dompurify';
import useReadingStats from '../hooks/useReadingStats';

const ArticleModal = ({ article, onClose, allArticles = [], onSelectArticle }) => {
    const [summary, setSummary] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [language, setLanguage] = useState('tr'); // 'tr' or 'en'
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const { trackArticleRead } = useReadingStats();

    // Track reading time
    useEffect(() => {
        if (!article) return;

        const startTime = Date.now();

        // Track article read after minimum 5 seconds of viewing
        const trackTimer = setTimeout(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            trackArticleRead(article, timeSpent);
        }, 5000);

        return () => {
            clearTimeout(trackTimer);
            // Track final reading time on unmount
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            if (timeSpent >= 5) {
                trackArticleRead(article, timeSpent);
            }
        };
    }, [article, trackArticleRead]);

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    if (!article) return null;

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const handleToggleSpeech = () => {
        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        const textToRead = summary
            ? `${article.title}. ${summary.points.join('. ')}`
            : `${article.title}. ${article.contentSnippet || ''}`;

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US';

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const handleClose = () => {
        stopSpeaking();
        onClose();
    };

    const date = new Date(article.pubDate).toLocaleDateString('tr-TR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const handleGenerateSummary = async () => {
        // If we already have a summary for the *current* language, don't regenerate unless forcing
        if (summary && summary.language === language) return;

        setIsGenerating(true);
        setSummary(null); // Clear previous summary during generation
        try {
            const content = article['content:encoded'] || article.content || article.contentSnippet || '';
            const result = await generateSummary(content, article.title, language);
            setSummary({ ...result, language });
        } catch (error) {
            console.error("Summary generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Keyboard navigation - close on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="article-title">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={handleClose}
                aria-hidden="true"
            ></div>

            <div className={`relative w-full max-w-3xl ${isDark ? 'bg-gray-900' : 'bg-white'} border border-theme-border-medium rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn`}>

                {/* Header Image */}
                {article.imageUrl && (
                    <div className="h-64 w-full relative shrink-0">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg-secondary via-transparent to-transparent"></div>

                        {/* Actions */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="flex bg-black/40 rounded-full p-1 backdrop-blur-md">
                                <button
                                    onClick={() => setLanguage('tr')}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'tr' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    TR
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'en' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    ENG
                                </button>
                            </div>

                            <button
                                onClick={handleGenerateSummary}
                                disabled={isGenerating}
                                className={`p-2 rounded-full text-white transition-all shadow-lg backdrop-blur-md ${summary?.language === language ? 'bg-purple-600/80' :
                                    isGenerating ? 'bg-purple-600/80 animate-pulse' :
                                        'bg-purple-600/80 hover:bg-purple-500 hover:scale-110 hover:rotate-12'
                                    }`}
                                aria-label={`${isGenerating ? 'Özet oluşturuluyor' : 'AI özeti oluştur'}`}
                                title="AI Özet (Potion)"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                </svg>
                            </button>

                            <button
                                onClick={handleToggleSpeech}
                                className={`p-2 rounded-full text-white transition-all shadow-lg backdrop-blur-md ${isSpeaking ? 'bg-red-500/80 animate-pulse' : 'bg-green-600/80 hover:bg-green-500 hover:scale-110'}`}
                                aria-label={isSpeaking ? "Okumayı durdur" : "Makaleyi sesli oku"}
                                title={isSpeaking ? "Durdur" : "Haberi Dinle"}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isSpeaking ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                                    )}
                                </svg>
                            </button>

                            <ShareButton article={article} />

                            <button
                                onClick={handleClose}
                                className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md"
                                aria-label="Close article modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                )}

                {!article.imageUrl && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <div className="flex bg-theme-bg-tertiary rounded-full p-1 backdrop-blur-md border border-theme-border-light">
                            <button
                                onClick={() => setLanguage('tr')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'tr' ? 'bg-purple-600 text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                            >
                                TR
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'en' ? 'bg-purple-600 text-white' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
                            >
                                ENG
                            </button>
                        </div>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={isGenerating}
                            className={`p-2 rounded-full text-white transition-all shadow-lg backdrop-blur-md ${summary?.language === language ? 'bg-purple-600/80 cursor-default' :
                                isGenerating ? 'bg-purple-600/80 animate-pulse' :
                                    'bg-purple-600/80 hover:bg-purple-500 hover:scale-110 hover:rotate-12'
                                }`}
                            title="AI Özet (Potion)"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                            </svg>
                        </button>
                        <button
                            onClick={handleToggleSpeech}
                            className={`p-2 rounded-full text-white transition-all shadow-lg backdrop-blur-md ${isSpeaking ? 'bg-red-500/80 animate-pulse' : 'bg-green-600/80 hover:bg-green-500 hover:scale-110'}`}
                            title={isSpeaking ? "Durdur" : "Haberi Dinle"}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isSpeaking ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                                )}
                            </svg>
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 bg-theme-bg-tertiary hover:bg-theme-bg-quaternary rounded-full text-theme-text-primary transition-colors backdrop-blur-md"
                            aria-label="Close article modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-theme-bg-secondary/90 to-theme-bg-secondary">
                    <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 bg-theme-accent-primary/20 text-theme-accent-primary text-sm rounded-lg font-medium">{article.feedName}</span>
                    </div>

                    <h2 className="text-3xl font-bold text-theme-text-primary mb-2 leading-tight" id="article-title">
                        {article.title}
                    </h2>
                    <p className="text-theme-text-muted text-sm mb-6">{date}</p>

                    {/* AI Summary Section */}
                    {summary && (
                        <div className="mb-8 p-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl animate-fadeIn">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                                    {summary.title || 'AI Özeti'}
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {summary.points.map((point, idx) => (
                                    <li key={idx} className="flex gap-3 text-purple-100/90 leading-relaxed">
                                        <span className="text-purple-400 mt-1.5">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 text-xs text-purple-400/60 text-right">
                                {summary.disclaimer}
                            </div>
                        </div>
                    )}

                    <div className={`prose ${isDark ? 'prose-invert' : ''} prose-lg max-w-none text-theme-text-secondary leading-relaxed`}>
                        {/* RSS Parser sometimes puts full content in 'content:encoded' or 'content' */}
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article['content:encoded'] || article.content || article.contentSnippet || '') }} />
                    </div>

                    {/* Similar Articles */}
                    {allArticles.length > 0 && onSelectArticle && (
                        <SimilarArticles
                            currentArticle={article}
                            allArticles={allArticles}
                            onSelectArticle={onSelectArticle}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-theme-border-strong bg-theme-bg-quaternary flex justify-end gap-3 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-theme-bg-tertiary hover:bg-theme-bg-quaternary rounded-xl text-theme-text-primary font-medium transition-colors"
                    >
                        {t('close')}
                    </button>
                    <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-bold shadow-lg shadow-purple-900/40 transition-all transform hover:-translate-y-1"
                    >
                        {t('goToSource')} →
                    </a>
                </div>

            </div>
        </div>
    );
};

export default ArticleModal;
