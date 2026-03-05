import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import km from '../locales/km.json';
import zh from '../locales/zh.json';
import ko from '../locales/ko.json';
import tl from '../locales/tl.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            km: { translation: km },
            zh: { translation: zh },
            ko: { translation: ko},
            tl: { translation: tl }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;