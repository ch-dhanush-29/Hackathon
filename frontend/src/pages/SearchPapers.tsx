<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import api from '../utils/api';

interface Paper {
  arxiv_id: string; title: string; authors: string; abstract: string;
  published: string; source: string; pdf_url: string; citations: number;
}
interface Workspace { id: number; name: string; }

export default function SearchPapers() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState<number>(0);
  const [source, setSource] = useState('all');
  
  // New State for Bulk Import and History
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load History from Local Storage
    const saved = localStorage.getItem('researchhub_search_history');
    if (saved) setSearchHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    api.get('/papers/workspaces').then(({ data }) => {
      setWorkspaces(data);
      if (data.length > 0) setSelectedWs(data[0].id);
    });
  }, []);

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;
    
    // Save to History (max 5 items)
    const newHistory = [q, ...searchHistory.filter(item => item !== q)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('researchhub_search_history', JSON.stringify(newHistory));
    
    setLoading(true);
    setPapers([]); // clear old results
    setSelectedPapers(new Set()); // reset selection
    
    try {
      const { data } = await api.get(`/papers/search?query=${encodeURIComponent(q)}&source=${source}`);
      setPapers(data.papers);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const toggleSelection = (arxiv_id: string) => {
    setSelectedPapers(prev => {
      const next = new Set(prev);
      if (next.has(arxiv_id)) next.delete(arxiv_id);
      else next.add(arxiv_id);
      return next;
    });
  };

  const handleBulkImport = async () => {
    if (!selectedWs) { alert('Please select a workspace first'); return; }
    if (selectedPapers.size === 0) return;
    
    setIsImporting(true);
    
    const papersToImport = papers.filter(p => selectedPapers.has(p.arxiv_id));
    
    try {
      // Import all selected papers concurrently
      await Promise.all(papersToImport.map(paper => 
        api.post('/papers/import', {
          arxiv_id: paper.arxiv_id, title: paper.title, authors: paper.authors,
          abstract: paper.abstract, published: paper.published, source: paper.source,
          pdf_url: paper.pdf_url, workspace_id: selectedWs,
        })
      ));
      
      alert(`Successfully imported ${papersToImport.length} paper(s)!`);
      setSelectedPapers(new Set()); // Clear selection after success
    } catch (err) { 
      console.error(err); 
      alert('Failed to import some papers. Check the console.');
    }
    
    setIsImporting(false);
  };



  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Search Research Papers</h1>
      <p className="text-gray-500 text-sm mt-1">Search across millions of research papers and import them to your workspace</p>

      <div className="flex flex-col gap-2 mt-6">
        <label className="text-sm font-medium text-gray-700">Search Query</label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search papers (e.g., 'machine learning')..." 
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button onClick={() => handleSearch()} disabled={loading} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Search History Pills */}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 items-center">
            <span className="text-xs text-gray-500 mr-1">Recent:</span>
            {searchHistory.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => { setQuery(item); handleSearch(item); }}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-gray-500">Source:</span>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-xs min-w-32">
          <option value="all">Unified Search (All)</option>
          <option value="semanticscholar">Semantic Scholar (IEEE, Nature, etc.)</option>
          <option value="arxiv">arXiv preprint server</option>
          <option value="huggingface">Hugging Face Daily</option>
        </select>
        {workspaces.length > 0 && (
          <>
            <span className="text-xs text-gray-500 ml-4">Import to:</span>
            <select value={selectedWs} onChange={(e) => setSelectedWs(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded text-xs">
              {workspaces.map((ws) => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Results Header with Sticky Action Bar */}
      <div className="flex justify-between items-center mt-6 mb-2 sticky top-0 bg-gray-50/90 backdrop-blur py-2 z-10">
        {papers.length > 0 ? (
          <p className="text-sm text-gray-600 font-medium">Found {papers.length} papers</p>
        ) : <div />}
        
        {selectedPapers.size > 0 && (
          <div className="flex items-center gap-4 bg-primary-50 border border-primary-100 px-4 py-2 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium text-primary-800">{selectedPapers.size} selected</span>
            <button
              onClick={handleBulkImport}
              disabled={isImporting}
              className="px-4 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
            >
              {isImporting ? 'Importing...' : 'Import Selected'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {papers.map((paper) => (
          <div 
            key={paper.arxiv_id} 
            onClick={() => toggleSelection(paper.arxiv_id)}
            className={`cursor-pointer transition-all border rounded-xl p-4 ${selectedPapers.has(paper.arxiv_id) ? 'bg-primary-50 border-primary-300 shadow-sm' : 'bg-white border-gray-200 hover:border-primary-200'}`}
          >
            <div className="flex items-start gap-4">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={selectedPapers.has(paper.arxiv_id)}
                  onChange={() => toggleSelection(paper.arxiv_id)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                />
              </div>
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-gray-900 text-sm">{paper.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{paper.authors}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{paper.abstract}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{paper.published}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{paper.source.toUpperCase()}</span>
                  {paper.citations > 0 && <span className="text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{paper.citations} Citations</span>}
                  {paper.pdf_url && <a href={paper.pdf_url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline ml-auto" onClick={(e) => e.stopPropagation()}>View Paper</a>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import api from '../utils/api';

interface Paper {
  arxiv_id: string; title: string; authors: string; abstract: string;
  published: string; source: string; pdf_url: string; citations: number;
}
interface Workspace { id: number; name: string; }

export default function SearchPapers() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState<number>(0);
  const [source, setSource] = useState('all');
  const [importing, setImporting] = useState<string>('');

  useEffect(() => {
    api.get('/papers/workspaces').then(({ data }) => {
      setWorkspaces(data);
      if (data.length > 0) setSelectedWs(data[0].id);
    });
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/papers/search?query=${encodeURIComponent(query)}&source=${source}`);
      setPapers(data.papers);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const importPaper = async (paper: Paper) => {
    if (!selectedWs) { alert('Please select a workspace first'); return; }
    setImporting(paper.arxiv_id);
    try {
      await api.post('/papers/import', {
        arxiv_id: paper.arxiv_id, title: paper.title, authors: paper.authors,
        abstract: paper.abstract, published: paper.published, source: paper.source,
        pdf_url: paper.pdf_url, workspace_id: selectedWs,
      });
      alert('Paper imported successfully!');
    } catch (err) { console.error(err); }
    setImporting('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Search Research Papers</h1>
      <p className="text-gray-500 text-sm mt-1">Search across millions of research papers and import them to your workspace</p>

      {/* Search bar */}
      <div className="flex gap-2 mt-6">
        <div className="flex-1 relative">
          <SearchIcon size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search papers..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button onClick={handleSearch} disabled={loading} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-gray-500">Source:</span>
        <select value={source} onChange={(e) => setSource(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-xs">
          <option value="all">All Sources</option>
          <option value="arxiv">arXiv</option>
        </select>
        {workspaces.length > 0 && (
          <>
            <span className="text-xs text-gray-500 ml-4">Import to:</span>
            <select value={selectedWs} onChange={(e) => setSelectedWs(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded text-xs">
              {workspaces.map((ws) => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Results */}
      {papers.length > 0 && <p className="text-sm text-gray-600 mt-4 font-medium">Found {papers.length} papers</p>}

      <div className="space-y-4 mt-3">
        {papers.map((paper) => (
          <div key={paper.arxiv_id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-gray-900 text-sm">{paper.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{paper.authors}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{paper.abstract}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{paper.published}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">{paper.source}</span>
                  {paper.pdf_url && <a href={paper.pdf_url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">View Paper</a>}
                </div>
              </div>
              <button
                onClick={() => importPaper(paper)}
                disabled={importing === paper.arxiv_id}
                className="px-3 py-1.5 border border-primary-300 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-50 disabled:opacity-50 whitespace-nowrap"
              >
                {importing === paper.arxiv_id ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
