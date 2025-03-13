
import React from "react";
import { Student, RecitationCategory } from "@/types/student";
import StudentList from "@/components/StudentList";
import RecitationTracker from "@/components/RecitationTracker";

interface DesktopViewProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | undefined;
  recitationTexts: string[];
  categories: RecitationCategory[];
  selectedCategoryId: string | null;
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateAvatar: (studentId: string, newAvatar: string) => void;
  onAddRecitationText: (text: string, categoryId?: string) => string | undefined;
  onDeleteRecitationText: (text: string) => void;
  onAddCategory: (name: string) => RecitationCategory | undefined;
  onSelectCategory: (categoryId: string | null) => void;
  onRecordRecitation: (
    studentId: string,
    textId: string,
    status: 'completed' | 'incomplete',
    notes: string
  ) => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  students,
  selectedStudentId,
  selectedStudent,
  recitationTexts,
  categories,
  selectedCategoryId,
  onSelectStudent,
  onDeleteStudent,
  onUpdateAvatar,
  onAddRecitationText,
  onDeleteRecitationText,
  onAddCategory,
  onSelectCategory,
  onRecordRecitation
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
        <div className="space-y-6 mt-8">
          <div className="grid grid-cols-12 gap-8 animate-fade-in">
            <div className="col-span-12 md:col-span-8 space-y-6">
              <RecitationTracker
                student={selectedStudent}
                recitationTexts={recitationTexts}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onAddRecitationText={onAddRecitationText}
                onDeleteRecitationText={onDeleteRecitationText}
                onAddCategory={onAddCategory}
                onSelectCategory={onSelectCategory}
                onRecordRecitation={onRecordRecitation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopView;
