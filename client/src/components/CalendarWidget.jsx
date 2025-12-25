import React, { useState, useEffect } from 'react';

const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showNextMonth, setShowNextMonth] = useState(false);

    useEffect(() => {
        // Update date at midnight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        const timer = setTimeout(() => {
            setCurrentDate(new Date());
        }, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, [currentDate]);

    const getMonthData = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { year, month, daysInMonth, startingDayOfWeek };
    };

    const renderCalendar = (date, isNextMonth = false) => {
        const { year, month, daysInMonth, startingDayOfWeek } = getMonthData(date);
        const today = new Date();
        const isCurrentMonth = !isNextMonth && today.getMonth() === month && today.getFullYear() === year;

        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];

        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

        const days = [];

        // Empty cells before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="text-center p-1"></div>);
        }

        // Calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === today.getDate();
            days.push(
                <div
                    key={day}
                    className={`text-center p-1 rounded text-xs ${isToday
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold shadow-lg'
                        : 'text-gray-300 hover:bg-glass-200 transition-colors'
                        }`}
                >
                    {day}
                </div>
            );
        }

        return (
            <div>
                <h3 className="text-sm font-bold text-center mb-2 text-purple-200">
                    {monthNames[month]} {year}
                </h3>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(name => (
                        <div key={name} className="text-center text-[10px] text-gray-400 font-medium">
                            {name}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    };

    const currentMonthDate = currentDate;
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    return (
        <div className="mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-400/20 shadow-lg relative group">
            {/* Decorative Background blob */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl group-hover:bg-pink-400/30 transition-all"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                        📅 Takvim
                    </h2>
                    <button
                        onClick={() => setShowNextMonth(!showNextMonth)}
                        className="text-xs px-2 py-1 bg-glass-200 hover:bg-glass-300 rounded text-purple-200 transition-colors"
                    >
                        {showNextMonth ? 'Bu Ay' : 'Gelecek Ay'}
                    </button>
                </div>

                {showNextMonth ? renderCalendar(nextMonthDate, true) : renderCalendar(currentMonthDate)}
            </div>
        </div>
    );
};

export default CalendarWidget;
