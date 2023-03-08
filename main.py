from flask import Flask
from flask import request, jsonify, render_template
from werkzeug.exceptions import BadRequest

from datetime import datetime

from utils.utils import is_valid_osmosis_address
from config.redis import initialize_redis
from config.wallet import initialize_wallet
from config.ledger_client import initialize_ledger_client
from config.config import FUNDING_AMOUNT, MAX_FUNDING_AMOUNT, MAX_REQUESTS_PER_IP, PORT

app = Flask(__name__, static_url_path='/static')

@app.before_first_request
def run_on_startup():
    global redis_client, wallet, ledger_client

    # Set up Redis connection
    redis_client = initialize_redis()

    # Set up wallet
    wallet = initialize_wallet()

    # Create client
    ledger_client = initialize_ledger_client()


@app.route('/fund', methods=['GET'])
def fund():
    try:
        osmosis_address = request.args.get('address')

        if not osmosis_address:
            app.logger.error("Osmosis address is required")
            raise BadRequest('Osmosis address is required')

        if not is_valid_osmosis_address(osmosis_address):
            app.logger.error("Osmosis address is invalid")
            raise BadRequest('Osmosis address is invalid')
        
        app.logger.info(f"Received funding request for address: {osmosis_address}")

        # Check 1: Check if the address has already been funded in the last 24 hours
        if redis_client.get(osmosis_address):
            raise BadRequest('Osmosis address already funded in the last 24 hours')
        
        # Check 2: Check if the address has already enough uosmo
        balance = ledger_client.query_bank_balance(osmosis_address)
        app.logger.debug(f"Address balance: {balance}")

        if balance >= MAX_FUNDING_AMOUNT:
            app.logger.info(f"Address already funded. Balance: {balance}")
            raise BadRequest('Osmosis has already enough tokens')
        
        # Check 3: Check the number of requests made by that IP in the last 24 hours
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        ip_key = f"{ip_address}:{datetime.now().strftime('%Y-%m-%d')}"
        ip_count = redis_client.get(ip_key)

        if ip_count is not None and int(ip_count) >= MAX_REQUESTS_PER_IP:
            app.logger.info(f"IP address has already made {MAX_REQUESTS_PER_IP} requests. IP: {ip_address}")
            raise BadRequest('Too many requests from your IP address')
        
        # Increment the number of requests made by this IP
        redis_client.incr(ip_key)
        # Expire the key after 24 hours
        redis_client.expire(ip_key, 86400)

        # Check 4: Check the amount of uosmo sent in the last 24 hours by the faucet overall
        # TODO: Implement this

        # Fund the address
        app.logger.debug("Sending funds to address...")
        tx = ledger_client.send_tokens(osmosis_address, FUNDING_AMOUNT, "uosmo", wallet)
        app.logger.debug("Funds sent.")

        # block until the transaction has been successful or failed
        app.logger.debug("Waiting for transaction...")
        tx.wait_to_complete()
        app.logger.info(f"Successfully funded Osmosis address: {osmosis_address}")

        # Mark the address as funded in Redis
        redis_client.setex(osmosis_address, 86400, 'funded')

        return jsonify({'message': 'Successfully funded Osmosis address: {}'.format(osmosis_address)})
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error: {}'.format(str(e))}), 500


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=False, port=PORT)
