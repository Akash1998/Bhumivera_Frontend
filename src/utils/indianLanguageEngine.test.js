// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

let activateFullSiteTranslation;
let translateCombo;
let changeHandler;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  document.cookie = 'googtrans=; Max-Age=0; path=/;';
  document.body.innerHTML = '<div id="google_translate_element"></div>';
  delete window.google;
  translateCombo = undefined;
  changeHandler = vi.fn();
  ({ activateFullSiteTranslation } = await import('./indianLanguageEngine.js'));
});

describe('activateFullSiteTranslation', () => {
  it('loads Google Translate and automatically selects the requested language', async () => {
    activateFullSiteTranslation('hi');

    const script = document.getElementById('bhumivera-google-translate-script');
    expect(script.src).toBe(
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    expect(document.cookie).toContain('googtrans=/en/hi');

    window.google = {
      translate: {
        TranslateElement: class {
          static InlineLayout = { SIMPLE: 0 };

          constructor(_options, targetId) {
            translateCombo = document.createElement('select');
            translateCombo.className = 'goog-te-combo';
            ['en', 'hi', 'bn'].forEach((lang) => {
              const option = document.createElement('option');
              option.value = lang;
              translateCombo.appendChild(option);
            });
            translateCombo.addEventListener('change', changeHandler);
            document.getElementById(targetId).appendChild(translateCombo);
          }
        },
      },
    };
    window.googleTranslateElementInit();

    expect(translateCombo.value).toBe('hi');
    expect(changeHandler).toHaveBeenCalledOnce();
  });

  it('reloads with a canonical cookie when switching an initialized translation', () => {
    window.google = {
      translate: {
        TranslateElement: class {
          static InlineLayout = { SIMPLE: 0 };

          constructor(_options, targetId) {
            translateCombo = document.createElement('select');
            translateCombo.className = 'goog-te-combo';
            ['en', 'hi', 'bn'].forEach((lang) => {
              const option = document.createElement('option');
              option.value = lang;
              translateCombo.appendChild(option);
            });
            translateCombo.addEventListener('change', changeHandler);
            document.getElementById(targetId).appendChild(translateCombo);
          }
        },
      },
    };

    activateFullSiteTranslation('hi');
    expect(translateCombo.value).toBe('hi');
    const reloadPage = vi.fn();
    activateFullSiteTranslation('bn', { reloadPage });
    expect(reloadPage).toHaveBeenCalledOnce();
    expect(document.cookie).toContain('googtrans=/en/bn');

    activateFullSiteTranslation('en', { reloadPage });
    expect(reloadPage).toHaveBeenCalledTimes(2);
    expect(document.cookie).not.toContain('googtrans=/en/');
    expect(changeHandler).toHaveBeenCalledOnce();
  });

  it('waits for Google Translate to populate a selected language option', async () => {
    window.google = {
      translate: {
        TranslateElement: class {
          static InlineLayout = { SIMPLE: 0 };

          constructor(_options, targetId) {
            translateCombo = document.createElement('select');
            translateCombo.className = 'goog-te-combo';
            ['en', 'hi'].forEach((lang) => {
              const option = document.createElement('option');
              option.value = lang;
              translateCombo.appendChild(option);
            });
            translateCombo.addEventListener('change', changeHandler);
            document.getElementById(targetId).appendChild(translateCombo);
          }
        },
      },
    };

    activateFullSiteTranslation('bn');
    expect(translateCombo.value).toBe('en');
    expect(changeHandler).not.toHaveBeenCalled();

    const bengaliOption = document.createElement('option');
    bengaliOption.value = 'bn';
    translateCombo.appendChild(bengaliOption);

    await vi.waitFor(() => {
      expect(translateCombo.value).toBe('bn');
      expect(changeHandler).toHaveBeenCalledOnce();
    });
  });

  it('removes the Google toolbar if it is injected after translation starts', async () => {
    activateFullSiteTranslation('hi');
    const banner = document.createElement('iframe');
    banner.className = 'goog-te-banner-frame';
    document.body.appendChild(banner);

    await vi.waitFor(() => {
      expect(document.querySelector('.goog-te-banner-frame')).toBeNull();
    });
  });
});
