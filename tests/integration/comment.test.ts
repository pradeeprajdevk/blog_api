import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/index';
import { AppDataSource } from '../../src/config/database';
import { Post } from "../../src/models/Post";
import { User } from "../../src/models/User";
import { Comment } from '../../src/models/Comment';

describe('Comment API Integration Tests', () => {
    const commentRepo = AppDataSource.getMongoRepository(Comment);
    const postRepo = AppDataSource.getMongoRepository(Post);
    const userRepo = AppDataSource.getMongoRepository(User);
    let authToken: string;
    let testCommentId: string;
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
            role: "user",
        });

        authToken = userRes.body.token;
        
        // Create a test post
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Post',
                content: 'This is a test post'
            });
        
        testPostId = postRes.body.id;

        // Create  a comment
        const commentRes = await request(app)
            .post(`/api/post/${testPostId}/comments`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                content: 'This is a test comment'
            });

        testCommentId = commentRes.body.id;
    });

    after(async () => {
        try {
            await commentRepo.clear();
            await postRepo.clear();
            await userRepo.clear();
        } catch(e) {
            console.error('Error during cleanup:', e);
        }
    });

    it("should fetch all comments for a post", async () => {
        const res = await request(app).get(`/api/post/${testPostId}/comments`);
    
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    it("should delete a comment (owner only)", async () => {
        const res = await request(app)
          .delete(`/api/post/comments/${testCommentId}`)
          .set("Authorization", `Bearer ${authToken}`);
    
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Comment deleted successfully");
    });
});