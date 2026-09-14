import { test, expect } from '@playwright/test';

test.describe('intro curtain', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('shows once, dismisses on Entrar, and does not return that session', async ({ page }) => {
    await page.goto('/');
    const gate = page.locator('[data-threshold]');
    await expect(gate).toBeVisible();

    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(gate).toBeHidden();

    await page.reload();
    await expect(page.locator('[data-threshold]')).toBeHidden();
  });

  test('dismisses on Escape', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-threshold]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-threshold]')).toBeHidden();
  });
});

test('intro curtain never appears under reduced motion', async ({ page }) => {
  // project default is reducedMotion: 'reduce'
  await page.goto('/');
  await expect(page.locator('[data-threshold]')).toBeHidden();
  await expect(page.locator('main#main h1')).toBeVisible();
});
