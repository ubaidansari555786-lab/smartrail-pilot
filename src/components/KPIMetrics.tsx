import type { KPIMetrics } from '@/types/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Clock, Train, AlertTriangle, CheckCircle } from 'lucide-react';

interface KPIMetricsProps {
  metrics: KPIMetrics;
}

const KPIMetrics = ({ metrics }: KPIMetricsProps) => {
  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-success';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-destructive';
  };

  const getTrendIcon = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value > threshold;
    return isGood ? (
      <TrendingUp className="w-4 h-4 text-success" />
    ) : (
      <TrendingDown className="w-4 h-4 text-destructive" />
    );
  };

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    return `${(minutes / 60).toFixed(1)}h`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Punctuality */}
      <Card className="metric-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Punctuality Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getPerformanceColor(metrics.punctuality, { good: 85, warning: 75 })}`}>
              {metrics.punctuality.toFixed(1)}%
            </span>
            {getTrendIcon(metrics.punctuality, 85)}
          </div>
          <Progress value={metrics.punctuality} className="mb-2" />
          <p className="text-xs text-muted-foreground">
            Target: 85% | Industry average: 82%
          </p>
        </CardContent>
      </Card>

      {/* Throughput */}
      <Card className="metric-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Train className="w-4 h-4 text-primary" />
            Throughput
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getPerformanceColor(metrics.throughput, { good: 20, warning: 15 })}`}>
              {metrics.throughput}
            </span>
            {getTrendIcon(metrics.throughput, 20)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">trains/hour</p>
          <p className="text-xs text-muted-foreground">
            Capacity: 30 trains/hour
          </p>
        </CardContent>
      </Card>

      {/* Average Delay */}
      <Card className="metric-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Average Delay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getPerformanceColor(15 - metrics.averageDelay, { good: 10, warning: 5 })}`}>
              {formatDelay(metrics.averageDelay)}
            </span>
            {getTrendIcon(15 - metrics.averageDelay, 10)}
          </div>
          <Progress value={Math.max(0, 100 - (metrics.averageDelay / 30) * 100)} className="mb-2" />
          <p className="text-xs text-muted-foreground">
            Target: &lt;5min | Max acceptable: 15min
          </p>
        </CardContent>
      </Card>

      {/* Conflicts Resolved */}
      <Card className="metric-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Conflicts Resolved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-success">
              {metrics.conflictsResolved}
            </span>
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">today</p>
          <p className="text-xs text-muted-foreground">
            Prevention rate: 94%
          </p>
        </CardContent>
      </Card>

      {/* Total Trains */}
      <Card className="metric-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Train className="w-4 h-4 text-primary" />
            Active Trains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-foreground">
              {metrics.totalTrains}
            </span>
            <div className="text-sm text-muted-foreground">trains</div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Express: 8</span>
            <span>Passenger: 10</span>
            <span>Freight: 5</span>
          </div>
        </CardContent>
      </Card>

      {/* Critical Delays */}
      <Card className="metric-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            Critical Delays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${metrics.criticalDelays > 0 ? 'text-destructive' : 'text-success'}`}>
              {metrics.criticalDelays}
            </span>
            {metrics.criticalDelays > 0 ? (
              <AlertTriangle className="w-4 h-4 text-destructive" />
            ) : (
              <CheckCircle className="w-4 h-4 text-success" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">&gt;15min delays</p>
          <p className="text-xs text-muted-foreground">
            {metrics.criticalDelays === 0 ? 'All within limits' : 'Requires attention'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIMetrics;