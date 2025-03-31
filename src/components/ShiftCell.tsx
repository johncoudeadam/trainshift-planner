
import { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ShiftType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ShiftCellProps {
  children: ReactNode;
  trainId: string;
  day: number;
  shift: ShiftType;
  onActivityMove: (
    activityId: string,
    trainId: string,
    targetDay: number,
    targetShift: ShiftType
  ) => void;
}

const ShiftCell = ({ children, trainId, day, shift, onActivityMove }: ShiftCellProps) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "activity",
    drop: (item: { id: string; trainId: string }) => {
      onActivityMove(item.id, item.trainId, day, shift);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={cn(
        "p-1 min-h-[80px] transition-colors",
        shift === "day" ? "bg-blue-50 border-r" : "bg-indigo-50",
        isOver && canDrop && "bg-green-100"
      )}
    >
      {children}
    </div>
  );
};

export default ShiftCell;
