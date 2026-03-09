import os
from tempfile import gettempdir
import chromadb
from chromadb.utils import embedding_functions

# Initialize ChromaDB client (persistent storage on disk)
db_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
client = chromadb.PersistentClient(path=db_dir)

# Initialize embedding function
# Using a lightweight, fast sentence-transformer model
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# Get or create collection
collection = client.get_or_create_collection(
    name="research_papers",
    embedding_function=sentence_transformer_ef,
    metadata={"hnsw:space": "cosine"} # Use cosine similarity for semantic search
)

def add_paper_to_vector_store(paper_id: int, title: str, authors: str, abstract: str, workspace_id: int):
    """
    Adds a paper's metadata to the Chroma vector store for semantic search.
    The embeddings are calculated on a rich research context string.
    """
    # Create a comprehensive context string for embedding
    content_to_embed = f"Title: {title}\nAuthors: {authors}\nAbstract: {abstract}"
    
    collection.add(
        documents=[content_to_embed],
        metadatas=[{"paper_id": paper_id, "workspace_id": workspace_id, "title": title}],
        ids=[f"paper_{paper_id}"]
    )

def search_papers_in_workspace(query: str, workspace_id: int, top_k: int = 5):
    """
    Searches for semantically similar papers within a specific workspace.
    Returns the associated metadata and document content.
    """
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where={"workspace_id": workspace_id}
    )
    
    # Retrieve matching paper IDs 
    if not results['metadatas'] or not results['metadatas'][0]:
        return []
        
    return [meta["paper_id"] for meta in results['metadatas'][0]]

def remove_paper_from_vector_store(paper_id: int):
    """
    Removes a paper from the Chroma vector store.
    """
    collection.delete(
        ids=[f"paper_{paper_id}"]
    )
