import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import useBookmarks from '../../hooks/useBookmarks'

describe('useBookmarks', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('should initialize with empty bookmarks when no saved data', () => {
        const { result } = renderHook(() => useBookmarks())

        expect(result.current.bookmarks).toEqual([])
        expect(result.current.showBookmarks).toBe(false)
    })

    it('should load saved bookmarks from localStorage on init', () => {
        const savedBookmarks = [
            { title: 'Test Article', link: 'https://example.com/1' }
        ]
        localStorage.setItem('rss_bookmarks', JSON.stringify(savedBookmarks))

        const { result } = renderHook(() => useBookmarks())

        expect(result.current.bookmarks).toHaveLength(1)
        expect(result.current.bookmarks[0].title).toBe('Test Article')
    })

    it('should add bookmark and persist to localStorage', () => {
        const { result } = renderHook(() => useBookmarks())
        const article = {
            title: 'New Article',
            link: 'https://example.com/new',
            pubDate: '2025-12-25'
        }

        act(() => {
            result.current.toggleBookmark(article)
        })

        expect(result.current.bookmarks).toHaveLength(1)
        expect(result.current.bookmarks[0].link).toBe('https://example.com/new')

        const stored = JSON.parse(localStorage.getItem('rss_bookmarks'))
        expect(stored).toHaveLength(1)
        expect(stored[0].title).toBe('New Article')
    })

    it('should remove bookmark on second toggle', () => {
        const { result } = renderHook(() => useBookmarks())
        const article = {
            title: 'Test',
            link: 'https://example.com/test'
        }

        // Add bookmark
        act(() => {
            result.current.toggleBookmark(article)
        })
        expect(result.current.bookmarks).toHaveLength(1)

        // Remove bookmark
        act(() => {
            result.current.toggleBookmark(article)
        })
        expect(result.current.bookmarks).toHaveLength(0)

        const stored = JSON.parse(localStorage.getItem('rss_bookmarks'))
        expect(stored).toHaveLength(0)
    })

    it('should prevent duplicate bookmarks based on link', () => {
        const { result } = renderHook(() => useBookmarks())
        const article1 = { title: 'Article 1', link: 'https://example.com/same' }
        const article2 = { title: 'Article 2', link: 'https://example.com/same' }

        act(() => {
            result.current.toggleBookmark(article1)
            result.current.toggleBookmark(article2) // Same link, should toggle off
        })

        expect(result.current.bookmarks).toHaveLength(0)
    })

    it('should toggle showBookmarks state', () => {
        const { result } = renderHook(() => useBookmarks())

        expect(result.current.showBookmarks).toBe(false)

        act(() => {
            result.current.setShowBookmarks(true)
        })

        expect(result.current.showBookmarks).toBe(true)
    })

    it('should handle multiple bookmarks correctly', () => {
        const { result } = renderHook(() => useBookmarks())
        const articles = [
            { title: 'Article 1', link: 'https://example.com/1' },
            { title: 'Article 2', link: 'https://example.com/2' },
            { title: 'Article 3', link: 'https://example.com/3' }
        ]

        act(() => {
            articles.forEach(article => result.current.toggleBookmark(article))
        })

        expect(result.current.bookmarks).toHaveLength(3)
        expect(result.current.bookmarks.map(b => b.title)).toEqual([
            'Article 1', 'Article 2', 'Article 3'
        ])
    })
})
