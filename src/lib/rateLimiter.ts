import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from './redisClient';

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5, 
  duration: 60 * 5, 
});

export default limiter;
