import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL_CONFIG = {
    "model": "llama-3.3-70b-versatile",
    "temperature": 0.3,
    "max_tokens": 2000,
    "top_p": 0.9
}
