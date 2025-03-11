
import React, { useState } from "react";
import AddStudentForm from "@/components/AddStudentForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Settings } from "lucide-react";

interface AddStudentDialogProps {
  onAddStudent: (name: string, studentId: string) => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ onAddStudent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddStudent = (name: string, studentId: string) => {
    onAddStudent(name, studentId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild id="add-student-dialog-trigger">
        <Button className="gap-2">
          <Plus size={16} />
          添加学生
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加新学生</DialogTitle>
        </DialogHeader>
        <AddStudentForm onAddStudent={handleAddStudent} />
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
