import { Conflict } from '@/types/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

interface ConflictPanelProps {
  conflicts: Conflict[];
  onResolveConflict: (conflictId: string, resolution: string) => void;
  onDismissConflict: (conflictId: string) => void;
}

const ConflictPanel = ({ conflicts, onResolveConflict, onDismissConflict }: ConflictPanelProps) => {
  const [processingConflict, setProcessingConflict] = useState<string | null>(null);

  const getSeverityColor = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getSeverityIcon = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getConflictTypeIcon = (type: Conflict['type']) => {
    // Return appropriate icon based on conflict type
    return '⚠️';
  };

  const handleResolve = async (conflictId: string, resolution: string) => {
    setProcessingConflict(conflictId);
    // Simulate processing time
    setTimeout(() => {
      onResolveConflict(conflictId, resolution);
      setProcessingConflict(null);
    }, 1500);
  };

  if (conflicts.length === 0) {
    return (
      <Card className="control-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="w-5 h-5" />
            Conflict Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="text-success font-medium">No conflicts detected</p>
            <p className="text-sm text-muted-foreground">All trains operating smoothly</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="control-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Active Conflicts ({conflicts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="p-4 rounded-lg border border-border bg-muted/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(conflict.severity)}
                  <Badge variant={getSeverityColor(conflict.severity)}>
                    {conflict.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {conflict.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Time to conflict</div>
                  <div className="font-bold text-destructive">
                    {conflict.timeToConflict} min
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-medium mb-1">Affected Trains</h4>
                <div className="flex gap-2 flex-wrap">
                  {conflict.trains.map((trainId) => (
                    <Badge key={trainId} variant="outline" className="font-mono">
                      {trainId}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm mb-2">{conflict.description}</p>
                <div className="p-3 bg-primary/10 rounded border border-primary/20">
                  <div className="text-sm font-medium text-primary mb-1">
                    Suggested Resolution:
                  </div>
                  <p className="text-sm">{conflict.suggestedResolution}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleResolve(conflict.id, conflict.suggestedResolution)}
                  disabled={processingConflict === conflict.id}
                >
                  {processingConflict === conflict.id ? 'Processing...' : 'Apply Resolution'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDismissConflict(conflict.id)}
                  disabled={processingConflict === conflict.id}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConflictPanel;