
import React from "react";
import { Student } from "@/types/student";
import StudentList from "@/components/StudentList";
import RecitationTracker from "@/components/RecitationTracker";

interface DesktopViewProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | undefined;
  recitationTexts: string[];
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateAvatar: (studentId: string, newAvatar: string) => void;
  onAddRecitationText: (text: string) => string | undefined;
  onDeleteRecitationText: (text: string) => void;
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
  onSelectStudent,
  onDeleteStudent,
  onUpdateAvatar,
  onAddRecitationText,
  onDeleteRecitationText,
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
                onAddRecitationText={onAddRecitationText}
                onDeleteRecitationText={onDeleteRecitationText}
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
