import { Train, RailwaySection, Conflict, KPIMetrics, ManualOverride } from '@/types/railway';

export const mockTrains: Train[] = [
  {
    id: 'TRN001',
    number: 'IC 2047',
    type: 'passenger',
    priority: 8,
    currentPosition: 15.3,
    speed: 120,
    destination: 'Central Station',
    status: 'on-time',
    delay: 0,
    scheduledArrival: '14:25',
    estimatedArrival: '14:25',
    operator: 'RailCorp'
  },
  {
    id: 'TRN002',
    number: 'FR 8841',
    type: 'freight',
    priority: 3,
    currentPosition: 8.7,
    speed: 80,
    destination: 'Industrial Park',
    status: 'delayed',
    delay: 12,
    scheduledArrival: '15:10',
    estimatedArrival: '15:22',
    operator: 'FreightLines'
  },
  {
    id: 'TRN003',
    number: 'EX 1205',
    type: 'express',
    priority: 9,
    currentPosition: 22.8,
    speed: 160,
    destination: 'Airport Terminal',
    status: 'active',
    delay: 0,
    scheduledArrival: '14:42',
    estimatedArrival: '14:42',
    operator: 'ExpressRail'
  },
  {
    id: 'TRN004',
    number: 'LC 4412',
    type: 'passenger',
    priority: 6,
    currentPosition: 3.2,
    speed: 95,
    destination: 'Suburban Junction',
    status: 'approaching',
    delay: 5,
    scheduledArrival: '15:30',
    estimatedArrival: '15:35',
    operator: 'LocalTrans'
  },
  {
    id: 'TRN005',
    number: 'FR 7739',
    type: 'freight',
    priority: 2,
    currentPosition: 18.9,
    speed: 70,
    destination: 'Port Authority',
    status: 'delayed',
    delay: 18,
    scheduledArrival: '16:15',
    estimatedArrival: '16:33',
    operator: 'CargoRail'
  }
];

export const mockRailwaySection: RailwaySection = {
  id: 'SEC001',
  name: 'Metropolitan Junction Section',
  length: 25.5,
  tracks: [
    { id: 'TRK001', name: 'Track 1 (Main)', occupied: true },
    { id: 'TRK002', name: 'Track 2 (Main)', occupied: false },
    { 
      id: 'TRK003', 
      name: 'Track 3 (Freight)', 
      occupied: false,
      maintenanceBlock: {
        start: 12.0,
        end: 14.5,
        reason: 'Signal maintenance'
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
    { id: 'STA001', name: 'Junction West', position: 5.2, platforms: 2 },
    { id: 'STA002', name: 'Central Hub', position: 15.8, platforms: 4 },
    { id: 'STA003', name: 'Junction East', position: 22.1, platforms: 2 }
  ]
};

export const mockConflicts: Conflict[] = [
  {
    id: 'CNF001',
    type: 'crossing',
    trains: ['TRN001', 'TRN002'],
    severity: 'medium',
    description: 'IC 2047 and FR 8841 approaching same junction',
    suggestedResolution: 'Delay freight train by 3 minutes',
    timeToConflict: 8
  },
  {
    id: 'CNF002',
    type: 'maintenance',
    trains: ['TRN005'],
    severity: 'high',
    description: 'FR 7739 route blocked by signal maintenance',
    suggestedResolution: 'Reroute to Track 2 with speed restriction',
    timeToConflict: 15
  },
  {
    id: 'CNF003',
    type: 'overtaking',
    trains: ['TRN003', 'TRN004'],
    severity: 'low',
    description: 'Express train needs to overtake local service',
    suggestedResolution: 'Hold local train at Junction West for 2 minutes',
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
    operator: 'Controller Smith',
    action: 'Manual priority change',
    trainId: 'TRN001',
    reason: 'VIP passenger on board',
    originalValue: 'Priority: 8',
    newValue: 'Priority: 10'
  },
  {
    id: 'AUD002',
    timestamp: '2024-01-15 14:12:15',
    operator: 'Controller Jones',
    action: 'Route modification',
    trainId: 'TRN002',
    reason: 'Track maintenance conflict',
    originalValue: 'Track 3',
    newValue: 'Track 2'
  },
  {
    id: 'AUD003',
    timestamp: '2024-01-15 14:05:33',
    operator: 'Controller Davis',
    action: 'Speed restriction override',
    reason: 'Emergency service priority',
    originalValue: 'Speed: 80 km/h',
    newValue: 'Speed: 60 km/h'
  }
];