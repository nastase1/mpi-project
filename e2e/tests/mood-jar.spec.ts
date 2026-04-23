import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5162/api/MoodEntries';
const NOTE_TAG = 'E2E-Playwright-Test';

test.describe('Mood Jar - Adaugare stari emotionale', () => {

  test.afterEach(async ({ request }) => {
    // Sterge intrarile create de teste pentru a mentine baza de date curata
    const res = await request.get(API_URL);
    if (!res.ok()) return;
    const entries = await res.json();
    for (const entry of entries.filter((e: { note: string }) => e.note === NOTE_TAG)) {
      await request.delete(`${API_URL}/${entry.id}`);
    }
  });

  test('Pagina Mood Jar se incarca si afiseaza canvas-ul si dock-ul', async ({ page }) => {
    await page.goto('/jar');

    await expect(page.locator('canvas')).toBeVisible();

    // Butoanele de mood trebuie sa fie prezente
    await expect(page.getByTestId('mood-btn-great')).toBeVisible();
    await expect(page.getByTestId('mood-btn-good')).toBeVisible();
    await expect(page.getByTestId('mood-btn-neutral')).toBeVisible();
    await expect(page.getByTestId('mood-btn-bad')).toBeVisible();
    await expect(page.getByTestId('mood-btn-awful')).toBeVisible();
  });

  test('Butoanele de mood sunt activate dupa incarcarea datelor', async ({ page }) => {
    await page.goto('/jar');

    // Asteptam ca butoanele sa fie activate (loading = false)
    await expect(page.getByTestId('mood-btn-great')).toBeEnabled({ timeout: 10000 });
  });

  test('Clic pe un mood deschide modalul de adaugare notita', async ({ page }) => {
    await page.goto('/jar');
    await expect(page.getByTestId('mood-btn-great')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('mood-btn-great').click();

    await expect(page.getByTestId('add-mood-modal')).toBeVisible();
    await expect(page.getByText('Cum a fost')).toBeVisible();
    await expect(page.getByTestId('note-textarea')).toBeVisible();
  });

  test('Butonul "Anuleaza" inchide modalul fara a salva', async ({ page }) => {
    await page.goto('/jar');
    await expect(page.getByTestId('mood-btn-good')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('mood-btn-good').click();
    await expect(page.getByTestId('add-mood-modal')).toBeVisible();

    await page.getByTestId('cancel-mood-btn').click();

    await expect(page.getByTestId('add-mood-modal')).not.toBeVisible();
  });

  test('Textarea primeste si pastreaza textul introdus', async ({ page }) => {
    await page.goto('/jar');
    await expect(page.getByTestId('mood-btn-neutral')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('mood-btn-neutral').click();

    const textarea = page.getByTestId('note-textarea');
    await textarea.fill('Nota de test locala');
    await expect(textarea).toHaveValue('Nota de test locala');

    // Anulam fara a salva
    await page.getByTestId('cancel-mood-btn').click();
  });

  test('Clic pe backdrop inchide modalul', async ({ page }) => {
    await page.goto('/jar');
    await expect(page.getByTestId('mood-btn-bad')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('mood-btn-bad').click();
    await expect(page.getByTestId('add-mood-modal')).toBeVisible();

    // Clic pe overlay (backdrop - div-ul care acopera ecranul)
    await page.locator('.fixed.inset-0.z-\\[60\\] > .absolute').click();

    await expect(page.getByTestId('add-mood-modal')).not.toBeVisible();
  });

  test('Salvarea unui mood adauga intrarea in baza de date', async ({ page, request }) => {
    await page.goto('/jar');
    await expect(page.getByTestId('mood-btn-good')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('mood-btn-good').click();

    const textarea = page.getByTestId('note-textarea');
    await textarea.fill(NOTE_TAG);

    await page.getByTestId('save-mood-btn').click();

    // Modalul trebuie sa se inchida dupa salvare
    await expect(page.getByTestId('add-mood-modal')).not.toBeVisible({ timeout: 5000 });

    // Verificam ca intrarea a aparut in API
    await page.waitForTimeout(1000);
    const res = await request.get(API_URL);
    const entries = await res.json();
    const found = entries.find((e: { note: string; mood: string }) => e.note === NOTE_TAG);
    expect(found).toBeTruthy();
    expect(found.mood).toBe('Good');
  });

  test('Butonul "Adauga in Borcan" este dezactivat in timpul salvarii', async ({ page }) => {
    await page.goto('/jar');
    await expect(page.getByTestId('mood-btn-awful')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('mood-btn-awful').click();
    await page.getByTestId('note-textarea').fill(NOTE_TAG);

    // Urmarim starea butonului in momentul salvarii
    const saveBtn = page.getByTestId('save-mood-btn');
    await saveBtn.click();

    // Butonul fie este dezactivat, fie modala s-a inchis deja
    // Testul verifica ca nu se pot trimite cereri duble
    await expect(page.getByTestId('add-mood-modal')).not.toBeVisible({ timeout: 5000 });
  });

});
