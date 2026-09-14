import { test, expect } from '@playwright/test';

const PAGES = ['/', '/events', '/artists', '/archive', '/mixes', '/legal'];

for (const path of PAGES) {
  test(`${path} renders, is titled, and logs no errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();

    await expect(page).toHaveTitle(/KUSH HOUSE/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeAttached();
    await expect(page.locator('meta[http-equiv="content-security-policy" i]')).toHaveCount(1);
    await expect(page.locator('footer')).toBeVisible();

    expect(errors, `console/page errors on ${path}`).toEqual([]);
  });
}

test('unknown URLs serve the 404 page', async ({ page }) => {
  const response = await page.goto('/nao-existe-esta-pagina');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Beco sem saída');
});

test('the RSS feed and sitemap are served', async ({ request }) => {
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBeTruthy();
  expect(rss.headers()['content-type']).toContain('xml');

  const sitemap = await request.get('/sitemap-index.xml');
  expect(sitemap.ok()).toBeTruthy();
});

test('per-event .ics downloads are generated', async ({ request }) => {
  const ics = await request.get('/events/2026-10-17-cavernas.ics');
  expect(ics.ok()).toBeTruthy();
  expect(ics.headers()['content-type']).toContain('text/calendar');
  expect(await ics.text()).toContain('BEGIN:VEVENT');
});
