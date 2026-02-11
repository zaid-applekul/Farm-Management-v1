import React, { useState } from 'react';
import { mockFinances } from '../data/mockData';
import { FinancialEntry } from '../types';
import { PoundSterling, TrendingUp, TrendingDown, Plus, Filter } from 'lucide-react';

export function FinancialLedger() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const totalIncome = mockFinances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = mockFinances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const filteredFinances = selectedCategory === 'all' 
    ? mockFinances 
    : mockFinances.filter(f => f.category === selectedCategory);

  const categories = [
    'all', 'sales', 'purchases', 'equipment', 'fertilizer', 'pesticide', 'labor', 'other'
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-blue-100 text-blue-800';
      case 'fertilizer': return 'bg-yellow-100 text-yellow-800';
      case 'pesticide': return 'bg-red-100 text-red-800';
      case 'labor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Ledger</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-800">£{totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-800">£{totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </div>

        <div className={`${netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border-2 rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${netProfit >= 0 ? 'text-blue-700' : 'text-red-700'} font-medium`}>Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                £{netProfit.toLocaleString()}
              </p>
            </div>
            <PoundSterling className={`${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`} size={32} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter size={16} className="text-gray-400" />
          <span className="font-medium text-gray-700">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {filteredFinances.map(entry => (
              <div key={entry.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(entry.category)}`}>
                      {entry.category}
                    </span>
                    <h4 className="font-medium text-gray-900">{entry.description}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${
                    entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.type === 'income' ? '+' : '-'}£{entry.amount.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-500">{entry.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Financial Entry</h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      <option>Income</option>
                      <option>Expense</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500">
                      <option>sales</option>
                      <option>purchases</option>
                      <option>equipment</option>
                      <option>fertilizer</option>
                      <option>pesticide</option>
                      <option>labor</option>
                      <option>other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Add Entry
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