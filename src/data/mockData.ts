import { Field, FinancialEntry, Inventory, Equipment, User, CropRotation, Tree, HarvestRecord, PestTreatment, AppleVarietyInfo } from '../types';

export const mockFields: Field[] = [
  {
    id: '1',
    name: 'North Orchard Block A',
    area: 15.5,
    crop: 'Ambri Apples',
    plantingDate: '2020-03-15',
    growthStage: 'fruiting',
    weedState: 'low',
    fertilizerApplied: [
      { id: '1', type: 'NPK 19-19-19', amount: 300, date: '2024-04-01', cost: 220 },
      { id: '2', type: 'Calcium Nitrate', amount: 150, date: '2024-06-15', cost: 125 }
    ],
    lastUpdated: '2024-12-08'
  },
  {
    id: '2',
    name: 'South Orchard Block B',
    area: 12.3,
    crop: 'Royal Delicious',
    plantingDate: '2019-03-20',
    growthStage: 'harvesting',
    weedState: 'medium',
    fertilizerApplied: [
      { id: '3', type: 'Potash', amount: 200, date: '2024-05-10', cost: 145 }
    ],
    lastUpdated: '2024-12-07'
  },
  {
    id: '3',
    name: 'East Orchard Block C',
    area: 8.7,
    crop: 'Red Delicious',
    plantingDate: '2021-04-05',
    growthStage: 'flowering',
    weedState: 'low',
    fertilizerApplied: [],
    lastUpdated: '2024-12-06'
  }
];

export const mockFinances: FinancialEntry[] = [
  { id: '1', date: '2024-12-01', description: 'Ambri Apple harvest - 127 bins', category: 'sales', amount: 42000, type: 'income' },
  { id: '2', date: '2024-11-28', description: 'Apple-specific NPK fertilizer', category: 'fertilizer', amount: 450, type: 'expense' },
  { id: '3', date: '2024-11-25', description: 'Tractor maintenance', category: 'equipment', amount: 320, type: 'expense' },
  { id: '4', date: '2024-11-20', description: 'Royal Delicious premium grade sale', category: 'sales', amount: 38500, type: 'income' },
  { id: '5', date: '2024-11-15', description: 'Apple picking labor costs', category: 'labor', amount: 1200, type: 'expense' },
  { id: '6', date: '2024-11-10', description: 'Woolly Aphid treatment - Imidacloprid', category: 'pesticide', amount: 280, type: 'expense' }
];

export const mockInventory: Inventory[] = [
  { id: '1', name: 'NPK 19-19-19 (Apple Special)', type: 'fertilizer', quantity: 500, unit: 'kg', pricePerUnit: 1.4, supplier: 'Kashmir AgriSupply' },
  { id: '2', name: 'Calcium Nitrate', type: 'fertilizer', quantity: 300, unit: 'kg', pricePerUnit: 0.95, supplier: 'Apple Care Solutions' },
  { id: '3', name: 'Imidacloprid (Woolly Aphid)', type: 'pesticide', quantity: 15, unit: 'L', pricePerUnit: 18.5, supplier: 'Pest Control Kashmir', expiryDate: '2025-06-30' },
  { id: '4', name: 'Neem Oil Concentrate', type: 'pesticide', quantity: 25, unit: 'L', pricePerUnit: 12.0, supplier: 'Organic Apple Care', expiryDate: '2025-03-15' },
  { id: '5', name: 'Codling Moth Pheromone Traps', type: 'pesticide', quantity: 50, unit: 'pieces', pricePerUnit: 25.0, supplier: 'IPM Solutions' },
  { id: '6', name: 'Bordeaux Mixture', type: 'pesticide', quantity: 100, unit: 'kg', pricePerUnit: 3.5, supplier: 'Fungicide Depot', expiryDate: '2026-01-15' }
];

export const mockEquipment: Equipment[] = [
  { id: '1', name: 'John Deere 6120M', type: 'Tractor', ownership: 'owned', dailyCost: 0, condition: 'good', lastMaintenance: '2024-10-15', nextService: '2025-01-15' },
  { id: '2', name: 'Case IH Combine', type: 'Harvester', ownership: 'leased', dailyCost: 450, condition: 'excellent', lastMaintenance: '2024-11-01', nextService: '2025-02-01' },
  { id: '3', name: 'Kuhn Plough', type: 'Tillage', ownership: 'owned', dailyCost: 0, condition: 'fair', lastMaintenance: '2024-09-20', nextService: '2025-03-20' }
];

export const mockUsers: User[] = [
  { id: '1', name: 'James MacLeod', email: 'james@applekulfarm.com', role: 'owner', joinDate: '2024-01-15', status: 'active' },
  { id: '2', name: 'Sarah Thompson', email: 'sarah.t@gmail.com', role: 'editor', joinDate: '2024-03-20', status: 'active' },
  { id: '3', name: 'Michael Roberts', email: 'm.roberts@email.com', role: 'viewer', joinDate: '2024-11-10', status: 'pending' }
];

