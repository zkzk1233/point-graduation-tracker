
import React, { useState } from "react";
import { Student } from "@/types/student";
import StudentCard from "./StudentCard";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap } from "lucide-react";

interface StudentListProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  selectedStudentId: string | null;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onSelectStudent, 
  selectedStudentId 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-lg font-medium">
          <GraduationCap className="w-5 h-5 mr-2 text-primary" />
          <h2>学生列表</h2>
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
      
      <div className="space-y-3 mt-2">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onSelect={onSelectStudent}
              isSelected={selectedStudentId === student.id}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              {searchTerm ? "未找到匹配的学生" : "暂无学生，请添加学生"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
