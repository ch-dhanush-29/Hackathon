<<<<<<< HEAD
import httpx
import asyncio
import xml.etree.ElementTree as ET
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from models.database import get_db, User, Workspace, Paper
from routers.auth import get_current_user
from utils.vector_store import add_paper_to_vector_store, remove_paper_from_vector_store

router = APIRouter(prefix="/papers", tags=["Papers"])


# --- Schemas ---
class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = ""

class PaperImport(BaseModel):
    arxiv_id: Optional[str] = ""
    title: str
    authors: str
    abstract: str
    published: Optional[str] = ""
    source: Optional[str] = "arxiv"
    pdf_url: Optional[str] = ""
    workspace_id: int


# --- arXiv Search ---
async def query_arxiv(query: str, max_results: int = 10):
    url = "https://export.arxiv.org/api/query"
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "relevance",
        "sortOrder": "descending"
    }

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        return []

    ns = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
    root = ET.fromstring(response.text)
    papers = []

    for entry in root.findall("atom:entry", ns):
        title = entry.find("atom:title", ns)
        summary = entry.find("atom:summary", ns)
        published = entry.find("atom:published", ns)
        arxiv_id_elem = entry.find("atom:id", ns)

        authors = []
        for author in entry.findall("atom:author", ns):
            name = author.find("atom:name", ns)
            if name is not None:
                authors.append(name.text)

        pdf_link = ""
        for link in entry.findall("atom:link", ns):
            if link.get("title") == "pdf":
                pdf_link = link.get("href", "")

        arxiv_id = ""
        if arxiv_id_elem is not None and arxiv_id_elem.text:
            arxiv_id = arxiv_id_elem.text.split("/abs/")[-1]

        citations_count = 0

        papers.append({
            "arxiv_id": arxiv_id,
            "title": title.text.strip().replace("\n", " ") if title is not None else "N/A",
            "authors": ", ".join(authors),
            "abstract": summary.text.strip().replace("\n", " ") if summary is not None else "N/A",
            "published": published.text[:10] if published is not None else "",
            "source": "arxiv",
            "pdf_url": pdf_link,
            "citations": citations_count,
        })

    return papers


# --- Semantic Scholar Search ---
async def query_semantic_scholar(query: str, max_results: int = 10):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": query,
        "limit": max_results,
        "fields": "paperId,title,authors,abstract,year,url,citationCount,isOpenAccess,openAccessPdf"
    }
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        try:
            response = await client.get(url, params=params)
            if response.status_code != 200:
                print(f"Semantic Scholar Error: {response.text}")
                return []
                
            data = response.json()
            papers = []
            
            for item in data.get("data", []):
                authors = [a.get("name", "") for a in item.get("authors", [])]
                
                pdf_link = ""
                if item.get("isOpenAccess") and item.get("openAccessPdf"):
                    pdf_link = item.get("openAccessPdf", {}).get("url", "")
                    
                papers.append({
                    "arxiv_id": item.get("paperId", ""), # Use Semantic Scholar ID as fallback
                    "title": item.get("title", "N/A"),
                    "authors": ", ".join(authors),
                    "abstract": item.get("abstract") or "No abstract available.",
                    "published": str(item.get("year", "")),
                    "source": "semanticscholar",
                    "pdf_url": pdf_link or item.get("url", ""),
                    "citations": item.get("citationCount", 0)
                })
            return papers
        except Exception as e:
            print(f"Semantic Scholar Exception: {e}")
            return []


# --- Hugging Face Daily Papers Search ---
async def query_huggingface(query: str, max_results: int = 10):
    # HF Papers API allows fetching trending ML papers from arXiv that are highly discussed
    url = "https://huggingface.co/api/daily_papers"
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        try:
            response = await client.get(url)
            if response.status_code != 200:
                return []
                
            data = response.json()
            papers = []
            
            # Since HF Daily API doesn't support direct text search well, we fetch trending and filter locally
            query_lower = query.lower()
            
            for item in data:
                title = item.get("paper", {}).get("title", "")
                abstract = item.get("paper", {}).get("summary", "")
                
                # Filter locally
                if query_lower in title.lower() or query_lower in abstract.lower():
                    authors = [a.get("name", "") for a in item.get("paper", {}).get("authors", [])]
                    
                    arxiv_id = item.get("paper", {}).get("id", "")
                    pdf_link = f"https://arxiv.org/pdf/{arxiv_id}.pdf" if arxiv_id else ""
                    
                    papers.append({
                        "arxiv_id": arxiv_id,
                        "title": title,
                        "authors": ", ".join(authors),
                        "abstract": abstract,
                        "published": item.get("paper", {}).get("publishedAt", "")[:10],
                        "source": "huggingface",
                        "pdf_url": pdf_link,
                        "citations": 0
                    })
                    
                    if len(papers) >= max_results:
                        break
            
            # If local filtering on exact HF daily yields 0 results, it's normal as HF daily is constrained to 'today'
            return papers
        except Exception as e:
            print(f"Hugging Face Exception: {e}")
            return []



