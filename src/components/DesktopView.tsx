
import React, { useState } from "react";
import { Student } from "@/types/student";
import StudentList from "@/components/StudentList";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";
import RecitationTracker from "@/components/RecitationTracker";
import { Button } from "@/components/ui/button";
import { History, BookOpen } from "lucide-react";

interface DesktopViewProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | undefined;
  pointCategories: string[];
  recitationTexts: string[];
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateAvatar: (studentId: string, newAvatar: string) => void;
  onAddPoints: (studentId: string, amount: number, description: string, category: string) => void;
  onAddCategory: (category: string) => string | undefined;
  onDeleteCategory: (category: string) => void;
  onAddRecitationText: (text: string) => string | undefined;
  onDeleteRecitationText: (text: string) => void;
  onRecordRecitation: (
    studentId: string,
    textId: string,
    status: 'completed' | 'incomplete',
    points: number,
    notes: string
  ) => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  students,
  selectedStudentId,
  selectedStudent,
  pointCategories,
  recitationTexts,
  onSelectStudent,
  onDeleteStudent,
  onUpdateAvatar,
  onAddPoints,
  onAddCategory,
  onDeleteCategory,
  onAddRecitationText,
  onDeleteRecitationText,
  onRecordRecitation
}) => {
  const [activeView, setActiveView] = useState<"recitation" | "points" | "history">("recitation");

  return (
    <div className="hidden md:block space-y-6 animate-fade-in">
      <StudentList 
        students={students} 
        onSelectStudent={onSelectStudent} 
        selectedStudentId={selectedStudentId}
        onDeleteStudent={onDeleteStudent}
        onUpdateAvatar={onUpdateAvatar}
      />
      
      {/* If a student is selected, show details */}
      {selectedStudent && (
        <div className="space-y-6 mt-8">
          {/* Toggleable content section */}
          <div className="flex gap-4">
            <Button 
              variant={activeView === "recitation" ? "default" : "outline"} 
              onClick={() => setActiveView("recitation")}
              className="gap-2"
            >
              <BookOpen size={16} />
              背诵记录
            </Button>
            <Button 
              variant={activeView === "points" ? "default" : "outline"} 
              onClick={() => setActiveView("points")}
            >
              添加积分
            </Button>
            <Button 
              variant={activeView === "history" ? "default" : "outline"}
              onClick={() => setActiveView("history")}
              className="gap-2"
            >
              <History size={16} />
              积分历史
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-8 animate-fade-in">
            <div className="col-span-12 md:col-span-8 space-y-6">
              {activeView === "recitation" && (
                <RecitationTracker
                  student={selectedStudent}
                  recitationTexts={recitationTexts}
                  onAddRecitationText={onAddRecitationText}
                  onDeleteRecitationText={onDeleteRecitationText}
                  onRecordRecitation={onRecordRecitation}
                />
              )}
              
              {activeView === "points" && (
                <AddPointsForm 
                  student={selectedStudent} 
                  onAddPoints={onAddPoints}
                  pointCategories={pointCategories}
                  recitationTexts={recitationTexts}
                  onAddCategory={onAddCategory}
                  onDeleteCategory={onDeleteCategory}
                  onAddRecitationText={onAddRecitationText}
                  onDeleteRecitationText={onDeleteRecitationText}
                />
              )}
              
              {activeView === "history" && (
                <PointsHistory student={selectedStudent} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopView;
