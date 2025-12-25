import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedList from '../../components/FeedList';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

const mockFeeds = [
    { url: 'https://example.com/feed1', name: 'Feed 1' },
    { url: 'https://example.com/feed2', name: 'Feed 2' }
];

const mockCategories = ['Technology', 'Sports', 'News'];

const renderWithProviders = (ui) => {
    return render(
        <LanguageProvider>
            <ThemeProvider>
                {ui}
            </ThemeProvider>
        </LanguageProvider>
    );
};

describe('FeedList', () => {
    const mockOnAddFeed = vi.fn();
    const mockOnRemoveFeed = vi.fn();
    const mockOnSelectFeed = vi.fn();
    const mockOnSelectCategory = vi.fn();
    const mockOnSelectBookmarks = vi.fn();
    const mockOnSelectEarthquakes = vi.fn();
    const mockOnReadArticle = vi.fn();
    const mockGetRecommendationReason = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render all feeds', () => {
        renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={[]}
            />
        );

        expect(screen.getByText('Feed 1')).toBeInTheDocument();
        expect(screen.getByText('Feed 2')).toBeInTheDocument();
    });

    it('should call onAddFeed with valid URL', async () => {
        const user = userEvent.setup();
        mockOnAddFeed.mockResolvedValue(undefined);

        renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={[]}
            />
        );

        const input = screen.getByPlaceholderText(/RSS Linki|RSS Feed/i);
        const submitButton = screen.getByText(/Kaynağı Ekle|Add Feed/i);

        await user.type(input, 'https://example.com/newfeed');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnAddFeed).toHaveBeenCalledWith({
                url: 'https://example.com/newfeed',
                name: 'example.com'
            });
        });
    });

    it('should not submit invalid URL', async () => {
        const user = userEvent.setup();
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

        renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={[]}
            />
        );

        const input = screen.getByPlaceholderText(/RSS Linki|RSS Feed/i);
        const submitButton = screen.getByText(/Kaynağı Ekle|Add Feed/i);

        await user.type(input, 'invalid-url');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnAddFeed).not.toHaveBeenCalled();
        });

        alertSpy.mockRestore();
    });

    it('should call onRemoveFeed when remove button is clicked', async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={[]}
            />
        );

        // Find remove button (✕)
        const removeButtons = screen.getAllByText('✕');
        await user.click(removeButtons[0]);

        expect(mockOnRemoveFeed).toHaveBeenCalledWith(mockFeeds[0].url);
    });

    it('should render all categories', () => {
        renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={[]}
            />
        );

        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Sports')).toBeInTheDocument();
        expect(screen.getByText('News')).toBeInTheDocument();
    });

    it('should call onSelectCategory when category is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={[]}
            />
        );

        const techCategory = screen.getByText('Technology');
        await user.click(techCategory);

        expect(mockOnSelectCategory).toHaveBeenCalledWith('Technology');
    });

    it('should display bookmark count when bookmarks exist', () => {
        const bookmarks = ['link1', 'link2', 'link3'];

        renderWithProviders(
            <FeedList
                feeds={mockFeeds}
                onAddFeed={mockOnAddFeed}
                onRemoveFeed={mockOnRemoveFeed}
                onSelectFeed={mockOnSelectFeed}
                selectedFeed={null}
                categories={mockCategories}
                onSelectCategory={mockOnSelectCategory}
                selectedCategory={null}
                onSelectBookmarks={mockOnSelectBookmarks}
                showBookmarks={false}
                onSelectEarthquakes={mockOnSelectEarthquakes}
                showEarthquakes={false}
                recommendations={[]}
                onReadArticle={mockOnReadArticle}
                getRecommendationReason={mockGetRecommendationReason}
                bookmarks={bookmarks}
            />
        );

        expect(screen.getByText('3')).toBeInTheDocument();
    });
});
