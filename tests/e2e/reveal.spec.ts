import { test, expect } from '@playwright/test';

/**
 * The reveal effect is pure CSS (`animation-timeline: view()`), gated by
 * `@media (prefers-reduced-motion: no-preference)` and
 * `@supports (animation-timeline: view())`. There is no JS and no
 * hidden-by-default state to undo, so content can never get stuck.
 */
test.describe('reveal-on-scroll', () => {
  const deepReveal = '#lista [data-reveal]';

  test('reduced motion: deep content is visible immediately, no scroll', async ({ page }) => {
    // Project default is reducedMotion: 'reduce'.
    await page.goto('/');
    await expect(page.locator(deepReveal).first()).toHaveCSS('opacity', '1');
  });

  test.describe('with motion', () => {
    test.use({ reducedMotion: 'no-preference' });

    test('deep content fades in as it enters the viewport', async ({ page }) => {
      await page.goto('/');
      const gate = page.locator('[data-threshold]');
      if (await gate.isVisible()) {
        await page.getByRole('button', { name: 'Entrar', exact: true }).click();
        await expect(gate).toBeHidden();
      }

      const target = page.locator(deepReveal).first();
      // Chromium supports view() timelines, so it starts mid-animation (dim).
      const before = await target.evaluate((el) => Number(getComputedStyle(el).opacity));
      expect(before).toBeLessThan(1);

      await target.scrollIntoViewIfNeeded();
      await expect(target).toHaveCSS('opacity', '1', { timeout: 3000 });
    });
  });
});
