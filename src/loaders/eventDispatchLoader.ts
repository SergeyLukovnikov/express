import glob from 'glob';
import {MicroframeworkLoader, MicroframeworkSettings} from 'microframework-w3tec';
// import {CronJob} from 'cron';

import {env} from '../env';

/**
 * eventDispatchLoader
 * ------------------------------
 * This loads all the created subscribers into the project, so we do not have to
 * import them manually
 */
export const eventDispatchLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  // const cronJob = new CronJob('1 * * * * *', () => {
  //   console.log('You will see this message every second');
  //   console.log(cronJob.nextDate());
  // }, undefined, false, 'America/Los_Angeles');
  //
  // cronJob.start();

  if (settings) {
    const patterns = env.app.dirs.subscribers;
    patterns.forEach((pattern) => {
      glob(pattern, (err: any, files: string[]) => {
        for (const file of files) {
          require(file);
        }
      });
    });
  }
};
