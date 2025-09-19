import { Train } from '@/types/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface TrainScheduleBoardProps {
  trains: Train[];
}

const TrainScheduleBoard = ({ trains }: TrainScheduleBoardProps) => {
  const getStatusIcon = (status: Train['status']) => {
    switch (status) {
      case 'on-time':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'active':
        return <div className="train-indicator active" />;
      case 'approaching':
        return <div className="train-indicator on-time" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Train['status'], delay: number) => {
    if (status === 'delayed') {
      return (
        <Badge variant="destructive" className="ml-2">
          +{delay}min
        </Badge>
      );
    }
    if (status === 'on-time') {
      return (
        <Badge variant="default" className="ml-2 bg-success text-success-foreground">
          On Time
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="ml-2">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTrainTypeColor = (type: Train['type']) => {
    switch (type) {
      case 'express':
        return 'border-l-4 border-l-primary';
      case 'passenger':
        return 'border-l-4 border-l-accent';
      case 'freight':
        return 'border-l-4 border-l-muted-foreground';
      default:
        return 'border-l-4 border-l-border';
    }
  };

  return (
    <Card className="control-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Train Schedule Board
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trains.map((train) => (
            <div
              key={train.id}
              className={`p-4 rounded-lg bg-muted/30 border ${getTrainTypeColor(train.type)} transition-all duration-300 hover:bg-muted/50 ${
                train.speed > 0 ? 'ring-2 ring-primary/20 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(train.status)}
                    <span className="font-mono text-lg font-bold text-primary">
                      {train.number}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {train.type.toUpperCase()}
                    </Badge>
                  </div>
                  {getStatusBadge(train.status, train.delay)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Priority</div>
                  <div className="font-bold text-accent">{train.priority}/10</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Destination</div>
                  <div className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {train.destination}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Position</div>
                  <div className="font-medium">{train.currentPosition.toFixed(1)} km</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Speed</div>
                  <div className="font-medium">{train.speed} km/h</div>
                </div>
                <div>
                  <div className="text-muted-foreground">ETA</div>
                  <div className="font-medium font-mono">
                    {train.estimatedArrival}
                    {train.delay > 0 && (
                      <span className="text-destructive ml-1">
                        ({train.scheduledArrival})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Operator: {train.operator}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainScheduleBoard;