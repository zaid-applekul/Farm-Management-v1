// This file contains mock data for development and testing
// In production, all data will come from Supabase

export const mockFields = [
  {
    id: '1',
    name: 'North Orchard',
    area: 12.5,
    crop: 'Apple Trees',
    plantingDate: '2020-03-15',
    growthStage: 'fruiting' as const,
    weedState: 'low' as const,
    fertilizerApplied: [
      {
        id: '1',
        type: 'NPK 10-10-10',
        amount: 250,
        date: '2024-03-01',
        cost: 1200
      }
    ],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'South Block',
    area: 8.3,
    crop: 'Apple Trees',
    plantingDate: '2019-04-10',
    growthStage: 'flowering' as const,
    weedState: 'medium' as const,
    fertilizerApplied: [
      {
        id: '2',
        type: 'Organic Compost',
        amount: 500,
        date: '2024-02-15',
        cost: 800
      }
    ],
    lastUpdated: '2024-01-20'
  }
];

export const mockTrees = [
  {
    id: '1',
    fieldId: '1',
    variety: 'Royal Delicious' as const,
    row: 1,
    treeCount: 45,
    status: 'healthy' as const,
    plantingYear: 2020,
    lastPruned: '2024-01-15',
    yieldEstimate: 180
  },
  {
    id: '2',
    fieldId: '1',
    variety: 'Ambri' as const,
    row: 2,
    treeCount: 42,
    status: 'healthy' as const,
    plantingYear: 2020,
    yieldEstimate: 168
  }
];

export const mockHarvest = [
  {
    id: '1',
    treeId: '1',
    variety: 'Royal Delicious',
    binCount: 25,
    lugCount: 150,
    qualityGrade: 'premium' as const,
    harvestDate: '2024-09-15',
    pricePerBin: 2500,
    totalRevenue: 62500,
    picker: 'Rajesh Kumar',
    storageLocation: 'Cold Storage A',
    starchIndex: 6.2,
    shelfLifeDays: 180
  }
];

export const mockPestTreatments = [
  {
    id: '1',
    treeId: '1',
    pestType: 'woolly_aphid' as const,
    treatmentStep: 1,
    chemical: 'Imidacloprid',
    dosage: '2ml/L',
    applicationDate: '2024-03-01',
    completed: true,
    cost: 1500,
    effectiveness: 'excellent' as const
  }
];

export const mockFinances = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Apple Sales - Premium Grade',
    category: 'sales' as const,
    amount: 125000,
    type: 'income' as const
  },
  {
    id: '2',
    date: '2024-01-10',
    description: 'Fertilizer Purchase',
    category: 'fertilizer' as const,
    amount: 15000,
    type: 'expense' as const
  }
];

export const mockInventory = [
  {
    id: '1',
    name: 'NPK 10-10-10',
    type: 'fertilizer' as const,
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 45,
    supplier: 'AgriCorp India',
    expiryDate: '2025-12-31'
  },
  {
    id: '2',
    name: 'Imidacloprid 17.8% SL',
    type: 'pesticide' as const,
    quantity: 25,
    unit: 'L',
    pricePerUnit: 850,
    supplier: 'Bayer CropScience',
    expiryDate: '2025-06-30'
  }
];

export const mockEquipment = [
  {
    id: '1',
    name: 'John Deere 5050D',
    type: 'Tractor',
    ownership: 'owned' as const,
    dailyCost: 0,
    condition: 'excellent' as const,
    lastMaintenance: '2024-01-15',
    nextService: '2024-07-15'
  },
  {
    id: '2',
    name: 'Sprayer Unit',
    type: 'Spraying Equipment',
    ownership: 'leased' as const,
    dailyCost: 500,
    condition: 'good' as const,
    lastMaintenance: '2024-02-01',
    nextService: '2024-05-01'
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Arjun Singh',
    email: 'arjun@applekulfarm.com',
    role: 'owner' as const,
    joinDate: '2024-01-01',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@applekulfarm.com',
    role: 'editor' as const,
    joinDate: '2024-01-15',
    status: 'active' as const
  }
];

export const cropRotationData = {
  'Winter Wheat': [
    {
      year: 1,
      crop: 'Winter Wheat',
      benefits: ['Soil structure improvement', 'Nitrogen fixation', 'Weed suppression'],
      plantingWindow: 'September - October'
    },
    {
      year: 2,
      crop: 'Spring Barley',
      benefits: ['Quick cash crop', 'Pest cycle break', 'Soil aeration'],
      plantingWindow: 'March - April'
    },
    {
      year: 3,
      crop: 'Oil Seed Rape',
      benefits: ['Deep rooting', 'Soil conditioning', 'High value crop'],
      plantingWindow: 'August - September'
    },
    {
      year: 4,
      crop: 'Grass Ley',
      benefits: ['Soil fertility restoration', 'Organic matter increase', 'Livestock feed'],
      plantingWindow: 'April - May'
    }
  ]
};

export const appleVarieties = [
  {
    name: 'Royal Delicious',
    harvestSeason: 'September - October',
    avgPricePerBin: 2500,
    storageLife: 180,
    commonPests: ['woolly_aphid', 'codling_moth'],
    marketDemand: 'high' as const
  },
  {
    name: 'Ambri',
    harvestSeason: 'October - November',
    avgPricePerBin: 3000,
    storageLife: 200,
    commonPests: ['scale_insects', 'mites'],
    marketDemand: 'high' as const
  },
  {
    name: 'Red Delicious',
    harvestSeason: 'September',
    avgPricePerBin: 2200,
    storageLife: 150,
    commonPests: ['codling_moth', 'leaf_roller'],
    marketDemand: 'medium' as const
  },
  {
    name: 'Golden Delicious',
    harvestSeason: 'October',
    avgPricePerBin: 2800,
    storageLife: 170,
    commonPests: ['woolly_aphid', 'mites'],
    marketDemand: 'high' as const
  }
];