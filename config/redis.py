from config import REDIS_HOST, REDIS_PORT
import redis

def initialize_redis():

    try:
        redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
        # check if Redis connection is successful
        redis_client.ping()
        return redis_client
    except redis.ConnectionError as e:
        print(f"Error connecting to Redis: {e}")
        # raise an exception if connection fails
        raise
