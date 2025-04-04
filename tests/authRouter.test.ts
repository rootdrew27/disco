import supertest from 'supertest';
import app from '../src/app';
import sqlite3 from 'sqlite3';
import UserResult from '../src/classes/database/UserResult';

const request = supertest(app);

describe('Test Login', () => {
    test('GET /login page should return 200', async () => {
        const response = await request.get('/login');
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe('text/html; charset=utf-8');
    });
    test('POST /login/password with valid credentials -> should redirect to /', async () => {
        const response = await request.post('/login/password').set('accept', 'text/html').send({
            username: 'testuser',
            password: 'password'
        });
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
    test('POST /login/password with invalid credentials -> should redirect to /login', async () => {
        const response = await request.post('/login/password').set('accept', 'text/html').send({
            username: 'testuser_invalid',
            password: 'testpassword_invalid'
        });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
});

describe('Test Logout', () => {
    const agent = supertest.agent(app);
    beforeEach(async () => {
        const response = await agent.post('/login/password').set('accept', 'text/html').send({
            username: 'testuser',
            password: 'password'
        });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
    test('GET /logout should redirect to /', async () => {
        const response = await agent.post('/logout').set('accept', 'text/html');
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
});

describe('Test Signup', () => {

    const db: sqlite3.Database = new sqlite3.Database(
        './var/db/sessions.db',
      );
    const testUsername = 'testuser_signup';
    const testPassword = 'password';

    test('GET /signup page should return 200', async () => {
        const response = await request.get('/signup').set('accept', 'text/html');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    });
    test('POST /signup with valid credentials -> should redirect to /', async () => {
        const response = await request.post('/signup').set('accept', 'text/html').send({
            username: testUsername,
            password: testPassword
        });
        expect(response.status).toBe(302);
        expect(response.headers['location']).toBe('/');
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
        // check if the user is created in the database
        db.get('SELECT * FROM users WHERE username = ?', [testUsername], (err, row: UserResult) => {
            if (err) {
                console.error(err.message);
            }
            expect(row).toBeDefined();
            expect(row.id).toBeDefined();
            expect(row.username).toBe(testUsername);
            expect(row.hashed_password).toBeDefined();
            expect(row.salt).toBeDefined();
        });
        // remove the user from the database

        db.run('DELETE FROM users WHERE username = ?', [testUsername], (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    });
});