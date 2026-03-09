<<<<<<< HEAD
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from PyPDF2 import PdfReader
from io import BytesIO
from models.database import get_db, User, UploadedPDF
from routers.auth import get_current_user
from utils.research_assistant import research_assistant

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()

    # Extract text from PDF
    try:
        reader = PdfReader(BytesIO(contents))
        extracted_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

    # Save to database
    pdf_record = UploadedPDF(
        filename=file.filename,
        extracted_text=extracted_text,
        user_id=current_user.id
    )
    db.add(pdf_record)
    db.commit()
    db.refresh(pdf_record)

    return {
        "id": pdf_record.id,
        "filename": pdf_record.filename,
        "text_length": len(extracted_text),
        "extracted_text": extracted_text[:2000],  # Preview
        "message": "PDF uploaded and processed successfully"
    }


@router.post("/pdf/{pdf_id}/summary")
async def generate_pdf_summary(
    pdf_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdf = db.query(UploadedPDF).filter(
        UploadedPDF.id == pdf_id,
        UploadedPDF.user_id == current_user.id
    ).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    summary = research_assistant.summarize_pdf(pdf.extracted_text)
    pdf.summary = summary
    db.commit()

    return {"summary": summary}


class SaveToWorkspace(BaseModel):
    workspace_id: int


@router.post("/pdf/{pdf_id}/save-to-workspace")
async def save_pdf_to_workspace(
    pdf_id: int,
    data: SaveToWorkspace,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdf = db.query(UploadedPDF).filter(
        UploadedPDF.id == pdf_id,
        UploadedPDF.user_id == current_user.id
    ).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    pdf.workspace_id = data.workspace_id
    db.commit()
    return {"message": "PDF saved to workspace"}


@router.get("/pdfs")
async def get_uploaded_pdfs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdfs = db.query(UploadedPDF).filter(UploadedPDF.user_id == current_user.id).all()
    return [{
        "id": p.id,
        "filename": p.filename,
        "summary": p.summary or "",
        "created_at": str(p.created_at)
    } for p in pdfs]
=======
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from PyPDF2 import PdfReader
from io import BytesIO
from models.database import get_db, User, UploadedPDF
from routers.auth import get_current_user
from utils.research_assistant import research_assistant

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()

    # Extract text from PDF
    try:
        reader = PdfReader(BytesIO(contents))
        extracted_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

    # Save to database
    pdf_record = UploadedPDF(
        filename=file.filename,
        extracted_text=extracted_text,
        user_id=current_user.id
    )
    db.add(pdf_record)
    db.commit()
    db.refresh(pdf_record)

    return {
        "id": pdf_record.id,
        "filename": pdf_record.filename,
        "text_length": len(extracted_text),
        "extracted_text": extracted_text[:2000],  # Preview
        "message": "PDF uploaded and processed successfully"
    }


@router.post("/pdf/{pdf_id}/summary")
async def generate_pdf_summary(
    pdf_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdf = db.query(UploadedPDF).filter(
        UploadedPDF.id == pdf_id,
        UploadedPDF.user_id == current_user.id
    ).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    summary = research_assistant.summarize_pdf(pdf.extracted_text)
    pdf.summary = summary
    db.commit()

    return {"summary": summary}


class SaveToWorkspace(BaseModel):
    workspace_id: int


@router.post("/pdf/{pdf_id}/save-to-workspace")
async def save_pdf_to_workspace(
    pdf_id: int,
    data: SaveToWorkspace,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdf = db.query(UploadedPDF).filter(
        UploadedPDF.id == pdf_id,
        UploadedPDF.user_id == current_user.id
    ).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    pdf.workspace_id = data.workspace_id
    db.commit()
    return {"message": "PDF saved to workspace"}


@router.get("/pdfs")
async def get_uploaded_pdfs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdfs = db.query(UploadedPDF).filter(UploadedPDF.user_id == current_user.id).all()
    return [{
        "id": p.id,
        "filename": p.filename,
        "summary": p.summary or "",
        "created_at": str(p.created_at)
    } for p in pdfs]
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
