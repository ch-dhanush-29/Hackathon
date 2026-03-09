<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Lightbulb, Key, BookOpen, Download } from 'lucide-react';
import api from '../utils/api';

interface Paper { id: number; title: string; authors: string; }

export default function AITools() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState('');
  const [loading, setLoading] = useState('');

  useEffect(() => {
    // Fetch all papers across all workspaces
    api.get('/papers/workspaces').then(async ({ data }) => {
      const allPapers: Paper[] = [];
      for (const ws of data) {
        const res = await api.get(`/papers/workspaces/${ws.id}`);
        allPapers.push(...res.data.papers.map((p: any) => ({ id: p.id, title: p.title, authors: p.authors })));
      }
      setPapers(allPapers);
    });
  }, []);

  const togglePaper = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const runTool = async (tool: 'summary' | 'insights' | 'review') => {
    const ids = Array.from(selected);
    if (ids.length === 0) { alert('Select at least one paper'); return; }
    setLoading(tool);
    try {
      const { data } = await api.post(`/ai-tools/${tool}`, { paper_ids: ids });
      setResult(data.result);
      setResultType(tool);
    } catch (err) { console.error(err); }
    setLoading('');
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resultType}_results.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
      <p className="text-gray-500 text-sm mt-1">
        AI-powered research analysis tools · {papers.length} papers available · {selected.size} selected
      </p>

      {/* Paper selection */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs">📄</span>
          Select Papers for Analysis
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {papers.map((p) => (
            <label key={p.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selected.has(p.id) ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50 border border-transparent'}`}>
              <input type="checkbox" checked={selected.has(p.id)} onChange={() => togglePaper(p.id)} className="accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">{p.authors}</p>
              </div>
            </label>
          ))}
          {papers.length === 0 && <p className="text-gray-400 text-sm">No papers imported yet.</p>}
        </div>
        <p className="text-xs text-primary-600 mt-2">{selected.size} paper(s) selected</p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <Lightbulb size={24} className="text-primary-500 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">AI Summaries</h3>
          <p className="text-xs text-gray-500 mt-1">Generate concise summaries of selected research papers</p>
          <button onClick={() => runTool('summary')} disabled={loading === 'summary'} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 disabled:opacity-50 w-full">
            {loading === 'summary' ? 'Generating...' : '▷ Generate Summaries'}
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <Key size={24} className="text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Key Insights</h3>
          <p className="text-xs text-gray-500 mt-1">Extract key insights and trends from research papers</p>
          <button onClick={() => runTool('insights')} disabled={loading === 'insights'} className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600 disabled:opacity-50 w-full">
            {loading === 'insights' ? 'Extracting...' : '⚙ Extract Insights'}
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <BookOpen size={24} className="text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Literature Review</h3>
          <p className="text-xs text-gray-500 mt-1">Generate comprehensive literature reviews automatically</p>
          <button onClick={() => runTool('review')} disabled={loading === 'review'} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 w-full">
            {loading === 'review' ? 'Generating...' : '⊞ Generate Review'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold capitalize">{resultType} Results</h3>
            <button onClick={downloadResult} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
              <Download size={12} /> Download
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { Lightbulb, Key, BookOpen, Download } from 'lucide-react';
import api from '../utils/api';

interface Paper { id: number; title: string; authors: string; }

export default function AITools() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState('');
  const [loading, setLoading] = useState('');

  useEffect(() => {
    // Fetch all papers across all workspaces
    api.get('/papers/workspaces').then(async ({ data }) => {
      const allPapers: Paper[] = [];
      for (const ws of data) {
        const res = await api.get(`/papers/workspaces/${ws.id}`);
        allPapers.push(...res.data.papers.map((p: any) => ({ id: p.id, title: p.title, authors: p.authors })));
      }
      setPapers(allPapers);
    });
  }, []);

  const togglePaper = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const runTool = async (tool: 'summary' | 'insights' | 'review') => {
    const ids = Array.from(selected);
    if (ids.length === 0) { alert('Select at least one paper'); return; }
    setLoading(tool);
    try {
      const { data } = await api.post(`/ai-tools/${tool}`, { paper_ids: ids });
      setResult(data.result);
      setResultType(tool);
    } catch (err) { console.error(err); }
    setLoading('');
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resultType}_results.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
      <p className="text-gray-500 text-sm mt-1">
        AI-powered research analysis tools · {papers.length} papers available · {selected.size} selected
      </p>

      {/* Paper selection */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs">📄</span>
          Select Papers for Analysis
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {papers.map((p) => (
            <label key={p.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selected.has(p.id) ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50 border border-transparent'}`}>
              <input type="checkbox" checked={selected.has(p.id)} onChange={() => togglePaper(p.id)} className="accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">{p.authors}</p>
              </div>
            </label>
          ))}
          {papers.length === 0 && <p className="text-gray-400 text-sm">No papers imported yet.</p>}
        </div>
        <p className="text-xs text-primary-600 mt-2">{selected.size} paper(s) selected</p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <Lightbulb size={24} className="text-primary-500 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">AI Summaries</h3>
          <p className="text-xs text-gray-500 mt-1">Generate concise summaries of selected research papers</p>
          <button onClick={() => runTool('summary')} disabled={loading === 'summary'} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 disabled:opacity-50 w-full">
            {loading === 'summary' ? 'Generating...' : '▷ Generate Summaries'}
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <Key size={24} className="text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Key Insights</h3>
          <p className="text-xs text-gray-500 mt-1">Extract key insights and trends from research papers</p>
          <button onClick={() => runTool('insights')} disabled={loading === 'insights'} className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600 disabled:opacity-50 w-full">
            {loading === 'insights' ? 'Extracting...' : '⚙ Extract Insights'}
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <BookOpen size={24} className="text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Literature Review</h3>
          <p className="text-xs text-gray-500 mt-1">Generate comprehensive literature reviews automatically</p>
          <button onClick={() => runTool('review')} disabled={loading === 'review'} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 w-full">
            {loading === 'review' ? 'Generating...' : '⊞ Generate Review'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold capitalize">{resultType} Results</h3>
            <button onClick={downloadResult} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
              <Download size={12} /> Download
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
