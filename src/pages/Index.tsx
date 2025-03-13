
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import AddStudentDialog from "@/components/AddStudentDialog";
import MobileViewTabs from "@/components/MobileViewTabs";
import DesktopView from "@/components/DesktopView";
import { useStudentData } from "@/hooks/useStudentData";

const Index = () => {
  const {
    students,
    selectedStudent,
    selectedStudentId,
    categories,
    selectedCategoryId,
    recitationTexts,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateAvatar,
    handleSelectStudent,
    handleAddRecitationText,
    handleDeleteRecitationText,
    handleAddCategory,
    handleSelectCategory,
    handleRecordRecitation
  } = useStudentData();
  
  const [activeTab, setActiveTab] = useState<string>("avatars");

  // Show student details on mobile when selecting a student
  useEffect(() => {
    if (selectedStudentId && window.innerWidth < 768) {
      setActiveTab("detail");
    }
  }, [selectedStudentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="mb-8">
          <AddStudentDialog onAddStudent={handleAddStudent} />
        </div>

        {/* Mobile View Tabs */}
        <div className="md:hidden mb-6">
          <MobileViewTabs
            students={students}
            selectedStudentId={selectedStudentId}
            selectedStudent={selectedStudent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectStudent={handleSelectStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdateAvatar={handleUpdateAvatar}
            recitationTexts={recitationTexts}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onAddRecitationText={handleAddRecitationText}
            onDeleteRecitationText={handleDeleteRecitationText}
            onAddCategory={handleAddCategory}
            onSelectCategory={handleSelectCategory}
            onRecordRecitation={handleRecordRecitation}
          />
        </div>

        {/* Desktop View */}
        <DesktopView
          students={students}
          selectedStudentId={selectedStudentId}
          selectedStudent={selectedStudent}
          recitationTexts={recitationTexts}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectStudent={handleSelectStudent}
          onDeleteStudent={handleDeleteStudent}
          onUpdateAvatar={handleUpdateAvatar}
          onAddRecitationText={handleAddRecitationText}
          onDeleteRecitationText={handleDeleteRecitationText}
          onAddCategory={handleAddCategory}
          onSelectCategory={handleSelectCategory}
          onRecordRecitation={handleRecordRecitation}
        />
      </div>
    </div>
  );
};

export default Index;
