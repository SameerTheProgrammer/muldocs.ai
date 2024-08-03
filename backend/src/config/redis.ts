import Redis from "ioredis";
import env from "./dotenv";
const redisConnection = new Redis(env.REDIS_SERVICE_URI);

export default redisConnection;
