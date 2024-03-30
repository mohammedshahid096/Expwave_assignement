from flask import Blueprint,jsonify,request,make_response
from config.mongoConfig import COLLECTION_USER
from bson import ObjectId 
import bcrypt
import jwt
import datetime
from middleware0.auth_middleware import Authentication



user_routes = Blueprint('user_routes', __name__)



@user_routes.route("/login",methods = ["POST"])
def login_controller():

     email = request.json.get("email")
     password = request.json.get("password")

     if not email or not password:
          return jsonify({"success":False,"message":"email or password required"})
     

     userExist  = COLLECTION_USER.find_one({"email":email})

     if not userExist:
          return jsonify({"message": "Email or password not found","success":False}), 404
     
     userExist["_id"] = str(userExist["_id"])

     isPasswordCorrect =bcrypt.checkpw(password.encode('utf-8'), userExist["password"].encode("utf-8"))
     if not isPasswordCorrect:
          return jsonify({"message": "Email or password not found","success":False}), 404

     payload  = { 
          "id": str(userExist["_id"]),
          "role":userExist["role"],
          'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=45)
          }
     token =  jwt.encode(payload,"shahid1245424","HS256")

     data ={
          "success":True,
          "message":"successfully login",
          "user":userExist,
          "token" :token
     }  

     response = make_response(jsonify(data))

     expires = 1 * 86400  # Convert days to seconds
     http_only = True
     same_site = "None"  # For cross-site requests
     secure = True
     # Set the cookie
     response.set_cookie(
        "access_token",
        value=token,
        max_age=expires,
        httponly=http_only,
        samesite=same_site,
        secure=secure
    )

     return response

@user_routes.route("/logout")
@Authentication
def logout_controller(id,role):
     response = make_response(jsonify({"success":True,"message":"successfully logout","statusCode":200}),200)
     response.delete_cookie('access_token')
     return response 

@user_routes.route('/me')
@Authentication
def my_details(id,role):
    try:
     data_from_mongodb = COLLECTION_USER.find_one({'_id': ObjectId(id)})
     
     if data_from_mongodb:
          data_from_mongodb['_id'] = str(data_from_mongodb['_id'])          
          json_data = jsonify({"success":True,"statusCode":200,"data": data_from_mongodb})
          return json_data
     else:
          return jsonify({'message': 'Document not found'}), 404
     
    except  Exception:
         return jsonify({"success":False,"message":str(Exception)}),500

