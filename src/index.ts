import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import "reflect-metadata";
import { AppDataSource } from './config/database';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

const PORT = process.env.PORT ?? 5000;

AppDataSource.initialize()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    })
    .catch((e: any) => console.log("Error connecting to DB:", e));