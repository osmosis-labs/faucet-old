from flask import Flask
from flask import request, jsonify, render_template

app = Flask(__name__, static_url_path='/static')

@app.route('/fund', methods=['GET', 'POST'])
def fund():
    data = request.json
    print(data)
    return jsonify(data)

@app.route("/")
def index():
    return render_template('index.html')

