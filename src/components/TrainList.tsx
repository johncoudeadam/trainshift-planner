
import { Train, Activity, ShiftType } from "@/lib/types";
import ActivityItem from "./ActivityItem";
import ShiftCell from "./ShiftCell";
import { TrainFront } from "lucide-react";

interface TrainListProps {
  trains: Train[];
  onActivityMove: (
    activityId: string,
    trainId: string, 
    targetDay: number,
    targetShift: ShiftType
  ) => void;
}

const TrainList = ({ trains, onActivityMove }: TrainListProps) => {
  // Generate day numbers (0-13) for 2 weeks
  const days = Array.from({ length: 14 }, (_, i) => i);
  
  // Get all shifts for each day (day and night)
  const shifts: { day: number; shift: ShiftType }[] = days.flatMap((day) => [
    { day, shift: "day" as ShiftType },
    { day, shift: "night" as ShiftType },
  ]);

  return (
    <div>
      {trains.map((train) => (
        <div key={train.id} className="flex border-b last:border-b-0">
          <div className="w-48 min-w-48 p-3 font-medium flex items-center gap-2 bg-gray-50 border-r">
            <TrainFront className="text-blue-600" size={18} />
            <span>{train.name}</span>
          </div>
          <div className="flex-1 grid grid-cols-14">
            {days.map((day) => (
              <div key={day} className="border-r last:border-r-0 grid grid-cols-1">
                <div className="grid grid-cols-2 h-full">
                  <ShiftCell
                    trainId={train.id}
                    day={day}
                    shift="day"
                    onActivityMove={onActivityMove}
                  >
                    {train.activities
                      .filter((activity) => activity.day === day && activity.shift === "day")
                      .map((activity) => (
                        <ActivityItem 
                          key={activity.id} 
                          activity={activity} 
                          trainId={train.id} 
                        />
                      ))}
                  </ShiftCell>
                  <ShiftCell
                    trainId={train.id}
                    day={day}
                    shift="night"
                    onActivityMove={onActivityMove}
                  >
                    {train.activities
                      .filter((activity) => activity.day === day && activity.shift === "night")
                      .map((activity) => (
                        <ActivityItem 
                          key={activity.id} 
                          activity={activity} 
                          trainId={train.id} 
                        />
                      ))}
                  </ShiftCell>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainList;
