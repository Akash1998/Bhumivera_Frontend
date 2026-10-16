// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

let getCurrentLanguage;
let setLanguage;
let t;
let translateDomNodes;
let activateFullSiteTranslation;
let SUPPORTED_INDIAN_LANGUAGES;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  document.cookie = 'googtrans=; Max-Age=0; path=/;';
  document.body.innerHTML = `
    <div id="test-root">
      <h1>Rooted in nature. Made for your everyday.</h1>
      <p>A story that begins with the earth</p>
      <button aria-label="Explore the Collection" title="Discover">
        Explore the Collection
      </button>
      <input type="text" placeholder="Search skincare, hair care, ingredients..." />
    </div>
  `;
  ({
    getCurrentLanguage,
    setLanguage,
    t,
    translateDomNodes,
    activateFullSiteTranslation,
    SUPPORTED_INDIAN_LANGUAGES,
  } = await import('./indianLanguageEngine.js'));
});

describe('Bhumivera Tri-Lingual Language Engine (English, Hindi, Bengali)', () => {
  it('supports English, Hindi, and Bengali as primary languages', () => {
    const codes = SUPPORTED_INDIAN_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('bn');
    expect(SUPPORTED_INDIAN_LANGUAGES.find((l) => l.code === 'bn')?.nativeName).toBe('বাংলা');
    expect(SUPPORTED_INDIAN_LANGUAGES.find((l) => l.code === 'hi')?.nativeName).toBe('हिन्दी');
  });

  it('translates DOM nodes and placeholders into Hindi', () => {
    setLanguage('hi');

    const h1 = document.querySelector('h1');
    const p = document.querySelector('p');
    const btn = document.querySelector('button');
    const input = document.querySelector('input');

    expect(h1.textContent).toBe('प्रकृति से प्रेरित। आपके दैनिक जीवन के लिए निर्मित।');
    expect(p.textContent).toBe('एक कहानी जो धरती से शुरू होती है');
    expect(btn.textContent.trim()).toBe('संग्रह देखें');
    expect(input.placeholder).toBe('स्किनकेयर, हेयर केयर या सामग्री खोजें...');
    expect(document.documentElement.lang).toBe('hi');
  });

  it('translates DOM nodes and placeholders into Bengali with zero latency and restores English', () => {
    setLanguage('bn');

    const h1 = document.querySelector('h1');
    const p = document.querySelector('p');
    const btn = document.querySelector('button');
    const input = document.querySelector('input');

    expect(h1.textContent).toBe('প্রকৃতি থেকে অনুপ্রাণিত। আপনার দৈনন্দিন জীবনের জন্য তৈরি।');
    expect(p.textContent).toBe('একটি গল্প যা মাটি থেকে শুরু হয়');
    expect(btn.textContent.trim()).toBe('সংগ্রহ দেখুন');
    expect(input.placeholder).toBe('স্কিনকেয়ার বা উপাদান খুঁজুন...');
    expect(document.documentElement.lang).toBe('bn');

    // Switch back to English
    setLanguage('en');
    expect(h1.textContent).toBe('Rooted in nature. Made for your everyday.');
    expect(p.textContent).toBe('A story that begins with the earth');
    expect(btn.textContent.trim()).toBe('Explore the Collection');
    expect(input.placeholder).toBe('Search skincare, hair care, ingredients...');
    expect(document.documentElement.lang).toBe('en');
  });

  it('t() function retrieves correct localized strings for en, hi, and bn', () => {
    expect(t('nav_home', '', 'en')).toBe('Home');
    expect(t('nav_home', '', 'hi')).toBe('होम');
    expect(t('nav_home', '', 'bn')).toBe('হোম');

    expect(t('nav_shop', '', 'bn')).toBe('সব পণ্য দেখুন');
    expect(t('nav_science', '', 'bn')).toBe('উদ্ভিদ বিজ্ঞান');
  });

  it('cleans up legacy Google Translate banner frames and cookies without reloading', () => {
    const banner = document.createElement('iframe');
    banner.className = 'goog-te-banner-frame';
    document.body.appendChild(banner);

    document.cookie = 'googtrans=/en/hi; path=/';
    activateFullSiteTranslation('bn');

    expect(document.querySelector('.goog-te-banner-frame')).toBeNull();
    expect(document.cookie).not.toContain('googtrans=/en/hi');
  });
});

