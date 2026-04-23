import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5162/api/MoodEntries';

test.describe('Pagina History - Vizualizare si navigare', () => {
  let entryId: string;

  test.beforeEach(async ({ request }) => {
    // Cream o intrare pentru ziua curenta, folosita in teste
    const res = await request.post(API_URL, {
      data: {
        date: new Date(Date.now() - 5000).toISOString(),
        mood: 'Great',
        note: 'Intrare test History page',
      },
    });
    const body = await res.json();
    entryId = body.id;
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`${API_URL}/${entryId}`).catch(() => {});
  });

  test('Pagina History se incarca si afiseaza calendarul lunar', async ({ page }) => {
    await page.goto('/history');

    // Butoanele de navigare luna trebuie sa fie prezente
    await expect(page.getByRole('button', { name: '←' })).toBeVisible();
    await expect(page.getByRole('button', { name: '→' })).toBeVisible();

    // Zilele saptamanii in romana trebuie sa apara
    await expect(page.getByText('L', { exact: true }).first()).toBeVisible();
  });

  test('Butonul luna urmatoare este dezactivat pe luna curenta', async ({ page }) => {
    await page.goto('/history');

    const nextBtn = page.getByRole('button', { name: '→' });
    await expect(nextBtn).toBeDisabled();
  });

  test('Navigarea la luna anterioara functioneaza', async ({ page }) => {
    await page.goto('/history');

    const prevBtn = page.getByRole('button', { name: '←' });
    await prevBtn.click();

    // Dupa clic, butonul "→" trebuie sa fie activ (nu mai suntem pe luna curenta)
    const nextBtn = page.getByRole('button', { name: '→' });
    await expect(nextBtn).toBeEnabled();
  });

  test('Dupa navigarea la o luna anterioara, butonul inapoi readuce la luna curenta', async ({ page }) => {
    await page.goto('/history');

    await page.getByRole('button', { name: '←' }).click();
    await page.getByRole('button', { name: '→' }).click();

    // Revenim la luna curenta - butonul "→" trebuie sa fie din nou dezactivat
    await expect(page.getByRole('button', { name: '→' })).toBeDisabled();
  });

  test('Filtrele de mood sunt vizibile si au toate cele 5 optiuni', async ({ page }) => {
    await page.goto('/history');

    await expect(page.locator('button[title="great"]')).toBeVisible();
    await expect(page.locator('button[title="good"]')).toBeVisible();
    await expect(page.locator('button[title="neutral"]')).toBeVisible();
    await expect(page.locator('button[title="bad"]')).toBeVisible();
    await expect(page.locator('button[title="awful"]')).toBeVisible();
  });

  test('Clic pe un filtru de mood il activeaza', async ({ page }) => {
    await page.goto('/history');

    const filterGreat = page.locator('button[title="great"]');
    await filterGreat.click();

    // Dupa activare, butonul primeste clasa de activ (contine scale-110)
    await expect(filterGreat).toHaveClass(/scale-110/);
  });

  test('Clic pe ziua curenta din calendar deschide modalul cu intrari', async ({ page }) => {
    await page.goto('/history');

    const today = new Date().getDate();
    // Celulele de calendar sunt div-uri cu numarul zilei
    const dayCell = page.locator(`text="${today}"`).first();
    await dayCell.click();

    // Modalul cu intrari trebuie sa apara
    await expect(page.getByText('Înapoi la Calendar')).toBeVisible({ timeout: 5000 });
  });

});
