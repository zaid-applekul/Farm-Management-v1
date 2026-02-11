import React from 'react';
import { ViewType } from '../types';
import { 
  BarChart3, 
  Sprout, 
  RotateCcw, 
  PoundSterling, 
  Package, 
  Wrench, 
  Users,
  Menu,
  X,
  TreePine,
  Apple,
  Bug
} from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function Navigation({ currentView, onViewChange, isMobileMenuOpen, onToggleMobileMenu }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: BarChart3 },
    { id: 'fields' as ViewType, label: 'Fields', icon: Sprout },
    { id: 'trees' as ViewType, label: 'Tree Blocks', icon: TreePine },
    { id: 'harvest' as ViewType, label: 'Harvest', icon: Apple },
    { id: 'pest' as ViewType, label: 'Pest Control', icon: Bug },
    { id: 'rotation' as ViewType, label: 'Rotation', icon: RotateCcw },
    { id: 'finances' as ViewType, label: 'Finances', icon: PoundSterling },
    { id: 'inventory' as ViewType, label: 'Inventory', icon: Package },
    { id: 'equipment' as ViewType, label: 'Equipment', icon: Wrench },
    { id: 'users' as ViewType, label: 'Users', icon: Users },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-lg shadow-lg"
        onClick={onToggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-green-800">AppleKul Farm</h1>
          <p className="text-sm text-gray-600 mt-1">Management System</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onToggleMobileMenu();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${currentView === item.id 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggleMobileMenu}
        />
      )}
    </>
  );
}