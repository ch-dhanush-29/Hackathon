<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, Save, Download } from 'lucide-react';
import api from '../utils/api';

interface Workspace { id: number; name: string; }

export default function UploadPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState(0);

  useEffect(() => {
    api.get('/papers/workspaces').then(({ data }) => {
      setWorkspaces(data);
      if (data.length > 0) setSelectedWs(data[0].id);
    });
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResult(data);
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const generateSummary = async () => {
    if (!uploadResult) return;
    setSummaryLoading(true);
    try {
      const { data } = await api.post(`/upload/pdf/${uploadResult.id}/summary`);
      setSummary(data.summary);
    } catch (err) { console.error(err); }
    setSummaryLoading(false);
  };

  const saveToWorkspace = async () => {
    if (!uploadResult || !selectedWs) return;
    try {
      await api.post(`/upload/pdf/${uploadResult.id}/save-to-workspace`, { workspace_id: selectedWs });
      alert('Saved to workspace!');
    } catch (err) { console.error(err); }
  };

  const downloadText = () => {
    if (!uploadResult) return;
    const blob = new Blob([uploadResult.extracted_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${file?.name || 'paper'}_text.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Upload Research Paper</h1>
      <p className="text-gray-500 text-sm mt-1">Upload a PDF to extract text and generate AI insights</p>

      {/* Upload area */}
      <div className="mt-6 bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
        <Upload size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 font-medium">Upload PDF</p>
        <p className="text-xs text-gray-400 mt-1">Drop your PDF file here or click to browse</p>

        <input
          type="file" accept=".pdf"
          onChange={(e) => { setFile(e.target.files?.[0] || null); setUploadResult(null); setSummary(''); }}
          className="hidden" id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 cursor-pointer">
          Select PDF File
        </label>

        {file && (
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
              <FileText size={14} /> {file.name} ✓
            </div>
          </div>
        )}
      </div>

      {file && !uploadResult && (
        <button onClick={handleUpload} disabled={uploading} className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {uploading ? 'Processing...' : 'Upload & Extract Text'}
        </button>
      )}

      {/* Actions after upload */}
      {uploadResult && (
        <div className="mt-4 flex gap-3">
          <button onClick={generateSummary} disabled={summaryLoading} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            <Sparkles size={14} /> {summaryLoading ? 'Generating...' : 'Generate AI Summary'}
          </button>
          <button onClick={saveToWorkspace} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            <Save size={14} /> Save to Workspace
          </button>
          <select value={selectedWs} onChange={(e) => setSelectedWs(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded text-xs">
            {workspaces.map((ws) => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
          </select>
          <button onClick={downloadText} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download size={14} /> Download Text
          </button>
        </div>
      )}

      {/* Extracted text */}
      {uploadResult && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2">Extracted Text:</h3>
          <div className="max-h-48 overflow-y-auto text-xs text-gray-600 bg-gray-50 rounded p-3">
            {uploadResult.extracted_text}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {summary && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-primary-500" /> AI Summary
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{summary}</pre>
        </div>
      )}
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, Save, Download } from 'lucide-react';
import api from '../utils/api';

interface Workspace { id: number; name: string; }

export default function UploadPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWs, setSelectedWs] = useState(0);

  useEffect(() => {
    api.get('/papers/workspaces').then(({ data }) => {
      setWorkspaces(data);
      if (data.length > 0) setSelectedWs(data[0].id);
    });
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResult(data);
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const generateSummary = async () => {
    if (!uploadResult) return;
    setSummaryLoading(true);
    try {
      const { data } = await api.post(`/upload/pdf/${uploadResult.id}/summary`);
      setSummary(data.summary);
    } catch (err) { console.error(err); }
    setSummaryLoading(false);
  };

  const saveToWorkspace = async () => {
    if (!uploadResult || !selectedWs) return;
    try {
      await api.post(`/upload/pdf/${uploadResult.id}/save-to-workspace`, { workspace_id: selectedWs });
      alert('Saved to workspace!');
    } catch (err) { console.error(err); }
  };

  const downloadText = () => {
    if (!uploadResult) return;
    const blob = new Blob([uploadResult.extracted_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${file?.name || 'paper'}_text.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Upload Research Paper</h1>
      <p className="text-gray-500 text-sm mt-1">Upload a PDF to extract text and generate AI insights</p>

      {/* Upload area */}
      <div className="mt-6 bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
        <Upload size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 font-medium">Upload PDF</p>
        <p className="text-xs text-gray-400 mt-1">Drop your PDF file here or click to browse</p>

        <input
          type="file" accept=".pdf"
          onChange={(e) => { setFile(e.target.files?.[0] || null); setUploadResult(null); setSummary(''); }}
          className="hidden" id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 cursor-pointer">
          Select PDF File
        </label>

        {file && (
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
              <FileText size={14} /> {file.name} ✓
            </div>
          </div>
        )}
      </div>

      {file && !uploadResult && (
        <button onClick={handleUpload} disabled={uploading} className="mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {uploading ? 'Processing...' : 'Upload & Extract Text'}
        </button>
      )}

      {/* Actions after upload */}
      {uploadResult && (
        <div className="mt-4 flex gap-3">
          <button onClick={generateSummary} disabled={summaryLoading} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            <Sparkles size={14} /> {summaryLoading ? 'Generating...' : 'Generate AI Summary'}
          </button>
          <button onClick={saveToWorkspace} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            <Save size={14} /> Save to Workspace
          </button>
          <select value={selectedWs} onChange={(e) => setSelectedWs(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded text-xs">
            {workspaces.map((ws) => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
          </select>
          <button onClick={downloadText} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download size={14} /> Download Text
          </button>
        </div>
      )}

      {/* Extracted text */}
      {uploadResult && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2">Extracted Text:</h3>
          <div className="max-h-48 overflow-y-auto text-xs text-gray-600 bg-gray-50 rounded p-3">
            {uploadResult.extracted_text}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {summary && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Sparkles size={14} className="text-primary-500" /> AI Summary
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{summary}</pre>
        </div>
      )}
    </div>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
