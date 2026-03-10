from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from models.database import init_db
from routers import auth, papers, chat, ai_tools, upload, documents

load_dotenv()

app = FastAPI(title="ResearchHub AI API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "https://hackathon-eta-rust.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(chat.router)
app.include_router(ai_tools.router)
app.include_router(upload.router)
app.include_router(documents.router)


@app.on_event("startup")
async def startup():
    init_db()


@app.get("/")
async def root():
    return {"message": "ResearchHub AI API is running"}
