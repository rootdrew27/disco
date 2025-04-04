import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

describe('Test Home Page "/" ', () => {
    test('GET / should return 200', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe('text/html; charset=utf-8');
    });
});

describe('Test Disco', () => {
    test('GET /disco', async () => {
        const response = await request.get('/disco');
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe('text/html; charset=utf-8');
    });         
});