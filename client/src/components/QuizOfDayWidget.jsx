import React, { useState, useEffect, useMemo, useCallback } from 'react';

const QuizOfDayWidget = () => {

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);

    // Curated list of educational quiz questions - memoized
    const quizzes = useMemo(() => [
        {
            question: 'Türkiye\'nin başkenti hangi şehirdir?',
            options: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'],
            correctAnswer: 1,
            explanation: 'Türkiye\'nin başkenti 1923 yılından beri Ankara\'dır.'
        },
        {
            question: 'Dünya\'nın en büyük okyanusu hangisidir?',
            options: ['Atlas Okyanusu', 'Hint Okyanusu', 'Pasifik Okyanusu', 'Kuzey Buz Denizi'],
            correctAnswer: 2,
            explanation: 'Pasifik Okyanusu, dünya yüzeyinin yaklaşık %46\'sını kaplar.'
        },
        {
            question: 'İnsan vücudundaki en büyük organ hangisidir?',
            options: ['Karaciğer', 'Akciğer', 'Deri', 'Kalp'],
            correctAnswer: 2,
            explanation: 'Deri, yaklaşık 2 metrekare yüzey alanı ile en büyük organdır.'
        },
        {
            question: 'Işık hızı saniyede yaklaşık kaç kilometredir?',
            options: ['100,000 km', '200,000 km', '300,000 km', '400,000 km'],
            correctAnswer: 2,
            explanation: 'Işık hızı saniyede yaklaşık 300,000 kilometredir (299,792 km/s).'
        },
        {
            question: 'DNA\'nın açılımı nedir?',
            options: ['Deoksiribonükleik Asit', 'Dinamik Nükleer Asit', 'Direk Nükleer Adaptör', 'Dozlu Nükleer Atom'],
            correctAnswer: 0,
            explanation: 'DNA, Deoksiribonükleik Asit\'in kısaltmasıdır ve genetik bilgiyi taşır.'
        },
        {
            question: 'Güneş sisteminde kaç gezegen vardır?',
            options: ['7', '8', '9', '10'],
            correctAnswer: 1,
            explanation: 'Plüton\'un 2006\'da gezegen statüsünü kaybetmesiyle Güneş sisteminde 8 gezegen kaldı.'
        },
        {
            question: 'Albert Einstein hangi teoriyle ünlüdür?',
            options: ['Evrim Teorisi', 'Kuantum Teorisi', 'Görelilik Teorisi', 'Kaos Teorisi'],
            correctAnswer: 2,
            explanation: 'Einstein\'ın en ünlü çalışması Görelilik Teorisi\'dir (E=mc²).'
        },
        {
            question: 'Türkiye hangi kıtada yer alır?',
            options: ['Sadece Avrupa', 'Sadece Asya', 'Avrupa ve Asya', 'Afrika'],
            correctAnswer: 2,
            explanation: 'Türkiye, hem Avrupa hem de Asya kıtalarında toprakları olan bir ülkedir.'
        },
        {
            question: 'Osmanlı İmparatorluğu kaç yıl sürmüştür?',
            options: ['Yaklaşık 400 yıl', 'Yaklaşık 500 yıl', 'Yaklaşık 600 yıl', 'Yaklaşık 700 yıl'],
            correctAnswer: 2,
            explanation: 'Osmanlı İmparatorluğu 1299-1922 yılları arasında yaklaşık 623 yıl sürmüştür.'
        },
        {
            question: 'Su\'nun kimyasal formülü nedir?',
            options: ['H2O', 'CO2', 'O2', 'H2O2'],
            correctAnswer: 0,
            explanation: 'Su molekülü, 2 hidrojen ve 1 oksijen atomundan oluşur (H2O).'
        },
        {
            question: 'Hangi gezegen "Kızıl Gezegen" olarak bilinir?',
            options: ['Venüs', 'Mars', 'Jüpiter', 'Satürn'],
            correctAnswer: 1,
            explanation: 'Mars, yüzeyindeki demir oksit nedeniyle kızıl renkte görünür.'
        },
        {
            question: 'İlk bilgisayar hangi yüzyılda icat edildi?',
            options: ['18. yüzyıl', '19. yüzyıl', '20. yüzyıl', '21. yüzyıl'],
            correctAnswer: 2,
            explanation: 'İlk elektronik bilgisayar ENIAC, 1945 yılında (20. yüzyıl) yapıldı.'
        },
        {
            question: 'Mona Lisa tablosunu kim yapmıştır?',
            options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
            correctAnswer: 1,
            explanation: 'Mona Lisa, Leonardo da Vinci tarafından 1503-1519 yılları arasında yapılmıştır.'
        },
        {
            question: 'Evrenin yaşı yaklaşık kaç milyar yıldır?',
            options: ['10 milyar yıl', '13.8 milyar yıl', '20 milyar yıl', '25 milyar yıl'],
            correctAnswer: 1,
            explanation: 'Bilim insanları evrenin yaklaşık 13.8 milyar yaşında olduğunu hesaplamıştır.'
        },
        {
            question: 'Hangi element periyodik tabloda "Au" sembolüyle gösterilir?',
            options: ['Gümüş', 'Altın', 'Alüminyum', 'Argon'],
            correctAnswer: 1,
            explanation: 'Au (Latince: Aurum), altın elementinin kimyasal sembolüdür.'
        },
        {
            question: 'Dünyanın en yüksek dağı hangisidir?',
            options: ['K2', 'Everest', 'Kilimanjaro', 'Annapurna'],
            correctAnswer: 1,
            explanation: 'Mount Everest, 8,849 metre yüksekliğiyle dünyanın en yüksek dağıdır.'
        },
        {
            question: 'İnternetin başlangıç protokolü hangisidir?',
            options: ['FTP', 'HTTP', 'TCP/IP', 'SMTP'],
            correctAnswer: 2,
            explanation: 'TCP/IP, internetin temel iletişim protokolüdür.'
        },
        {
            question: 'Hangi ülke "Yükselen Güneş Ülkesi" olarak bilinir?',
            options: ['Çin', 'Japonya', 'Güney Kore', 'Tayland'],
            correctAnswer: 1,
            explanation: 'Japonya, "Yükselen Güneş Ülkesi" (Nihon/Nippon) olarak bilinir.'
        },
        {
            question: 'Fotosentez sırasında bitkiler hangi gazı üretir?',
            options: ['Karbondioksit', 'Oksijen', 'Hidrojen', 'Azot'],
            correctAnswer: 1,
            explanation: 'Fotosentez sırasında bitkiler karbondioksit alır ve oksijen üretir.'
        },
        {
            question: 'Shakespeare\'in en ünlü trajedisi hangisidir?',
            options: ['Othello', 'Macbeth', 'Hamlet', 'Romeo ve Juliet'],
            correctAnswer: 2,
            explanation: 'Hamlet, Shakespeare\'in en ünlü ve en çok oynanan trajedisidir.'
        },
        {
            question: 'Piramitler hangi eski medeniyete aittir?',
            options: ['Yunan', 'Roma', 'Mısır', 'Sümer'],
            correctAnswer: 2,
            explanation: 'Piramitler, Eski Mısır medeniyetinin en önemli yapılarıdır.'
        },
        {
            question: 'Ses hızı saniyede yaklaşık kaç metredir?',
            options: ['240 m/s', '343 m/s', '450 m/s', '500 m/s'],
            correctAnswer: 1,
            explanation: 'Ses deniz seviyesinde havada yaklaşık 343 m/s hızla yayılır.'
        },
        {
            question: 'Dünya kaç derece eğik olarak döner?',
            options: ['18.5 derece', '23.5 derece', '30 derece', '45 derece'],
            correctAnswer: 1,
            explanation: 'Dünya\'nın dönme ekseni 23.5 derece eğiktir, bu mevsimlerin oluşmasını sağlar.'
        },
        {
            question: 'İlk uçan insan kimdir?',
            options: ['Wright Kardeşler', 'Leonardo da Vinci', 'Santos Dumont', 'Charles Lindbergh'],
            correctAnswer: 0,
            explanation: 'Wright Kardeşler 1903\'te ilk motorlu uçağı uçurdular.'
        },
        {
            question: 'Atom numarası 1 olan element hangisidir?',
            options: ['Helyum', 'Hidrojen', 'Lityum', 'Karbom'],
            correctAnswer: 1,
            explanation: 'Hidrojen (H), atom numarası 1 olan en basit elementtir.'
        },
        {
            question: 'Hangi bilim dalı yıldızları inceler?',
            options: ['Jeoloji', 'Botanik', 'Astronomi', 'Zooloji'],
            correctAnswer: 2,
            explanation: 'Astronomi, gök cisimlerini ve uzayı inceleyen bilim dalıdır.'
        },
        {
            question: 'Beethoven hangi dönemin bestecisidir?',
            options: ['Barok', 'Klasik', 'Romantik', 'Modern'],
            correctAnswer: 2,
            explanation: 'Beethoven, Klasik dönemden Romantik döneme geçişi simgeleyen büyük bestecilerdendir.'
        },
        {
            question: 'İlk yazı hangi medeniyette ortaya çıkmıştır?',
            options: ['Mısır', 'Sümer', 'Yunan', 'Çin'],
            correctAnswer: 1,
            explanation: 'Çivi yazısı, Sümerler tarafından MÖ 3200 civarında geliştirilmiştir.'
        },
        {
            question: 'Mitokondri hücrenin neresinde bulunur?',
            options: ['Çekirdek', 'Sitoplazma', 'Ribozom', 'Vakuol'],
            correctAnswer: 1,
            explanation: 'Mitokondri, hücrenin sitoplazmasında enerji üreten organeldir.'
        },
        {
            question: 'Nobel Ödülü ilk kez hangi yıl verildi?',
            options: ['1895', '1901', '1910', '1920'],
            correctAnswer: 1,
            explanation: 'İlk Nobel Ödülleri 1901 yılında verilmeye başlandı.'
        },
        {
            question: 'Elektriği kim keşfetti?',
            options: ['Thomas Edison', 'Nikola Tesla', 'Benjamin Franklin', 'Alessandro Volta'],
            correctAnswer: 2,
            explanation: 'Benjamin Franklin, 1752\'de yıldırımın elektrik olduğunu kanıtladı.'
        },
        {
            question: 'Hangi gezegen en çok uyduya sahiptir?',
            options: ['Jüpiter', 'Satürn', 'Uranüs', 'Neptün'],
            correctAnswer: 1,
            explanation: 'Satürn, bilinen 146 uydusuyla en çok uyduya sahip gezegendir.'
        },
        {
            question: 'Pablo Picasso hangi sanat akımının öncüsüdür?',
            options: ['Sürrealizm', 'Kübizm', 'İzlenimcilik', 'Ekspresyonizm'],
            correctAnswer: 1,
            explanation: 'Picasso, Kübizm akımının kurucularından biridir.'
        },
        {
            question: 'İnsan beyni yaklaşık yüzde kaç sudan oluşur?',
            options: ['%50', '%60', '%73', '%85'],
            correctAnswer: 2,
            explanation: 'İnsan beyni yaklaşık %73 su içerir.'
        },
        {
            question: 'Hangisi bir programlama dili değildir?',
            options: ['Python', 'Java', 'HTML', 'C++'],
            correctAnswer: 2,
            explanation: 'HTML bir işaretleme dilidir, programlama dili değildir.'
        },
        {
            question: 'Dünyanın en uzun nehri hangisidir?',
            options: ['Amazon', 'Nil', 'Yangtze', 'Mississippi'],
            correctAnswer: 1,
            explanation: 'Nil Nehri, 6,650 km uzunluğu ile dünyanın en uzun nehridir.'
        },
        {
            question: 'Elektron negatif mi yoksa pozitif mi yüklüdür?',
            options: ['Negatif', 'Pozitif', 'Nötr', 'Her ikisi'],
            correctAnswer: 0,
            explanation: 'Elektronlar negatif (-) elektrik yükü taşır.'
        },
        {
            question: 'Rönesans hangi ülkede başladı?',
            options: ['Fransa', 'İspanya', 'İtalya', 'İngiltere'],
            correctAnswer: 2,
            explanation: 'Rönesans, 14. yüzyılda İtalya\'da başlayıp Avrupa\'ya yayıldı.'
        },
        {
            question: 'Hangisi yenilenebilir enerji kaynağıdır?',
            options: ['Kömür', 'Petrol', 'Rüzgar', 'Doğalgaz'],
            correctAnswer: 2,
            explanation: 'Rüzgar enerjisi yenilenebilir ve temiz bir enerji kaynağıdır.'
        },
        {
            question: 'Vincent van Gogh hangi ülkelidir?',
            options: ['Alman', 'Fransız', 'Hollandalı', 'Belçikalı'],
            correctAnswer: 2,
            explanation: 'Van Gogh Hollandalı bir ressam olup 19. yüzyılda yaşamıştır.'
        },
        {
            question: 'İlk yapay uydu hangisidir?',
            options: ['Apollo 11', 'Sputnik 1', 'Explorer 1', 'Vostok 1'],
            correctAnswer: 1,
            explanation: 'Sputnik 1, 1957\'de Sovyetler Birliği tarafından fırlatılan ilk yapay uydudur.'
        },
        {
            question: 'Hangisi bir sıcak kanlı hayvandır?',
            options: ['Kertenkele', 'Balık', 'Kuş', 'Yılan'],
            correctAnswer: 2,
            explanation: 'Kuşlar ve memeliler sıcak kanlı (endotermik) hayvanlardır.'
        },
        {
            question: 'Mozart kaç yaşında hayatını kaybetti?',
            options: ['25', '35', '45', '55'],
            correctAnswer: 1,
            explanation: 'Wolfgang Amadeus Mozart 35 yaşında (1791) hayatını kaybetti.'
        },
        {
            question: 'Hangisi metamorfik bir kayadır?',
            options: ['Granit', 'Kireçtaşı', 'Mermer', 'Bazalt'],
            correctAnswer: 2,
            explanation: 'Mermer, kireçtaşının yüksek sıcaklık ve basınç altında dönüşmesiyle oluşur.'
        },
        {
            question: 'Dünya\'nın çapı yaklaşık kaç kilometredir?',
            options: ['8,000 km', '10,000 km', '12,742 km', '15,000 km'],
            correctAnswer: 2,
            explanation: 'Dünya\'nın çapı ekvatorda yaklaşık 12,742 kilometredir.'
        },
        {
            question: 'Hangisi bir tarayıcı değildir?',
            options: ['Chrome', 'Firefox', 'Photoshop', 'Safari'],
            correctAnswer: 2,
            explanation: 'Photoshop bir görsel düzenleme programıdır, web tarayıcısı değildir.'
        },
        {
            question: 'Ay\'ın Dünya etrafında dönüşü kaç gün sürer?',
            options: ['24 gün', '27.3 gün', '30 gün', '35 gün'],
            correctAnswer: 1,
            explanation: 'Ay, Dünya etrafında 27.3 günde bir tur atar.'
        },
        {
            question: 'Atatürk\'ün doğum yılı hangisidir?',
            options: ['1880', '1881', '1882', '1883'],
            correctAnswer: 1,
            explanation: 'Mustafa Kemal Atatürk 1881 yılında Selanik\'te doğmuştur.'
        },
        {
            question: 'Hangisi bir bulut bilişim hizmeti sağlayıcısıdır?',
            options: ['Microsoft Word', 'AWS', 'Photoshop', 'Excel'],
            correctAnswer: 1,
            explanation: 'AWS (Amazon Web Services), önde gelen bulut bilişim platformlarından biridir.'
        },
        {
            question: 'İlk baskı makinesi kim tarafından icat edilmiştir?',
            options: ['Thomas Edison', 'Johannes Gutenberg', 'Alexander Graham Bell', 'Benjamin Franklin'],
            correctAnswer: 1,
            explanation: 'Johannes Gutenberg, 1440\'larda hareketli hurufat baskı makinesini icat etti.'
        },
        {
            question: 'Hangi vitamin güneş ışığıyla üretilir?',
            options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
            correctAnswer: 3,
            explanation: 'Vitamin D, güneş ışığının etkisiyle derimizde üretilir.'
        },
        {
            question: 'Büyük Okyanus Ring of Fire (Ateş Çemberi) neyle ünlüdür?',
            options: ['Güzel plajlar', 'Volkanlar ve depremler', 'Mercan resifleri', 'Balina göçleri'],
            correctAnswer: 1,
            explanation: 'Ring of Fire, yoğun volkanik ve sismik aktivite ile bilinir.'
        },
        {
            question: 'DNA\'nın keşfi hangi yıl yapılmıştır?',
            options: ['1943', '1953', '1963', '1973'],
            correctAnswer: 1,
            explanation: 'DNA\'nın çift sarmal yapısı Watson ve Crick tarafından 1953\'te keşfedildi.'
        },
        {
            question: 'Hangisi bir işletim sistemidir?',
            options: ['Microsoft Word', 'Linux', 'Chrome', 'Photoshop'],
            correctAnswer: 1,
            explanation: 'Linux, açık kaynak kodlu bir işletim sistemidir.'
        },
        {
            question: 'En küçük okyanus hangisidir?',
            options: ['Hint Okyanusu', 'Atlas Okyanusu', 'Kuzey Buz Denizi', 'Güney Okyanusu'],
            correctAnswer: 2,
            explanation: 'Kuzey Buz Denizi (Arktik Okyanusu), en küçük okyanustur.'
        },
        {
            question: 'Yerçekimi yasasını kim keşfetti?',
            options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Stephen Hawking'],
            correctAnswer: 1,
            explanation: 'Isaac Newton, 1687\'de evrensel çekim yasasını formüle etti.'
        },
        {
            question: 'Hangi organ insülin hormonu üretir?',
            options: ['Karaciğer', 'Pankreas', 'Böbrek', 'Kalp'],
            correctAnswer: 1,
            explanation: 'Pankreas, kan şekerini düzenleyen insülin hormonunu üretir.'
        },
        {
            question: 'Hangisi bir sosyal medya platformu değildir?',
            options: ['Instagram', 'Twitter', 'LinkedIn', 'Photoshop'],
            correctAnswer: 3,
            explanation: 'Photoshop bir görsel düzenleme yazılımıdır, sosyal medya platformu değildir.'
        },
        {
            question: 'Titanik hangi yıl battı?',
            options: ['1902', '1912', '1922', '1932'],
            correctAnswer: 1,
            explanation: 'RMS Titanic, ilk seferinde 1912 yılında bir buzdağına çarparak battı.'
        },
        {
            question: 'Hangisi bir çıkış birimi değildir?',
            options: ['Monitör', 'Yazıcı', 'Fare', 'Hoparlör'],
            correctAnswer: 2,
            explanation: 'Fare bir giriş birimidir, çıkış birimi değildir.'
        },
        {
            question: 'Dünyadaki en büyük tropikal yağmur ormanı hangisidir?',
            options: ['Kongo Ormanları', 'Amazon Yağmur Ormanı', 'Güneydoğu Asya Ormanları', 'Avustralya Ormanları'],
            correctAnswer: 1,
            explanation: 'Amazon Yağmur Ormanı, dünyanın en büyük tropikal yağmur ormanıdır.'
        }
    ], []);

    const getQuizForDay = useCallback(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const quizIndex = dayOfYear % quizzes.length;
        return quizzes[quizIndex];
    }, [quizzes]);

    // Initialize state with today's quiz
    const [quizData, setQuizData] = useState(getQuizForDay);


    useEffect(() => {
        // Update at midnight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        const timer = setTimeout(() => {
            const newQuiz = getQuizForDay();
            setQuizData(newQuiz);
            setSelectedAnswer(null);
            setAnswered(false);
        }, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, [getQuizForDay]);

    const handleAnswerClick = (index) => {
        if (!answered) {
            setSelectedAnswer(index);
            setAnswered(true);
        }
    };

    if (!quizData) return null;

    return (
        <div className="mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-400/20 shadow-lg relative group">
            {/* Decorative Background blob */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl group-hover:bg-pink-400/30 transition-all"></div>

            <div className="relative z-10">
                <h2 className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-3">
                    🧠 Günün Sorusu
                </h2>

                <div className="bg-glass-200 rounded-lg p-4 border-l-4 border-purple-400/50">
                    {/* Question */}
                    <p className="text-sm text-white font-semibold mb-4 leading-relaxed">
                        {quizData.question}
                    </p>

                    {/* Options */}
                    <div className="space-y-2 mb-3">
                        {quizData.options.map((option, index) => {
                            const isCorrect = index === quizData.correctAnswer;
                            const isSelected = index === selectedAnswer;

                            let buttonClasses = 'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 ';

                            if (!answered) {
                                buttonClasses += 'bg-glass-100 hover:bg-purple-500/30 text-gray-200 hover:text-white border border-purple-400/20 hover:border-purple-400/50 cursor-pointer';
                            } else {
                                if (isCorrect) {
                                    buttonClasses += 'bg-green-500/30 text-white border-2 border-green-400 font-semibold';
                                } else if (isSelected && !isCorrect) {
                                    buttonClasses += 'bg-red-500/30 text-white border-2 border-red-400';
                                } else {
                                    buttonClasses += 'bg-glass-100 text-gray-400 border border-gray-600/20';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    disabled={answered}
                                    className={buttonClasses}
                                >
                                    <span className="flex items-center">
                                        <span className="mr-2 font-mono text-xs opacity-70">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        {option}
                                        {answered && isCorrect && (
                                            <span className="ml-auto text-green-400">✓</span>
                                        )}
                                        {answered && isSelected && !isCorrect && (
                                            <span className="ml-auto text-red-400">✗</span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {answered && (
                        <div
                            className="mt-4 bg-glass-100 rounded p-3 border-l-2 border-purple-400/50"
                            style={{
                                animation: 'fadeIn 0.3s ease-out',
                                animationFillMode: 'both'
                            }}
                        >
                            <p className="text-xs text-purple-200 font-semibold mb-1">
                                💡 Açıklama
                            </p>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                {quizData.explanation}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizOfDayWidget;
