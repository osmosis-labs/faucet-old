import os

# Mnemonic of the faucet account
MNEMONIC = os.environ.get('MNEMONIC')

# How much money to send to each address
FUNDING_AMOUNT = int(os.environ.get('FUNDING_AMOUNT', '100000000'))

# Maximum amount of money to send to each address
MAX_FUNDING_AMOUNT = int(os.environ.get('MAX_FUNDING_AMOUNT', '300000000'))

# Maximum number of requests per IP address
MAX_REQUESTS_PER_IP = int(os.environ.get('MAX_REQUESTS_PER_IP', '20'))

# Port to run the server on
PORT = int(os.environ.get('PORT', 5000))

# Chain informations
CHAIN_ID = os.environ.get('CHAIN_ID', 'localosmosis')
REST_NODE = os.environ.get('REST_NODE', 'http://localhost:1317')
DENOM = os.environ.get('DENOM', 'uosmo')
ADDRESS_PREFIX = os.environ.get('ADDRESS_PREFIX', 'osmo')

# Redis connection
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


