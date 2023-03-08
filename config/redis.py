import os
import redis

def initialize_redis():
    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
    REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

    try:
        redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
        # check if Redis connection is successful
        redis_client.ping()
        return redis_client
    except redis.ConnectionError as e:
        print(f"Error connecting to Redis: {e}")
        # raise an exception if connection fails
        raise
