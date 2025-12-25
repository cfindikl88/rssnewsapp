import React, { useState, useEffect, useMemo, useCallback } from 'react';

const HistoricalEventsWidget = () => {
    // Historical events database organized by month and day - memoized
    const historicalEvents = useMemo(() => ({
        '12-18': [
            { year: 1865, event: 'ABD\'de köleliği yasaklayan 13. Anayasa değişikliği onaylandı' },
            { year: 1912, event: 'Piltdown İnsanı fosili bulundu (sonradan sahte olduğu anlaşıldı)' },
            { year: 1969, event: 'Birleşik Krallık\'ta idam cezası tamamen kaldırıldı' },
            { year: 2011, event: 'ABD\'nin Irak\'taki askeri varlığı sona erdi' }
        ],
        '12-19': [
            { year: 1843, event: 'Charles Dickens\'ın "A Christmas Carol" adlı eseri yayımlandı' },
            { year: 1972, event: 'Apollo 17 Dünya\'ya döndü, Ay\'a yapılan son insanlı görev sona erdi' },
            { year: 2001, event: 'Afganistan\'da geçici hükümet göreve başladı' }
        ],
        '12-20': [
            { year: 1803, event: 'Louisiana Satın Alımı tamamlandı' },
            { year: 1924, event: 'Adolf Hitler Landsberg Hapishanesi\'nden serbest bırakıldı' },
            { year: 1989, event: 'ABD Panama\'ya müdahale etti (Operation Just Cause)' },
            { year: 2007, event: 'II. Elizabeth, Birleşik Krallık tarihinin en uzun süre hüküm süren hükümdarı oldu' }
        ],
        '12-25': [
            { year: 1991, event: 'Sovyetler Birliği resmen dağıldı' },
            { year: 800, event: 'Şarlman Roma İmparatoru olarak taç giydi' },
            { year: 1914, event: 'I. Dünya Savaşı\'nda Noel ateşkesi gerçekleşti' }
        ],
        '1-1': [
            { year: 1923, event: 'Ankara, Türkiye Cumhuriyeti\'nin başkenti ilan edildi' },
            { year: 1959, event: 'Küba Devrimi: Batista rejimi yıkıldı' },
            { year: 2002, event: 'Euro, 12 Avrupa ülkesinde resmi para birimi oldu' }
        ],
        '5-29': [
            { year: 1453, event: 'Fatih Sultan Mehmet İstanbul\'u fethetti' },
            { year: 1919, event: 'Einstein\'ın genel görelilik kuramı güneş tutulması gözlemiyle doğrulandı' },
            { year: 1953, event: 'Edmund Hillary ve Tenzing Norgay Everest zirvesine ulaştı' }
        ],
        '10-29': [
            { year: 1923, event: 'Türkiye Cumhuriyeti ilan edildi' },
            { year: 1929, event: 'Kara Salı - Wall Street\'te borsa çöküşü, Büyük Buhran başladı' },
            { year: 1969, event: 'İnternet\'in ilk mesajı gönderildi (ARPANET)' }
        ],
        '7-20': [
            { year: 1969, event: 'Apollo 11 Ay\'a iniş yaptı, Neil Armstrong Ay\'a ayak basan ilk insan oldu' },
            { year: 1974, event: 'Kıbrıs Barış Harekâtı başladı' }
        ],
        '4-23': [
            { year: 1920, event: 'TBMM açıldı, Ulusal Egemenlik ve Çocuk Bayramı' },
            { year: 1616, event: 'William Shakespeare vefat etti' }
        ],
        '8-30': [
            { year: 1922, event: 'Büyük Taarruz başladı (Kurtuluş Savaşı\'nın dönüm noktası)' },
            { year: 1963, event: 'Moskova-Washington arası kırmızı telefon hattı açıldı' }
        ]
    }), []);

    const getEventsForToday = useCallback(() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const key = `${month}-${day}`;

        return historicalEvents[key] || [
            { year: new Date().getFullYear() - 100, event: 'Bu tarihte kayıtlı önemli bir olay bulunmamaktadır' }
        ];
    }, [historicalEvents]);

    const [events, setEvents] = useState(() => getEventsForToday().slice(0, 3));

    useEffect(() => {
        // Update at midnight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        const timer = setTimeout(() => {
            setEvents(getEventsForToday().slice(0, 3));
        }, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, [getEventsForToday]);

    const today = new Date();
    const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    return (
        <div className="mb-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-4 border border-amber-400/20 shadow-lg relative group">
            {/* Decorative Background blob */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition-all"></div>

            <div className="relative z-10">
                <h2 className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
                    🕰️ Tarihte Bugün
                </h2>
                <p className="text-xs text-amber-300/70 mb-3">
                    {today.getDate()} {monthNames[today.getMonth()]}
                </p>

                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-glass-200 rounded-lg p-3 border-l-4 border-amber-400/50 hover:bg-glass-300 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <span className="inline-block bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {event.year}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-200 leading-relaxed">
                                    {event.event}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoricalEventsWidget;
