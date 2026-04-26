import { test, expect } from '@playwright/test';

test.describe('Navigatie si Layout', () => {

  test('Pagina Welcome se incarca corect cu elementele principale', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('How are you feeling today')).toBeVisible();
    await expect(page.getByText('Your Personal Emotion Tracker')).toBeVisible();
    await expect(page.getByText('Open the Mood Jar 🫙')).toBeVisible();
    await expect(page.getByText('See Your History 📅')).toBeVisible();
  });

  test('Navbar este vizibila pe toate paginile', async ({ page }) => {
    for (const route of ['/', '/jar', '/history']) {
      await page.goto(route);
      await expect(page.getByText('Daily Mood')).toBeVisible();
    }
  });

  test('Butonul "Open the Mood Jar" navigheaza la /jar', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Open the Mood Jar 🫙').click();
    await expect(page).toHaveURL('/jar');
  });

  test('Butonul "See Your History" navigheaza la /history', async ({ page }) => {
    await page.goto('/');
    await page.getByText('See Your History 📅').click();
    await expect(page).toHaveURL('/history');
  });

  test('Link-ul "History" din Navbar navigheaza la /history', async ({ page }) => {
    await page.goto('/');
    // Navbar link-ul de History (contine emoji 📅)
    await page.locator('nav').getByRole('link', { name: /history/i }).click();
    await expect(page).toHaveURL('/history');
  });

  test('Link-ul "Add Mood" din Navbar navigheaza la /jar', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').getByRole('link', { name: /add mood/i }).click();
    await expect(page).toHaveURL('/jar');
  });

  test('Logo-ul "Daily Mood" navigheaza inapoi la pagina principala', async ({ page }) => {
    await page.goto('/jar');
    await page.locator('nav').getByText('Daily Mood').click();
    await expect(page).toHaveURL('/');
  });

  test('Dock-ul de emotii de pe Welcome contine 5 emoji-uri', async ({ page }) => {
    await page.goto('/');
    // The 5 emoji divs in the bottom dock
    const emojiDock = page.locator('text=🤩').or(page.locator('text=🙂')).or(page.locator('text=😐'));
    await expect(page.getByText('🤩')).toBeVisible();
    await expect(page.getByText('🙂')).toBeVisible();
    await expect(page.getByText('😐')).toBeVisible();
    await expect(page.getByText('😕')).toBeVisible();
    await expect(page.getByText('😭')).toBeVisible();
  });

});
