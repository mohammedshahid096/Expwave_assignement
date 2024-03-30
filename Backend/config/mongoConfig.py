from pymongo import MongoClient

# Replace the following variables with your actual MongoDB URI and database name
MONGO_URI = "mongodb://localhost:27017/DealsDray"
DB_NAME = "DealsDray"

# Initialize a MongoClient instance
client = MongoClient(MONGO_URI)
# Get a reference to your database
db = client[DB_NAME]

COLLECTION_EMPLOYEE = db["employees"]
COLLECTION_USER = db["users"]
