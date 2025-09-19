export interface Train {
  id: string;
  number: string;
  type: 'passenger' | 'freight' | 'express';
  priority: number; // 1-10, higher is more priority
  currentPosition: number; // km position on section
  speed: number; // km/h
  destination: string;
  status: 'on-time' | 'delayed' | 'active' | 'approaching';
  delay: number; // minutes
  scheduledArrival: string;
  estimatedArrival: string;
  operator: string;
}

export interface RailwaySection {
  id: string;
  name: string;
  length: number; // km
  tracks: Track[];
  signals: Signal[];
  stations: Station[];
}

export interface Track {
  id: string;
  name: string;
  occupied: boolean;
  maintenanceBlock?: {
    start: number;
    end: number;
    reason: string;
  };
}

export interface Signal {
  id: string;
  position: number; // km
  status: 'green' | 'red' | 'amber';
  type: 'entry' | 'exit' | 'intermediate';
}

export interface Station {
  id: string;
  name: string;
  position: number; // km
  platforms: number;
}

export interface Conflict {
  id: string;
  type: 'crossing' | 'overtaking' | 'platform' | 'maintenance';
  trains: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedResolution: string;
  timeToConflict: number; // minutes
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  conflicts: Conflict[];
  recommendations: Recommendation[];
  kpis: KPIMetrics;
}

export interface Recommendation {
  id: string;
  type: 'delay' | 'reroute' | 'priority_change' | 'speed_adjustment';
  trainId: string;
  description: string;
  impact: string;
  confidence: number; // 0-1
}

export interface KPIMetrics {
  punctuality: number; // percentage
  throughput: number; // trains per hour
  averageDelay: number; // minutes
  conflictsResolved: number;
  totalTrains: number;
  criticalDelays: number;
}

export interface ManualOverride {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  trainId?: string;
  reason: string;
  originalValue: string;
  newValue: string;
}