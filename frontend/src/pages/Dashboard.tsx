<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderOpen, FileText, Search } from 'lucide-react';
import api from '../utils/api';

interface Workspace {
  id: number; name: string; description: string; created_at: string; paper_count: number;
}

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => { fetchWorkspaces(); }, []);

  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get('/papers/workspaces');
      setWorkspaces(data);
    } catch (err) { console.error(err); }
  };

  const createWorkspace = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/papers/workspaces', { name: newName, description: newDesc });
      setNewName(''); setNewDesc(''); setShowCreate(false);
      fetchWorkspaces();
    } catch (err) { console.error(err); }
  };

  const deleteWorkspace = async (id: number) => {
    if (!confirm('Delete this workspace and all its papers?')) return;
    try {
      await api.delete(`/papers/workspaces/${id}`);
      fetchWorkspaces();
    } catch (err) { console.error(err); }
  };

  const totalPapers = workspaces.reduce((sum, ws) => sum + ws.paper_count, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 text-sm mt-1">Manage your research workspaces</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Workspaces</p>
              <p className="text-2xl font-bold mt-1">{workspaces.length}</p>
            </div>
            <FolderOpen className="text-primary-400" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Papers Imported</p>
              <p className="text-2xl font-bold mt-1">{totalPapers}</p>
            </div>
            <FileText className="text-primary-400" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Quick Actions</p>
          <Link to="/search" className="flex items-center gap-1 text-primary-600 text-sm mt-2 font-medium hover:underline">
            <Search size={14} /> Search Papers
          </Link>
        </div>
      </div>

      {/* Create workspace */}
      <button onClick={() => setShowCreate(!showCreate)} className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
        <Plus size={16} /> Create New Workspace
      </button>

      {showCreate && (
        <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 max-w-md">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Workspace name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-primary-500" />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-primary-500" />
          <div className="flex gap-2">
            <button onClick={createWorkspace} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-600 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Workspace grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {workspaces.map((ws) => (
          <div key={ws.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <Link to={`/workspace/${ws.id}`} className="flex-1">
                <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{ws.description || 'No description'}</p>
              </Link>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{ws.paper_count} papers</span>
                <button onClick={() => deleteWorkspace(ws.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              📅 Created {new Date(ws.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {workspaces.length === 0 && (
        <div className="text-center text-gray-400 mt-12">
          <FolderOpen size={48} className="mx-auto mb-3 opacity-50" />
          <p>No workspaces yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderOpen, FileText, Search } from 'lucide-react';
import api from '../utils/api';

interface Workspace {
  id: number; name: string; description: string; created_at: string; paper_count: number;
}

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => { fetchWorkspaces(); }, []);

  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get('/papers/workspaces');
      setWorkspaces(data);
    } catch (err) { console.error(err); }
  };

  const createWorkspace = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/papers/workspaces', { name: newName, description: newDesc });
      setNewName(''); setNewDesc(''); setShowCreate(false);
      fetchWorkspaces();
    } catch (err) { console.error(err); }
  };

  const deleteWorkspace = async (id: number) => {
    if (!confirm('Delete this workspace and all its papers?')) return;
    try {
      await api.delete(`/papers/workspaces/${id}`);
      fetchWorkspaces();
    } catch (err) { console.error(err); }
  };

  const totalPapers = workspaces.reduce((sum, ws) => sum + ws.paper_count, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 text-sm mt-1">Manage your research workspaces</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Workspaces</p>
              <p className="text-2xl font-bold mt-1">{workspaces.length}</p>
            </div>
            <FolderOpen className="text-primary-400" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Papers Imported</p>
              <p className="text-2xl font-bold mt-1">{totalPapers}</p>
            </div>
            <FileText className="text-primary-400" size={24} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Quick Actions</p>
          <Link to="/search" className="flex items-center gap-1 text-primary-600 text-sm mt-2 font-medium hover:underline">
            <Search size={14} /> Search Papers
          </Link>
        </div>
      </div>

      {/* Create workspace */}
      <button onClick={() => setShowCreate(!showCreate)} className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
        <Plus size={16} /> Create New Workspace
      </button>

      {showCreate && (
        <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 max-w-md">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Workspace name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-primary-500" />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-primary-500" />
          <div className="flex gap-2">
            <button onClick={createWorkspace} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-600 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Workspace grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {workspaces.map((ws) => (
          <div key={ws.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <Link to={`/workspace/${ws.id}`} className="flex-1">
                <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{ws.description || 'No description'}</p>
              </Link>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{ws.paper_count} papers</span>
                <button onClick={() => deleteWorkspace(ws.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              📅 Created {new Date(ws.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {workspaces.length === 0 && (
        <div className="text-center text-gray-400 mt-12">
          <FolderOpen size={48} className="mx-auto mb-3 opacity-50" />
          <p>No workspaces yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
