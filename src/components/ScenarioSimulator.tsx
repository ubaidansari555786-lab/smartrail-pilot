import { useState } from 'react';
import { Train, Conflict, KPIMetrics } from '@/types/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical, Play, RotateCcw, TrendingUp, AlertTriangle } from 'lucide-react';

interface ScenarioSimulatorProps {
  trains: Train[];
  currentKPIs: KPIMetrics;
}

type ScenarioType = 'delay' | 'maintenance' | 'emergency' | 'volume';

interface Scenario {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  parameters: Record<string, any>;
}

const ScenarioSimulator = ({ trains, currentKPIs }: ScenarioSimulatorProps) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [simulationResults, setSimulationResults] = useState<{
    kpis: KPIMetrics;
    conflicts: Conflict[];
    recommendations: string[];
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioParams, setScenarioParams] = useState<Record<string, string>>({});

  const predefinedScenarios: Scenario[] = [
    {
      id: 'major_delay',
      name: 'Major Delay Event',
      type: 'delay',
      description: 'Simulate a major delay affecting multiple trains',
      parameters: { delayMinutes: 30, affectedTrains: 3 }
    },
    {
      id: 'track_maintenance',
      name: 'Emergency Track Maintenance',
      type: 'maintenance',
      description: 'Urgent maintenance blocking main track for 2 hours',
      parameters: { duration: 120, trackId: 'TRK001' }
    },
    {
      id: 'signal_failure',
      name: 'Signal System Failure',
      type: 'emergency',
      description: 'Critical signal failure requiring manual control',
      parameters: { affectedSignals: 2, fallbackMode: true }
    },
    {
      id: 'peak_volume',
      name: 'Peak Hour Volume Surge',
      type: 'volume',
      description: 'Simulate 150% of normal traffic volume',
      parameters: { volumeMultiplier: 1.5, duration: 60 }
    }
  ];

  const runSimulation = async () => {
    if (!selectedScenario) return;

    setIsSimulating(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const scenario = predefinedScenarios.find(s => s.id === selectedScenario);
      if (!scenario) {
        setIsSimulating(false);
        return;
      }

      // Generate mock simulation results based on scenario type
      const simulatedResults = generateSimulationResults(scenario, currentKPIs);
      setSimulationResults(simulatedResults);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const generateSimulationResults = (scenario: Scenario, baseKPIs: KPIMetrics) => {
    let kpis = { ...baseKPIs };
    let conflicts: Conflict[] = [];
    let recommendations: string[] = [];

    switch (scenario.type) {
      case 'delay':
        kpis.punctuality -= 25;
        kpis.averageDelay += 15;
        kpis.criticalDelays += 2;
        conflicts = [
          {
            id: 'SIM001',
            type: 'crossing',
            trains: ['TRN001', 'TRN002', 'TRN003'],
            severity: 'high',
            description: 'Multiple trains delayed, creating cascade effect',
            suggestedResolution: 'Implement emergency timetable with 15-minute intervals',
            timeToConflict: 5
          }
        ];
        recommendations = [
          'Activate emergency timetable',
          'Increase platform dwell times',
          'Notify passengers of delays',
          'Consider freight train holding patterns'
        ];
        break;

      case 'maintenance':
        kpis.throughput -= 8;
        kpis.averageDelay += 10;
        kpis.punctuality -= 15;
        conflicts = [
          {
            id: 'SIM002',
            type: 'maintenance',
            trains: ['TRN001', 'TRN005'],
            severity: 'critical',
            description: 'Main track blocked, requires rerouting',
            suggestedResolution: 'Reroute all traffic to Track 2 with speed restrictions',
            timeToConflict: 2
          }
        ];
        recommendations = [
          'Activate single-track operation protocol',
          'Implement speed restrictions (60 km/h)',
          'Extend crossing windows',
          'Deploy additional signaling personnel'
        ];
        break;

      case 'emergency':
        kpis.punctuality -= 35;
        kpis.throughput -= 12;
        kpis.averageDelay += 20;
        kpis.criticalDelays += 4;
        conflicts = [
          {
            id: 'SIM003',
            type: 'platform',
            trains: ['TRN003', 'TRN004'],
            severity: 'critical',
            description: 'Manual signal control causing bottlenecks',
            suggestedResolution: 'Implement paper-based authority system',
            timeToConflict: 1
          }
        ];
        recommendations = [
          'Switch to paper-based train orders',
          'Deploy additional control staff',
          'Implement 10-minute safety margins',
          'Consider service suspension if needed'
        ];
        break;

      case 'volume':
        kpis.throughput += 5;
        kpis.punctuality -= 10;
        kpis.averageDelay += 5;
        conflicts = [
          {
            id: 'SIM004',
            type: 'overtaking',
            trains: ['TRN001', 'TRN003', 'TRN004'],
            severity: 'medium',
            description: 'Platform congestion due to increased frequency',
            suggestedResolution: 'Optimize platform assignments and reduce dwell times',
            timeToConflict: 8
          }
        ];
        recommendations = [
          'Optimize platform scheduling',
          'Reduce passenger boarding times',
          'Implement dynamic priority adjustments',
          'Monitor capacity utilization closely'
        ];
        break;
    }

    return { kpis, conflicts, recommendations };
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    setSelectedScenario('');
    setScenarioParams({});
  };

  const getImpactColor = (original: number, simulated: number, inverse = false) => {
    const diff = simulated - original;
    if (Math.abs(diff) < 1) return 'text-muted-foreground';
    
    const isWorse = inverse ? diff > 0 : diff < 0;
    return isWorse ? 'text-destructive' : 'text-success';
  };

  return (
    <Card className="control-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          What-If Scenario Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="results" disabled={!simulationResults}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="scenario-select">Select Scenario</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose scenario to simulate..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedScenario && (
              <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                <h4 className="font-medium mb-2">
                  {predefinedScenarios.find(s => s.id === selectedScenario)?.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {predefinedScenarios.find(s => s.id === selectedScenario)?.description}
                </p>
                <Badge variant="outline">
                  {predefinedScenarios.find(s => s.id === selectedScenario)?.type.toUpperCase()}
                </Badge>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={runSimulation} 
                disabled={!selectedScenario || isSimulating}
                className="flex-1"
              >
                {isSimulating ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetSimulation}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 mt-4">
            {simulationResults && (
              <>
                {/* KPI Comparison */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Impact Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Punctuality:</span>
                        <span className={getImpactColor(currentKPIs.punctuality, simulationResults.kpis.punctuality)}>
                          {simulationResults.kpis.punctuality.toFixed(1)}% 
                          ({(simulationResults.kpis.punctuality - currentKPIs.punctuality) >= 0 ? '+' : ''}{(simulationResults.kpis.punctuality - currentKPIs.punctuality).toFixed(1)})
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Throughput:</span>
                        <span className={getImpactColor(currentKPIs.throughput, simulationResults.kpis.throughput)}>
                          {simulationResults.kpis.throughput} 
                          ({(simulationResults.kpis.throughput - currentKPIs.throughput) >= 0 ? '+' : ''}{simulationResults.kpis.throughput - currentKPIs.throughput})
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg Delay:</span>
                        <span className={getImpactColor(currentKPIs.averageDelay, simulationResults.kpis.averageDelay, true)}>
                          {simulationResults.kpis.averageDelay.toFixed(1)}m 
                          ({(simulationResults.kpis.averageDelay - currentKPIs.averageDelay) >= 0 ? '+' : ''}{(simulationResults.kpis.averageDelay - currentKPIs.averageDelay).toFixed(1)})
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Critical Delays:</span>
                        <span className={getImpactColor(currentKPIs.criticalDelays, simulationResults.kpis.criticalDelays, true)}>
                          {simulationResults.kpis.criticalDelays} 
                          ({(simulationResults.kpis.criticalDelays - currentKPIs.criticalDelays) >= 0 ? '+' : ''}{simulationResults.kpis.criticalDelays - currentKPIs.criticalDelays})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projected Conflicts */}
                {simulationResults.conflicts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Projected Conflicts
                    </h4>
                    <div className="space-y-2">
                      {simulationResults.conflicts.map((conflict) => (
                        <div key={conflict.id} className="p-3 bg-destructive/10 rounded border border-destructive/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="destructive">{conflict.severity.toUpperCase()}</Badge>
                            <span className="text-sm font-medium">{conflict.description}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Resolution: {conflict.suggestedResolution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium mb-3">Recommended Actions</h4>
                  <ul className="space-y-1">
                    {simulationResults.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScenarioSimulator;