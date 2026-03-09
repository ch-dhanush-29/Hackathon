<<<<<<< HEAD
# ResearchHub AI

Intelligent Research Paper Management and Analysis System using Agentic AI.

Built with **React + TypeScript + Tailwind CSS** frontend and **FastAPI + Groq Llama 3.3 70B** backend.

## Features

- **User Authentication** — JWT-based register/login
- **Paper Search** — Search arXiv for research papers
- **Workspace Management** — Organize papers into project workspaces
- **AI Chatbot** — Ask questions about your papers (Groq Llama 3.3 70B)
- **AI Tools** — Generate summaries, key insights, and literature reviews
- **PDF Upload** — Upload PDFs, extract text, generate AI summaries
- **DocSpace** — Rich text document editor for notes

## Prerequisites

- Python 3.9+
- Node.js 18+
- Groq API key (get one at https://console.groq.com/)

## Setup

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Open

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs

## Project Structure

```
ResearchHub-AI/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── database.py      # SQLAlchemy models + SQLite
│   ├── routers/
│   │   ├── auth.py           # JWT authentication
│   │   ├── papers.py         # arXiv search + workspace CRUD
│   │   ├── chat.py           # AI chatbot
│   │   ├── ai_tools.py       # Summaries, insights, reviews
│   │   ├── upload.py         # PDF upload + text extraction
│   │   └── documents.py      # DocSpace CRUD
│   └── utils/
│       ├── groq_client.py    # Groq API client
│       └── research_assistant.py  # AI analysis logic
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Home, Dashboard, Search, Workspace, AITools, Upload, DocSpace
│   │   ├── components/       # Sidebar, Navbar
│   │   ├── utils/api.ts      # Axios instance with auth
│   │   └── App.tsx           # Router + layout
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, React Router, Axios, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy (SQLite), Groq SDK, PyPDF2, python-jose (JWT), passlib (bcrypt)
- **AI Model**: Groq Llama 3.3 70B Versatile
- **Paper Source**: arXiv API
=======
# ResearchHub AI

Intelligent Research Paper Management and Analysis System using Agentic AI.

Built with **React + TypeScript + Tailwind CSS** frontend and **FastAPI + Groq Llama 3.3 70B** backend.

## Features

- **User Authentication** — JWT-based register/login
- **Paper Search** — Search arXiv for research papers
- **Workspace Management** — Organize papers into project workspaces
- **AI Chatbot** — Ask questions about your papers (Groq Llama 3.3 70B)
- **AI Tools** — Generate summaries, key insights, and literature reviews
- **PDF Upload** — Upload PDFs, extract text, generate AI summaries
- **DocSpace** — Rich text document editor for notes

## Prerequisites

- Python 3.9+
- Node.js 18+
- Groq API key (get one at https://console.groq.com/)

## Setup

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Open

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs

## Project Structure

```
ResearchHub-AI/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── database.py      # SQLAlchemy models + SQLite
│   ├── routers/
│   │   ├── auth.py           # JWT authentication
│   │   ├── papers.py         # arXiv search + workspace CRUD
│   │   ├── chat.py           # AI chatbot
│   │   ├── ai_tools.py       # Summaries, insights, reviews
│   │   ├── upload.py         # PDF upload + text extraction
│   │   └── documents.py      # DocSpace CRUD
│   └── utils/
│       ├── groq_client.py    # Groq API client
│       └── research_assistant.py  # AI analysis logic
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Home, Dashboard, Search, Workspace, AITools, Upload, DocSpace
│   │   ├── components/       # Sidebar, Navbar
│   │   ├── utils/api.ts      # Axios instance with auth
│   │   └── App.tsx           # Router + layout
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, React Router, Axios, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy (SQLite), Groq SDK, PyPDF2, python-jose (JWT), passlib (bcrypt)
- **AI Model**: Groq Llama 3.3 70B Versatile
- **Paper Source**: arXiv API
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
