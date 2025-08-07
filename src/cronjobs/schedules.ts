const cron = require('node-cron');
import logger from '../config/logger';

// Schedule a task to run every minute
cron.schedule('0 * * * *', async () => {
    logger.info('🔄 Cron job running every hour to keep Render free version awake');
});

module.exports = {};
