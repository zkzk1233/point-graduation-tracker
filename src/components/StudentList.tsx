
import React, { useState, useRef } from "react";
import { Student } from "@/types/student";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Trash2, Upload, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StudentListProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  selectedStudentId: string | null;
  onDeleteStudent: (studentId: string) => void;
  onUpdateAvatar: (studentId: string, newAvatar: string) => void;
}

// Default avatar URLs for students without custom avatars
const defaultAvatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces",
];

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onSelectStudent, 
  selectedStudentId,
  onDeleteStudent,
  onUpdateAvatar
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ensure all students have an avatar
  const studentsWithAvatars = students.map((student, index) => ({
    ...student,
    avatar: student.avatar || defaultAvatars[index % defaultAvatars.length]
  }));
  
  const filteredStudents = studentsWithAvatars.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAvatarUpload = (studentId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.studentId = studentId;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const studentId = e.target.dataset.studentId;
    
    if (file && studentId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatar = event.target?.result as string;
        onUpdateAvatar(studentId, newAvatar);
        toast.success("头像已更新");
      };
      reader.readAsDataURL(file);
      
      // Clear the input so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-lg font-medium">
          <GraduationCap className="w-5 h-5 mr-2 text-primary" />
          <h2>学生头像选择</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          共 {students.length} 名学生
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="搜索学生姓名或学号..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white/50"
        />
      </div>
      
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 mt-4">
          {filteredStudents.map(student => (
            <TooltipProvider key={student.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <button
                      onClick={() => onSelectStudent(student.id)}
                      className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-200 hover:bg-primary/10 ${
                        selectedStudentId === student.id ? 'bg-primary/20 ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className={`relative ${selectedStudentId === student.id ? 'scale-110' : ''}`}>
                        <Avatar className="w-16 h-16 border-2 border-primary">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {student.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs font-medium text-center truncate w-full">
                        {student.name}
                      </span>
                    </button>
                    
                    {/* Avatar upload and delete options */}
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAvatarUpload(student.id);
                        }}
                        className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600"
                        title="更新头像"
                      >
                        <Upload size={14} />
                      </button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
                            title="删除学生"
                          >
                            <Trash2 size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除学生</AlertDialogTitle>
                            <AlertDialogDescription>
                              您确定要删除 {student.name} 吗？此操作将永久删除该学生及其所有背诵记录，无法恢复。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDeleteStudent(student.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{student.name}</p>
                  <p className="text-xs text-muted-foreground">学号: {student.studentId}</p>
                  <p className="text-xs">背诵篇目: {student.recitations.length} 个</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Add student button */}
          {students.length < 40 && (
            <button
              onClick={() => document.getElementById('add-student-dialog-trigger')?.click()}
              className="flex flex-col items-center justify-center h-[104px] p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-xs font-medium mt-2 text-gray-500">添加学生</span>
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            {searchTerm ? "未找到匹配的学生" : "暂无学生，请添加学生"}
          </div>
        </div>
      )}

      {students.length < 40 && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          当前显示 {students.length} 名学生，系统支持最多 40 名学生
        </div>
      )}
      
      {/* Hidden file input for avatar uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
        data-student-id=""
      />
    </div>
  );
};

export default StudentList;
