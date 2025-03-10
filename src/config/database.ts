import "reflect-metadata";
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { config } from "../config";

console.log("MONGOURI", config.MONGO_URI);

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: config.MONGO_URI,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: [User, Post, Comment],
    logger: 'advanced-console', // This will log in a more detailed format
});