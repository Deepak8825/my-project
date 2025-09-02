from fastapi import FastAPI, HTTPException, Depends, Query
from pymongo import MongoClient
from pydantic import BaseModel
import requests
import os
import jwt
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from passlib.context import CryptContext

app = FastAPI()

# Security setup
SECRET_KEY = os.getenv("SECRET_KEY", "airware-secret-key")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
client = MongoClient(MONGO_URI)
db = client.airaware

# Models
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Location(BaseModel):
    city: str
    state: str
    country: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Scheduled data fetching
def fetch_aqi_data():
    # Implementation will be added later
    pass

scheduler = BackgroundScheduler()
scheduler.add_job(fetch_aqi_data, 'interval', minutes=15)
scheduler.start()

# Authentication endpoints
@app.post("/auth/register")
async def register(user: UserRegister):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password
    db.users.insert_one(user_data)
    return {"message": "User registered successfully"}

@app.post("/auth/login")
async def login(user: UserLogin):
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": db_user["email"]},
        expires_delta=timedelta(days=7)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# API endpoints
@app.get("/get_aqi")
async def get_aqi(city: str = Query(...)):
    # Placeholder - will implement OpenAQ API integration
    return {"city": city, "aqi": 45, "category": "Good"}

@app.get("/get_forecast")
async def get_forecast(city: str = Query(...)):
    # Placeholder - will implement forecast logic
    return {"city": city, "forecast": []}

@app.get("/get_map_data")
async def get_map_data():
    # Placeholder - will implement map data
    return {"data": []}

@app.get("/top10_cities_india")
async def top10_cities_india():
    # Placeholder - will implement top cities data
    return {"cities": []}

@app.get("/get_tips")
async def get_tips(aqi: int = Query(...)):
    # Placeholder - will implement health tips logic
    return {"aqi": aqi, "tips": []}

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "AirAware API is running"}
