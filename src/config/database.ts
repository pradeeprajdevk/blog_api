import "reflect-metadata";
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI ?? "mongodb://localhost:27017/blog",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    logging: true,
    entities: ["src/models/*.ts"],
});