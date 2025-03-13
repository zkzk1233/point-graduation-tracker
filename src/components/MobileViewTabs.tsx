
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student, RecitationCategory } from "@/types/student";
import StudentList from "@/components/StudentList";
import RecitationTracker from "@/components/RecitationTracker";

interface MobileViewTabsProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | undefined;
  activeTab: string;
  setActiveTab: (value: string) => void;
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

const MobileViewTabs: React.FC<MobileViewTabsProps> = ({
  students,
  selectedStudentId,
  selectedStudent,
  activeTab,
  setActiveTab,
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="avatars">学生头像</TabsTrigger>
        <TabsTrigger value="detail" disabled={!selectedStudentId}>
          学生详情
        </TabsTrigger>
      </TabsList>
      <TabsContent value="avatars" className="mt-4 space-y-6 animate-fade-in">
        <StudentList 
          students={students} 
          onSelectStudent={onSelectStudent} 
          selectedStudentId={selectedStudentId}
          onDeleteStudent={onDeleteStudent}
          onUpdateAvatar={onUpdateAvatar}
        />
      </TabsContent>
      <TabsContent value="detail" className="mt-4 space-y-6 animate-fade-in">
        {selectedStudent && (
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
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MobileViewTabs;
