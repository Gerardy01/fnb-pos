import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      global: typeof import('./locales/en.json');
      auth: typeof import('./locales/en.json');
      account: typeof import('./locales/en.json');
    };
  }
}