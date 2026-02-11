import React from 'react';
import { useFields } from '../hooks/useFields';
import { useFinances } from '../hooks/useFinances';
import { useInventory } from '../hooks/useInventory';
import { useEquipment } from '../hooks/useEquipment';
import { useHarvest } from '../hooks/useHarvest';
import { useTrees } from '../hooks/useTrees';
import { usePestTreatments } from '../hooks/usePestTreatments';
import { TrendingUp, TrendingDown, MapPin, Package, Wrench, PoundSterling, Apple } from 'lucide-react';

export function Dashboard() {
  const { fields, loading: fieldsLoading } = useFields();
  const { finances, loading: financesLoading } = useFinances();
  const { inventory, loading: inventoryLoading } = useInventory();
  const { equipment, loading: equipmentLoading } = useEquipment();
  const { harvest, loading: harvestLoading } = useHarvest();
  const { trees, loading: treesLoading } = useTrees();
  const { pestTreatments, loading: pestLoading } = usePestTreatments();

  const loading = fieldsLoading || financesLoading || inventoryLoading || equipmentLoading || harvestLoading || treesLoading || pestLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const totalFields = fields.length;
  const totalTrees = trees.reduce((sum, tree) => sum + (tree.tree_count || 0), 0);
  const harvestRevenue = harvest.reduce((sum, h) => sum + (h.total_revenue || 0), 0);
  const pendingTreatments = pestTreatments.filter(t => !t.completed).length;
  const totalIncome = finances.filter(f => f.entry_type === 'income').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalExpenses = finances.filter(f => f.entry_type === 'expense').reduce((sum, f) => sum + (f.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  const lowStockItems = inventory.filter(i => (i.quantity || 0) < 100).length;
  const equipmentIssues = equipment.filter(e => e.condition === 'poor' || e.condition === 'fair').length;

  const summaryCards = [
    {
      title: 'Apple Trees',
      value: totalTrees.toLocaleString(),
      subtitle: `${totalFields} orchard blocks`,
      icon: Apple,
      color: 'green'
    },
    {
      title: 'Harvest Revenue',
      value: `₹${harvestRevenue.toLocaleString()}`,
      subtitle: `${harvest.reduce((sum, h) => sum + (h.bin_count || 0), 0)} bins harvested`,
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
      value: `${equipment.length - equipmentIssues}/${equipment.length}`,
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
          {fields.slice(0, 6).map(field => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{field.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  field.weed_state === 'low' ? 'bg-green-100 text-green-800' :
                  field.weed_state === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {field.weed_state || 'low'} weeds
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{field.crop} • {field.area} ha</p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  field.growth_stage === 'seeding' ? 'bg-yellow-400' :
                  field.growth_stage === 'vegetative' ? 'bg-green-400' :
                  field.growth_stage === 'flowering' ? 'bg-purple-400' :
                  field.growth_stage === 'fruiting' ? 'bg-orange-400' :
                  'bg-blue-400'
                }`} />
                <span className="text-sm text-gray-700 capitalize">{field.growth_stage || 'vegetative'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Harvest Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Harvest Activity</h3>
          <span className="text-sm text-gray-500">{harvest.length} records</span>
        </div>
        <div className="space-y-3">
          {harvest.slice(0, 3).map(harvestRecord => (
            <div key={harvestRecord.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{harvestRecord.variety} - {harvestRecord.bin_count} bins</p>
                <p className="text-xs text-gray-500">
                  {harvestRecord.quality_grade} grade • {new Date(harvestRecord.harvest_date).toLocaleDateString()}
                </p>
              </div>
              <span className="font-medium text-green-600">
                ₹{harvestRecord.total_revenue?.toLocaleString()}
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
          {finances.slice(0, 5).map(entry => (
            <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{entry.description}</p>
                <p className="text-xs text-gray-500">{new Date(entry.entry_date).toLocaleDateString()}</p>
              </div>
              <span className={`font-medium ${
                entry.entry_type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {entry.entry_type === 'income' ? '+' : '-'}₹{entry.amount?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}