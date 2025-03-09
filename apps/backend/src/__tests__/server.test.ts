import request from 'supertest';
import app from '../server';

describe('Server', () => {
    describe('GET /', () => {
        it('should return welcome message', async () => {
            const response = await request(app).get('/');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Backend is running with TypeScript!"
            });
        });
    });
}); 