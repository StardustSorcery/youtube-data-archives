import assert from 'node:assert';
import { MongoDB } from './types/mongodb';
import { TargetsByType } from './types/targets';
import Target from './models/Target';
import { Youtube } from './types/youtube';

const log4js = require('./modules/logger').init();
const logger = log4js.getLogger('default');

async function main() {
  // schedules job for targets
  const {
    CRON_RULE,
  } = process.env;

  const job = require('node-schedule').scheduleJob(CRON_RULE, async () => {
    logger.info('Started archive job.');

    const mongodb: MongoDB = require('./modules/mongodb').init();
    const youtube: Youtube = require('./modules/youtube').init();

    // retrieves list of targets from db
    const targetsByType: TargetsByType = await require('./modules/targets').get(mongodb.collections.targets).catch((err: Error) => {
      logger.error('Failed to retrieve targets from database.');
      throw err;
    });
    logger.info(`Retrieved ${Object.keys(targetsByType).length} type(s) / ${Object.values(targetsByType).reduce((accu, curr): Target[] => [ ...accu, ...curr ], []).length} target(s) from database.`);

    const promises: Promise<any>[] = [];

    if(targetsByType.channel) {
      const targets = targetsByType.channel;
      logger.debug(`Creating snapshot of ${targets.length} YouTube channel(s).`);
      
      promises.push(
        require('./modules/ytChannelSnapshots').create(
          youtube.client,
          mongodb.collections.channels,
          targets,
        ).then(() => {
          logger.info(`Created snapshot of ${targets.length} YouTube channel(s).`);
          return;
        }).catch((err: Error) => {
          logger.error('Failed to create snapshot of YouTube channel(s).');
          logger.error(err.toString());
          return;
        })
      );
    }

    if(targetsByType.video) {
      const targets = targetsByType.video;
      logger.debug(`Creating snapshot of ${targets.length} YouTube video(s).`);
      
      promises.push(
        require('./modules/ytVideoSnapshots').create(
          youtube.client,
          mongodb.collections.videos,
          targets,
        ).then(() => {
          logger.info(`Created snapshot of ${targets.length} YouTube video(s).`);
          return;
        }).catch((err: Error) => {
          logger.error('Failed to create snapshot of YouTube video(s).');
          logger.error(err.toString());
          return;
        })
      );
    }

    await Promise.allSettled(promises).finally(() => {
      return mongodb.client.close();
    });

    logger.info('Completed archive job.');

    return;
  });
  logger.info(`Scheduled a job at cron rule "${CRON_RULE}"`);

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