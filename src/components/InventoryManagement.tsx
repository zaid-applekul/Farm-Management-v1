import React, { useState } from 'react';
import { mockInventory } from '../data/mockData';
import { Package, AlertTriangle, Plus, Search } from 'lucide-react';

export function InventoryManagement() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = mockInventory.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const lowStockItems = mockInventory.filter(item => item.quantity < 100);
  const expiringItems = mockInventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  });

  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <button className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Total Items</p>
              <p className="text-2xl font-bold text-blue-800">{filteredInventory.length}</p>
            </div>
            <Package className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div>
            <p className="text-green-700 font-medium">Total Value</p>
            <p className="text-2xl font-bold text-green-800">£{totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className={`${lowStockItems.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'} border-2 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${lowStockItems.length > 0 ? 'text-amber-700' : 'text-green-700'} font-medium`}>Low Stock</p>
              <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-amber-800' : 'text-green-800'}`}>
                {lowStockItems.length}
              </p>
            </div>
            {lowStockItems.length > 0 && <AlertTriangle className="text-amber-600" size={24} />}
          </div>
        </div>

        <div className={`${expiringItems.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-2 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${expiringItems.length > 0 ? 'text-red-700' : 'text-green-700'} font-medium`}>Expiring Soon</p>
              <p className={`text-2xl font-bold ${expiringItems.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                {expiringItems.length}
              </p>
            </div>
            {expiringItems.length > 0 && <AlertTriangle className="text-red-600" size={24} />}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {['all', 'fertilizer', 'pesticide'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-amber-600 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Inventory Alerts</h3>
              <div className="mt-2 text-sm text-amber-700">
                {lowStockItems.length > 0 && (
                  <p>• {lowStockItems.length} items are running low on stock</p>
                )}
                {expiringItems.length > 0 && (
                  <p>• {expiringItems.length} items are expiring within 3 months</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Stock</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map(item => {
                const isLowStock = item.quantity < 100;
                const isExpiring = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.expiryDate && (
                        <div className="text-sm text-gray-500">Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.type === 'fertilizer' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 text-gray-900">£{item.pricePerUnit.toFixed(2)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">£{(item.quantity * item.pricePerUnit).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-900">{item.supplier}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {isLowStock && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            Low Stock
                          </span>
                        )}
                        {isExpiring && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Expiring Soon
                          </span>
                        )}
                        {!isLowStock && !isExpiring && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Good
                          </span>
                        )}
                      </div>
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