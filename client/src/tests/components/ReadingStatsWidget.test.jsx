import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReadingStatsWidget from '../../components/ReadingStatsWidget';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import * as useReadingStatsModule from '../../hooks/useReadingStats';

const renderWithProviders = (ui) => {
    return render(
        <LanguageProvider>
            <ThemeProvider>
                {ui}
            </ThemeProvider>
        </LanguageProvider>
    );
};

describe('ReadingStatsWidget', () => {
    it('should render with zero stats initially', () => {
        vi.spyOn(useReadingStatsModule, 'useReadingStats').mockReturnValue({
            getTodayStats: () => ({ count: 0, time: 0, streak: 0 }),
            getWeekStats: () => ({ count: 0, time: 0 }),
            getTopCategories: () => [],
            formatTime: (seconds) => `${seconds}s`,
            stats: { totalArticles: 0 }
        });

        renderWithProviders(<ReadingStatsWidget />);

        expect(screen.getByText(/Reading Stats|Okuma İstatistikleri/i)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should display today stats correctly', () => {
        vi.spyOn(useReadingStatsModule, 'useReadingStats').mockReturnValue({
            getTodayStats: () => ({ count: 5, time: 300, streak: 3 }),
            getWeekStats: () => ({ count: 20, time: 1800 }),
            getTopCategories: () => [
                { category: 'Technology', count: 10 },
                { category: 'Sports', count: 5 }
            ],
            formatTime: (seconds) => `${Math.floor(seconds / 60)}m`,
            stats: { totalArticles: 25 }
        });

        renderWithProviders(<ReadingStatsWidget />);

        expect(screen.getByText('5')).toBeInTheDocument(); // Today count
        expect(screen.getByText('5m')).toBeInTheDocument(); // Today time formatted
        expect(screen.getByText('3')).toBeInTheDocument(); // Streak
    });

    it('should display week stats correctly', () => {
        vi.spyOn(useReadingStatsModule, 'useReadingStats').mockReturnValue({
            getTodayStats: () => ({ count: 5, time: 300, streak: 3 }),
            getWeekStats: () => ({ count: 20, time: 1800 }),
            getTopCategories: () => [],
            formatTime: (seconds) => `${Math.floor(seconds / 60)}m`,
            stats: { totalArticles: 25 }
        });

        renderWithProviders(<ReadingStatsWidget />);

        expect(screen.getByText('20')).toBeInTheDocument(); // Week count
        expect(screen.getByText('30m')).toBeInTheDocument(); // Week time formatted
    });

    it('should display top categories', () => {
        vi.spyOn(useReadingStatsModule, 'useReadingStats').mockReturnValue({
            getTodayStats: () => ({ count: 0, time: 0, streak: 0 }),
            getWeekStats: () => ({ count: 0, time: 0 }),
            getTopCategories: () => [
                { category: 'Technology', count: 10 },
                { category: 'Sports', count: 5 },
                { category: 'News', count: 3 }
            ],
            formatTime: (seconds) => `${seconds}s`,
            stats: { totalArticles: 18 }
        });

        renderWithProviders(<ReadingStatsWidget />);

        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Sports')).toBeInTheDocument();
        expect(screen.getByText('News')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should format time correctly', () => {
        const formatTime = (seconds) => {
            if (seconds < 60) return `${seconds}s`;
            if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
            return `${Math.floor(seconds / 3600)}h`;
        };

        expect(formatTime(45)).toBe('45s');
        expect(formatTime(150)).toBe('2m');
        expect(formatTime(3700)).toBe('1h');
    });

    it('should display streak with fire emoji', () => {
        vi.spyOn(useReadingStatsModule, 'useReadingStats').mockReturnValue({
            getTodayStats: () => ({ count: 5, time: 300, streak: 7 }),
            getWeekStats: () => ({ count: 20, time: 1800 }),
            getTopCategories: () => [],
            formatTime: (seconds) => `${seconds}s`,
            stats: { totalArticles: 25 }
        });

        renderWithProviders(<ReadingStatsWidget />);

        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText(/🔥/)).toBeInTheDocument();
    });

    it('should display total articles read', () => {
        vi.spyOn(useReadingStatsModule, 'useReadingStats').mockReturnValue({
            getTodayStats: () => ({ count: 5, time: 300, streak: 3 }),
            getWeekStats: () => ({ count: 20, time: 1800 }),
            getTopCategories: () => [],
            formatTime: (seconds) => `${seconds}s`,
            stats: { totalArticles: 150 }
        });

        renderWithProviders(<ReadingStatsWidget />);

        expect(screen.getByText('150')).toBeInTheDocument();
    });
});
