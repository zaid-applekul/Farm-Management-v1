import React, { useState } from 'react';
import { useHarvest } from '../hooks/useHarvest';
import { useTrees } from '../hooks/useTrees';
import { appleVarieties } from '../data/mockData';
import { Apple, Plus, TrendingUp, Package, Star, Thermometer, Calendar } from 'lucide-react';

export function HarvestManagement() {
  const { harvest, loading: harvestLoading, error: harvestError } = useHarvest();
  const { trees, loading: treesLoading } = useTrees();
  const [selectedVariety, setSelectedVariety] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const loading = harvestLoading || treesLoading;

  const filteredHarvest = selectedVariety === 'all' 
    ? harvest 
    : harvest.filter(h => h.variety === selectedVariety);

  const totalBins = filteredHarvest.reduce((sum, h) => sum + (h.bin_count || 0), 0);
  const totalRevenue = filteredHarvest.reduce((sum, h) => sum + (h.total_revenue || 0), 0);
  const avgPricePerBin = totalBins > 0 ? totalRevenue / totalBins : 0;
  const premiumGrade = filteredHarvest.filter(h => h.quality_grade === 'premium').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (harvestError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading harvest data: {harvestError}</p>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'premium': return 'bg-gold-100 text-yellow-800 border-yellow-300';
      case 'standard': return 'bg-green-100 text-green-800 border-green-300';
      case 'processing': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getVarietyInfo = (variety: string) => {
    return appleVarieties.find(v => v.name === variety);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Harvest Management</h2>
          <p className="text-gray-600 mt-1">Track apple harvest, quality grading, and storage</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Record Harvest</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Total Bins</p>
              <p className="text-2xl font-bold text-green-800">{totalBins}</p>
              <p className="text-xs text-green-600 mt-1">This season</p>
            </div>
            <Package className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-800">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">From harvest sales</p>
            </div>
            <TrendingUp className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div>
            <p className="text-purple-700 font-medium">Avg Price/Bin</p>
            <p className="text-2xl font-bold text-purple-800">₹{Math.round(avgPricePerBin)}</p>
            <p className="text-xs text-purple-600 mt-1">Market rate</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 font-medium">Premium Grade</p>
              <p className="text-2xl font-bold text-yellow-800">{premiumGrade}</p>
              <p className="text-xs text-yellow-600 mt-1">High quality batches</p>
            </div>
            <Star className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Variety Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">Filter by Variety:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVariety('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedVariety === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Varieties
            </button>
            {Array.from(new Set(harvest.map(h => h.variety))).map(variety => (
              <button
                key={variety}
                onClick={() => setSelectedVariety(variety)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedVariety === variety ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {variety}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Harvest Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHarvest.map(harvest => {
          const tree = trees.find(t => t.id === harvestRecord.tree_id);
          return (
            <div key={harvest.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Apple size={20} className="text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{harvest.variety}</h3>
                    <p className="text-sm text-gray-600">Harvested by {harvest.picker}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full font-medium border ${getGradeColor(harvestRecord.quality_grade || 'standard')}`}>
                  {harvestRecord.quality_grade}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Bins Harvested</p>
                  <p className="text-xl font-bold text-gray-900">{harvestRecord.bin_count}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Revenue</p>
                  <p className="text-xl font-bold text-green-600">₹{harvestRecord.total_revenue?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Price per Bin</p>
                  <p className="text-lg font-medium text-gray-900">₹{harvestRecord.price_per_bin}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Harvest Date</p>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-gray-400" />
                    <p className="text-sm text-gray-700">{new Date(harvestRecord.harvest_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {harvestRecord.storage_location && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Storage: {harvestRecord.storage_location}</p>
                      {harvestRecord.starch_index && (
                        <p className="text-xs text-blue-700">Starch Index: {harvestRecord.starch_index}</p>
                      )}
                    </div>
                    {harvestRecord.shelf_life_days && (
                      <div className="flex items-center space-x-1">
                        <Thermometer size={14} className="text-blue-600" />
                        <span className="text-sm text-blue-800">{harvestRecord.shelf_life_days} days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Update Record
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                  Print Label
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Variety Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Variety Performance This Season</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variety</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bins</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium %</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from(new Set(harvest.map(h => h.variety))).map(variety => {
                const varietyHarvests = harvest.filter(h => h.variety === variety);
                const totalBins = varietyHarvests.reduce((sum, h) => sum + (h.bin_count || 0), 0);
                const totalRevenue = varietyHarvests.reduce((sum, h) => sum + (h.total_revenue || 0), 0);
                const avgPrice = totalBins > 0 ? totalRevenue / totalBins : 0;
                const premiumCount = varietyHarvests.filter(h => h.quality_grade === 'premium').length;
                const premiumPercent = varietyHarvests.length > 0 ? (premiumCount / varietyHarvests.length) * 100 : 0;
                const varietyInfo = getVarietyInfo(variety);
                
                return (
                  <tr key={variety} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">{variety}</td>
                    <td className="px-4 py-4 text-gray-900">{totalBins}</td>
                    <td className="px-4 py-4 font-medium text-green-600">₹{totalRevenue.toLocaleString()}</td>
                    <td className="px-4 py-4 text-gray-900">₹{Math.round(avgPrice)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        premiumPercent >= 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {Math.round(premiumPercent)}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        varietyInfo?.marketDemand === 'high' ? 'bg-green-100 text-green-800' : 
                        varietyInfo?.marketDemand === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {varietyInfo?.marketDemand || 'unknown'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Harvest Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Record New Harvest</h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tree Block</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      {trees.map(tree => (
                        <option key={tree.id} value={tree.id}>
                          {tree.variety} - Row {tree.row_number}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Picker Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bins Harvested</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      <option value="premium">Premium</option>
                      <option value="standard">Standard</option>
                      <option value="processing">Processing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Bin (₹)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                    <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      <option>Cold Storage A</option>
                      <option>Cold Storage B</option>
                      <option>Ambient Storage</option>
                      <option>Direct Sale</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starch Index (Optional)</label>
                    <input type="number" step="0.1" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Est. Shelf Life (Days)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Record Harvest
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}