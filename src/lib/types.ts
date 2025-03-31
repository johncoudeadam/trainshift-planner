
export type ShiftType = "day" | "night";

export interface Activity {
  id: string;
  name: string;
  type: number;
  day: number;
  shift: ShiftType;
  optimalDay: number;
  optimalShift: ShiftType;
  isOutOfOptimalTime: boolean;
}

export interface Train {
  id: string;
  name: string;
  activities: Activity[];
}
