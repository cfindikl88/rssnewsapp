import React from 'react';
import useNotifications from '../hooks/useNotifications';
import { useTranslation } from '../contexts/useLanguage';

const AVAILABLE_CATEGORIES = [
    'Son Dakika', 'Dünya', 'Ekonomi', 'Spor', 'Teknoloji', 'Siyaset', 'Sağlık'
];

const NotificationSettings = () => {
    const { t } = useTranslation();
    const {
        permission,
        isSubscribed,
        notifyCategories,
        toggleNotifications,
        toggleCategory,
        isSupported
    } = useNotifications();

    if (!isSupported) {
        return (
            <div className="p-4 bg-glass-200 rounded-2xl border border-glass-200">
                <div className="text-sm text-gray-400 text-center">
                    Tarayıcınız bildirimleri desteklemiyor
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-glass-200 rounded-2xl border border-glass-200">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {t('notifications')}
            </h3>

            {/* Main Toggle */}
            <div
                onClick={toggleNotifications}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all mb-4 ${isSubscribed
                        ? 'bg-green-900/30 border border-green-500/30'
                        : 'bg-glass-100 hover:bg-glass-300'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSubscribed ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isSubscribed ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">
                            {t('breakingNews')}
                        </div>
                        <div className="text-xs text-gray-400">
                            {isSubscribed ? 'Bildirimler açık' : 'Bildirimler kapalı'}
                        </div>
                    </div>
                </div>

                {/* Toggle Switch */}
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${isSubscribed ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isSubscribed ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                </div>
            </div>

            {/* Permission Warning */}
            {permission === 'denied' && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl">
                    <div className="text-xs text-red-400">
                        ⚠️ Bildirim izni reddedildi. Tarayıcı ayarlarından izin verin.
                    </div>
                </div>
            )}

            {/* Category Selection */}
            {isSubscribed && (
                <div>
                    <div className="text-xs text-gray-400 mb-2">Bildirim alınacak kategoriler:</div>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${notifyCategories.includes(category)
                                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                        : 'bg-glass-100 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationSettings;
