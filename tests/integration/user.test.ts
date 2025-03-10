import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/index';
import { AppDataSource } from '../../src/config/database';
import { User } from '../../src/models/User';

describe("User API Integration Tests", () => {
    const userRepo = AppDataSource.getRepository(User);
    let authToken: string;
    let testUserId: string;

    before (async () => {
        try {
            console.log('Initializing database connection from user...');
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }

            // Create a test user and get a token
            const res = await request(app).post("/api/auth/signup").send({
                name: "Test User",
                email: "testuser@example.com",
                password: "Password@123",
                role: "admin",
            });

            authToken = res.body.token;
            testUserId = res.body.id;
        } catch(e) {
            console.error('Error initializing database connection from user:', e);
        }
    });

    after(async () => {
        try {
            await userRepo.clear();
        } catch(e) {
            console.error('Error during cleanup:', e);
        }
    });

    it('should fetch all users (Admin Only)', async () => {
        console.log("authToken", authToken);
        const res = await request(app)
            .get('/api/users/')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it("should update the user", async () => {
        console.log("testUserId", testUserId);
        console.log("authToken", authToken);
        const res = await request(app)
          .put(`/api/users/${testUserId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({ name: "Updated User" });
    
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("Updated User");
    });

    it("should delete the user", async () => {
        const res = await request(app)
          .delete(`/api/users/${testUserId}`)
          .set("Authorization", `Bearer ${authToken}`);
    
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("User deleted successfully");
    });
});