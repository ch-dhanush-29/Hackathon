<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from models.database import get_db, User, Paper
from routers.auth import get_current_user
from utils.research_assistant import research_assistant

router = APIRouter(prefix="/ai-tools", tags=["AI Tools"])


class PaperIds(BaseModel):
    paper_ids: List[int]


def get_papers_by_ids(paper_ids: List[int], user_id: int, db: Session):
    papers = db.query(Paper).filter(
        Paper.id.in_(paper_ids),
        Paper.user_id == user_id
    ).all()
    return [{"title": p.title, "authors": p.authors, "abstract": p.abstract} for p in papers]


@router.post("/summary")
async def generate_summary(
    data: PaperIds,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = get_papers_by_ids(data.paper_ids, current_user.id, db)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")

    result = research_assistant.generate_summary(papers)
    return {"result": result}


@router.post("/insights")
async def extract_insights(
    data: PaperIds,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = get_papers_by_ids(data.paper_ids, current_user.id, db)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")

    result = research_assistant.extract_insights(papers)
    return {"result": result}


@router.post("/review")
async def generate_review(
    data: PaperIds,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = get_papers_by_ids(data.paper_ids, current_user.id, db)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")

    result = research_assistant.generate_literature_review(papers)
    return {"result": result}
=======
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from models.database import get_db, User, Paper
from routers.auth import get_current_user
from utils.research_assistant import research_assistant

router = APIRouter(prefix="/ai-tools", tags=["AI Tools"])


class PaperIds(BaseModel):
    paper_ids: List[int]


def get_papers_by_ids(paper_ids: List[int], user_id: int, db: Session):
    papers = db.query(Paper).filter(
        Paper.id.in_(paper_ids),
        Paper.user_id == user_id
    ).all()
    return [{"title": p.title, "authors": p.authors, "abstract": p.abstract} for p in papers]


@router.post("/summary")
async def generate_summary(
    data: PaperIds,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = get_papers_by_ids(data.paper_ids, current_user.id, db)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")

    result = research_assistant.generate_summary(papers)
    return {"result": result}


@router.post("/insights")
async def extract_insights(
    data: PaperIds,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = get_papers_by_ids(data.paper_ids, current_user.id, db)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")

    result = research_assistant.extract_insights(papers)
    return {"result": result}


@router.post("/review")
async def generate_review(
    data: PaperIds,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = get_papers_by_ids(data.paper_ids, current_user.id, db)
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")

    result = research_assistant.generate_literature_review(papers)
    return {"result": result}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
