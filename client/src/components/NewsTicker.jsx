import React from 'react';

const NewsTicker = ({ news = [], onReadArticle }) => {
    if (!news || news.length === 0) return null;

    // Get the latest 10 news items for the ticker
    const tickerNews = news.slice(0, 15);

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-b border-white/5 h-10 flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-50">
            <div className="flex items-center px-4 bg-red-600 h-full relative z-10">
                <span className="flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">SON DAKİKA</span>
            </div>

            <div className="flex-1 overflow-hidden relative h-full flex items-center group">
                <div className="animate-marquee pause-marquee inline-block whitespace-nowrap">
                    {tickerNews.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => onReadArticle(item)}
                            className="inline-flex items-center px-6 text-sm text-gray-300 hover:text-white transition-colors border-r border-white/5 group"
                        >
                            <span className="text-purple-400 font-bold mr-2">#</span>
                            <span className="font-medium group-hover:underline">{item.title}</span>
                        </button>
                    ))}
                    {/* Duplicate for seamless scrolling */}
                    {tickerNews.map((item, index) => (
                        <button
                            key={`dup-${index}`}
                            onClick={() => onReadArticle(item)}
                            className="inline-flex items-center px-6 text-sm text-gray-300 hover:text-white transition-colors border-r border-white/5 group"
                        >
                            <span className="text-purple-400 font-bold mr-2">#</span>
                            <span className="font-medium group-hover:underline">{item.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
