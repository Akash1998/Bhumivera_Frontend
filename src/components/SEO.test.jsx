// @vitest-environment jsdom
import React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './SEO';

describe('homepage structured data', () => {
  afterEach(cleanup);

  it('does not ship a duplicate static product-carousel ItemList', () => {
    const indexHtml = readFileSync(resolve(cwd(), 'index.html'), 'utf8');
    const schemaScripts = [...indexHtml.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    )];
    const graphs = schemaScripts.map(([, content]) => JSON.parse(content));
    const itemLists = graphs.flatMap(graph => graph['@graph'] || [])
      .filter(node => node['@type'] === 'ItemList');

    expect(itemLists).toHaveLength(0);
  });

  it('does not publish unsupported product-carousel ItemList markup', async () => {
    render(
      <HelmetProvider>
        <SEO
          title="Bhumivera"
          description="Bhumivera botanical skincare."
          route="/"
        />
      </HelmetProvider>
    );

    let schemaScript;
    await waitFor(() => {
      schemaScript = document.head.querySelector('script[type="application/ld+json"]');
      expect(schemaScript).not.toBeNull();
    });

    const schema = JSON.parse(schemaScript.textContent);
    expect(schema['@graph'].some(node => node['@type'] === 'ItemList')).toBe(false);
  });
});
