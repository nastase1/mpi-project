import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5162/api/MoodEntries';

test.describe('API Integration - MoodEntries', () => {

  test('GET /api/MoodEntries - returneaza 200 si un array', async ({ request }) => {
    const response = await request.get(API_URL);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('POST /api/MoodEntries - creeaza o intrare noua si returneaza 201', async ({ request }) => {
    const response = await request.post(API_URL, {
      data: {
        date: new Date(Date.now() - 5000).toISOString(),
        mood: 'Great',
        note: 'Test creare intrare Playwright',
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.mood).toBe('Great');
    expect(body.note).toBe('Test creare intrare Playwright');

    await request.delete(`${API_URL}/${body.id}`);
  });

  test('GET /api/MoodEntries/{id} - returneaza intrarea corecta dupa ID', async ({ request }) => {
    const createRes = await request.post(API_URL, {
      data: {
        date: new Date(Date.now() - 5000).toISOString(),
        mood: 'Good',
        note: 'Test GET by ID',
      },
    });
    const created = await createRes.json();

    const response = await request.get(`${API_URL}/${created.id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(created.id);
    expect(body.mood).toBe('Good');

    await request.delete(`${API_URL}/${created.id}`);
  });

  test('DELETE /api/MoodEntries/{id} - sterge intrarea si returneaza 204', async ({ request }) => {
    const createRes = await request.post(API_URL, {
      data: {
        date: new Date(Date.now() - 5000).toISOString(),
        mood: 'Neutral',
        note: 'Test stergere',
      },
    });
    const created = await createRes.json();

    const deleteRes = await request.delete(`${API_URL}/${created.id}`);
    expect(deleteRes.status()).toBe(204);

    // Verificam ca intrarea nu mai exista
    const getRes = await request.get(`${API_URL}/${created.id}`);
    expect(getRes.status()).toBe(404);
  });

  test('POST cu mood gol - returneaza 400 Bad Request', async ({ request }) => {
    const response = await request.post(API_URL, {
      data: {
        date: new Date(Date.now() - 5000).toISOString(),
        mood: '',
        note: 'Mood gol',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('POST cu data in viitor - returneaza 400 Bad Request', async ({ request }) => {
    const dataViitor = new Date();
    dataViitor.setDate(dataViitor.getDate() + 3);

    const response = await request.post(API_URL, {
      data: {
        date: dataViitor.toISOString(),
        mood: 'Great',
        note: 'Data in viitor',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('GET cu ID inexistent - returneaza 404', async ({ request }) => {
    const response = await request.get(`${API_URL}/00000000-0000-0000-0000-000000000000`);
    expect(response.status()).toBe(404);
  });

  test('DELETE cu ID inexistent - returneaza 404', async ({ request }) => {
    const response = await request.delete(`${API_URL}/00000000-0000-0000-0000-000000000000`);
    expect(response.status()).toBe(404);
  });

});
