
import React, { useState } from "react";
import { Student } from "@/types/student";
import StudentList from "@/components/StudentList";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

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
  onDeleteRecitationText
}) => {
  const [showPointsHistory, setShowPointsHistory] = useState(false);

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
              variant={!showPointsHistory ? "default" : "outline"} 
              onClick={() => setShowPointsHistory(false)}
            >
              添加积分
            </Button>
            <Button 
              variant={showPointsHistory ? "default" : "outline"}
              onClick={() => setShowPointsHistory(true)}
              className="gap-2"
            >
              <History size={16} />
              积分历史
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-8 animate-fade-in">
            {!showPointsHistory ? (
              <div className="col-span-12 md:col-span-8 space-y-6">
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
              </div>
            ) : (
              <div className="col-span-12 md:col-span-8 space-y-6">
                <PointsHistory student={selectedStudent} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopView;
