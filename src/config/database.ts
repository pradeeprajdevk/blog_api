import "reflect-metadata";
import { DataSource } from 'typeorm';
import { User } from "../models/User";
import { Post } from "../models/Post";

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI ?? "mongodb://localhost:27017/blog",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: [User, Post],
    logger: 'advanced-console', // This will log in a more detailed format
});