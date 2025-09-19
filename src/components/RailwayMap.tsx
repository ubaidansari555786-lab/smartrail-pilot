import { RailwaySection, Train } from '@/types/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Construction, Train as TrainIcon } from 'lucide-react';

interface RailwayMapProps {
  section: RailwaySection;
  trains: Train[];
}

const RailwayMap = ({ section, trains }: RailwayMapProps) => {
  const getTrainAtPosition = (position: number) => {
    return trains.find(train => 
      Math.abs(train.currentPosition - position) < 0.5
    );
  };

  const getSignalColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'signal-light green';
      case 'red':
        return 'signal-light red';
      case 'amber':
        return 'signal-light amber';
      default:
        return 'signal-light';
    }
  };

  return (
    <Card className="control-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {section.name}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Length: {section.length} km
        </div>
      </CardHeader>
      <CardContent>
        {/* Track Layout */}
        <div className="space-y-6">
          {section.tracks.map((track, trackIndex) => (
            <div key={track.id} className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={track.occupied ? "destructive" : "secondary"}>
                  {track.name}
                </Badge>
                {track.occupied && (
                  <Badge variant="outline" className="text-xs">
                    OCCUPIED
                  </Badge>
                )}
                {track.maintenanceBlock && (
                  <Badge variant="destructive" className="text-xs flex items-center gap-1">
                    <Construction className="w-3 h-3" />
                    MAINTENANCE
                  </Badge>
                )}
              </div>
              
              {/* Track line with scale */}
              <div className="relative">
                <div className="track-line w-full">
                  {/* Maintenance block visualization */}
                  {track.maintenanceBlock && (
                    <div
                      className="absolute top-0 h-full bg-destructive/30 border border-destructive rounded"
                      style={{
                        left: `${(track.maintenanceBlock.start / section.length) * 100}%`,
                        width: `${((track.maintenanceBlock.end - track.maintenanceBlock.start) / section.length) * 100}%`
                      }}
                    />
                  )}
                  
                  {/* Stations */}
                  {section.stations.map((station) => (
                    <div
                      key={station.id}
                      className="absolute top-0 transform -translate-y-1/2"
                      style={{ left: `${(station.position / section.length) * 100}%` }}
                    >
                      <div className="w-3 h-3 bg-accent rounded-full border-2 border-background" />
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-accent font-medium whitespace-nowrap">
                        {station.name}
                      </div>
                    </div>
                  ))}
                  
                  {/* Signals */}
                  {section.signals.map((signal) => (
                    <div
                      key={signal.id}
                      className="absolute top-0 transform translate-y-1/2"
                      style={{ left: `${(signal.position / section.length) * 100}%` }}
                    >
                      <div className={getSignalColor(signal.status)} />
                    </div>
                  ))}
                  
                  {/* Trains */}
                  {trains.map((train) => (
                    <div
                      key={train.id}
                      className="absolute top-0 transform -translate-y-6"
                      style={{ left: `${(train.currentPosition / section.length) * 100}%` }}
                    >
                      <div className="flex flex-col items-center">
                        <TrainIcon className="w-6 h-6 text-primary mb-1" />
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {train.number}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Distance scale */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0 km</span>
                  <span>{(section.length / 4).toFixed(1)} km</span>
                  <span>{(section.length / 2).toFixed(1)} km</span>
                  <span>{(3 * section.length / 4).toFixed(1)} km</span>
                  <span>{section.length} km</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="text-sm font-medium mb-2 text-muted-foreground">Legend</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="signal-light green" />
              <span>Clear Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="signal-light amber" />
              <span>Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="signal-light red" />
              <span>Stop Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span>Station</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RailwayMap;