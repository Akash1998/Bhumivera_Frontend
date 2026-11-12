async function submitSitemapUrls() {
  const key = 'b4b0ecccd2749abb58822fa6846f5d923a61a7d30242c52d';
  const siteOrigin = 'https://www.bhumivera.com';
  const [keyResponse, sitemapResponse] = await Promise.all([
    fetch(`${siteOrigin}/${key}.txt`, { signal: AbortSignal.timeout(8000) }),
    fetch(`${siteOrigin}/sitemap.xml`, { signal: AbortSignal.timeout(8000) }),
  ]);
  if (!keyResponse.ok) throw new Error(`IndexNow key verification file returned HTTP ${keyResponse.status}.`);
  if ((await keyResponse.text()).trim() !== key) throw new Error('The live IndexNow key verification content did not match.');
  if (!sitemapResponse.ok) throw new Error(`The live sitemap returned HTTP ${sitemapResponse.status}.`);
  const sitemap = await sitemapResponse.text();
  const urls = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(([, value]) => value.replace(/&amp;/g, '&').trim())
    .filter(value => value.startsWith(`${siteOrigin}/`)))];

  if (!urls.length) {
    throw new Error('The deployment sitemap contains no canonical www URLs.');
  }

  let submittedCount = 0;
  for (let offset = 0; offset < urls.length; offset += 10000) {
    const urlList = urls.slice(offset, offset + 10000);
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'www.bhumivera.com',
        key,
        keyLocation: `https://www.bhumivera.com/${key}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`IndexNow returned HTTP ${response.status} for a batch of ${urlList.length} URL(s).`);
    }
    submittedCount += urlList.length;
  }

  console.log(`[INDEXNOW] Submitted ${submittedCount} sitemap URL(s).`);
}

submitSitemapUrls().catch(error => {
  console.error('[INDEXNOW_DEPLOY_SUBMISSION_FAILED]', error);
});
