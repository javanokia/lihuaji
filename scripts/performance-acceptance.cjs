// Browser performance and regression capture for the static Pages app.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { serve } = require('./ar-local-server.cjs');

const root = path.resolve(__dirname, '..');
const phase = process.env.PERF_PHASE || 'after';
const publicBase = process.env.PERF_URL;
const outDir = path.join(root, 'docs/performance/validation');
const firstProductId = JSON.parse(fs.readFileSync(path.join(path.resolve(__dirname, '..'), 'content/products.json'), 'utf8'))[0].id;
const routes = [
  { id: 'home', hash: '#home', wait: '.ivory-hero' },
  { id: 'library', hash: '#library', wait: '#pattern-count' },
  { id: 'gallery', hash: '#gallery', wait: '#product-count' },
  { id: 'product', hash: `#product/${encodeURIComponent(firstProductId)}`, wait: '#sku' },
  { id: 'search-cloud', hash: '#search/%E7%A5%A5%E4%BA%91', wait: '.search-section' },
  { id: 'detail', hash: '#library', wait: '#pattern-count' },
  { id: 'ar', hash: '#ar', wait: '#ar-frame' },
  { id: 'learning-path', hash: '#ar/learn-tao', wait: '#learning-path' },
];

async function measure(browser, base, route, viewport, phaseName) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const requests = new Set();
  const failures = [];
  const badResponses = [];
  const errors = [];
  let contentLengthBytes = 0;
  page.on('request', request => requests.add(request.url()));
  page.on('requestfailed', request => failures.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', async response => {
    if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() });
    const length = Number((await response.allHeaders())['content-length']);
    if (Number.isFinite(length)) contentLengthBytes += length;
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__perf = { lcp: null, cls: 0, longTasks: [] };
    try {
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__perf.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__perf.longTasks.push({ start: entry.startTime, duration: entry.duration }); }).observe({ type: 'longtask', buffered: true });
    } catch {}
  });
  const response = await page.goto(`${base}${route.hash}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator(route.wait).waitFor({ timeout: 60000 });
  let initialPatternCards = null, afterScrollPatternCards = null, initialProductCards = null, afterScrollProductCards = null;
  if (route.id === 'library' || route.id === 'detail') {
    await page.locator('[data-pattern]').first().scrollIntoViewIfNeeded();
    await page.locator('[data-pattern] img').first().evaluate(img => Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]));
    initialPatternCards = await page.locator('[data-pattern]').count();
    if (route.id === 'library') {
      await page.locator('#pagination').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelectorAll('[data-pattern]').length >= 48, null, { timeout: 10000 }).catch(() => {});
      afterScrollPatternCards = await page.locator('[data-pattern]').count();
    }
  }
  if (route.id === 'gallery') {
    initialProductCards = await page.locator('#products .card').count();
    const firstProductImage = page.locator('#products img').first();
    const firstProductSrc = await firstProductImage.getAttribute('src');
    if (!firstProductSrc.includes('/shop/thumbnails/')) throw new Error(`Product card is not using a thumbnail: ${firstProductSrc}`);
    await firstProductImage.evaluate(img => Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]));
    if (await page.locator('#product-pagination').count()) {
      await page.locator('#product-pagination').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelectorAll('#products .card').length >= 24, null, { timeout: 10000 }).catch(() => {});
    }
    afterScrollProductCards = await page.locator('#products .card').count();
    if (initialProductCards !== 12 || afterScrollProductCards < 24) throw new Error(`Product batch size regression: ${initialProductCards} -> ${afterScrollProductCards}`);
  }
  if (route.id === 'product') await page.locator('.split img').evaluate(img => Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]));
  if (route.id === 'home') {
    await page.locator('.ivory-hero img').evaluate(img => Promise.race([img.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 8000))]));
  }
  await page.waitForTimeout(600);
  if (route.id === 'detail') {
    await page.locator('[data-pattern]').first().click();
    await page.locator('#modal-body img').waitFor();
    await page.locator('#modal-body img').evaluate(img => img.decode());
  }
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const images = [...document.images];
    const appResource = url => /\.(?:png|jpe?g|webp|avif|gif|svg)(?:[?#]|$)/i.test(url);
    return {
      domNodes: document.getElementsByTagName('*').length,
      images: images.length,
      loadedImages: images.filter(img => img.complete && img.naturalWidth > 0).length,
      imageResourceRequests: resources.filter(r => appResource(r.name)).length,
      imageTransferBytes: resources.filter(r => appResource(r.name)).reduce((n, r) => n + r.transferSize, 0),
      resourceTransferBytes: resources.reduce((n, r) => n + r.transferSize, 0),
      dclMs: nav?.domContentLoadedEventEnd || null,
      loadMs: nav?.loadEventEnd || null,
      fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || null,
      lcpMs: window.__perf.lcp,
      cls: window.__perf.cls,
      longTasks: window.__perf.longTasks,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      patternCards: document.querySelectorAll('[data-pattern]').length,
      productCards: document.querySelectorAll('#products .card').length,
      loadedCatalogs: performance.getEntriesByType('resource').map(r => r.name).filter(name => /content\/(?:site|patterns|products)\.json/.test(name)).map(name => name.match(/content\/([^?]+)/)?.[1]),
      iframeCount: document.querySelectorAll('iframe').length,
      externalHosts: [...new Set(resources.map(r => { try { return new URL(r.name).hostname } catch { return '' } }).filter(host => host && host !== location.hostname))],
      resourceCount: resources.length,
      routeReadyMs: performance.now(),
    };
  });
  if (route.id === 'home' && metrics.loadedCatalogs.join(',') !== 'site.json') throw new Error(`Home fetched non-home catalogs: ${metrics.loadedCatalogs.join(',')}`);
  if (route.id === 'library' && (initialPatternCards !== 24 || (afterScrollPatternCards ?? 0) < 48 || metrics.loadedCatalogs.includes('products.json'))) throw new Error('Library lazy paging/catalog boundary regressed.');
  if (route.id === 'product' && metrics.loadedCatalogs.includes('patterns.json')) throw new Error('Product page unexpectedly loaded pattern catalog.');
  if (route.id === 'gallery' && metrics.loadedCatalogs.includes('patterns.json')) throw new Error('Product gallery unexpectedly loaded pattern catalog.');
  const name = `${phaseName}-${route.id}${viewport.width === 390 ? '-mobile' : ''}.png`;
  await page.screenshot({ path: path.join(outDir, name), fullPage: route.id === 'library' || route.id === 'search-cloud' });
  const result = { route: route.id, viewport: `${viewport.width}x${viewport.height}`, status: response?.status(), requests: requests.size, contentLengthBytes, initialPatternCards, afterScrollPatternCards, initialProductCards, afterScrollProductCards, ...metrics, jsErrors: errors, failedRequests: failures, badResponses };
  await context.close();
  return result;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  let server;
  let browser;
  try {
    const local = publicBase ? null : await serve();
    server = local?.server;
    const base = publicBase || local.base;
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const results = [];
    for (const route of routes) {
      console.log(`Measuring ${phase} ${route.id} at desktop`);
      results.push(await measure(browser, base, route, { width: 1440, height: 900 }, phase));
      if (route.id === 'home' || route.id === 'library' || route.id === 'gallery' || route.id === 'search-cloud' || route.id === 'ar') {
        console.log(`Measuring ${phase} ${route.id} at 390x844`);
        results.push(await measure(browser, base, route, { width: 390, height: 844 }, phase));
      }
    }
    const report = {
      phase,
      target: publicBase ? 'public-pages' : 'local',
      base,
      createdAt: new Date().toISOString(),
      patternDatasetCount: JSON.parse(fs.readFileSync(path.join(root, 'content/patterns.json'), 'utf8')).length,
      results,
    };
    const reportPath = path.join(root, `docs/performance/${phase}-metrics.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (results.some(row => row.status !== 200 || row.jsErrors.length || row.failedRequests.some(failure => !(failure.error === 'net::ERR_ABORTED' && failure.url.includes('icourse163.org/course/'))) || row.horizontalOverflow)) process.exitCode = 1;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser?.close();
    server?.close();
  }
})();
