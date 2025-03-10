
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from "@/types/student";
import StudentList from "@/components/StudentList";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";

interface MobileViewTabsProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | undefined;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onSelectStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateAvatar: (studentId: string, newAvatar: string) => void;
  onAddPoints: (studentId: string, amount: number, description: string, category: string) => void;
}

const MobileViewTabs: React.FC<MobileViewTabsProps> = ({
  students,
  selectedStudentId,
  selectedStudent,
  activeTab,
  setActiveTab,
  onSelectStudent,
  onDeleteStudent,
  onUpdateAvatar,
  onAddPoints
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
          <>
            <AddPointsForm 
              student={selectedStudent} 
              onAddPoints={onAddPoints} 
            />
            <PointsHistory student={selectedStudent} />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MobileViewTabs;
