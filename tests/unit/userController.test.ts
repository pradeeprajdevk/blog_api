import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import * as userService from '../../src/services/userService';
import * as userController from '../../src/controllers/userController';
import { ObjectId } from 'mongodb';

describe('User Controller - Mocha & Sinon Mock Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonStub: sinon.SinonStub;
    let statusStub: sinon.SinonStub;

    beforeEach(() => {
        jsonStub = sinon.stub();
        statusStub = sinon.stub().returns({ json: jsonStub });

        req = {};
        res = { status: statusStub } as Partial<Response>;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all users', async () => {
        const mockUsers: {
            id: ObjectId,
            name: string,
            email: string,
            role: 'user' | 'admin',
            password: string, 
        }[] = [{
            id: new ObjectId(),
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            password: 'hashed_password123',
        }];

        sinon.stub(userService, 'getAllUsers').resolves(mockUsers);

        await userController.getAllUsers(req as Request, res as Response);

        expect(statusStub.calledWith(200)).to.be.true;
        expect(jsonStub.calledWith(mockUsers)).to.be.true;
    });

    it('should return a user by ID', async () => {
        const mockUsers: {
            id: ObjectId,
            name: string,
            email: string,
            role: 'user' | 'admin',
            password: string,
        } = { 
            id: new ObjectId(), 
            name: "John Doe", 
            email: "john@example.com", 
            role: "user",
            password: 'hashed_password123',
        };
        sinon.stub(userService, 'getUserById').resolves(mockUsers);
    });

    it('should update a user', async () => {
        const userId = new ObjectId();
        const updatedUser: {
            id: ObjectId,
            name: string,
            email: string,
            role: 'user' | 'admin',
            password: string
        } = {
            id: new ObjectId(),
            name: 'Updated Name',
            email: 'john@example.com',
            role: 'user',
            password: 'hashedPassword_123'
        };
        sinon.stub(userService, 'updateUser').resolves(updatedUser);

        req.params = { userId: userId.toString() };
        req.body = {  name: 'Updated Name' };
        await userController.updateUser(req as Request, res as Response);

        expect(statusStub.calledWith(200)).to.be.true;
        expect(jsonStub.calledWith(updatedUser)).to.be.true;
    });

    it('should delete a user', async () => {
        const mockUsers: {
            id: ObjectId,
            name: string,
            email: string,
            role: 'user' | 'admin',
            password: string,
        } = { 
            id: new ObjectId(), 
            name: "John Doe", 
            email: "john@example.com", 
            role: "user",
            password: 'hashed_password123',
        };
        sinon.stub(userService, 'deleteUser').resolves(mockUsers);

        req.params = { userId: new ObjectId().toString() };
        await userController.deleteUser(req as Request, res as Response);

        expect(statusStub.calledWith(200)).to.be.true;
        expect(jsonStub.calledWith({ message: "User deleted successfully" })).to.be.true;
    })
});