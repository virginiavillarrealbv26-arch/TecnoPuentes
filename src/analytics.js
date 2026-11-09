const provider = (import.meta.env.VITE_ANALYTICS_PROVIDER || '').toLowerCase();

const loadScript = (src, attrs = {}) => {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    Object.entries(attrs).forEach(([key, value]) => existing.setAttribute(key, value));
    return existing;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
  return script;
};

const getPagePath = (pageName) => {
  if (!pageName || pageName === 'menu') return '/';
  return `/${pageName}`;
};

export const trackPageView = (pageName) => {
  const path = getPagePath(pageName);

  if (provider === 'google') {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId) return;

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_path: path,
      anonymize_ip: true,
    });
    return;
  }

  if (provider === 'umami') {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';
    if (!websiteId) return;

    if (!document.querySelector('script[data-analytics="umami"]')) {
      const script = loadScript(scriptUrl, {
        'data-website-id': websiteId,
        'data-analytics': 'umami',
      });
      if (script) {
        script.dataset.websiteId = websiteId;
      }
    }

    if (window.umami) {
      window.umami.trackView({ url: path });
    }
    return;
  }

  if (provider === 'plausible') {
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (!domain) return;

    if (!document.querySelector('script[data-domain]')) {
      loadScript('https://plausible.io/js/script.js', {
        defer: 'true',
        'data-domain': domain,
        'data-analytics': 'plausible',
      });
    }

    if (window.plausible) {
      window.plausible('pageview', { u: window.location.origin + path });
    }
  }
};

export const initAnalytics = () => {
  const providerName = provider || 'none';

  if (providerName === 'none') return;

  if (provider === 'google') {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId) return;
    trackPageView('menu');
    return;
  }

  if (provider === 'umami') {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    if (!websiteId) return;
    trackPageView('menu');
    return;
  }

  if (provider === 'plausible') {
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (!domain) return;
    trackPageView('menu');
  }
};
