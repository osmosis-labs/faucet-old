import os
import logging


from flask import Flask
from flask import request, jsonify, render_template
from werkzeug.exceptions import BadRequest

from config.redis import initialize_redis
from config.wallet import initialize_wallet
from config.ledger_client import initialize_ledger_client

app = Flask(__name__, static_url_path='/static')

# Set up logging
logging.basicConfig(level=logging.INFO)

@app.before_first_request
def run_on_startup():
    global redis_client, wallet, ledger_client
    global FUNDING_AMOUNT, MAX_FUNDING_AMOUNT

    # Set up Redis connection
    redis_client = initialize_redis()

    # Set up wallet
    wallet = initialize_wallet()

    # Create client
    ledger_client = initialize_ledger_client()

    # Other configuration variables
    FUNDING_AMOUNT = int(os.environ.get('FUNDING_AMOUNT', '100000000'))
    MAX_FUNDING_AMOUNT = int(os.environ.get('MAX_FUNDING_AMOUNT', '300000000'))

def is_valid_osmosis_address(address: str) -> bool:
    if len(address) != 43 or not address.startswith("osmo"):
        return False

    alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    for i in range(4, 43):
        if address[i] not in alphabet:
            return False
    return True

@app.route('/fund', methods=['GET'])
def fund():
    try:
        osmosis_address = request.args.get('address')

        if not osmosis_address:
            logging.error("Osmosis address is required")
            raise BadRequest('Osmosis address is required')

        if not is_valid_osmosis_address(osmosis_address):
            logging.error("Osmosis address is invalid")
            raise BadRequest('Osmosis address is invalid')
        
        logging.info(f"Received funding request for address: {osmosis_address}")

        # Check 1: Check if the address has already been funded in the last 24 hours
        if redis_client.get(osmosis_address):
            raise BadRequest('Osmosis address already funded in the last 24 hours')
        
        # Check 2: Check if the address has already enough uosmo
        balance = ledger_client.query_bank_balance(osmosis_address)
        logging.debug(f"Address balance: {balance}")

        if balance >= MAX_FUNDING_AMOUNT:
            logging.info(f"Address already funded. Balance: {balance}")
            raise BadRequest('Osmosis has already enough tokens')
        
        # Check 3: Check the number of requests made by that IP in the last 24 hours
        # TODO: Implement this

        # Check 4: Check the amount of uosmo sent in the last 24 hours by the faucet overall
        # TODO: Implement this

        # Fund the address
        logging.debug("Sending funds to address...")
        tx = ledger_client.send_tokens(osmosis_address, FUNDING_AMOUNT, "uosmo", wallet)
        logging.debug("Funds sent.")

        # block until the transaction has been successful or failed
        logging.debug("Waiting for transaction...")
        tx.wait_to_complete()
        logging.info(f"Successfully funded Osmosis address: {osmosis_address}")
        

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
    app.run(debug=False)