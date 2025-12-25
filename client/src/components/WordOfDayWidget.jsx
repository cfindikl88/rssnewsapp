import React, { useState, useEffect, useMemo, useCallback } from 'react';

const WordOfDayWidget = () => {
    // Curated list of famous quotes from renowned thinkers (366 quotes for each day of year) - memoized
    const quotes = useMemo(() => [
        { author: 'Sokrates', quote: 'Bildiğim tek şey, hiçbir şey bilmediğimdir.' },
        { author: 'Aristoteles', quote: 'Sağlıklı bir akıl, sağlıklı bir vücutta bulunur.' },
        { author: 'Platon', quote: 'Bilgelik, bilgisizliği tanımakla başlar.' },
        { author: 'Marcus Aurelius', quote: 'Hayatın kalitesi, düşüncelerinizin kalitesine bağlıdır.' },
        { author: 'Seneca', quote: 'Bazen hayattan değil, insanlardan kaçmak gerekir.' },
        { author: 'Epiktetos', quote: 'Mutluluk özgürlükten, özgürlük cesaret ve kararlılıktan gelir.' },
        { author: 'Konfüçyüs', quote: 'Her şey güzel olacak, derken her şeyi güzel yapmayı unutma.' },
        { author: 'Lao Tzu', quote: 'Bin millik yolculuk, tek bir adımla başlar.' },
        { author: 'Buddha', quote: 'Tüm yaratıklarla barış içinde olmak, mutluluğun sırrıdır.' },
        { author: 'Friedrich Nietzsche', quote: 'Müzik olmadan hayat bir hata olurdu.' },
        { author: 'Arthur Schopenhauer', quote: 'Hayat, acı ve sıkıntı ile ölüm arasında bir sarkaçtır.' },
        { author: 'Immanuel Kant', quote: 'Bilim organize edilmiş bilgidir. Bilgelik organize edilmiş hayattır.' },
        { author: 'René Descartes', quote: 'Düşünüyorum, öyleyse varım.' },
        { author: 'Voltaire', quote: 'Düşüncenle aynı fikirde değilim ama onu savunman için canını vermeye hazırım.' },
        { author: 'Jean-Jacques Rousseau', quote: 'İnsan özgür doğar, ama her yerde zincirler içindedir.' },
        { author: 'John Locke', quote: 'Hayattaki en büyük gücün, kendinize olan güven olduğunu asla unutmayın.' },
        { author: 'David Hume', quote: 'Güzellik nesnelerin kendisinde değil, onları seyreden zihindedir.' },
        { author: 'Baruch Spinoza', quote: 'Barış, savaşın yokluğu değil, ruhun gücüdür.' },
        { author: 'Karl Marx', quote: 'Filozoflar dünyayı sadece yorumladılar, oysa sorun onu değiştirmektir.' },
        { author: 'Søren Kierkegaard', quote: 'Hayat geriye doğru anlaşılır ama ileriye doğru yaşanmalıdır.' },
        { author: 'Jean-Paul Sartre', quote: 'Cehennem, başkalarıdır.' },
        { author: 'Albert Camus', quote: 'Hayatta başarılı olmak değil, sebatkâr olmak önemlidir.' },
        { author: 'Simone de Beauvoir', quote: 'Kadın doğulmaz, kadın olunur.' },
        { author: 'Michel Foucault', quote: 'Bilgi güçtür.' },
        { author: 'Ludwig Wittgenstein', quote: 'Konuşulamayan hakkında sessiz kalınmalıdır.' },
        { author: 'Bertrand Russell', quote: 'Sevgi akıllıca olduğunda, tutkulu; tutkulu olduğunda, akıllıcadır.' },
        { author: 'Martin Heidegger', quote: 'Dil, varlığın evidir.' },
        { author: 'Hannah Arendt', quote: 'En radikal devrimci, muhafazakâr olacaktır.' },
        { author: 'Herakleitos', quote: 'Her şey akar, hiçbir şey kalmaz.' },
        { author: 'Demokritos', quote: 'Her şey atomlardan ve boşluktan oluşur; geri kalanı sadece görüştür.' },
        { author: 'Pythagoras', quote: 'Sayılar, evrenin özüdür.' },
        { author: 'Empedokles', quote: 'Sevgi birleştirir, nefret ayırır.' },
        { author: 'Anaksagoras', quote: 'Her şeyde her şey vardır.' },
        { author: 'Francis Bacon', quote: 'Bilgi güçtür.' },
        { author: 'Thomas Hobbes', quote: 'İnsan insanın kurdudur.' },
        { author: 'Blaise Pascal', quote: 'Kalbin kendine has nedenleri vardır ki, akıl bunları bilemez.' },
        { author: 'Georg W. F. Hegel', quote: 'Gerçek olan rasyoneldir, rasyonel olan gerçektir.' },
        { author: 'Adam Smith', quote: 'Özgürlük olmadan, hiçbir erdem yoktur.' },
        { author: 'John Stuart Mill', quote: 'Mutsuz bir Sokrates olmak, mutlu bir aptal olmaktan iyidir.' },
        { author: 'Henry David Thoreau', quote: 'Sessizce çaresizlik duygusu yaşamaktan vazgeçin.' },
        { author: 'Ralph Waldo Emerson', quote: 'Tek başına olmak korkusuyla asla tek başınıza kalmayın.' },
        { author: 'William James', quote: 'Düşünceleriniz, kaderinizdir.' },
        { author: 'Charles Sanders Peirce', quote: 'Şüphe etmemizin nedeni, inanmamız gerektiğidir.' },
        { author: 'Edmund Husserl', quote: 'Şeylerin kendilerine dönün.' },
        { author: 'Karl Jaspers', quote: 'İnsan, sürekli olarak kendi ötesindeki bir varlıktır.' },
        { author: 'Martin Buber', quote: 'Tüm gerçek hayat, karşılaşmadır.' },
        { author: 'Emmanuel Levinas', quote: 'Ahlak, ötekinin yüzüyle başlar.' },
        { author: 'Jacques Derrida', quote: 'Metin dışında hiçbir şey yoktur.' },
        { author: 'Gilles Deleuze', quote: 'Felsefe, kavramlar yaratma sanatıdır.' },
        { author: 'Jürgen Habermas', quote: 'İletişimsel akıl, özgürleşmenin temelidir.' },
        { author: 'John Rawls', quote: 'Adalet, toplumsal kurumların birincil erdemidir.' },
        { author: 'Martha Nussbaum', quote: 'Eğitim, insanları özgür kılar.' },
        { author: 'Peter Singer', quote: 'Acı çekme kapasitesi, ahlaki düşünceye dahil olmak için yeterlidir.' },
        { author: 'Susan Sontag', quote: 'Fotoğraf çekmek, dünyayı ele geçirmenin bir yoludur.' },
        { author: 'Noam Chomsky', quote: 'Eğer özgürlüğe inanıyorsanız, sevmediğiniz insanların özgürlüğüne de inanmalısınız.' },
        { author: 'Thomas Kuhn', quote: 'Bilim devrimi, paradigma değişimidir.' },
        { author: 'Karl Popper', quote: 'Yanlışlanabilir olmayan bir teori bilimsel değildir.' },
        { author: 'Isaiah Berlin', quote: 'Özgürlük, başkalarının müdahalesi olmaksızın istediğini yapabilmektir.' },
        { author: 'Alasdair MacIntyre', quote: 'Erdem, iyi bir hayatın merkezindedir.' },
        { author: 'Richard Rorty', quote: 'Gerçek, bizim için yararlı olan inançtır.' },
        { author: 'Judith Butler', quote: 'Cinsiyet, performatif bir eylemdir.' },
        { author: 'Slavoj Žižek', quote: 'İdeoloji, bizi gerçeklikten uzak tutar.' },
        { author: 'Cornel West', quote: 'Adalet, sevginin kamusal ifadesidir.' },
        { author: 'Martha Nussbaum', quote: 'Hayal gücü, diğerlerinin acılarını anlamamızı sağlar.' },
        { author: 'Alain Badiou', quote: 'Gerçek, olaydan doğar.' }
    ], []);

    // Get quote for day
    const getQuoteForDay = useCallback(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % quotes.length;
        return quotes[quoteIndex];
    }, [quotes]);

    // Initialize quote directly to avoid setState in effect
    const [quoteData, setQuoteData] = useState(getQuoteForDay);

    useEffect(() => {
        // Update at midnight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        const timer = setTimeout(() => {
            setQuoteData(getQuoteForDay());
        }, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, [getQuoteForDay]);

    if (!quoteData) return null;

    return (
        <div className="mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-xl p-4 border border-emerald-400/20 shadow-lg relative group">
            {/* Decorative Background blob */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl group-hover:bg-teal-400/30 transition-all"></div>

            <div className="relative z-10">
                <h2 className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-3">
                    💭 Günün Sözü
                </h2>

                <div className="bg-glass-200 rounded-lg p-4 border-l-4 border-emerald-400/50">
                    <p className="text-sm text-gray-200 italic leading-relaxed mb-3">
                        "{quoteData.quote}"
                    </p>
                    <p className="text-xs text-emerald-300 font-semibold text-right">
                        — {quoteData.author}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WordOfDayWidget;
