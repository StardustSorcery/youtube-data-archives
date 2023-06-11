import assert from 'node:assert';
import { MongoDB } from './types/mongodb';
import Target from './models/Target';

const log4js = require('./modules/logger').init();
const logger = log4js.getLogger('default');

async function main() {
  const mongodb: MongoDB = require('./modules/mongodb').init();

  // retrieves list of targets from db
  const targets: Target[] = await require('./modules/targets').get(mongodb.collections.targets).catch((err: Error) => {
    logger.error('Failed to retrieve targets from database.');
    throw err;
  });
  logger.debug(`Retrieved ${targets.length} target(s) from database.`);

  // schedules jobs based on targets
  const schedule = require('node-schedule');
  targets.forEach((target) => {
    let method;

    switch(target.type) {
      default: {
        logger.warn(`Specified target type "${target.type}" is not supported.`);
        logger.debug(`Skipped scheduling job. (ID: ${target._id?.toString()})`);
        return;
      }
      case 'channel': {
        assert(target.ids.channelId);

        method = () => {
          console.log(target.ids.channelId);
        };
      }
    }

    const job = schedule.scheduleJob(target.schedule, method);

    logger.debug(`Scheduled job. (ID: ${target._id?.toString()})`);

    return job;
  });
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