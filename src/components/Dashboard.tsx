import React from 'react';
import { mockFields, mockFinances, mockInventory, mockEquipment, mockHarvest, mockTrees, mockPestTreatments } from '../data/mockData';
import { TrendingUp, TrendingDown, MapPin, Package, Wrench, PoundSterling } from 'lucide-react';

export function Dashboard() {
  const totalFields = mockFields.length;
  const totalTrees = mockTrees.reduce((sum, tree) => sum + tree.treeCount, 0);
  const harvestRevenue = mockHarvest.reduce((sum, h) => sum + h.totalRevenue, 0);
  const pendingTreatments = mockPestTreatments.filter(t => !t.completed).length;
  const totalIncome = mockFinances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = mockFinances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const lowStockItems = mockInventory.filter(i => i.quantity < 100).length;
  const equipmentIssues = mockEquipment.filter(e => e.condition === 'poor' || e.condition === 'fair').length;

  const summaryCards = [
    {
      title: 'Apple Trees',
      value: totalTrees.toLocaleString(),
      subtitle: `${totalFields} orchard blocks`,
      icon: MapPin,
      color: 'green'
    },
    {
      title: 'Harvest Revenue',
      value: `₹${harvestRevenue.toLocaleString()}`,
      subtitle: `${mockHarvest.reduce((sum, h) => sum + h.binCount, 0)} bins harvested`,
      icon: netProfit >= 0 ? TrendingUp : TrendingDown,
      color: netProfit >= 0 ? 'green' : 'red'
    },
    {
      title: 'Pest Treatments',
      value: pendingTreatments,
      subtitle: 'Treatments pending',
      icon: Package,
      color: pendingTreatments > 0 ? 'amber' : 'green'
    },
    {
      title: 'Equipment Status',
      value: `${mockEquipment.length - equipmentIssues}/${mockEquipment.length}`,
      subtitle: 'Equipment in good condition',
      icon: Wrench,
      color: equipmentIssues === 0 ? 'green' : 'amber'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'amber':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Farm Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1 sm:mt-0">Overview of your farm operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`p-6 rounded-lg border-2 ${getColorClasses(card.color)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs opacity-75 mt-1">{card.subtitle}</p>
                </div>
                <Icon size={32} className="opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orchard Block Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {mockFields.map(field => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{field.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  field.weedState === 'low' ? 'bg-green-100 text-green-800' :
                  field.weedState === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {field.weedState} weeds
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{field.crop} • {field.area} ha</p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  field.growthStage === 'seeding' ? 'bg-yellow-400' :
                  field.growthStage === 'vegetative' ? 'bg-green-400' :
                  field.growthStage === 'flowering' ? 'bg-purple-400' :
                  field.growthStage === 'fruiting' ? 'bg-orange-400' :
                  'bg-blue-400'
                }`} />
                <span className="text-sm text-gray-700 capitalize">{field.growthStage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Harvest Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Harvest Activity</h3>
          <span className="text-sm text-gray-500">{mockHarvest.length} records</span>
        </div>
        <div className="space-y-3">
          {mockHarvest.slice(0, 3).map(harvest => (
            <div key={harvest.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{harvest.variety} - {harvest.binCount} bins</p>
                <p className="text-xs text-gray-500">
                  {harvest.qualityGrade} grade • {new Date(harvest.harvestDate).toLocaleDateString()}
                </p>
              </div>
              <span className="font-medium text-green-600">
                ₹{harvest.totalRevenue.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Financial Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Financial Activity</h3>
          <PoundSterling size={20} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {mockFinances.slice(0, 5).map(entry => (
            <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{entry.description}</p>
                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
              <span className={`font-medium ${
                entry.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}