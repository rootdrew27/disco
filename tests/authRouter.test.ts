import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

describe('Test Login', () => {
    test('GET /login page shoul`d return 200', async () => {
        const response = await request.get('/login');
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe('text/html; charset=utf-8');
    });
    test('POST /login/password with valid credentials -> should redirect to /', async () => {
        const response = await request.post('/login/password').send({
            username: 'testuser',
            password: 'password'
        });
        console.log(response.headers);
        expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/');
    });
    test('POST /login/password with invalid credentials -> should redirect to /login', async () => {
        const response = await request.post('/login/password').send({
            username: 'testuser_invalid',
            password: 'testpassword_invalid'
        });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
    });
});

describe('Test Logout', () => {
    const agent = supertest.agent(app);
    beforeEach(async () => {
        const response = await agent.post('/login/password').send({
            username: 'testuser',
            password: 'password'
        });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/');
    });
    test('GET /logout should redirect to /login', async () => {
        const response = await agent.post('/logout');
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/');
    });
});