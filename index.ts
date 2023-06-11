import assert from 'node:assert';
import { MongoDB } from './types/mongodb';
import { TargetsByType } from './types/targets';
import Target from './models/Target';

const log4js = require('./modules/logger').init();
const logger = log4js.getLogger('default');

async function main() {
  const mongodb: MongoDB = require('./modules/mongodb').init();

  // retrieves list of targets from db
  const targetsByType: TargetsByType = await require('./modules/targets').get(mongodb.collections.targets).catch((err: Error) => {
    logger.error('Failed to retrieve targets from database.');
    throw err;
  });
  logger.debug(`Retrieved ${Object.keys(targetsByType).length} type(s) / ${Object.values(targetsByType).reduce((accu, curr): Target[] => [ ...accu, ...curr ], []).length} target(s) from database.`);

  // schedules job for targets
  const {
    CRON_RULE,
  } = process.env;

  const job = require('node-schedule').scheduleJob(CRON_RULE, () => {
    if(targetsByType.channel) {
      const targets = targetsByType.channel;
      console.log(targets.map(target => target.ids.channelId).join(', '));
    }

    return;
  });
  logger.debug(`Scheduled a job at cron rule "${CRON_RULE}"`);

  return job;
}


function shutdown(code?: number) {
  logger.info('Shutting down...');
  return require('node-schedule').gracefulShutdown().then(() => {
    return process.exit(code);
  }).catch((err: Error) => {
    logger.error('Failed to shutdown scheduled jobs.');
    logger.error(err.toString());
    return process.exit(1);
  });
}


// Launch
main().then(() => {
  logger.info('Completed initialization.');
  return;
}).catch(err => {
  logger.error(err.toString());
  return shutdown(1);
})

// Signal
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGQUIT', shutdown);