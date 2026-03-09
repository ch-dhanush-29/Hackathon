<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.database import get_db, User, Paper, Conversation
from routers.auth import get_current_user
from utils.research_assistant import research_assistant
from utils.vector_store import search_papers_in_workspace

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    content: str
    workspace_id: int


@router.post("")
async def chat_with_papers(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Perform Semantic Vector Search to get top relevant papers
    matching_paper_ids = search_papers_in_workspace(message.content, message.workspace_id, top_k=5)
    
    if not matching_paper_ids:
        # Fallback to all workspace papers if vector search yields empty
        workspace_papers = db.query(Paper).filter(
            Paper.workspace_id == message.workspace_id,
            Paper.user_id == current_user.id
        ).all()
    else:
        workspace_papers = db.query(Paper).filter(
            Paper.id.in_(matching_paper_ids),
            Paper.user_id == current_user.id
        ).all()

    if not workspace_papers:
        return {"response": "No papers found in this workspace. Please import some papers first to start chatting."}

    # Build paper context
    papers_data = [{
        "title": p.title,
        "authors": p.authors,
        "abstract": p.abstract
    } for p in workspace_papers]

    # Get conversation history
    history = db.query(Conversation).filter(
        Conversation.workspace_id == message.workspace_id,
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.desc()).limit(10).all()

    context = research_assistant.create_research_context(papers_data, message.content)

    # Generate response
    ai_response = research_assistant.generate_research_response(context, message.content, history)

    # Store conversation
    user_msg = Conversation(
        workspace_id=message.workspace_id,
        user_id=current_user.id,
        role="user",
        content=message.content
    )
    assistant_msg = Conversation(
        workspace_id=message.workspace_id,
        user_id=current_user.id,
        role="assistant",
        content=ai_response
    )
    db.add(user_msg)
    db.add(assistant_msg)
    db.commit()

    return {"response": ai_response}


@router.get("/history/{workspace_id}")
async def get_chat_history(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Conversation).filter(
        Conversation.workspace_id == workspace_id,
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.asc()).all()

    return [{
        "id": m.id,
        "role": m.role,
        "content": m.content,
        "created_at": str(m.created_at)
    } for m in messages]
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.database import get_db, User, Paper, Conversation
from routers.auth import get_current_user
from utils.research_assistant import research_assistant

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    content: str
    workspace_id: int


@router.post("")
async def chat_with_papers(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get workspace papers
    workspace_papers = db.query(Paper).filter(
        Paper.workspace_id == message.workspace_id,
        Paper.user_id == current_user.id
    ).all()

    if not workspace_papers:
        return {"response": "No papers found in this workspace. Please import some papers first to start chatting."}

    # Build paper context
    papers_data = [{
        "title": p.title,
        "authors": p.authors,
        "abstract": p.abstract
    } for p in workspace_papers]

    # Get conversation history
    history = db.query(Conversation).filter(
        Conversation.workspace_id == message.workspace_id,
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.desc()).limit(10).all()

    context = research_assistant.create_research_context(papers_data, message.content)

    # Generate response
    ai_response = research_assistant.generate_research_response(context, message.content)

    # Store conversation
    user_msg = Conversation(
        workspace_id=message.workspace_id,
        user_id=current_user.id,
        role="user",
        content=message.content
    )
    assistant_msg = Conversation(
        workspace_id=message.workspace_id,
        user_id=current_user.id,
        role="assistant",
        content=ai_response
    )
    db.add(user_msg)
    db.add(assistant_msg)
    db.commit()

    return {"response": ai_response}


@router.get("/history/{workspace_id}")
async def get_chat_history(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Conversation).filter(
        Conversation.workspace_id == workspace_id,
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.asc()).all()

    return [{
        "id": m.id,
        "role": m.role,
        "content": m.content,
        "created_at": str(m.created_at)
    } for m in messages]
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
