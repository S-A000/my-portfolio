from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="Portfolio API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Project(BaseModel):
    title: str
    description: str
    tags: List[str]
    link: str
    is_enterprise: bool = False
    is_pypi: bool = False

# Static project data from the original HTML
STATIC_PROJECTS = [
    {
        "title": "DeepGuard System",
        "description": "Advanced AI detection system for enterprise security.",
        "tags": ["GenAI", "NLP"],
        "link": "https://github.com/S-A000/deepguard",
        "is_enterprise": True
    },
    {
        "title": "PalmPilot",
        "description": "Retro-tech pun project for hand-controlled gaming using Computer Vision.",
        "tags": ["Python"],
        "link": "https://github.com/S-A000/PalmPilot"
    },
    {
        "title": "Stock Price Prediction",
        "description": "Time-series forecasting for GOOG Stock using Deep Learning models.",
        "tags": ["Jupyter"],
        "link": "https://github.com/S-A000/Stock_price_prediction"
    },
    {
        "title": "Fraud Detection",
        "description": "Anamoly detection in financial transactions with high precision.",
        "tags": ["ML", "Data Mining"],
        "link": "https://github.com/S-A000/Credit-Card-Fraud-Detection"
    },
    {
        "title": "Extraction_Of_Data",
        "description": "Web scraping ETL pipeline converting web data into structured CSVs.",
        "tags": ["WebScraping", "ETL"],
        "link": "https://github.com/S-A000/Extraction_Of_Data"
    },
    {
        "title": "SAM-Package",
        "description": "Custom Python package published on PyPI for developer utility.",
        "tags": ["PyPI"],
        "link": "https://pypi.org/project/sam_eda/",
        "is_pypi": True
    },
    {
        "title": "House-Price-Prediction",
        "description": "Regression analysis project for real estate price estimations.",
        "tags": ["Jupyter"],
        "link": "https://github.com/S-A000/House-price-Prediction"
    },
    {
        "title": "pinn_web_app",
        "description": "Integrated web application for displaying neural network insights.",
        "tags": ["HTML"],
        "link": "https://github.com/S-A000/pinn_web_app"
    },
    {
        "title": "Chatbot-",
        "description": "Conversational AI interface using Natural Language Processing.",
        "tags": ["HTML", "NLP"],
        "link": "https://github.com/S-A000/Chatbot-"
    }
]

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

@app.get("/api/projects", response_model=List[Project])
def get_projects():
    return STATIC_PROJECTS

@app.post("/api/contact")
def send_message(message: ContactMessage):
    # In a real app, you would save this to a database or send an email.
    return {"status": "success", "message": "Message received!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
