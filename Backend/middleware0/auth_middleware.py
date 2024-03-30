from flask import jsonify,request,make_response
import jwt
from functools import wraps


def Authentication(fun):
     @wraps(fun)
     def decorated(*args,**kwargs):
         try:
            access_token = request.cookies.get('access_token')
            if not access_token:
               return jsonify({"success":False,"statusCode":401 ,"message": "Not authenticated"}), 401
          
            decodeToken = jwt.decode(access_token,"shahid1245424","HS256")
            kwargs["id"] = decodeToken["id"]
            kwargs["role"] = decodeToken["role"]
            return fun(*args, **kwargs) 
         except jwt.DecodeError as e:
            response = make_response(jsonify({"success":False,"message":str(e),"statusCode":401}),401)
            response.delete_cookie('access_token')
            return response
         except jwt.ExpiredSignatureError as e:
            response = make_response(jsonify({"success":False,"message":str(e),"statusCode":401}),401)
            response.delete_cookie('access_token')
            return response        
         except Exception as e:
            return jsonify({"success":False,"message":str(e),"statusCode":500}),500
     return decorated


def Authorization(*roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user_role = kwargs.get("role")  # Assuming role is passed as a keyword argument
            if user_role not in roles:
                return jsonify({'success': False, 'message': 'Not authorized'}), 401
            return func(*args, **kwargs)
        return wrapper
    return decorator