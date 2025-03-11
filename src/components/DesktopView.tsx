
import React from "react";
import { Student } from "@/types/student";
import StudentList from "@/components/StudentList";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";

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
        <div className="grid grid-cols-12 gap-8 mt-8">
          <div className="col-span-12 md:col-span-6 space-y-6 animate-fade-in">
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
          <div className="col-span-12 md:col-span-6 space-y-6 animate-fade-in">
            <PointsHistory student={selectedStudent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopView;
