const cron = require('node-cron');
import logger from '../config/logger';
import { JobService } from '../services/jobService';

// Schedule a task to run every midnight to update the job by checking if the deadline has passed
cron.schedule('0 0 * * *', async () => {
    const jobService = new JobService();
    await jobService.updateJobsByDeadline();
    logger.info('🔄 Cron job running every midnight to update jobs by deadline');
});

module.exports = {};
