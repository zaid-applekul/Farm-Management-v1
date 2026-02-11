import React, { useState } from 'react';
import { useTrees } from '../hooks/useTrees';
import { useFields } from '../hooks/useFields';
import { TreePine, Plus, MapPin, Calendar, TrendingUp, Scissors } from 'lucide-react';

export function TreeManagement() {
  const { trees, loading: treesLoading, error: treesError } = useTrees();
  const { fields, loading: fieldsLoading } = useFields();
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedVariety, setSelectedVariety] = useState<string>('all');

  const loading = treesLoading || fieldsLoading;

  const filteredTrees = trees.filter(tree => {
    const matchesField = selectedField === 'all' || tree.field_id === selectedField;
    const matchesVariety = selectedVariety === 'all' || tree.variety === selectedVariety;
    return matchesField && matchesVariety;
  });

  const varieties = Array.from(new Set(trees.map(tree => tree.variety)));
  const totalTrees = filteredTrees.reduce((sum, tree) => sum + (tree.tree_count || 0), 0);
  const totalYieldEstimate = filteredTrees.reduce((sum, tree) => sum + (tree.yield_estimate || 0), 0);
  const healthyTrees = filteredTrees.filter(tree => tree.status === 'healthy').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (treesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading trees: {treesError}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'diseased': return 'bg-red-100 text-red-800';
      case 'pruned': return 'bg-blue-100 text-blue-800';
      case 'dormant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarietyColor = (variety: string) => {
    switch (variety) {
      case 'Ambri': return 'bg-purple-100 text-purple-800';
      case 'Royal Delicious': return 'bg-red-100 text-red-800';
      case 'Red Delicious': return 'bg-pink-100 text-pink-800';
      case 'Golden Delicious': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tree Block Management</h2>
          <p className="text-gray-600 mt-1">Track apple varieties and tree health by blocks</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Tree Block</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Total Trees</p>
              <p className="text-2xl font-bold text-green-800">{totalTrees.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{filteredTrees.length} blocks</p>
            </div>
            <TreePine className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div>
            <p className="text-blue-700 font-medium">Varieties</p>
            <p className="text-2xl font-bold text-blue-800">{varieties.length}</p>
            <p className="text-xs text-blue-600 mt-1">Apple cultivars</p>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-medium">Est. Yield</p>
              <p className="text-2xl font-bold text-purple-800">{totalYieldEstimate}</p>
              <p className="text-xs text-purple-600 mt-1">Bins this season</p>
            </div>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
          <div>
            <p className="text-amber-700 font-medium">Healthy Blocks</p>
            <p className="text-2xl font-bold text-amber-800">{healthyTrees}/{filteredTrees.length}</p>
            <p className="text-xs text-amber-600 mt-1">{Math.round((healthyTrees / filteredTrees.length) * 100)}% healthy</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedField('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedField === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Fields
            </button>
            {fields.map(field => (
              <button
                key={field.id}
                onClick={() => setSelectedField(field.id!)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedField === field.id! ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {field.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Variety:</span>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Varieties</option>
              {varieties.map(variety => (
                <option key={variety} value={variety}>{variety}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tree Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrees.map(tree => {
          const field = fields.find(f => f.id === tree.field_id);
          return (
            <div key={tree.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TreePine size={20} className="text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Row {tree.row_number}</h3>
                    <p className="text-sm text-gray-600">{field?.name}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getVarietyColor(tree.variety)}`}>
                  {tree.variety}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tree Count:</span>
                  <span className="font-medium">{tree.tree_count} trees</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(tree.status || 'healthy')}`}>
                    {tree.status || 'healthy'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Planted:</span>
                  <span className="font-medium">{tree.planting_year}</span>
                </div>

                {tree.yield_estimate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Yield:</span>
                    <span className="font-medium text-green-600">{tree.yield_estimate} bins</span>
                  </div>
                )}
              </div>

              {tree.last_pruned && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Scissors size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last pruned: {new Date(tree.last_pruned).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Update Status
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Variety Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Variety Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variety</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blocks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Trees</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Yield</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Age</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {varieties.map(variety => {
                const varietyTrees = trees.filter(tree => tree.variety === variety);
                const totalTrees = varietyTrees.reduce((sum, tree) => sum + (tree.tree_count || 0), 0);
                const totalYield = varietyTrees.reduce((sum, tree) => sum + (tree.yield_estimate || 0), 0);
                const avgAge = Math.round(varietyTrees.reduce((sum, tree) => sum + (2024 - tree.planting_year), 0) / varietyTrees.length);
                const healthyCount = varietyTrees.filter(tree => tree.status === 'healthy').length;
                
                return (
                  <tr key={variety} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-sm rounded-full font-medium ${getVarietyColor(variety)}`}>
                        {variety}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-900">{varietyTrees.length}</td>
                    <td className="px-4 py-4 text-gray-900">{totalTrees}</td>
                    <td className="px-4 py-4 font-medium text-green-600">{totalYield} bins</td>
                    <td className="px-4 py-4 text-gray-900">{avgAge} years</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        healthyCount === varietyTrees.length ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {healthyCount}/{varietyTrees.length} healthy
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}