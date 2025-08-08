import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { auditLogger } from './middlewares/auditLogger';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swaggerConfig';
import { connectDB } from './config/db';
import { createTablesIfNotExist } from './database/init';
import expressWinston from 'express-winston';
import logger from './config/logger';
import helmet from 'helmet';
import routes from './routes';
dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';
const frontendHost = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();
const server = http.createServer(app);

const allowedOrigins = [frontendHost];

const configureMiddlewares = () => {
    app.use(express.json());
    // app.use(cors({ origin: '*' }));
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
    }));
    app.use(helmet());
    app.use(expressWinston.logger({ winstonInstance: logger, statusLevels: true }));
    app.use(auditLogger);
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('trust proxy', true);
};

const configureRoutes = () => {
    app.use('/api', routes); // Main API routes
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecs)); // Swagger docs
    app.get('/uploads/:file', (req, res) => {
        const filePath = path.resolve(__dirname, '..', 'uploads', req.params.file);
        res.download(filePath, req.params.file, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                const statusCode = (err as any).status || 500;
                res.status(statusCode).end();
            } else {
                console.log('File downloaded:', req.params.file);
            }
        });
    });

};

const startServer = async () => {
    try {
        require(path.join(__dirname, 'cronjobs', 'schedules'));
        await connectDB();
        await createTablesIfNotExist(); // Initialize database tables
        configureMiddlewares();
        configureRoutes();
        server.listen(port, () => {
            console.log(`🚀 Server running at http://${host}:${port}`);
            console.log(`📘 Swagger docs available at http://${host}:${port}`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
    }
};

if (require.main === module) {
    startServer();
}

