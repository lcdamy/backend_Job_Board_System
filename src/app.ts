import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swaggerConfig';
import expressWinston from 'express-winston';

import { auditLogger } from './middlewares/auditLogger';
import { connectDB } from './config/db';
import { createTablesIfNotExist } from './database/init';
import { checkDatabaseExists, runInitialDatabaseSetup, ensureDataDirectory } from './database/dbUtils';
import logger from './config/logger';
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
    app.set('trust proxy', true);
};

const configureRoutes = () => {
    const publicPath = path.resolve(__dirname, '..', 'public');
    app.use(express.static(publicPath));

    app.use('/api', routes);
    app.use((req, res, next) => {
        const requestedPath = path.join(publicPath, req.path);
        if (req.path !== '/' && !req.path.startsWith('/api') && !req.path.endsWith('.html')) {
            console.log(`🔍 Checking for static file: ${requestedPath}`);
        }
        next();
    });

    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

};

const startServer = async () => {
    try {
        require(path.join(__dirname, 'cronjobs', 'schedules'));
        ensureDataDirectory();
        const isFirstRun = !checkDatabaseExists();
        console.log(`🔍 Database exists: ${!isFirstRun}`);
        await connectDB();

        if (isFirstRun) {
            console.log('🆕 First time setup detected - running migrations and seeds...');
            await runInitialDatabaseSetup();
        } else {
            console.log('♻️  Existing database detected - ensuring schema is up to date...');
            await createTablesIfNotExist();
        }

        configureMiddlewares();
        configureRoutes();

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