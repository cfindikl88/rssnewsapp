import React, { createContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [uiLanguage, setUiLanguage] = useState(() => {
        const saved = localStorage.getItem('ui_language');
        return saved || 'tr';
    });

    useEffect(() => {
        localStorage.setItem('ui_language', uiLanguage);
        document.documentElement.lang = uiLanguage;
    }, [uiLanguage]);

    const toggleLanguage = () => {
        setUiLanguage(prev => prev === 'tr' ? 'en' : 'tr');
    };

    return (
        <LanguageContext.Provider value={{ uiLanguage, setUiLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
