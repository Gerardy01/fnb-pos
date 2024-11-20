import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// Translation
import enGlobal from "./constants/locales/en/global.json";
import enAuth from "./constants/locales/en/auth.json";
import enAccount from "./constants/locales/en/account.json";
import enRole from "./constants/locales/en/role.json";

import idGlobal from "./constants/locales/id/global.json";
import idAuth from "./constants/locales/id/auth.json";
import idAccount from "./constants/locales/id/account.json";


i18n
    // .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                global : enGlobal,
                auth : enAuth,
                account : enAccount,
                role : enRole
            },
            id: {
                auth : idAuth,
                global : idGlobal,
                account : idAccount,
            }
        },
        fallbackLng: 'en',
        ns : [
            "global",
            "auth",
            "account",
            "role",
        ],
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;