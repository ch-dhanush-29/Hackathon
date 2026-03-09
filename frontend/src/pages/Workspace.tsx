import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, FileText, MessageSquare, BookOpen, Trash2 } from 'lucide-react';
import api from '../utils/api';

interface Paper { id: number; title: string; authors: string; abstract: string; published: string; source: string; pdf_url: string; }
interface ChatMsg { id: number; role: string; content: string; created_at: string; }

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [tab, setTab] = useState<'papers' | 'chat' | 'review'>('papers');
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (id) fetchWorkspace(); }, [id]);

  const fetchWorkspace = async () => {
    try {
      const { data } = await api.get(`/papers/workspaces/${id}`);
      setWorkspace(data);
      setPapers(data.papers);
      const chatRes = await api.get(`/chat/history/${id}`);
      setChatMessages(chatRes.data);
    } catch (err) { console.error(err); }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: msg, created_at: '' }]);
    setChatLoading(true);
    try {
      const { data } = await api.post('/chat', { content: msg, workspace_id: Number(id) });
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.response, created_at: '' }]);
    } catch (err) { console.error(err); }
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const generateReview = async () => {
    const paperIds = papers.map(p => p.id);
    if (paperIds.length === 0) return;
    setReviewLoading(true);
    try {
      const { data } = await api.post('/ai-tools/review', { paper_ids: paperIds });
      setReviewResult(data.result);
    } catch (err) { console.error(err); }
    setReviewLoading(false);
  };

  const deletePaper = async (paperId: number) => {
    try {
      await api.delete(`/papers/${paperId}`);
      fetchWorkspace();
    } catch (err) { console.error(err); }
  };

  const toggleSelect = (paperId: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(paperId) ? next.delete(paperId) : next.add(paperId);
      return next;
    });
  };

  if (!workspace) return <div className="p-8 text-gray-500">Loading workspace...</div>;

  return (
    <div>
      <Link to="/dashboard" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
      <p className="text-sm text-gray-500 mt-1">{papers.length} papers · {selected.size} selected</p>

      {/* Tabs */}
      <div className="flex gap-1 mt-4 border-b border-gray-200">
        {[
          { key: 'papers' as const, label: `Papers (${papers.length})`, icon: FileText },
          { key: 'chat' as const, label: 'AI Chat', icon: MessageSquare },
          { key: 'review' as const, label: 'Generate Review', icon: BookOpen },
        ].map((t) => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Papers Tab */}
      {tab === 'papers' && (
        <div className="space-y-3 mt-4">
          {papers.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="mt-1 accent-primary-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.authors}</p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3">{p.abstract}</p>
                  {p.pdf_url && <a href={p.pdf_url} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline mt-1 inline-block">View Paper →</a>}
                </div>
                <button onClick={() => deletePaper(p.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {papers.length === 0 && <p className="text-gray-400 text-center mt-8">No papers yet. Go to Search Papers to import some.</p>}
        </div>
      )}

      {/* Chat Tab */}
      {tab === 'chat' && (
        <div className="mt-4 flex flex-col h-[calc(100vh-300px)]">
          <div className="bg-primary-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-primary-800">AI Research Assistant</p>
            <p className="text-xs text-primary-600">{papers.length} paper(s) selected · Ask anything!</p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
            {chatMessages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-primary-600 text-white font-medium' : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  {m.role === 'assistant' ? (
                     <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\ng/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ) : (
                     <p className="whitespace-pre-wrap font-sans">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm text-gray-500">Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              placeholder="Ask about the selected papers..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button onClick={sendChat} disabled={chatLoading} className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Review Tab */}
      {tab === 'review' && (
        <div className="mt-4">
          <button onClick={generateReview} disabled={reviewLoading || papers.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {reviewLoading ? 'Generating...' : 'Generate Literature Review'}
          </button>
          {reviewResult && (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Literature Review Results</h3>
                <button onClick={() => navigator.clipboard.writeText(reviewResult)} className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">Copy</button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{reviewResult}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
