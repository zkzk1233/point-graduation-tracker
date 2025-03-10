
import React from "react";
import { PointEntry, Student } from "@/types/student";
import { format } from "date-fns";
import { ChevronUp, ChevronDown, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PointsHistoryProps {
  student: Student;
}

const PointEntryItem: React.FC<{ entry: PointEntry }> = ({ entry }) => {
  const isPositive = entry.amount > 0;
  
  return (
    <div className="flex items-center p-3 border-b border-border last:border-0">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
        isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      )}>
        {isPositive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">{entry.description}</p>
          <span className={cn(
            "font-semibold text-sm",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? "+" : ""}{entry.amount}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Clock className="w-3 h-3 mr-1" />
          <span>{format(entry.timestamp, "yyyy-MM-dd HH:mm")}</span>
        </div>
      </div>
    </div>
  );
};

const PointsHistory: React.FC<PointsHistoryProps> = ({ student }) => {
  const sortedHistory = [...student.pointsHistory].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="p-4 border-b">
        <h3 className="font-medium">积分历史</h3>
      </div>
      
      <ScrollArea className="h-[400px]">
        {sortedHistory.length > 0 ? (
          <div>
            {sortedHistory.map((entry) => (
              <PointEntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            暂无积分记录
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PointsHistory;
