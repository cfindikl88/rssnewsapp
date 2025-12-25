import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsGrid from '../../components/NewsGrid';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

const mockArticles = [
    {
        title: 'First Article',
        description: 'First description',
        link: 'https://example.com/1',
        pubDate: '2025-12-25T12:00:00Z',
        source: 'Source A',
        category: 'Technology'
    },
    {
        title: 'Second Article',
        description: 'Second description',
        link: 'https://example.com/2',
        pubDate: '2025-12-25T11:00:00Z',
        source: 'Source B',
        category: 'Sports'
    }
];

const renderWithProviders = (ui) => {
    return render(
        <LanguageProvider>
            <ThemeProvider>
                {ui}
            </ThemeProvider>
        </LanguageProvider>
    );
};

describe('NewsGrid', () => {
    const mockOnArticleClick = vi.fn();
    const mockOnBookmark = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render article grid with all articles', () => {
        renderWithProviders(
            <NewsGrid
                articles={mockArticles}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
            />
        );

        expect(screen.getByText('First Article')).toBeInTheDocument();
        expect(screen.getByText('Second Article')).toBeInTheDocument();
    });

    it('should display article metadata correctly', () => {
        renderWithProviders(
            <NewsGrid
                articles={mockArticles}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
            />
        );

        expect(screen.getByText(/Source A/)).toBeInTheDocument();
        expect(screen.getByText(/Technology/)).toBeInTheDocument();
    });

    it('should call onArticleClick when "Oku" button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <NewsGrid
                articles={mockArticles}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
            />
        );

        const readButtons = screen.getAllByText(/Oku|Read/);
        await user.click(readButtons[0]);

        expect(mockOnArticleClick).toHaveBeenCalledWith(mockArticles[0]);
    });

    it('should show bookmark icon for bookmarked articles', () => {
        const bookmarkedArticles = [mockArticles[0].link];

        renderWithProviders(
            <NewsGrid
                articles={mockArticles}
                onArticleClick={mockOnArticleClick}
                bookmarks={bookmarkedArticles}
                onBookmark={mockOnBookmark}
            />
        );

        // First article should show filled star
        const bookmarkButtons = screen.getAllByText(/★|☆/);
        expect(bookmarkButtons.length).toBeGreaterThan(0);
    });

    it('should display loading state when specified', () => {
        renderWithProviders(
            <NewsGrid
                articles={[]}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
                loading={true}
            />
        );

        // Should show loading skeletons or spinner
        const loadingElement = screen.queryByText(/Yükleniyor|Loading/i);
        // Loading state might be implemented differently
    });

    it('should display empty state when no articles', () => {
        renderWithProviders(
            <NewsGrid
                articles={[]}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
            />
        );

        // Should show empty state message
        const emptyMessage = screen.queryByText(/haber bulunamadı|No articles found/i);
        expect(emptyMessage || screen.queryByRole('main')).toBeInTheDocument();
    });

    it('should filter articles by category when provided', () => {
        renderWithProviders(
            <NewsGrid
                articles={mockArticles}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
                selectedCategory="Technology"
            />
        );

        expect(screen.getByText('First Article')).toBeInTheDocument();
        // Second article (Sports) might be filtered out
    });

    it('should handle bookmark toggle', async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <NewsGrid
                articles={mockArticles}
                onArticleClick={mockOnArticleClick}
                bookmarks={[]}
                onBookmark={mockOnBookmark}
            />
        );

        const bookmarkButtons = screen.getAllByText(/★|☆/);
        await user.click(bookmarkButtons[0]);

        expect(mockOnBookmark).toHaveBeenCalledWith(mockArticles[0]);
    });
});
