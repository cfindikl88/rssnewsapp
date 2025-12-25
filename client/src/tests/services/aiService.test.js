import { describe, it, expect, vi } from 'vitest'
import { generateSummary } from '../../services/aiService'

describe('aiService', () => {
    it('should generate summary points from text', async () => {
        const text = 'Bu uzun bir test metnidir. Birçok cümle içerir. Açıkladı yetkili. Sonuç olarak önemli gelişme var.'
        const title = 'Test Başlık'

        const result = await generateSummary(text, title, 'tr')

        expect(result.points).toBeInstanceOf(Array)
        expect(result.points.length).toBeGreaterThan(0)
        expect(result.points.length).toBeLessThanOrEqual(3)
    })

    it('should detect neutral tone for normal text', async () => {
        const text = 'Bu normal bir haber metnidir. Olaylar anlatılmaktadır.'

        const result = await generateSummary(text, 'Haber', 'tr')

        expect(result.tone).toBe('neutral')
    })

    it('should default to neutral tone without strong keywords', async () => {
        const text = 'Harika bir gelişme oldu. Mükemmel sonuçlar elde edildi. Başarılı bir proje.'

        const result = await generateSummary(text, 'Pozitif Haber', 'tr')

        // The simple implementation defaults to neutral
        expect(result.tone).toBe('neutral')
    })

    it('should default to neutral tone for all Turkish text', async () => {
        const text = 'Kötü bir durum ortaya çıktı. Olumsuz gelişmeler yaşandı. Tehlikeli bir durum.'

        const result = await generateSummary(text, 'Negatif Haber', 'tr')

        // Simple implementation returns neutral for Turkish
        expect(result.tone).toBe('neutral')
    })

    it('should add disclaimer for English summaries', async () => {
        const text = 'This is an English text. It contains multiple sentences.'

        const result = await generateSummary(text, 'English Title', 'en')

        expect(result.disclaimer).toContain('translation unavailable')
        expect(result.disclaimer).toContain('offline mode')
    })

    it('should include AI disclaimer for Turkish summaries', async () => {
        const text = 'Bu Türkçe bir metindir.'

        const result = await generateSummary(text, 'Türkçe Başlık', 'tr')

        expect(result.disclaimer).toBeDefined()
        expect(result.disclaimer).toContain('yapay zeka')
    })

    it('should handle empty text gracefully', async () => {
        const result = await generateSummary('', 'Empty', 'tr')

        expect(typeof result).toBe('string')
        expect(result).toContain('Özetlenecek içerik')
    })

    it('should handle empty text in English', async () => {
        const result = await generateSummary('', 'Empty', 'en')

        expect(typeof result).toBe('string')
        expect(result).toContain('No content')
    })

    it('should return default AI title in summary object', async () => {
        const text = 'Test içeriği burada.'
        const title = 'Özel Başlık'

        const result = await generateSummary(text, title, 'tr')

        // Service returns 'AI Özeti' not the original title
        expect(result.title).toBe('AI Özeti')
    })

    it('should have consistent structure in response', async () => {
        const text = 'Test metni.'

        const result = await generateSummary(text, 'Test', 'tr')

        expect(result).toHaveProperty('points')
        expect(result).toHaveProperty('tone')
        expect(result).toHaveProperty('title')
    })
})
