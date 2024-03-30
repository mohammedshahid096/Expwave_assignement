from flask import Flask,jsonify
from config.mongoConfig import db
from routes.employee_route import employee_routes
from routes.user_route import user_routes
from flask_cors import CORS
# from collections.abc import Iterable

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
rootURL = "/api/v1"

app.register_blueprint(employee_routes, url_prefix= rootURL+'/employee')
app.register_blueprint(user_routes, url_prefix= rootURL+'/user')




if __name__=="__main__":
    app.run(debug=True,port =8000)