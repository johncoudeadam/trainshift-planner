
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
  manHours: number; // Number of man-hours required for this activity
}

export interface Train {
  id: string;
  name: string;
  activities: Activity[];
}

export interface ShiftManHours {
  day: number;
  shift: ShiftType;
  availableManHours: number;
}
