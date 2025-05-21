import { useContainer as classValidatorUseContainer } from 'class-validator';
import { useContainer as cronUseContainer } from 'cron-typedi-decorators';
import { MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

// import { useContainer as ormUseContainer } from 'typeorm';

export const iocLoader: MicroframeworkLoader = () => {
  /**
   * Setup routing-controllers to use typedi container.
   */
  cronUseContainer(Container);
  routingUseContainer(Container);
  classValidatorUseContainer(Container);
};
