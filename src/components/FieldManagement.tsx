import React, { useMemo, useState } from 'react';
import { mockFields } from '../data/mockData';
import { Field } from '../types';
import {
  Sprout,
  MapPin,
  Calendar,
  AlertTriangle,
  Filter,
  Droplets,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const growthStages = ['all', 'seeding', 'vegetative', 'flowering', 'fruiting', 'harvesting'];

const getWeedColor = (weedState: Field['weedState']) => {
  switch (weedState) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-amber-100 text-amber-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getGrowthColor = (growthStage: Field['growthStage']) => {
  switch (growthStage) {
    case 'seeding':
      return 'bg-yellow-100 text-yellow-800';
    case 'vegetative':
      return 'bg-green-100 text-green-800';
    case 'flowering':
      return 'bg-purple-100 text-purple-800';
    case 'fruiting':
      return 'bg-orange-100 text-orange-800';
    case 'harvesting':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function FieldManagement() {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  const crops = useMemo(() => {
    const unique = Array.from(new Set(mockFields.map(field => field.crop)));
    return ['all', ...unique];
  }, []);

  const filteredFields = useMemo(() => {
    return mockFields.filter(field => {
      const matchesCrop = selectedCrop === 'all' || field.crop === selectedCrop;
      const matchesStage = selectedStage === 'all' || field.growthStage === selectedStage;
      const matchesSearch =
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.crop.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCrop && matchesStage && matchesSearch;
    });
  }, [selectedCrop, selectedStage, searchTerm]);

  const totalArea = mockFields.reduce((sum, field) => sum + field.area, 0);
  const weedAlerts = mockFields.filter(field => field.weedState !== 'low').length;
  const totalApplications = mockFields.reduce(
    (sum, field) => sum + field.fertilizerApplied.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Field Management</h2>
          <p className="text-sm text-gray-600 mt-1">Track field health, crops, and inputs</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Field</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Total Fields</p>
              <p className="text-2xl font-bold text-green-800">{mockFields.length}</p>
            </div>
            <Sprout className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Total Area</p>
              <p className="text-2xl font-bold text-blue-800">{totalArea.toFixed(1)} ha</p>
            </div>
            <MapPin className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-medium">Crop Types</p>
              <p className="text-2xl font-bold text-purple-800">{crops.length - 1}</p>
            </div>
            <Filter className="text-purple-600" size={24} />
          </div>
        </div>

        <div className={`${weedAlerts > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'} border-2 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${weedAlerts > 0 ? 'text-amber-700' : 'text-green-700'} font-medium`}>Weed Alerts</p>
              <p className={`text-2xl font-bold ${weedAlerts > 0 ? 'text-amber-800' : 'text-green-800'}`}>{weedAlerts}</p>
            </div>
            {weedAlerts > 0 && <AlertTriangle className="text-amber-600" size={24} />}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <span className="font-medium text-gray-700">Filter fields</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {crops.map(crop => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCrop === crop
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {crop === 'all' ? 'All Crops' : crop}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Growth stage</span>
            <select
              value={selectedStage}
              onChange={event => setSelectedStage(event.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
            >
              {growthStages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search fields or crops"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Fertilizer Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fertilizer Applications</h3>
            <p className="text-sm text-gray-600 mt-1">Total applications recorded across all fields</p>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="text-blue-600" size={20} />
            <span className="text-xl font-bold text-blue-800">{totalApplications}</span>
          </div>
        </div>
      </div>

      {/* Field Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFields.map(field => {
          const isExpanded = expandedFieldId === field.id;

          return (
            <div key={field.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{field.crop} · {field.area} ha</p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setExpandedFieldId(isExpanded ? null : field.id)}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Growth Stage</p>
                  <span className={`inline-flex mt-1 px-2 py-1 text-xs rounded-full ${getGrowthColor(field.growthStage)}`}>
                    {field.growthStage}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Weed Status</p>
                  <span className={`inline-flex mt-1 px-2 py-1 text-xs rounded-full ${getWeedColor(field.weedState)}`}>
                    {field.weedState}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Planting Date</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{new Date(field.plantingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Last Updated</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{new Date(field.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Fertilizer History</h4>
                    <span className="text-xs text-gray-500">{field.fertilizerApplied.length} records</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {field.fertilizerApplied.length === 0 && (
                      <p className="text-sm text-gray-500">No fertilizer applications recorded.</p>
                    )}
                    {field.fertilizerApplied.map(application => (
                      <div key={application.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-gray-900">{application.type}</p>
                          <p className="text-xs text-gray-500">{new Date(application.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{application.amount} kg</p>
                          <p className="text-xs text-gray-500">GBP {application.cost.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFields.length === 0 && (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-600">
          <p className="font-medium">No fields match the current filters.</p>
          <p className="text-sm mt-1">Try clearing filters or updating your search term.</p>
        </div>
      )}
    </div>
  );
}
