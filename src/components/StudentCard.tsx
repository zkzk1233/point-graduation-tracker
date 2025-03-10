
import React from "react";
import { Student } from "@/types/student";
import { getRank, getNextRank, getPointsToNextRank, getProgressToNextRank } from "@/utils/rankUtils";
import RankBadge from "./RankBadge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Star, Award } from "lucide-react";

interface StudentCardProps {
  student: Student;
  onSelect: (studentId: string) => void;
  isSelected: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onSelect, isSelected }) => {
  const rank = getRank(student.totalPoints);
  const nextRank = getNextRank(student);
  const pointsToNext = getPointsToNextRank(student);
  const progress = getProgressToNextRank(student);

  return (
    <div 
      className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''
      }`}
      onClick={() => onSelect(student.id)}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          {student.avatar ? (
            <img 
              src={student.avatar} 
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
              {student.name.charAt(0)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <Award className="w-4 h-4 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-medium truncate">{student.name}</h3>
              <p className="text-xs text-muted-foreground truncate">ID: {student.studentId}</p>
            </div>
            <RankBadge rank={rank} />
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-amber-500 mr-1" />
            <span className="text-sm font-medium">{student.totalPoints} 分</span>
          </div>
          {nextRank && (
            <span className="text-xs text-muted-foreground">还需 {pointsToNext} 分升级</span>
          )}
        </div>
        
        <Progress value={progress} className="h-1.5" />
        
        {nextRank ? (
          <div className="mt-1 text-xs text-right text-muted-foreground">
            下一级: <RankBadge rank={nextRank} className="ml-1 text-[10px] py-0 px-1.5" />
          </div>
        ) : (
          <div className="mt-1 text-xs text-right text-primary font-medium">
            已达最高级别!
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
