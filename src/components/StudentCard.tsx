
import React from "react";
import { Student } from "@/types/student";
import RankBadge from "./RankBadge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Star, Award } from "lucide-react";

// Define simple rank utilities since the module is missing
const getRank = (student: Student) => {
  return {
    name: "学生",
    color: "bg-blue-100",
    textColor: "text-blue-800"
  };
};

interface StudentCardProps {
  student: Student;
  onSelect: (studentId: string) => void;
  isSelected: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onSelect, isSelected }) => {
  const rank = getRank(student);
  // Since totalPoints no longer exists, we'll use recitation count instead
  const recitationCount = student.recitations.length;
  
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
            <span className="text-sm font-medium">{recitationCount} 篇</span>
          </div>
        </div>
        
        <Progress value={recitationCount > 0 ? (recitationCount / 10) * 100 : 0} className="h-1.5" />
        
        <div className="mt-1 text-xs text-right text-muted-foreground">
          背诵进度
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
