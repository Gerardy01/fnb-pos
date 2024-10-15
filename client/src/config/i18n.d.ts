import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      auth: typeof import('./locales/en.json');
    };
  }
}