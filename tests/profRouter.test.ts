import supertest from 'supertest';
import app from '../src/app';

const request = supertest(app);

const testUsername = 'testuser';
const testPassword = 'password';

describe('Test the Profile Page', () => {
    test('GET /prof should return 302 and redirect to /login', async () => {
        const response = await request.get('/profile').set('accept', 'text/html');
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/login');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
    test('GET /prof with valid credentials should return 200', async () => {
        const agent = supertest.agent(app);
        const responseLogin = await agent.post('/login/password').set('accept', 'text/html').send({
            username: 'testuser',
            password: 'password'
        });
        expect(responseLogin.status).toBe(302);
        expect(responseLogin.headers['location']).toBe('/');
        expect(responseLogin.headers['content-type']).toBe('text/html; charset=utf-8');

        const response = await agent.get('/profile').set('accept', 'text/html');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
});

describe('Test ensureLoggedIn and passport middleware', () => {
    test('GET /prof should redirect to /login then after login redirect to /prof', async () => {
        const agent = supertest.agent(app);
        const response = await agent.get('/profile').set('accept', 'text/html');
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/login');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');

        const responseRedirectedToProf = await agent.post('/login/password').set('accept', 'text/html').send({
            username: 'testuser'
        })
    })
})