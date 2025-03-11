
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from "@/types/student";
import StudentList from "@/components/StudentList";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { History, Plus } from "lucide-react";

interface MobileViewTabsProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | undefined;
  activeTab: string;
  setActiveTab: (value: string) => void;
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

const MobileViewTabs: React.FC<MobileViewTabsProps> = ({
  students,
  selectedStudentId,
  selectedStudent,
  activeTab,
  setActiveTab,
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
            <div className="flex gap-4 mb-4">
              <Button 
                variant={!showPointsHistory ? "default" : "outline"} 
                onClick={() => setShowPointsHistory(false)}
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                添加积分
              </Button>
              <Button 
                variant={showPointsHistory ? "default" : "outline"}
                onClick={() => setShowPointsHistory(true)}
                size="sm"
                className="gap-1"
              >
                <History size={16} />
                积分历史
              </Button>
            </div>

            {!showPointsHistory ? (
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
            ) : (
              <PointsHistory student={selectedStudent} />
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MobileViewTabs;
