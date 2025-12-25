import React, { useState, useEffect } from 'react';

// TimeUnit component defined outside to prevent re-creation during render
const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl px-3 py-2 min-w-[60px] shadow-lg">
            <span className="text-2xl font-bold text-white tabular-nums">
                {String(value).padStart(2, '0')}
            </span>
        </div>
        <span className="text-xs text-gray-400 mt-1 font-medium">{label}</span>
    </div>
);

const Countdown2026 = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date('2026-01-01T00:00:00');
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-glass-100 border border-glass-200 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-sm font-semibold text-white">2026'ya Geri Sayım</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <TimeUnit value={timeLeft.days} label="Gün" />
                <TimeUnit value={timeLeft.hours} label="Saat" />
                <TimeUnit value={timeLeft.minutes} label="Dakika" />
                <TimeUnit value={timeLeft.seconds} label="Saniye" />
            </div>

            <div className="mt-3 pt-3 border-t border-glass-100">
                <p className="text-xs text-center text-gray-400">
                    🎉 Yeni yıla hazır mısınız?
                </p>
            </div>
        </div>
    );
};

export default Countdown2026;
