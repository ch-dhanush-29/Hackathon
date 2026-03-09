<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SearchPapers from './pages/SearchPapers';
import Workspace from './pages/Workspace';
import AITools from './pages/AITools';
import UploadPDF from './pages/UploadPDF';
import DocSpace from './pages/DocSpace';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPapers />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/upload" element={<UploadPDF />} />
          <Route path="/docspace" element={<DocSpace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
=======
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SearchPapers from './pages/SearchPapers';
import Workspace from './pages/Workspace';
import AITools from './pages/AITools';
import UploadPDF from './pages/UploadPDF';
import DocSpace from './pages/DocSpace';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPapers />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/upload" element={<UploadPDF />} />
          <Route path="/docspace" element={<DocSpace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
