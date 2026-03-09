<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900">{user.name || 'User'}</p>
          <p className="text-xs text-gray-500">{user.email || ''}</p>
        </div>
        <button onClick={handleLogout} className="ml-2 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
=======
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900">{user.name || 'User'}</p>
          <p className="text-xs text-gray-500">{user.email || ''}</p>
        </div>
        <button onClick={handleLogout} className="ml-2 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
>>>>>>> bcdd35be7fe9a7ef5b266d9cb38bb9542bafbd15