export const cropRotationData: { [key: string]: CropRotation[] } = {
  'Winter Wheat': [
    { year: 2, crop: 'Oil Seed Rape', benefits: ['Break disease cycle', 'Deep rooting improves soil'], plantingWindow: 'Aug-Sep' },
    { year: 3, crop: 'Spring Beans', benefits: ['Nitrogen fixation', 'Soil structure improvement'], plantingWindow: 'Mar-Apr' },
    { year: 4, crop: 'Spring Barley', benefits: ['Early harvest', 'Good cash crop'], plantingWindow: 'Mar-May' },
    { year: 1, crop: 'Winter Wheat', benefits: ['High yield potential', 'Premium grain prices'], plantingWindow: 'Sep-Nov' }
  ],
  'Potatoes': [
    { year: 2, crop: 'Winter Wheat', benefits: ['Soil recovery', 'Disease break'], plantingWindow: 'Sep-Nov' },
    { year: 3, crop: 'Grass Ley', benefits: ['Soil building', 'Organic matter increase'], plantingWindow: 'Apr-May' },
    { year: 4, crop: 'Spring Barley', benefits: ['Clean land', 'Good establishment'], plantingWindow: 'Mar-May' },
    { year: 1, crop: 'Potatoes', benefits: ['High value crop', 'Good returns'], plantingWindow: 'Mar-Jun' }
  ]
};

export const mockTrees: Tree[] = [
  { id: '1', fieldId: '1', variety: 'Ambri', row: 1, treeCount: 45, status: 'healthy', plantingYear: 2020, lastPruned: '2024-02-15', yieldEstimate: 180 },
  { id: '2', fieldId: '1', variety: 'Ambri', row: 2, treeCount: 42, status: 'healthy', plantingYear: 2020, lastPruned: '2024-02-15', yieldEstimate: 170 },
  { id: '3', fieldId: '2', variety: 'Royal Delicious', row: 1, treeCount: 38, status: 'healthy', plantingYear: 2019, lastPruned: '2024-01-20', yieldEstimate: 220 },
  { id: '4', fieldId: '2', variety: 'Royal Delicious', row: 2, treeCount: 40, status: 'pruned', plantingYear: 2019, lastPruned: '2024-02-10', yieldEstimate: 200 },
  { id: '5', fieldId: '3', variety: 'Red Delicious', row: 1, treeCount: 35, status: 'healthy', plantingYear: 2021, yieldEstimate: 120 }
];

export const mockHarvest: HarvestRecord[] = [
  { id: '1', treeId: '1', variety: 'Ambri', binCount: 67, lugCount: 0, qualityGrade: 'premium', harvestDate: '2024-11-15', pricePerBin: 330, totalRevenue: 22110, picker: 'Mohammad Ali', storageLocation: 'Cold Storage A', starchIndex: 3.2, shelfLifeDays: 180 },
  { id: '2', treeId: '2', variety: 'Ambri', binCount: 60, lugCount: 0, qualityGrade: 'standard', harvestDate: '2024-11-16', pricePerBin: 310, totalRevenue: 18600, picker: 'Rashid Khan', storageLocation: 'Cold Storage A', starchIndex: 3.8, shelfLifeDays: 150 },
  { id: '3', treeId: '3', variety: 'Royal Delicious', binCount: 85, lugCount: 0, qualityGrade: 'premium', harvestDate: '2024-10-20', pricePerBin: 450, totalRevenue: 38250, picker: 'Tariq Ahmad', storageLocation: 'Cold Storage B', starchIndex: 2.8, shelfLifeDays: 200 }
];

export const mockPestTreatments: PestTreatment[] = [
  { id: '1', treeId: '1', pestType: 'woolly_aphid', treatmentStep: 1, chemical: 'Imidacloprid', dosage: '2ml/L', applicationDate: '2024-11-01', completed: true, nextTreatmentDue: '2024-12-15', cost: 85, effectiveness: 'excellent' },
  { id: '2', treeId: '1', pestType: 'woolly_aphid', treatmentStep: 2, chemical: 'Neem Oil', dosage: '5ml/L', applicationDate: '2024-11-20', completed: false, cost: 45 },
  { id: '3', treeId: '3', pestType: 'codling_moth', treatmentStep: 1, chemical: 'Pheromone Traps', dosage: '2 traps/tree', applicationDate: '2024-10-01', completed: true, nextTreatmentDue: '2025-03-01', cost: 120, effectiveness: 'good' },
  { id: '4', treeId: '2', pestType: 'scale_insects', treatmentStep: 1, chemical: 'Bordeaux Mixture', dosage: '10g/L', applicationDate: '2024-09-15', completed: true, cost: 65, effectiveness: 'fair' }
];

export const appleVarieties: AppleVarietyInfo[] = [
  { name: 'Ambri', harvestSeason: 'Nov-Dec', avgPricePerBin: 320, storageLife: 180, commonPests: ['woolly_aphid', 'scale_insects'], marketDemand: 'high' },
  { name: 'Royal Delicious', harvestSeason: 'Oct-Nov', avgPricePerBin: 450, storageLife: 200, commonPests: ['codling_moth', 'mites'], marketDemand: 'high' },
  { name: 'Red Delicious', harvestSeason: 'Sep-Oct', avgPricePerBin: 380, storageLife: 160, commonPests: ['leaf_roller', 'mites'], marketDemand: 'medium' },
  { name: 'Golden Delicious', harvestSeason: 'Oct-Nov', avgPricePerBin: 400, storageLife: 170, commonPests: ['codling_moth', 'woolly_aphid'], marketDemand: 'medium' }
];