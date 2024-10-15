import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation
import enAuth from "./constants/locales/en/auth.json";

import idAuth from "./constants/locales/id/auth.json"


i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                auth : enAuth
            },
            id: {
                auth : idAuth
            }
        },
        fallbackLng: 'en',
        ns : [
            "auth"
        ],
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;