# --- Endpoints ---
@router.get("/search")
async def search_papers(
    query: str = Query(..., min_length=1),
    source: Optional[str] = "all",
    current_user: User = Depends(get_current_user)
):
    tasks = []
    
    if source in ["all", "arxiv"]:
        tasks.append(query_arxiv(query, max_results=10))
    if source in ["all", "semanticscholar"]:
        tasks.append(query_semantic_scholar(query, max_results=10))
    if source in ["all", "huggingface"]:
        tasks.append(query_huggingface(query, max_results=10))
        
    results = await asyncio.gather(*tasks)
    
    # Flatten the results array of arrays
    flattened_papers = []
    seen_titles = set()
    
    for rp in results:
        for p in rp:
            # Deduplicate by title to prevent arXiv and Semantic Scholar pulling the exact same entry twice
            title_lower = p["title"].lower().strip()
            if title_lower not in seen_titles:
                flattened_papers.append(p)
                seen_titles.add(title_lower)
                
    # Sort by citations if available (Semantic Scholar provides this)
    flattened_papers.sort(key=lambda x: x.get("citations", 0), reverse=True)
                
    return {"papers": flattened_papers, "total": len(flattened_papers)}


@router.post("/import")
async def import_paper(
    paper_data: PaperImport,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == paper_data.workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    new_paper = Paper(
        arxiv_id=paper_data.arxiv_id,
        title=paper_data.title,
        authors=paper_data.authors,
        abstract=paper_data.abstract,
        published=paper_data.published,
        source=paper_data.source,
        pdf_url=paper_data.pdf_url,
        workspace_id=paper_data.workspace_id,
        user_id=current_user.id
    )
    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)
    
    # Add to vector store for semantic search
    try:
        add_paper_to_vector_store(
            paper_id=new_paper.id,
            title=new_paper.title,
            authors=new_paper.authors,
            abstract=new_paper.abstract,
            workspace_id=new_paper.workspace_id
        )
    except Exception as e:
        print(f"Error adding paper {new_paper.id} to vector store: {e}")
        
    return {"message": "Paper imported successfully", "paper": {
        "id": new_paper.id,
        "title": new_paper.title,
        "authors": new_paper.authors,
        "abstract": new_paper.abstract,
    }}


