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
import { checkDatabaseExists, runInitialDatabaseSetup, ensureDataDirectory } from './database/dbUtils';
import expressWinston from 'express-winston';
import logger from './config/logger';
import helmet from 'helmet';
import routes from './routes';

dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

const app = express();
const server = http.createServer(app);


const configureMiddlewares = () => {
    app.use(express.json());
    app.use(cors({ origin: '*' }));
    app.use(helmet());
    app.use(expressWinston.logger({ winstonInstance: logger, statusLevels: true }));
    app.use(auditLogger);
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('trust proxy', true);
};

const configureRoutes = () => {
    app.use('/api', routes); // Main API routes
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecs)); // Swagger docs
    app.get('/public/:file', (req, res) => {
        const filePath = path.resolve(__dirname, '..', 'public', req.params.file);
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
        // Load cron jobs
        require(path.join(__dirname, 'cronjobs', 'schedules'));

        // Ensure data directory exists
        ensureDataDirectory();

        // Check if this is the first time running (no database exists)
        const isFirstRun = !checkDatabaseExists();
        console.log(`🔍 Database exists: ${!isFirstRun}`);

        // Connect to database
        await connectDB();

        if (isFirstRun) {
            // First time setup: run migrations and seeds
            console.log('🆕 First time setup detected - running migrations and seeds...');
            await runInitialDatabaseSetup();
        } else {
            // Existing database: just ensure tables exist (in case of schema changes)
            console.log('♻️  Existing database detected - ensuring schema is up to date...');
            await createTablesIfNotExist();
        }

        // Configure middlewares and routes
        configureMiddlewares();
        configureRoutes();

        // Start the server
        server.listen(port, () => {
            console.log(`🚀 Server running at http://${host}:${port}`);
            console.log(`📘 Swagger docs available at http://${host}:${port}`);
            if (isFirstRun) {
                console.log(`🎉 Welcome! Your database has been set up for the first time.`);
                console.log(`📧 Check the console above for admin credentials.`);
            }
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}