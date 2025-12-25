import React, { useState, useEffect, useMemo, useCallback } from 'react';

const EnglishWordWidget = () => {
    // Curated list of useful English words for Turkish speakers - memoized to prevent recreation
    const words = useMemo(() => [
        { word: 'Serendipity', phonetic: '/ˌser.ənˈdɪp.ə.ti/', partOfSpeech: 'noun', definition: 'The occurrence of events by chance in a happy or beneficial way', turkish: 'Tesadüfen güzel bir şey bulmak', example: 'Finding this old book was pure serendipity.' },
        { word: 'Resilience', phonetic: '/rɪˈzɪl.i.əns/', partOfSpeech: 'noun', definition: 'The ability to recover quickly from difficulties', turkish: 'Dayanıklılık, toparlanma gücü', example: 'Her resilience helped her overcome many challenges.' },
        { word: 'Ephemeral', phonetic: '/ɪˈfem.ər.əl/', partOfSpeech: 'adjective', definition: 'Lasting for a very short time', turkish: 'Geçici, kısa ömürlü', example: 'The beauty of cherry blossoms is ephemeral.' },
        { word: 'Eloquent', phonetic: '/ˈel.ə.kwənt/', partOfSpeech: 'adjective', definition: 'Fluent or persuasive in speaking or writing', turkish: 'Güzel konuşan, etkili', example: 'She gave an eloquent speech at the conference.' },
        { word: 'Ambiguous', phonetic: '/æmˈbɪɡ.ju.əs/', partOfSpeech: 'adjective', definition: 'Open to more than one interpretation; unclear', turkish: 'Belirsiz, muğlak', example: 'His ambiguous answer left everyone confused.' },
        { word: 'Perseverance', phonetic: '/ˌpɜː.sɪˈvɪə.rəns/', partOfSpeech: 'noun', definition: 'Continued effort to do or achieve something despite difficulties', turkish: 'Azim, sebat', example: 'Success requires perseverance and hard work.' },
        { word: 'Meticulous', phonetic: '/məˈtɪk.jə.ləs/', partOfSpeech: 'adjective', definition: 'Showing great attention to detail; very careful', turkish: 'Titiz, ayrıntılara önem veren', example: 'He is meticulous about his work.' },
        { word: 'Ubiquitous', phonetic: '/juːˈbɪk.wɪ.təs/', partOfSpeech: 'adjective', definition: 'Present, appearing, or found everywhere', turkish: 'Her yerde bulunan', example: 'Smartphones have become ubiquitous in modern society.' },
        { word: 'Paradigm', phonetic: '/ˈpær.ə.daɪm/', partOfSpeech: 'noun', definition: 'A typical example or pattern of something', turkish: 'Paradigma, örnek model', example: 'This discovery represents a paradigm shift in science.' },
        { word: 'Authentic', phonetic: '/ɔːˈθen.tɪk/', partOfSpeech: 'adjective', definition: 'Of undisputed origin; genuine', turkish: 'Özgün, gerçek', example: 'This is an authentic Italian restaurant.' },
        { word: 'Diligent', phonetic: '/ˈdɪl.ɪ.dʒənt/', partOfSpeech: 'adjective', definition: 'Having or showing care and conscientiousness', turkish: 'Çalışkan, gayretli', example: 'She is a diligent student who never misses class.' },
        { word: 'Innovative', phonetic: '/ˈɪn.ə.veɪ.tɪv/', partOfSpeech: 'adjective', definition: 'Featuring new methods; advanced and original', turkish: 'Yenilikçi', example: 'The company is known for its innovative products.' },
        { word: 'Pragmatic', phonetic: '/præɡˈmæt.ɪk/', partOfSpeech: 'adjective', definition: 'Dealing with things sensibly and realistically', turkish: 'Pragmatik, gerçekçi', example: 'We need a pragmatic approach to solve this problem.' },
        { word: 'Versatile', phonetic: '/ˈvɜː.sə.taɪl/', partOfSpeech: 'adjective', definition: 'Able to adapt or be adapted to many different functions', turkish: 'Çok yönlü', example: 'He is a versatile actor who can play any role.' },
        { word: 'Comprehensive', phonetic: '/ˌkɒm.prɪˈhen.sɪv/', partOfSpeech: 'adjective', definition: 'Complete; including all or nearly all elements', turkish: 'Kapsamlı', example: 'This book provides a comprehensive guide to programming.' },
        { word: 'Substantial', phonetic: '/səbˈstæn.ʃəl/', partOfSpeech: 'adjective', definition: 'Of considerable importance, size, or worth', turkish: 'Önemli, kayda değer', example: 'There has been substantial progress in the project.' },
        { word: 'Collaborate', phonetic: '/kəˈlæb.ə.reɪt/', partOfSpeech: 'verb', definition: 'To work jointly on an activity or project', turkish: 'İşbirliği yapmak', example: 'We need to collaborate to achieve our goals.' },
        { word: 'Conscientious', phonetic: '/ˌkɒn.ʃiˈen.ʃəs/', partOfSpeech: 'adjective', definition: 'Wishing to do what is right; careful and thorough', turkish: 'Vicdanlı, sorumlu', example: 'She is a conscientious worker who takes pride in her job.' },
        { word: 'Proficient', phonetic: '/prəˈfɪʃ.ənt/', partOfSpeech: 'adjective', definition: 'Competent or skilled in doing something', turkish: 'Yetenekli, usta', example: 'He is proficient in three languages.' },
        { word: 'Cultivate', phonetic: '/ˈkʌl.tɪ.veɪt/', partOfSpeech: 'verb', definition: 'To try to acquire or develop a quality or skill', turkish: 'Geliştirmek, yetiştirmek', example: 'It is important to cultivate good habits.' },
        { word: 'Coherent', phonetic: '/kəʊˈhɪə.rənt/', partOfSpeech: 'adjective', definition: 'Logical and consistent; clearly articulated', turkish: 'Tutarlı, anlaşılır', example: 'She presented a coherent argument.' },
        { word: 'Intricate', phonetic: '/ˈɪn.trɪ.kət/', partOfSpeech: 'adjective', definition: 'Very complicated or detailed', turkish: 'Karmaşık, girift', example: 'The watch has an intricate mechanism.' },
        { word: 'Contemplate', phonetic: '/ˈkɒn.təm.pleɪt/', partOfSpeech: 'verb', definition: 'To think about something carefully and for a long time', turkish: 'Düşünmek, tefekkür etmek', example: 'She sat by the window to contemplate her future.' },
        { word: 'Perspective', phonetic: '/pəˈspek.tɪv/', partOfSpeech: 'noun', definition: 'A particular attitude toward or way of regarding something', turkish: 'Bakış açısı, perspektif', example: 'Try to see the situation from a different perspective.' },
        { word: 'Endeavor', phonetic: '/ɪnˈdev.ər/', partOfSpeech: 'noun/verb', definition: 'An attempt to achieve a goal', turkish: 'Çaba, gayret', example: 'We will endeavor to complete the project on time.' },
        { word: 'Facilitate', phonetic: '/fəˈsɪl.ɪ.teɪt/', partOfSpeech: 'verb', definition: 'To make an action or process easier', turkish: 'Kolaylaştırmak', example: 'Technology can facilitate communication.' },
        { word: 'Benevolent', phonetic: '/bəˈnev.əl.ənt/', partOfSpeech: 'adjective', definition: 'Well meaning and kindly', turkish: 'İyiliksever, hayırsever', example: 'She has a benevolent nature and helps everyone.' },
        { word: 'Articulate', phonetic: '/ɑːˈtɪk.jə.lət/', partOfSpeech: 'adjective/verb', definition: 'Having or showing the ability to speak fluently and coherently', turkish: 'Açık sözlü, akıcı konuşan', example: 'He is very articulate when explaining complex ideas.' },
        { word: 'Momentum', phonetic: '/məʊˈmen.təm/', partOfSpeech: 'noun', definition: 'The force that keeps something moving or developing', turkish: 'İvme, momentum', example: 'The campaign is gaining momentum.' },
        { word: 'Abundance', phonetic: '/əˈbʌn.dəns/', partOfSpeech: 'noun', definition: 'A very large quantity of something', turkish: 'Bolluk, çokluk', example: 'There is an abundance of fresh fruit in summer.' },
        { word: 'Curiosity', phonetic: '/ˌkjʊə.riˈɒs.ə.ti/', partOfSpeech: 'noun', definition: 'A strong desire to know or learn something', turkish: 'Merak', example: 'Curiosity is essential for learning.' },
        { word: 'Empathy', phonetic: '/ˈem.pə.θi/', partOfSpeech: 'noun', definition: 'The ability to understand and share the feelings of another', turkish: 'Empati', example: 'Good leaders show empathy toward their team.' },
        { word: 'Gratitude', phonetic: '/ˈɡræt.ɪ.tʃuːd/', partOfSpeech: 'noun', definition: 'The quality of being thankful', turkish: 'Minnettarlık, şükran', example: 'She expressed her gratitude for their help.' },
        { word: 'Integrity', phonetic: '/ɪnˈteɡ.rə.ti/', partOfSpeech: 'noun', definition: 'The quality of being honest and having strong moral principles', turkish: 'Dürüstlük, bütünlük', example: 'He is known for his integrity and honesty.' },
        { word: 'Optimize', phonetic: '/ˈɒp.tɪ.maɪz/', partOfSpeech: 'verb', definition: 'To make the best or most effective use of something', turkish: 'Optimize etmek', example: 'We need to optimize our workflow.' },
        { word: 'Synergy', phonetic: '/ˈsɪn.ə.dʒi/', partOfSpeech: 'noun', definition: 'Combined or cooperative action producing a greater effect', turkish: 'Sinerji', example: 'The synergy between the teams led to great results.' },
        { word: 'Tenacity', phonetic: '/təˈnæs.ə.ti/', partOfSpeech: 'noun', definition: 'The quality of being determined and persistent', turkish: 'Inadıklık, kararlılık', example: 'Her tenacity helped her achieve her goals.' },
        { word: 'Aesthetic', phonetic: '/iːsˈθet.ɪk/', partOfSpeech: 'adjective/noun', definition: 'Concerned with beauty or the appreciation of beauty', turkish: 'Estetik', example: 'The building has great aesthetic appeal.' },
        { word: 'Catalyst', phonetic: '/ˈkæt.əl.ɪst/', partOfSpeech: 'noun', definition: 'A person or thing that precipitates an event', turkish: 'Katalizör, tetikleyici', example: 'The meeting was a catalyst for change.' },
        { word: 'Hypothesis', phonetic: '/haɪˈpɒθ.ə.sɪs/', partOfSpeech: 'noun', definition: 'A supposition made as a basis for reasoning', turkish: 'Hipotez', example: 'Scientists tested their hypothesis through experiments.' },
        { word: 'Methodology', phonetic: '/ˌmeθ.əˈdɒl.ə.dʒi/', partOfSpeech: 'noun', definition: 'A system of methods used in a particular activity', turkish: 'Metodoloji', example: 'The research methodology was very thorough.' },
        { word: 'Nuance', phonetic: '/ˈnjuː.ɑːns/', partOfSpeech: 'noun', definition: 'A subtle difference in meaning or opinion', turkish: 'Nüans, ince ayrıntı', example: 'Understanding cultural nuances is important.' },
        { word: 'Exponential', phonetic: '/ˌek.spəʊˈnen.ʃəl/', partOfSpeech: 'adjective', definition: 'Becoming more and more rapid', turkish: 'Üstel, hızla artan', example: 'The company experienced exponential growth.' },
        { word: 'Analyze', phonetic: '/ˈæn.əl.aɪz/', partOfSpeech: 'verb', definition: 'To examine something in detail', turkish: 'Analiz etmek', example: 'We need to analyze the data carefully.' },
        { word: 'Implement', phonetic: '/ˈɪm.plɪ.ment/', partOfSpeech: 'verb', definition: 'To put a decision or plan into effect', turkish: 'Uygulamak', example: 'The team will implement the new strategy next month.' },
        { word: 'Consensus', phonetic: '/kənˈsen.səs/', partOfSpeech: 'noun', definition: 'General agreement', turkish: 'Fikir birliği, konsensüs', example: 'We reached a consensus after long discussions.' },
        { word: 'Dynamic', phonetic: '/daɪˈnæm.ɪk/', partOfSpeech: 'adjective', definition: 'Characterized by constant change or activity', turkish: 'Dinamik, hareketli', example: 'She works in a dynamic environment.' },
        { word: 'Elaborate', phonetic: '/ɪˈlæb.ər.ət/', partOfSpeech: 'adjective/verb', definition: 'Involving many carefully arranged parts; to explain in detail', turkish: 'Ayrıntılı, detaylandırmak', example: 'Could you elaborate on your proposal?' },
        { word: 'Fundamental', phonetic: '/ˌfʌn.dəˈmen.təl/', partOfSpeech: 'adjective', definition: 'Forming a necessary base or core', turkish: 'Temel, esas', example: 'Reading is a fundamental skill.' },
        { word: 'Sustainable', phonetic: '/səˈsteɪ.nə.bəl/', partOfSpeech: 'adjective', definition: 'Able to be maintained at a certain rate or level', turkish: 'Sürdürülebilir', example: 'We need sustainable energy solutions.' },
        { word: 'Threshold', phonetic: '/ˈθreʃ.həʊld/', partOfSpeech: 'noun', definition: 'The magnitude that must be exceeded for a reaction to occur', turkish: 'Eşik', example: 'We are on the threshold of a new era.' },
        { word: 'Arbitrary', phonetic: '/ˈɑː.bɪ.trər.i/', partOfSpeech: 'adjective', definition: 'Based on random choice rather than reason', turkish: 'Keyfi, rastgele', example: 'The decision seemed arbitrary.' },
        { word: 'Implicit', phonetic: '/ɪmˈplɪs.ɪt/', partOfSpeech: 'adjective', definition: 'Suggested though not directly expressed', turkish: 'Üstü kapalı, örtük', example: 'There was an implicit threat in his words.' },
        { word: 'Criteria', phonetic: '/kraɪˈtɪə.ri.ə/', partOfSpeech: 'noun', definition: 'Standards by which something may be judged', turkish: 'Kriterler', example: 'What are the criteria for selection?' },
        { word: 'Leverage', phonetic: '/ˈliː.vər.ɪdʒ/', partOfSpeech: 'noun/verb', definition: 'The power to influence; to use something to maximum advantage', turkish: 'Kaldıraç etkisi, yararlanmak', example: 'We can leverage technology to improve efficiency.' },
        { word: 'Advocate', phonetic: '/ˈæd.və.keɪt/', partOfSpeech: 'noun/verb', definition: 'A person who publicly supports; to recommend', turkish: 'Savunucu, savunmak', example: 'She is an advocate for human rights.' },
        { word: 'Transcend', phonetic: '/trænˈsend/', partOfSpeech: 'verb', definition: 'To go beyond the limits of something', turkish: 'Aşmak, ötesine geçmek', example: 'True art transcends cultural boundaries.' },
        { word: 'Illuminate', phonetic: '/ɪˈluː.mɪ.neɪt/', partOfSpeech: 'verb', definition: 'To light up; to help clarify or explain', turkish: 'Aydınlatmak', example: 'The study illuminates the problem clearly.' },
        { word: 'Equilibrium', phonetic: '/ˌiː.kwɪˈlɪb.ri.əm/', partOfSpeech: 'noun', definition: 'A state of balance', turkish: 'Denge', example: 'We need to maintain equilibrium in our lives.' },
        { word: 'Inevitable', phonetic: '/ɪnˈev.ɪ.tə.bəl/', partOfSpeech: 'adjective', definition: 'Certain to happen; unavoidable', turkish: 'Kaçınılmaz', example: 'Change is inevitable in life.' },
        { word: 'Aspiration', phonetic: '/ˌæs.pɪˈreɪ.ʃən/', partOfSpeech: 'noun', definition: 'A hope or ambition of achieving something', turkish: 'Özlem, hedef', example: 'Her aspiration is to become a doctor.' },
        { word: 'Wisdom', phonetic: '/ˈwɪz.dəm/', partOfSpeech: 'noun', definition: 'The quality of having experience, knowledge, and good judgment', turkish: 'Bilgelik', example: 'With age comes wisdom.' },
        { word: 'Flourish', phonetic: '/ˈflʌr.ɪʃ/', partOfSpeech: 'verb', definition: 'To grow or develop in a healthy way', turkish: 'Gelişmek, büyümek', example: 'The business began to flourish.' },
        { word: 'Harmony', phonetic: '/ˈhɑː.mə.ni/', partOfSpeech: 'noun', definition: 'Agreement or concord', turkish: 'Uyum, ahenk', example: 'They live in harmony with nature.' }
    ], []);

    const getWordForDay = useCallback(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const wordIndex = dayOfYear % words.length;
        return words[wordIndex];
    }, [words]);

    const [wordData, setWordData] = useState(getWordForDay);

    useEffect(() => {
        // Update at midnight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        const timer = setTimeout(() => {
            setWordData(getWordForDay());
        }, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, [getWordForDay]);

    if (!wordData) return null;

    return (
        <div className="mb-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl p-4 border border-blue-400/20 shadow-lg relative group">
            {/* Decorative Background blob */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl group-hover:bg-indigo-400/30 transition-all"></div>

            <div className="relative z-10">
                <h2 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3">
                    📚 English Word of the Day
                </h2>

                <div className="bg-glass-200 rounded-lg p-4 border-l-4 border-blue-400/50">
                    {/* Word and Pronunciation */}
                    <div className="mb-3">
                        <h3 className="text-xl font-bold text-white mb-1">
                            {wordData.word}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">
                            {wordData.phonetic}
                        </p>
                    </div>

                    {/* Part of Speech */}
                    <div className="inline-block bg-blue-500/30 px-2 py-1 rounded text-xs text-blue-200 font-medium mb-3">
                        {wordData.partOfSpeech}
                    </div>

                    {/* Definition */}
                    <p className="text-sm text-gray-200 mb-3 leading-relaxed">
                        <span className="text-blue-300 font-semibold">Definition:</span> {wordData.definition}
                    </p>

                    {/* Turkish Translation */}
                    <p className="text-sm text-gray-200 mb-3 leading-relaxed">
                        <span className="text-blue-300 font-semibold">Türkçe:</span> {wordData.turkish}
                    </p>

                    {/* Example */}
                    <div className="bg-glass-100 rounded p-2 border-l-2 border-blue-400/30">
                        <p className="text-xs text-gray-300 italic">
                            "{wordData.example}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnglishWordWidget;
