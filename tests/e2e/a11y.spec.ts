import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/events', '/artists', '/archive', '/mixes', '/legal'];

for (const path of PAGES) {
  test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join('\n'),
    ).toEqual([]);
  });
}

test('the open artist dialog is accessible', async ({ page }) => {
  await page.goto('/artists');
  await page.locator('[data-artist-open]').first().click();
  await expect(page.locator('dialog[open]')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('dialog[open]')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations.map((v) => v.id)).toEqual([]);
});
