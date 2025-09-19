import { useState, useEffect } from 'react';
import { Train, Conflict, KPIMetrics as KPIMetricsType, ManualOverride } from '@/types/railway';
import { 
  mockTrains, 
  mockRailwaySection, 
  mockConflicts, 
  mockKPIs, 
  mockAuditLog 
} from '@/data/mockData';
import TrainScheduleBoard from '@/components/TrainScheduleBoard';
import RailwayMap from '@/components/RailwayMap';
import ConflictPanel from '@/components/ConflictPanel';
import KPIMetrics from '@/components/KPIMetrics';
import ManualOverridePanel from '@/components/ManualOverridePanel';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Train as TrainIcon, 
  AlertTriangle, 
  Activity, 
  Settings, 
  FlaskConical,
  Zap,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TrafficControlDashboard = () => {
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [conflicts, setConflicts] = useState<Conflict[]>(mockConflicts);
  const [kpis, setKPIs] = useState<KPIMetricsType>(mockKPIs);
  const [auditLog, setAuditLog] = useState<ManualOverride[]>(mockAuditLog);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Real-time simulation with dynamic behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => {
          const timeStep = 1; // 1-second updates
          let newPosition = train.currentPosition + (train.speed / 3600) * timeStep;
          let newSpeed = train.speed;
          let newStatus = train.status;
          let newDelay = train.delay;
          
          // Simulate realistic train behavior
          if (newPosition >= 25.5) {
            newPosition = 25.5;
            newSpeed = 0;
            newStatus = 'on-time';
          } else if (newPosition > 20 && train.speed > 60) {
            // Slow down approaching destination
            newSpeed = Math.max(40, train.speed - 10);
            newStatus = 'approaching';
          }
          
          // Randomly introduce delays or improvements
          const random = Math.random();
          if (random < 0.002) { // 0.2% chance per second
            newDelay = Math.min(newDelay + 1, 15);
            newStatus = 'delayed';
          } else if (random > 0.998 && newDelay > 0) {
            newDelay = Math.max(newDelay - 1, 0);
            if (newDelay === 0) newStatus = 'on-time';
          }
          
          // Update ETA based on current speed and position
          const remainingDistance = 25.5 - newPosition;
          const etaMinutes = newSpeed > 0 ? (remainingDistance / newSpeed) * 60 : 0;
          const estimatedArrival = new Date(Date.now() + etaMinutes * 60000 + newDelay * 60000)
            .toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
          
          return {
            ...train,
            currentPosition: newPosition,
            speed: newSpeed,
            status: newStatus,
            delay: newDelay,
            estimatedArrival
          };
        })
      );
      
      // Dynamic conflict detection
      setConflicts(prevConflicts => {
        const newConflicts = [...prevConflicts];
        
        // Randomly add new conflicts
        if (Math.random() < 0.001 && newConflicts.length < 5) {
          const conflictTypes = ['signal-failure', 'track-maintenance', 'train-delay', 'weather'];
          const severities = ['low', 'medium', 'high', 'critical'] as const;
          
          newConflicts.push({
            id: `CONF${Date.now()}`,
            type: conflictTypes[Math.floor(Math.random() * conflictTypes.length)] as any,
            severity: severities[Math.floor(Math.random() * severities.length)],
            description: `Auto-detected conflict at ${new Date().toLocaleTimeString()}`,
            trains: [`T00${Math.floor(Math.random() * 5) + 1}`],
            suggestedResolution: 'Reduce speed and maintain safe distance',
            timeToConflict: Math.floor(Math.random() * 15) + 2
          });
        }
        
        return newConflicts;
      });
      
      // Update KPIs in real-time
      setKPIs(prev => {
        const trainCount = trains.length;
        const onTimeTrains = trains.filter(t => t.status === 'on-time' || t.delay === 0).length;
        const delayedTrains = trains.filter(t => t.delay > 0).length;
        const avgDelay = delayedTrains > 0 ? 
          trains.reduce((sum, t) => sum + t.delay, 0) / trainCount : 0;
        
        return {
          ...prev,
          punctuality: trainCount > 0 ? Math.round((onTimeTrains / trainCount) * 100) : 100,
          averageDelay: Math.round(avgDelay * 10) / 10,
          activeTrains: trains.filter(t => t.speed > 0).length,
          throughput: prev.throughput + (Math.random() < 0.1 ? 1 : 0)
        };
      });
      
      setLastUpdate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleResolveConflict = (conflictId: string, resolution: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    
    // Update KPIs
    setKPIs(prev => ({
      ...prev,
      conflictsResolved: prev.conflictsResolved + 1
    }));

    toast({
      title: "Conflict Resolved",
      description: `Applied resolution: ${resolution}`,
    });
  };

  const handleDismissConflict = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    
    toast({
      title: "Conflict Dismissed",
      description: "Conflict removed from active list",
      variant: "destructive"
    });
  };

  const handleManualOverride = (override: Omit<ManualOverride, 'id' | 'timestamp'>) => {
    const newOverride: ManualOverride = {
      ...override,
      id: `AUD${Date.now()}`,
      timestamp: new Date().toLocaleString()
    };
    
    setAuditLog(prev => [newOverride, ...prev]);
    
    // Apply the override to the train if applicable
    if (override.trainId) {
      setTrains(prev => prev.map(train => {
        if (train.id === override.trainId) {
          // Apply changes based on override type
          if (override.action.includes('Priority')) {
            return { ...train, priority: parseInt(override.newValue.match(/\d+/)?.[0] || '5') };
          }
          // Add more override applications as needed
        }
        return train;
      }));
    }
    
    toast({
      title: "Manual Override Applied",
      description: `${override.action} completed successfully`,
    });
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update KPIs with optimized values
    setKPIs(prev => ({
      ...prev,
      punctuality: Math.min(95, prev.punctuality + 5),
      averageDelay: Math.max(2, prev.averageDelay - 2),
      throughput: prev.throughput + 2
    }));
    
    // Reduce conflicts
    setConflicts(prev => prev.slice(1));
    
    setIsOptimizing(false);
    
    toast({
      title: "Optimization Complete",
      description: "AI recommendations applied successfully",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getSystemStatus = () => {
    const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
    const highConflicts = conflicts.filter(c => c.severity === 'high').length;
    
    if (criticalConflicts > 0) return { status: 'critical', color: 'destructive' };
    if (highConflicts > 0) return { status: 'warning', color: 'default' };
    if (conflicts.length > 0) return { status: 'caution', color: 'secondary' };
    return { status: 'optimal', color: 'default' };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Railway Traffic Control System
          </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Metropolitan Junction Section</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Last Update: {formatTime(lastUpdate)}</span>
              </div>
              <span>•</span>
              <Badge variant={systemStatus.color as any}>
                System {systemStatus.status.toUpperCase()}
              </Badge>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={runOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-2"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run AI Optimization
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <KPIMetrics metrics={kpis} />

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Train Schedule & Railway Map */}
        <div className="xl:col-span-2 space-y-6">
          <TrainScheduleBoard trains={trains} />
          <RailwayMap section={mockRailwaySection} trains={trains} />
        </div>

        {/* Right Column - Controls & Analysis */}
        <div className="space-y-6">
          <ConflictPanel 
            conflicts={conflicts}
            onResolveConflict={handleResolveConflict}
            onDismissConflict={handleDismissConflict}
          />
          
          <Tabs defaultValue="override" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="override" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Override
              </TabsTrigger>
              <TabsTrigger value="simulator" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Simulator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="override">
              <ManualOverridePanel 
                trains={trains}
                auditLog={auditLog}
                onManualOverride={handleManualOverride}
              />
            </TabsContent>
            
            <TabsContent value="simulator">
              <ScenarioSimulator 
                trains={trains}
                currentKPIs={kpis}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrafficControlDashboard;