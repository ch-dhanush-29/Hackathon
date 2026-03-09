<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from models.database import get_db, User, Document
from routers.auth import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])


class DocumentCreate(BaseModel):
    title: str
    content: Optional[str] = ""

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


@router.post("")
async def create_document(
    doc: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = Document(title=doc.title, content=doc.content, user_id=current_user.id)
    db.add(document)
    db.commit()
    db.refresh(document)
    return {
        "id": document.id, "title": document.title,
        "content": document.content, "created_at": str(document.created_at)
    }


@router.get("")
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.updated_at.desc()).all()
    return [{
        "id": d.id, "title": d.title,
        "content": d.content,
        "created_at": str(d.created_at),
        "updated_at": str(d.updated_at)
    } for d in docs]


@router.get("/{doc_id}")
async def get_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id, "title": doc.title,
        "content": doc.content,
        "created_at": str(doc.created_at),
        "updated_at": str(doc.updated_at)
    }


@router.put("/{doc_id}")
async def update_document(
    doc_id: int,
    data: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if data.title is not None:
        doc.title = data.title
    if data.content is not None:
        doc.content = data.content
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "title": doc.title, "content": doc.content}


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from models.database import get_db, User, Document
from routers.auth import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])


class DocumentCreate(BaseModel):
    title: str
    content: Optional[str] = ""

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


@router.post("")
async def create_document(
    doc: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = Document(title=doc.title, content=doc.content, user_id=current_user.id)
    db.add(document)
    db.commit()
    db.refresh(document)
    return {
        "id": document.id, "title": document.title,
        "content": document.content, "created_at": str(document.created_at)
    }


@router.get("")
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.updated_at.desc()).all()
    return [{
        "id": d.id, "title": d.title,
        "content": d.content,
        "created_at": str(d.created_at),
        "updated_at": str(d.updated_at)
    } for d in docs]


@router.get("/{doc_id}")
async def get_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id, "title": doc.title,
        "content": doc.content,
        "created_at": str(doc.created_at),
        "updated_at": str(doc.updated_at)
    }


@router.put("/{doc_id}")
async def update_document(
    doc_id: int,
    data: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if data.title is not None:
        doc.title = data.title
    if data.content is not None:
        doc.content = data.content
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "title": doc.title, "content": doc.content}


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
