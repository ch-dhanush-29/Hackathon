<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Plus, Save, Download, Trash2, FileText } from 'lucide-react';
import api from '../utils/api';

interface Doc { id: number; title: string; content: string; created_at: string; updated_at: string; }

export default function DocSpace() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocs(data);
    } catch (err) { console.error(err); }
  };

  const createDoc = async () => {
    try {
      const { data } = await api.post('/documents', { title: 'Untitled Document', content: '' });
      fetchDocs();
      setActiveDoc(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (err) { console.error(err); }
  };

  const openDoc = (doc: Doc) => {
    setActiveDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
  };

  const saveDoc = async () => {
    if (!activeDoc) return;
    setSaving(true);
    try {
      await api.put(`/documents/${activeDoc.id}`, { title, content });
      fetchDocs();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const deleteDoc = async (id: number) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      if (activeDoc?.id === id) { setActiveDoc(null); setTitle(''); setContent(''); }
      fetchDocs();
    } catch (err) { console.error(err); }
  };

  const downloadDoc = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title || 'document'}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] -mt-2">
      {/* Document sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 p-3 flex flex-col">
        <button onClick={createDoc} className="w-full flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 mb-3">
          <Plus size={14} /> New Document
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {docs.map((doc) => (
            <div key={doc.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm group ${activeDoc?.id === doc.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}
              onClick={() => openDoc(doc)}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText size={14} />
                <span className="truncate">{doc.title}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col">
        {activeDoc ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-semibold outline-none flex-1" placeholder="Document title" />
              <div className="flex gap-2">
                <button onClick={saveDoc} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                  <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={downloadDoc} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-full resize-none outline-none text-sm text-gray-800 leading-relaxed"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>Select a document or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { Plus, Save, Download, Trash2, FileText } from 'lucide-react';
import api from '../utils/api';

interface Doc { id: number; title: string; content: string; created_at: string; updated_at: string; }

export default function DocSpace() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocs(data);
    } catch (err) { console.error(err); }
  };

  const createDoc = async () => {
    try {
      const { data } = await api.post('/documents', { title: 'Untitled Document', content: '' });
      fetchDocs();
      setActiveDoc(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (err) { console.error(err); }
  };

  const openDoc = (doc: Doc) => {
    setActiveDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
  };

  const saveDoc = async () => {
    if (!activeDoc) return;
    setSaving(true);
    try {
      await api.put(`/documents/${activeDoc.id}`, { title, content });
      fetchDocs();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const deleteDoc = async (id: number) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      if (activeDoc?.id === id) { setActiveDoc(null); setTitle(''); setContent(''); }
      fetchDocs();
    } catch (err) { console.error(err); }
  };

  const downloadDoc = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title || 'document'}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] -mt-2">
      {/* Document sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 p-3 flex flex-col">
        <button onClick={createDoc} className="w-full flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 mb-3">
          <Plus size={14} /> New Document
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {docs.map((doc) => (
            <div key={doc.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm group ${activeDoc?.id === doc.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}
              onClick={() => openDoc(doc)}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText size={14} />
                <span className="truncate">{doc.title}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col">
        {activeDoc ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-semibold outline-none flex-1" placeholder="Document title" />
              <div className="flex gap-2">
                <button onClick={saveDoc} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                  <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={downloadDoc} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-full resize-none outline-none text-sm text-gray-800 leading-relaxed"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>Select a document or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
