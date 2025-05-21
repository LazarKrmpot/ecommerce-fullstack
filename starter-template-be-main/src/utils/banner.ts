import { forEach } from 'lodash';

import { env } from 'env';
import { SUB_SWAGGER_KEYS } from 'loaders/swagger.loader';

import { getURL } from './getURL';
import { Logger } from './logger';

export function banner(log: Logger): void {
  if (env.app.banner) {
    log.info(``);
    log.info(
      `Greetings, your app is ready on ${getURL()}${env.app.routePrefix}`,
    );
    log.info(`To shut it down, press <CTRL> + C at any time.`);
    log.info(``);
    log.info('-------------------------------------------------------');
    log.info(`Environment  : ${env.node}`);
    log.info(`Version      : ${env.app.version}`);
    log.info(``);
    log.info(`API Info     : ${getURL()}${env.app.routePrefix}`);

    if (env.swagger.enabled && SUB_SWAGGER_KEYS.length) {
      log.info(`Swaggers     : `);
      forEach(SUB_SWAGGER_KEYS, (swaggerKey) => {
        log.info(`        -  ${getURL()}${swaggerKey}${env.swagger.route}`);
      });
    }
    log.info('-------------------------------------------------------');
    log.info('');
  } else {
    log.info(`Application is up and running.`);
  }
}
