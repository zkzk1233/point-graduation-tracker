
import React, { useState } from "react";
import { Student, RecitationCategory } from "@/types/student";
import { toast } from "sonner";
import RecitationTextGrid from "./recitation/RecitationTextGrid";
import CategorySelector from "./recitation/CategorySelector";
import { AddTextDialog, AddCategoryDialog } from "./recitation/RecitationDialogs";
import RecitationDetailView from "./recitation/RecitationDetailView";

interface RecitationTrackerProps {
  student: Student;
  recitationTexts: string[];
  categories: RecitationCategory[];
  selectedCategoryId: string | null;
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

const RecitationTracker: React.FC<RecitationTrackerProps> = ({
  student,
  recitationTexts,
  categories,
  selectedCategoryId,
  onAddRecitationText,
  onDeleteRecitationText,
  onAddCategory,
  onSelectCategory,
  onRecordRecitation
}) => {
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newRecitationText, setNewRecitationText] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [status, setStatus] = useState<'completed' | 'incomplete'>('completed');
  const [notes, setNotes] = useState("");
  const [isDetailMode, setIsDetailMode] = useState(false);

  const handleAddNewText = () => {
    if (newRecitationText.trim()) {
      onAddRecitationText(newRecitationText.trim(), selectedCategoryId || undefined);
      setNewRecitationText("");
      setIsTextDialogOpen(false);
    } else {
      toast.error("篇目名称不能为空");
    }
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    } else {
      toast.error("类别名称不能为空");
    }
  };

  const handleTextSelect = (text: string) => {
    setSelectedText(text);
    
    // Check if student already has a record for this text
    const existingRecord = student.recitations.find(r => r.textId === text);
    if (existingRecord) {
      setStatus(existingRecord.status);
      setNotes(existingRecord.notes);
    } else {
      // Default values for new record
      setStatus('completed');
      setNotes("");
    }
    
    setIsDetailMode(true);
  };

  const handleSubmit = () => {
    if (!selectedText) return;
    
    onRecordRecitation(
      student.id,
      selectedText,
      status,
      notes
    );
    
    // Return to text selection
    setIsDetailMode(false);
    setSelectedText(null);
  };

  const handleBackButton = () => {
    setIsDetailMode(false);
    setSelectedText(null);
  };

  // Get recitation status for a specific text
  const getTextStatus = (text: string) => {
    return student.recitations.find(r => r.textId === text)?.status || null;
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="font-medium mb-4">
        {isDetailMode ? `${student.name} - ${selectedText}` : `${student.name} - 背诵记录`}
      </h3>

      {!isDetailMode ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">选择篇目</h2>
            <div className="flex gap-2">
              {/* Category Selector */}
              <CategorySelector 
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={onSelectCategory}
                onAddCategoryClick={() => setIsCategoryDialogOpen(true)}
              />

              {/* Add Text Dialog */}
              <AddTextDialog 
                isOpen={isTextDialogOpen}
                onOpenChange={setIsTextDialogOpen}
                newText={newRecitationText}
                onTextChange={setNewRecitationText}
                onAddText={handleAddNewText}
              />
            </div>
          </div>

          {/* Add Category Dialog */}
          <AddCategoryDialog 
            isOpen={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
            newCategory={newCategoryName}
            onCategoryChange={setNewCategoryName}
            onAddCategory={handleAddNewCategory}
          />

          {/* Text Selection Grid */}
          <RecitationTextGrid 
            recitationTexts={recitationTexts}
            selectedText={selectedText}
            getTextStatus={getTextStatus}
            onTextSelect={handleTextSelect}
            onDeleteText={onDeleteRecitationText}
          />
        </>
      ) : (
        <RecitationDetailView 
          selectedText={selectedText}
          status={status}
          notes={notes}
          onStatusChange={setStatus}
          onNotesChange={setNotes}
          onBack={handleBackButton}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
};

export default RecitationTracker;
