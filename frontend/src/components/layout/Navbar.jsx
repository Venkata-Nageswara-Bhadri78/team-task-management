import { Menu, LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden mr-4 text-slate-500 hover:text-slate-700"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 md:hidden">Team Task Manager</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <User className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{user?.name}</span>
        </div>
        <Button variant="outline" onClick={logout} className="!p-2">
          <LogOut className="w-5 h-5 text-slate-500" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
