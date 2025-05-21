import { Mutex } from 'async-mutex';
import { MicroframeworkLoader } from 'microframework-w3tec';

export const mutexLoader: MicroframeworkLoader = () => {
  global.mutex = new Mutex();
};
