import { useState } from 'react';
import { Train, ManualOverride } from '@/types/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, X, AlertTriangle, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ManualOverridePanelProps {
  trains: Train[];
  auditLog: ManualOverride[];
  onManualOverride: (override: Omit<ManualOverride, 'id' | 'timestamp'>) => void;
}

const ManualOverridePanel = ({ trains, auditLog, onManualOverride }: ManualOverridePanelProps) => {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [overrideType, setOverrideType] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const overrideTypes = [
    { value: 'priority', label: 'Priority Change', field: 'priority' },
    { value: 'speed', label: 'Speed Limit', field: 'speed' },
    { value: 'route', label: 'Route Change', field: 'route' },
    { value: 'delay', label: 'Scheduled Delay', field: 'schedule' },
    { value: 'emergency', label: 'Emergency Stop', field: 'status' }
  ];

  const handleSubmit = () => {
    if (!selectedTrain || !overrideType || !newValue || !reason) return;

    const train = trains.find(t => t.id === selectedTrain);
    if (!train) return;

    const overrideConfig = overrideTypes.find(t => t.value === overrideType);
    if (!overrideConfig) return;

    const originalValue = getOriginalValue(train, overrideConfig.field);

    onManualOverride({
      operator: 'Control Operator', // In real app, get from auth
      action: overrideConfig.label,
      trainId: selectedTrain,
      reason,
      originalValue,
      newValue
    });

    // Reset form
    setSelectedTrain('');
    setOverrideType('');
    setNewValue('');
    setReason('');
    setIsDialogOpen(false);
  };

  const getOriginalValue = (train: Train, field: string): string => {
    switch (field) {
      case 'priority':
        return `Priority: ${train.priority}`;
      case 'speed':
        return `Speed: ${train.speed} km/h`;
      case 'route':
        return `Route: Current`;
      case 'schedule':
        return `ETA: ${train.estimatedArrival}`;
      case 'status':
        return `Status: ${train.status}`;
      default:
        return 'Unknown';
    }
  };

  const getOverrideTypeColor = (action: string) => {
    if (action.includes('Emergency')) return 'destructive';
    if (action.includes('Priority')) return 'default';
    if (action.includes('Speed')) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-4">
      {/* Manual Override Controls */}
      <Card className="control-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Manual Override Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Initiate Manual Override
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Manual Override Request
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="train-select">Select Train</Label>
                  <Select value={selectedTrain} onValueChange={setSelectedTrain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose train..." />
                    </SelectTrigger>
                    <SelectContent>
                      {trains.map((train) => (
                        <SelectItem key={train.id} value={train.id}>
                          {train.number} - {train.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="override-type">Override Type</Label>
                  <Select value={overrideType} onValueChange={setOverrideType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action..." />
                    </SelectTrigger>
                    <SelectContent>
                      {overrideTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="new-value">New Value</Label>
                  <Input
                    id="new-value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter new value..."
                  />
                </div>

                <div>
                  <Label htmlFor="reason">Reason (Required)</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain the reason for this override..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSubmit}
                    disabled={!selectedTrain || !overrideType || !newValue || !reason}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Apply Override
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card className="control-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Override Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLog.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No manual overrides recorded today
              </div>
            ) : (
              auditLog.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-muted/20 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getOverrideTypeColor(log.action)}>
                        {log.action}
                      </Badge>
                      {log.trainId && (
                        <Badge variant="outline" className="font-mono">
                          {log.trainId}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p><strong>Operator:</strong> {log.operator}</p>
                    <p><strong>Reason:</strong> {log.reason}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">From:</span>
                        <div className="font-mono bg-destructive/20 p-1 rounded">
                          {log.originalValue}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">To:</span>
                        <div className="font-mono bg-success/20 p-1 rounded">
                          {log.newValue}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualOverridePanel;