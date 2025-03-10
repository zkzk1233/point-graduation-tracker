
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import StudentList from "@/components/StudentList";
import AddStudentForm from "@/components/AddStudentForm";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";
import { Student, PointEntry } from "@/types/student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Award, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Add uuid dependency
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = "student-points-data";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("avatars");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        const studentsWithDates = parsedData.map((student: any) => ({
          ...student,
          avatar: student.avatar || "", // Ensure avatar exists
          pointsHistory: student.pointsHistory.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        }));
        setStudents(studentsWithDates);
      } catch (error) {
        console.error("Failed to parse saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Find the selected student
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Handle adding a new student
  const handleAddStudent = (name: string, studentId: string) => {
    // Check if student ID already exists
    if (students.some(s => s.studentId === studentId)) {
      toast.error("学号已存在", {
        description: "请使用不同的学号",
      });
      return;
    }

    // Generate random avatar from Unsplash
    const avatarSeed = Math.floor(Math.random() * 1000);
    const avatarUrl = `https://source.unsplash.com/collection/happy-people/${avatarSeed}`;

    const newStudent: Student = {
      id: uuidv4(),
      name,
      studentId,
      avatar: avatarUrl,
      totalPoints: 0,
      pointsHistory: []
    };

    setStudents(prev => [...prev, newStudent]);
    setSelectedStudentId(newStudent.id);
    setIsAddStudentOpen(false);
    setActiveTab("avatars");
    
    toast.success("学生添加成功", {
      description: `${name} (${studentId}) 已添加到系统`
    });
  };

  // Handle adding points to a student
  const handleAddPoints = (studentId: string, amount: number, description: string) => {
    const newPointEntry: PointEntry = {
      id: uuidv4(),
      amount,
      description,
      timestamp: new Date()
    };

    setStudents(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            totalPoints: student.totalPoints + amount,
            pointsHistory: [newPointEntry, ...student.pointsHistory]
          };
        }
        return student;
      })
    );
    
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`积分已记录`, {
        description: `${student.name}: ${amount > 0 ? '+' : ''}${amount} 分`
      });
    }
  };

  // Handle selecting a student
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    // Show student details on mobile
    if (window.innerWidth < 768) {
      setActiveTab("detail");
    }
  };

  // Responsive layout adjustments
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="flex justify-end mb-4">
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
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
        </div>

        {/* Mobile View Tabs */}
        <div className="md:hidden mb-6">
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
                onSelectStudent={handleSelectStudent} 
                selectedStudentId={selectedStudentId} 
              />
            </TabsContent>
            <TabsContent value="detail" className="mt-4 space-y-6 animate-fade-in">
              {selectedStudent && (
                <>
                  <AddPointsForm 
                    student={selectedStudent} 
                    onAddPoints={handleAddPoints} 
                  />
                  <PointsHistory student={selectedStudent} />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 space-y-6 animate-fade-in">
            <StudentList 
              students={students} 
              onSelectStudent={handleSelectStudent} 
              selectedStudentId={selectedStudentId} 
            />
          </div>
          
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {selectedStudent ? (
              <div className="space-y-6 animate-fade-in">
                <AddPointsForm 
                  student={selectedStudent} 
                  onAddPoints={handleAddPoints} 
                />
                <PointsHistory student={selectedStudent} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-white/50 rounded-xl p-8 border border-white/20 shadow-sm animate-fade-in">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    选择一名学生查看详情
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    从左侧头像列表中选择一名学生，或添加新学生来开始记录积分
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
