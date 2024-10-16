import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// Translation
import enGlobal from "./constants/locales/en/global.json";
import enAuth from "./constants/locales/en/auth.json";

import idGlobal from "./constants/locales/id/global.json";
import idAuth from "./constants/locales/id/auth.json";


i18n
    // .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                global : enGlobal,
                auth : enAuth,
            },
            id: {
                auth : idAuth,
                global : idGlobal,
            }
        },
        fallbackLng: 'en',
        ns : [
            "global",
            "auth",
        ],
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;