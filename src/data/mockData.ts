import { Train, RailwaySection, Conflict, KPIMetrics, ManualOverride } from '@/types/railway';

export const mockTrains: Train[] = [
  {
    id: 'TRN001',
    number: '12301',
    type: 'express',
    priority: 8,
    currentPosition: 15.3,
    speed: 120,
    destination: 'New Delhi',
    status: 'on-time',
    delay: 0,
    scheduledArrival: '14:25',
    estimatedArrival: '14:25',
    operator: 'Northern Railway'
  },
  {
    id: 'TRN002',
    number: '18047',
    type: 'freight',
    priority: 3,
    currentPosition: 8.7,
    speed: 80,
    destination: 'Kanpur Central',
    status: 'delayed',
    delay: 12,
    scheduledArrival: '15:10',
    estimatedArrival: '15:22',
    operator: 'North Central Railway'
  },
  {
    id: 'TRN003',
    number: '12951',
    type: 'express',
    priority: 9,
    currentPosition: 22.8,
    speed: 160,
    destination: 'Mumbai Central',
    status: 'active',
    delay: 0,
    scheduledArrival: '14:42',
    estimatedArrival: '14:42',
    operator: 'Western Railway'
  },
  {
    id: 'TRN004',
    number: '56473',
    type: 'passenger',
    priority: 6,
    currentPosition: 3.2,
    speed: 95,
    destination: 'Howrah Junction',
    status: 'approaching',
    delay: 5,
    scheduledArrival: '15:30',
    estimatedArrival: '15:35',
    operator: 'Eastern Railway'
  },
  {
    id: 'TRN005',
    number: '12622',
    type: 'express',
    priority: 8,
    currentPosition: 18.9,
    speed: 140,
    destination: 'Chennai Central',
    status: 'on-time',
    delay: 0,
    scheduledArrival: '16:15',
    estimatedArrival: '16:15',
    operator: 'Southern Railway'
  },
  {
    id: 'TRN006',
    number: '12009',
    type: 'express',
    priority: 9,
    currentPosition: 7.4,
    speed: 125,
    destination: 'Secunderabad Jn',
    status: 'delayed',
    delay: 8,
    scheduledArrival: '15:45',
    estimatedArrival: '15:53',
    operator: 'South Central Railway'
  }
];

export const mockRailwaySection: RailwaySection = {
  id: 'SEC001',
  name: 'New Delhi - Ghaziabad Junction Section',
  length: 25.5,
  tracks: [
    { id: 'TRK001', name: 'UP Main Line', occupied: true },
    { id: 'TRK002', name: 'DN Main Line', occupied: false },
    { 
      id: 'TRK003', 
      name: 'Goods Siding', 
      occupied: false,
      maintenanceBlock: {
        start: 12.0,
        end: 14.5,
        reason: 'Block Section maintenance'
      }
    }
  ],
  signals: [
    { id: 'SIG001', position: 0, status: 'green', type: 'entry' },
    { id: 'SIG002', position: 8.5, status: 'amber', type: 'intermediate' },
    { id: 'SIG003', position: 15.2, status: 'red', type: 'intermediate' },
    { id: 'SIG004', position: 25.5, status: 'green', type: 'exit' }
  ],
  stations: [
    { id: 'STA001', name: 'Shahdara', position: 5.2, platforms: 2 },
    { id: 'STA002', name: 'Sahibabad', position: 15.8, platforms: 4 },
    { id: 'STA003', name: 'Ghaziabad Jn', position: 22.1, platforms: 6 }
  ]
};

export const mockConflicts: Conflict[] = [
  {
    id: 'CNF001',
    type: 'crossing',
    trains: ['TRN001', 'TRN002'],
    severity: 'medium',
    description: 'Rajdhani Express (12301) and Goods train (18047) approaching same junction at Shahdara',
    suggestedResolution: 'Hold goods train at outer signal for 4 minutes',
    timeToConflict: 8
  },
  {
    id: 'CNF002',
    type: 'maintenance',
    trains: ['TRN005'],
    severity: 'high',
    description: 'Tamil Nadu Express (12622) route affected by block section maintenance',
    suggestedResolution: 'Divert via DN Main Line with 40 kmph speed restriction',
    timeToConflict: 15
  },
  {
    id: 'CNF003',
    type: 'overtaking',
    trains: ['TRN003', 'TRN004'],
    severity: 'low',
    description: 'Mumbai Rajdhani (12951) needs to overtake passenger service at Sahibabad',
    suggestedResolution: 'Hold passenger train at Platform 2 for 3 minutes',
    timeToConflict: 12
  }
];

export const mockKPIs: KPIMetrics = {
  punctuality: 87.3,
  throughput: 24,
  averageDelay: 6.2,
  conflictsResolved: 15,
  totalTrains: 23,
  criticalDelays: 2
};

export const mockAuditLog: ManualOverride[] = [
  {
    id: 'AUD001',
    timestamp: '2024-01-15 14:18:22',
    operator: 'SM Sharma',
    action: 'Manual priority change',
    trainId: 'TRN001',
    reason: 'Rajdhani Express - VIP passenger on board',
    originalValue: 'Priority: 8',
    newValue: 'Priority: 10'
  },
  {
    id: 'AUD002',
    timestamp: '2024-01-15 14:12:15',
    operator: 'ASM Patel',
    action: 'Route modification',
    trainId: 'TRN002',
    reason: 'Goods Siding block section maintenance',
    originalValue: 'DN Main Line',
    newValue: 'UP Main Line'
  },
  {
    id: 'AUD003',
    timestamp: '2024-01-15 14:05:33',
    operator: 'TXR Kumar',
    action: 'Speed restriction imposed',
    reason: 'Fog conditions at Sahibabad',
    originalValue: 'Speed: 120 km/h',
    newValue: 'Speed: 75 km/h'
  },
  {
    id: 'AUD004',
    timestamp: '2024-01-15 13:58:45',
    operator: 'Controller Gupta',
    action: 'Platform change',
    trainId: 'TRN003',
    reason: 'Mumbai Rajdhani platform optimization',
    originalValue: 'Platform: 1',
    newValue: 'Platform: 3'
  }
];