import { test, expect } from '@playwright/test';

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 780 } });

  test('opens, traps Escape, and restores focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });
});

test.describe('agenda filter', () => {
  test('toggles groups and reflects state in the URL and ARIA', async ({ page }) => {
    await page.goto('/events');
    const upcoming = page.locator('[data-events-group="upcoming"]');
    const past = page.locator('[data-events-group="past"]');

    await expect(upcoming).toBeVisible();
    await expect(past).toBeHidden();

    await page.getByRole('link', { name: /Já aconteceram/ }).click();
    await expect(past).toBeVisible();
    await expect(upcoming).toBeHidden();
    await expect(page).toHaveURL(/#passadas$/);
    await expect(page.getByRole('link', { name: /Já aconteceram/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('deep link to #passadas starts on the past group', async ({ page }) => {
    await page.goto('/events#passadas');
    await expect(page.locator('[data-events-group="past"]')).toBeVisible();
    await expect(page.locator('[data-events-group="upcoming"]')).toBeHidden();
  });
});

test.describe('artist dialog', () => {
  test('opens on click, closes on Escape, and returns focus', async ({ page }) => {
    await page.goto('/artists');
    const trigger = page.locator('[data-artist-open]').first();
    await trigger.click();

    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Fechar' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});

test.describe('archive lightbox', () => {
  test('opens, steps with the keyboard, and closes', async ({ page }) => {
    await page.goto('/archive');
    await page.locator('[data-lightbox-item]').first().click();

    const dialog = page.locator('dialog[data-lightbox][open]');
    await expect(dialog).toBeVisible();
    const count = dialog.locator('[data-lightbox-count]');
    await expect(count).toHaveText('1 / 13');

    await page.keyboard.press('ArrowRight');
    await expect(count).toHaveText('2 / 13');

    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[data-lightbox][open]')).toHaveCount(0);
  });
});

test.describe('newsletter form', () => {
  test('rejects a bad address and accepts a good one', async ({ page }) => {
    await page.goto('/#lista');
    const form = page.locator('[data-newsletter]');
    const input = form.getByLabel('Seu e-mail');
    const status = form.locator('#nl-status');

    await input.fill('nao-e-email');
    await form.getByRole('button', { name: 'Entrar na lista' }).click();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(status).toContainText(/Confira o e-mail/i);

    await input.fill('fa@exemplo.com');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(status).toHaveText('');
  });
});
