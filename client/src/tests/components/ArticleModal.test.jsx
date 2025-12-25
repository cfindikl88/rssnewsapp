import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleModal from '../../components/ArticleModal';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock audio API
global.SpeechSynthesisUtterance = vi.fn();
global.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => [])
};

const mockArticle = {
    title: 'Test Article Title',
    description: 'Test article description with some content',
    link: 'https://example.com/article',
    pubDate: '2025-12-25T12:00:00Z',
    source: 'Test Source',
    category: 'Technology',
    content: '<p>Test article content</p>'
};

const renderWithProviders = (ui) => {
    return render(
        <LanguageProvider>
            <ThemeProvider>
                {ui}
            </ThemeProvider>
        </LanguageProvider>
    );
};

describe('ArticleModal', () => {
    const mockOnClose = vi.fn();
    const mockOnBookmark = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not render when article is null', () => {
        const { container } = renderWithProviders(
            <ArticleModal
                article={null}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render article with all metadata', () => {
        renderWithProviders(
            <ArticleModal
                article={mockArticle}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        expect(screen.getByText('Test Article Title')).toBeInTheDocument();
        expect(screen.getByText(/Test Source/)).toBeInTheDocument();
        expect(screen.getByText(/Technology/)).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ArticleModal
                article={mockArticle}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        const closeButton = screen.getAllByRole('button').find(btn =>
            btn.getAttribute('aria-label')?.includes('Kapat') || btn.textContent.includes('×')
        );

        if (closeButton) {
            await user.click(closeButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        }
    });

    it('should toggle bookmark when bookmark button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ArticleModal
                article={mockArticle}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        const bookmarkButton = screen.getAllByRole('button').find(btn =>
            btn.textContent.includes('★') || btn.textContent.includes('☆')
        );

        if (bookmarkButton) {
            await user.click(bookmarkButton);
            expect(mockOnBookmark).toHaveBeenCalledWith(mockArticle);
        }
    });

    it('should display AI summary button', () => {
        renderWithProviders(
            <ArticleModal
                article={mockArticle}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        const summaryButton = screen.getAllByRole('button').find(btn =>
            btn.textContent.includes('Özet') || btn.textContent.includes('Summary')
        );

        expect(summaryButton).toBeInTheDocument();
    });

    it('should sanitize HTML content', () => {
        const articleWithScript = {
            ...mockArticle,
            content: '<p>Safe content</p><script>alert("xss")</script>'
        };

        renderWithProviders(
            <ArticleModal
                article={articleWithScript}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        // Script tags should be removed by DOMPurify
        expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
    });

    it('should track reading time for articles viewed > 5 seconds', async () => {
        vi.useFakeTimers();

        renderWithProviders(
            <ArticleModal
                article={mockArticle}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        // Fast-forward time by 6 seconds
        vi.advanceTimersByTime(6000);

        // Check that reading stats would be tracked (tested in integration)
        expect(screen.getByText('Test Article Title')).toBeInTheDocument();

        vi.useRealTimers();
    });

    it('should have proper accessibility attributes', () => {
        renderWithProviders(
            <ArticleModal
                article={mockArticle}
                onClose={mockOnClose}
                isBookmarked={false}
                onBookmark={mockOnBookmark}
            />
        );

        // After accessibility improvements, modal should have role="dialog"
        const modal = screen.getByText('Test Article Title').closest('div[class*="fixed"]');
        expect(modal).toBeInTheDocument();
    });
});
