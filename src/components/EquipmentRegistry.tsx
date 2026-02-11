import React, { useState } from 'react';
import { useEquipment } from '../hooks/useEquipment';
import { Wrench, Calendar, AlertCircle, Plus, Settings } from 'lucide-react';

export function EquipmentRegistry() {
  const { equipment, loading, error } = useEquipment();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading equipment: {error}</p>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOwnershipColor = (ownership: string) => {
    return ownership === 'owned' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const needsService = (nextService: string | null) => {
    if (!nextService) return false;
    const serviceDate = new Date(nextService);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return serviceDate <= thirtyDaysFromNow;
  };

  const totalDailyCost = equipment.reduce((sum, eq) => sum + (eq.daily_cost || 0), 0);
  const ownedCount = equipment.filter(eq => eq.ownership === 'owned').length;
  const leasedCount = equipment.filter(eq => eq.ownership === 'leased').length;
  const servicesDue = equipment.filter(eq => needsService(eq.next_service)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Equipment Registry</h2>
        <button className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Total Equipment</p>
              <p className="text-2xl font-bold text-blue-800">{equipment.length}</p>
              <p className="text-xs text-blue-600 mt-1">{ownedCount} owned, {leasedCount} leased</p>
            </div>
            <Wrench className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div>
            <p className="text-green-700 font-medium">Daily Lease Cost</p>
            <p className="text-2xl font-bold text-green-800">₹{totalDailyCost}</p>
            <p className="text-xs text-green-600 mt-1">Active leases only</p>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div>
            <p className="text-purple-700 font-medium">Owned Assets</p>
            <p className="text-2xl font-bold text-purple-800">{ownedCount}</p>
            <p className="text-xs text-purple-600 mt-1">{equipment.length > 0 ? Math.round((ownedCount / equipment.length) * 100) : 0}% of fleet</p>
          </div>
        </div>

        <div className={`${servicesDue > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'} border-2 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${servicesDue > 0 ? 'text-amber-700' : 'text-green-700'} font-medium`}>Services Due</p>
              <p className={`text-2xl font-bold ${servicesDue > 0 ? 'text-amber-800' : 'text-green-800'}`}>{servicesDue}</p>
              <p className={`text-xs ${servicesDue > 0 ? 'text-amber-600' : 'text-green-600'} mt-1`}>Within 30 days</p>
            </div>
            {servicesDue > 0 && <AlertCircle className="text-amber-600" size={24} />}
          </div>
        </div>
      </div>

      {/* Service Alerts */}
      {servicesDue > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-amber-600 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Upcoming Service Requirements</h3>
              <div className="mt-2 space-y-1">
                {mockEquipment.filter(eq => needsService(eq.nextService)).map(equipment => (
                  <p key={equipment.id} className="text-sm text-amber-700">
                    • {equipment.name} - Service due {new Date(equipment.nextService).toLocaleDateString()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {equipment.map(equipmentItem => (
          <div key={equipmentItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Settings size={20} className="text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">{equipmentItem.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getOwnershipColor(equipmentItem.ownership || 'owned')}`}>
                {equipmentItem.ownership}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{equipmentItem.equipment_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getConditionColor(equipmentItem.condition || 'good')}`}>
                  {equipmentItem.condition}
                </span>
              </div>
                  {equipment.filter(eq => needsService(eq.next_service)).map(equipmentItem => (
                    <p key={equipmentItem.id} className="text-sm text-amber-700">
                      • {equipmentItem.name} - Service due {equipmentItem.next_service ? new Date(equipmentItem.next_service).toLocaleDateString() : 'Unknown'}
                  <span className="text-gray-600">Daily Cost:</span>
                  <span className="font-medium text-red-600">£{equipment.dailyCost}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  Last service: {new Date(equipment.lastMaintenance).toLocaleDateString()}
                </span>
              </div>
              
              {(equipmentItem.daily_cost || 0) > 0 && (
                <Calendar size={14} className={needsService(equipment.nextService) ? 'text-amber-500' : 'text-gray-400'} />
                <span className={`text-sm ${needsService(equipment.nextService) ? 'text-amber-700 font-medium' : 'text-gray-600'}`}>
                  <span className="font-medium text-red-600">₹{equipmentItem.daily_cost}</span>
                </span>
                  Last service: {equipmentItem.last_maintenance ? new Date(equipmentItem.last_maintenance).toLocaleDateString() : 'Never'}
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                <Calendar size={14} className={needsService(equipmentItem.next_service) ? 'text-amber-500' : 'text-gray-400'} />
                <span className={`text-sm ${needsService(equipmentItem.next_service) ? 'text-amber-700 font-medium' : 'text-gray-600'}`}>
                  Next service: {equipmentItem.next_service ? new Date(equipmentItem.next_service).toLocaleDateString() : 'Not scheduled'}
                Maintenance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipment.map(equipmentItem => (
                <tr key={equipmentItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{equipmentItem.name}</td>
                  <td className="px-4 py-4 text-gray-600">{equipmentItem.equipment_type}</td>
                  <td className="px-4 py-4 text-gray-600">{equipmentItem.last_maintenance ? new Date(equipmentItem.last_maintenance).toLocaleDateString() : 'Never'}</td>
                  <td className="px-4 py-4 text-gray-600">{equipmentItem.next_service ? new Date(equipmentItem.next_service).toLocaleDateString() : 'Not scheduled'}</td>
                  <td className="px-4 py-4">
                    {needsService(equipmentItem.next_service) ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                        Service Due
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Up to Date
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}