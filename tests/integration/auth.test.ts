import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/index';
import { AppDataSource } from '../../src/config/database';
import { User } from '../../src/models/User';

describe("Auth API Integration Tests", () => {   

    before(async() => {
        try {
            console.log('Initializing database connection...');
            if (!AppDataSource.isInitialized) {
                console.log("DB Intialising");
                await AppDataSource.initialize();
            }
            console.log('Database initialized:', AppDataSource.isInitialized);

            const userRepo = AppDataSource.getMongoRepository(User);

            const userCount = await userRepo.count();  // Check if there are users in the collection
            if (userCount === 0) {
                // You can also add a dummy user if the collection isn't created yet
                await userRepo.save({
                    name: 'Dummy User',
                    email: 'dummy@example.com',
                    password: 'Password@123',
                    role: 'user'
                });
            }

            await userRepo.clear(); // Clear all users before tests
        } catch (e) {
            console.error('Error initializing database connection:', e);
        } 
    });

    beforeEach(async () => {
        try {
            const userRepo = AppDataSource.getMongoRepository(User);
            const userCount = await userRepo.count();  // Check if there are users in the collection
            if (userCount > 0) {
                await userRepo.clear(); // Clear users before each test
            }
        } catch(e) {
            console.error('Error during cleanup:', e);
        }
    });

    after(async () => {
        try {
            const userRepo = AppDataSource.getMongoRepository(User);
            const userCount = await userRepo.count();  // Check if there are users in the collection
            if (userCount > 0) {
                await userRepo.clear(); // Clear up after tests
            }
        } catch(e) {
            console.error('Error during cleanup:', e);
        }
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Jhon Doe',
                email: 'johndoe@example.com',
                password: 'Password@123',
                role: 'user'
            });
        
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'johndoe@example.com',
                password: 'wrongpassword'
            });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Invalid credentials");
    });

    it('should login with correct credentials', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                password: 'Password@123',
                role: 'user'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'janedoe@example.com',
                password: 'Password@123'
            });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });

    it('should not register a user with an existing email', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'Password@123',
                role: 'user'
            });

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'Password@123',
                role: 'user'
            });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Email already registered");
    });
});
