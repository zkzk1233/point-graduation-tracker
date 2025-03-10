
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface AddStudentFormProps {
  onAddStudent: (name: string, studentId: string) => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onAddStudent }) => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !studentId.trim()) {
      toast({
        title: "请填写完整信息",
        description: "学生姓名和学号不能为空",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onAddStudent(name.trim(), studentId.trim());
      
      toast({
        title: "添加成功",
        description: `学生 ${name} 已添加`,
      });
      
      // Reset form
      setName("");
      setStudentId("");
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="w-5 h-5 text-primary" />
        <h3 className="font-medium">添加新学生</h3>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">学生姓名</Label>
          <Input
            id="name"
            placeholder="请输入学生姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="studentId">学号</Label>
          <Input
            id="studentId"
            placeholder="请输入学生学号"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="bg-white/50"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "添加中..." : "添加学生"}
      </Button>
    </form>
  );
};

export default AddStudentForm;
