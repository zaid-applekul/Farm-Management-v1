import React, { useState } from 'react';
import { ViewType } from './types';
import { AuthWrapper } from './components/AuthWrapper';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { FieldManagement } from './components/FieldManagement';
import { TreeManagement } from './components/TreeManagement';
import { HarvestManagement } from './components/HarvestManagement';
import { PestManagement } from './components/PestManagement';
import { CropRotation } from './components/CropRotation';
import { FinancialLedger } from './components/FinancialLedger';
import { InventoryManagement } from './components/InventoryManagement';
import { EquipmentRegistry } from './components/EquipmentRegistry';
import { UserManagement } from './components/UserManagement';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'fields': return <FieldManagement />;
      case 'trees': return <TreeManagement />;
      case 'harvest': return <HarvestManagement />;
      case 'pest': return <PestManagement />;
      case 'rotation': return <CropRotation />;
      case 'finances': return <FinancialLedger />;
      case 'inventory': return <InventoryManagement />;
      case 'equipment': return <EquipmentRegistry />;
      case 'users': return <UserManagement />;
      default: return <Dashboard />;
    }
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50 flex">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={handleToggleMobileMenu}
        />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}
        </div>
      </main>
    </div>
  );
}

export default App;