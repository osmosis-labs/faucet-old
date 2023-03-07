from flask import Flask
from flask import request, jsonify, render_template
import redis

app = Flask(__name__, static_url_path='/static')

@app.route('/fund', methods=['GET'])
def fund():
    address = request.args.get('address')
    mock_data = {
        'address': address,
        'amount': '100 OSMO'
    }
    return jsonify(mock_data)

@app.route("/")
def index():
    return render_template('index.html')