# --- Workspace CRUD ---
@router.post("/workspaces")
async def create_workspace(
    ws: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = Workspace(name=ws.name, description=ws.description, user_id=current_user.id)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return {
        "id": workspace.id, "name": workspace.name,
        "description": workspace.description,
        "created_at": str(workspace.created_at),
        "paper_count": 0
    }


@router.get("/workspaces")
async def get_workspaces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspaces = db.query(Workspace).filter(Workspace.user_id == current_user.id).all()
    result = []
    for ws in workspaces:
        paper_count = db.query(Paper).filter(Paper.workspace_id == ws.id).count()
        result.append({
            "id": ws.id, "name": ws.name,
            "description": ws.description,
            "created_at": str(ws.created_at),
            "paper_count": paper_count
        })
    return result


@router.get("/workspaces/{workspace_id}")
async def get_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id, Workspace.user_id == current_user.id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    papers = db.query(Paper).filter(Paper.workspace_id == workspace_id).all()
    return {
        "id": workspace.id,
        "name": workspace.name,
        "description": workspace.description,
        "created_at": str(workspace.created_at),
        "papers": [{
            "id": p.id, "title": p.title, "authors": p.authors,
            "abstract": p.abstract, "published": p.published,
            "source": p.source, "pdf_url": p.pdf_url
        } for p in papers]
    }


@router.delete("/workspaces/{workspace_id}")
async def delete_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id, Workspace.user_id == current_user.id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    papers = db.query(Paper).filter(Paper.workspace_id == workspace_id).all()
    for p in papers:
        try:
            remove_paper_from_vector_store(paper_id=p.id)
        except Exception:
            pass

    db.query(Paper).filter(Paper.workspace_id == workspace_id).delete()
    db.delete(workspace)
    db.commit()
    return {"message": "Workspace deleted"}


@router.get("/workspace/{workspace_id}/papers")
async def get_workspace_papers(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = db.query(Paper).filter(
        Paper.workspace_id == workspace_id, Paper.user_id == current_user.id
    ).all()
    return [{
        "id": p.id, "title": p.title, "authors": p.authors,
        "abstract": p.abstract, "published": p.published,
        "source": p.source, "pdf_url": p.pdf_url
    } for p in papers]


@router.delete("/{paper_id}")
async def delete_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    paper = db.query(Paper).filter(Paper.id == paper_id, Paper.user_id == current_user.id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    db.delete(paper)
    db.commit()
    
    try:
        remove_paper_from_vector_store(paper_id=paper_id)
    except Exception as e:
        print(f"Error removing paper {paper_id} from vector store: {e}")
        
    return {"message": "Paper deleted"}
=======
import httpx
import xml.etree.ElementTree as ET
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from models.database import get_db, User, Workspace, Paper
from routers.auth import get_current_user

router = APIRouter(prefix="/papers", tags=["Papers"])


# --- Schemas ---
class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = ""

class PaperImport(BaseModel):
    arxiv_id: Optional[str] = ""
    title: str
    authors: str
    abstract: str
    published: Optional[str] = ""
    source: Optional[str] = "arxiv"
    pdf_url: Optional[str] = ""
    workspace_id: int


# --- arXiv Search ---
async def query_arxiv(query: str, max_results: int = 10):
    url = "http://export.arxiv.org/api/query"
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "relevance",
        "sortOrder": "descending"
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        return []

    ns = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
    root = ET.fromstring(response.text)
    papers = []

    for entry in root.findall("atom:entry", ns):
        title = entry.find("atom:title", ns)
        summary = entry.find("atom:summary", ns)
        published = entry.find("atom:published", ns)
        arxiv_id_elem = entry.find("atom:id", ns)

        authors = []
        for author in entry.findall("atom:author", ns):
            name = author.find("atom:name", ns)
            if name is not None:
                authors.append(name.text)

        pdf_link = ""
        for link in entry.findall("atom:link", ns):
            if link.get("title") == "pdf":
                pdf_link = link.get("href", "")

        arxiv_id = ""
        if arxiv_id_elem is not None and arxiv_id_elem.text:
            arxiv_id = arxiv_id_elem.text.split("/abs/")[-1]

        citations_count = 0

        papers.append({
            "arxiv_id": arxiv_id,
            "title": title.text.strip().replace("\n", " ") if title is not None else "N/A",
            "authors": ", ".join(authors),
            "abstract": summary.text.strip().replace("\n", " ") if summary is not None else "N/A",
            "published": published.text[:10] if published is not None else "",
            "source": "arxiv",
            "pdf_url": pdf_link,
            "citations": citations_count,
        })

    return papers


# --- Endpoints ---
@router.get("/search")
async def search_papers(
    query: str = Query(..., min_length=1),
    source: Optional[str] = "all",
    current_user: User = Depends(get_current_user)
):
    results = await query_arxiv(query)
    return {"papers": results, "total": len(results)}


@router.post("/import")
async def import_paper(
    paper_data: PaperImport,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == paper_data.workspace_id,
        Workspace.user_id == current_user.id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    new_paper = Paper(
        arxiv_id=paper_data.arxiv_id,
        title=paper_data.title,
        authors=paper_data.authors,
        abstract=paper_data.abstract,
        published=paper_data.published,
        source=paper_data.source,
        pdf_url=paper_data.pdf_url,
        workspace_id=paper_data.workspace_id,
        user_id=current_user.id
    )
    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)
    return {"message": "Paper imported successfully", "paper": {
        "id": new_paper.id,
        "title": new_paper.title,
        "authors": new_paper.authors,
        "abstract": new_paper.abstract,
    }}


# --- Workspace CRUD ---
@router.post("/workspaces")
async def create_workspace(
    ws: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = Workspace(name=ws.name, description=ws.description, user_id=current_user.id)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return {
        "id": workspace.id, "name": workspace.name,
        "description": workspace.description,
        "created_at": str(workspace.created_at),
        "paper_count": 0
    }


@router.get("/workspaces")
async def get_workspaces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspaces = db.query(Workspace).filter(Workspace.user_id == current_user.id).all()
    result = []
    for ws in workspaces:
        paper_count = db.query(Paper).filter(Paper.workspace_id == ws.id).count()
        result.append({
            "id": ws.id, "name": ws.name,
            "description": ws.description,
            "created_at": str(ws.created_at),
            "paper_count": paper_count
        })
    return result


@router.get("/workspaces/{workspace_id}")
async def get_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id, Workspace.user_id == current_user.id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    papers = db.query(Paper).filter(Paper.workspace_id == workspace_id).all()
    return {
        "id": workspace.id,
        "name": workspace.name,
        "description": workspace.description,
        "created_at": str(workspace.created_at),
        "papers": [{
            "id": p.id, "title": p.title, "authors": p.authors,
            "abstract": p.abstract, "published": p.published,
            "source": p.source, "pdf_url": p.pdf_url
        } for p in papers]
    }


@router.delete("/workspaces/{workspace_id}")
async def delete_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id, Workspace.user_id == current_user.id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    db.query(Paper).filter(Paper.workspace_id == workspace_id).delete()
    db.delete(workspace)
    db.commit()
    return {"message": "Workspace deleted"}


@router.get("/workspace/{workspace_id}/papers")
async def get_workspace_papers(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    papers = db.query(Paper).filter(
        Paper.workspace_id == workspace_id, Paper.user_id == current_user.id
    ).all()
    return [{
        "id": p.id, "title": p.title, "authors": p.authors,
        "abstract": p.abstract, "published": p.published,
        "source": p.source, "pdf_url": p.pdf_url
    } for p in papers]


@router.delete("/{paper_id}")
async def delete_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    paper = db.query(Paper).filter(Paper.id == paper_id, Paper.user_id == current_user.id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(paper)
    db.commit()
    return {"message": "Paper deleted"}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
