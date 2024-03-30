from flask import Blueprint,jsonify,request
from config.mongoConfig import COLLECTION_EMPLOYEE
from bson import ObjectId 
from uuid import uuid4
import os
from middleware0.auth_middleware import Authentication,Authorization


employee_routes = Blueprint('employee_routes', __name__)


@employee_routes.route("/all")
@Authentication
def get_employees(id,role):
    allDoc = COLLECTION_EMPLOYEE.find()
    allemployees = list(allDoc)
    for doc in allemployees:
        doc['_id'] = str(doc['_id'])

    data  = {"success":True,"statusCode":200,"data":allemployees}

    return jsonify(data)

    
@employee_routes.route('/<string:employeeid>', methods=['GET'])
@Authentication
def get_single_data(id,role,employeeid):
     # Retrieve a single document from MongoDB based on the provided ObjectId
    data_from_mongodb = COLLECTION_EMPLOYEE.find_one({'_id': ObjectId(employeeid)})
    
    if data_from_mongodb:
        # Convert ObjectId to string for JSON serialization
        data_from_mongodb['_id'] = str(data_from_mongodb['_id'])
        
        # Convert data to JSON
        json_data = jsonify({"success":True,"statusCode":200, "data":data_from_mongodb})
        return json_data
    else:
        return jsonify({'error': 'Document not found'}), 404


@employee_routes.route('delete/<string:employeeid>', methods=['DELETE'])
@Authentication
@Authorization("admin")
def delete_single_data(id,role,employeeid):
    try:
        # Assuming you have a field 'image_path' in your employee documents
        data = COLLECTION_EMPLOYEE.find_one_and_delete({'_id': ObjectId(employeeid)})
        if not data:
            return jsonify({'success': False, 'message': 'Employee not found'}), 404
        
        # Delete the image file from the photos folder
        image_path = os.path.join(os.getcwd(),"static","photos",data["image"])
        if os.path.isfile(image_path):
            os.remove(image_path)
        
        return jsonify({'success': True, 'message': 'Employee deleted',"statusCode":200}), 200
    except Exception as e:
        return jsonify({'success': False, 'statusCode': 500, 'message': str(e)}), 500


@employee_routes.route('/update/<string:employeeid>', methods=['PUT'])
@Authentication
@Authorization("admin")
def update_single_data(id,role,employeeid):
    try:
        req_body = request.json
        print(employeeid)
        if req_body["change"]:
            is_email_exist = COLLECTION_EMPLOYEE.find_one({'email': req_body['email']})
            if is_email_exist:
                return jsonify({'success': False, 'message': 'Email already exists',"statusCode":400}), 400
         
        # Update employee data
        del req_body["change"]
        data = COLLECTION_EMPLOYEE.find_one_and_update({'_id': ObjectId(employeeid)},{'$set': req_body },return_document=True ,upsert=False)
        print(data)
        if not data:
            return jsonify({'success': False, 'message': 'Employee not found'}), 404
        
        data["_id"] = str(data["_id"])
        return jsonify({'success': True, 'message': 'Employee updated', 'data': data}), 200
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': str(e),"statusCode":500}), 500


@employee_routes.route('/profile/<string:employeeid>', methods=['PUT'])
@Authentication
@Authorization("admin")
def update_photo_data(id,role,employeeid):
    try:
         # Assuming you have a file upload mechanism and req.file contains uploaded image
        data_from_mongodb = COLLECTION_EMPLOYEE.find_one({'_id': ObjectId(employeeid)})
        print(data_from_mongodb)
        del data_from_mongodb["_id"]

        image = request.files["ProfileAvatar"]
        if image:
            profile = request.files["ProfileAvatar"]
            profileName = profile.filename.rsplit('.', 1)
            profileName = str(uuid4())+"."+profileName[1]
            uploadpath = os.path.join(os.getcwd(),"static","photos",profileName)
            profile.save(uploadpath)
            data_from_mongodb["image"] =profileName

         
        # Update employee data
        data = COLLECTION_EMPLOYEE.find_one_and_update({'_id': ObjectId(employeeid)}, {'$set': data_from_mongodb})

        if not data:
            return jsonify({'success': False, 'message': 'Employee not found'}), 404
        
        data["_id"] = str(data["_id"])
        image_path = os.path.join(os.getcwd(),"static","photos",data["image"])
        if os.path.isfile(image_path):
            os.remove(image_path)
        
        return jsonify({'success': True, 'message': 'Employee updated', 'data': data}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@employee_routes.route("/add",methods=["POST"])
def Add_Employee():
   try:
        data = request.form

        AlreadyExist = COLLECTION_EMPLOYEE.find_one({"email":data.get("email")})
        print(AlreadyExist)
        if AlreadyExist :
            return jsonify({"success":False,"message":"employee already exist","statusCode":400}),400

        profile = request.files["ProfileAvatar"]
        profileName = profile.filename.rsplit('.', 1)
        profileName = str(uuid4())+"."+profileName[1]
        uploadpath = os.path.join(os.getcwd(),"static","photos",profileName)
        profile.save(uploadpath)

        NewEmployee = {
            "name": data.get("name"),
            "email": data.get("email"),
            "image": profileName,
            "mobile": data.get("mobile"),
            "designation": data.get("designation"),
            "gender": data.get("gender"),
            "course": data.get("course")
        }
        addedData = COLLECTION_EMPLOYEE.insert_one(NewEmployee)
        jsonData = {
                    "success": True,
                    "message": "New employee created successfully",
                    "data": str(addedData.inserted_id)
                    }
        return jsonify(jsonData),201
   except Exception as error:
       return jsonify({"success":False,"message":str(error),"statusCode":500}),500
   

@employee_routes.route("/dashboard/graph")
@Authentication
def dashboard_controller(id,role):
    try:
        gender_distribution = list(COLLECTION_EMPLOYEE.aggregate([
            {"$group": {"_id": "$gender", "count": {"$sum": 1}}}
        ]))

        designation_distribution = list(COLLECTION_EMPLOYEE.aggregate([
            {"$group": {"_id": "$designation", "count": {"$sum": 1}}}
        ]))

        course_distribution = list(COLLECTION_EMPLOYEE.aggregate([
            {"$group": {"_id": "$course", "count": {"$sum": 1}}}
        ]))

        gender_wise_course = list(COLLECTION_EMPLOYEE.aggregate([
            {"$group": {"_id": {"course": "$course", "gender": "$gender"}, "count": {"$sum": 1}}},
            {"$project": {"_id": 0, "course": "$_id.course", "gender": "$_id.gender", "count": 1}}
        ]))

        gender_wise_designation = list(COLLECTION_EMPLOYEE.aggregate([
            {"$group": {"_id": {"designation": "$designation", "gender": "$gender"}, "count": {"$sum": 1}}},
            {"$project": {"_id": 0, "designation": "$_id.designation", "gender": "$_id.gender", "count": 1}}
        ]))

        return jsonify({
            'success': True,
            'statusCode': 200,
            'genderDistribution': gender_distribution,
            'designationDistribution': designation_distribution,
            'courseDistribution': course_distribution,
            'genderWiseCourse': gender_wise_course,
            'genderWiseDesignation': gender_wise_designation
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e), 'statusCode': 500}), 500
