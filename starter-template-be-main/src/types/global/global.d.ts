/* eslint-disable no-var */
import { Mutex } from 'async-mutex';
import Redis from 'ioredis';
import { Server } from 'socket.io';

declare global {
  var redis: Redis;
  var mutex: Mutex;
  var io: Server;
}
