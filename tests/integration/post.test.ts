import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/index';
import { AppDataSource } from '../../src/config/database';
import { Post } from "../../src/models/Post";
import { User } from "../../src/models/User";

describe('Post API Integration Tests', () => {
    const postRepo = AppDataSource.getMongoRepository(Post);
    const userRepo = AppDataSource.getMongoRepository(User);
    let authToken: string;
    let testPostId: string;

    before(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Create a test user and get a token
        const userRes = await request(app).post("/api/auth/signup").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "Password@123",
            role: "admin",
        });

        authToken = userRes.body.token;

        // Create a post
        const postRes = await request(app)
            .post("/api/posts")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Test Post",
                content: "This is a test post",
            });

        testPostId = postRes.body.id;
    });

    after(async () => {
        try {
            await postRepo.clear();
            await userRepo.clear();
        } catch(e) {
            console.error('Error during cleanup:', e);
        }
    });

    it("should fetch all posts", async () => {
        const res = await request(app).get("/api/posts");
    
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    it("should update a post (owner only)", async () => {
        const res = await request(app)
          .put(`/api/posts/${testPostId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({ title: "Updated Title" });
    
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal("Updated Title");
    });

    it("should delete a post (owner only)", async () => {
        const res = await request(app)
          .delete(`/api/posts/${testPostId}`)
          .set("Authorization", `Bearer ${authToken}`);
    
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Post deleted successfully");
    });
});