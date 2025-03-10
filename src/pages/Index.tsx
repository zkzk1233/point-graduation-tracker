
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
    
    toast.success("学生添加成功", {
      description: `${name} (${studentId}) 已添加到系统`
    });
  };

  // Handle deleting a student
  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = students.find(s => s.id === studentId);
    if (!studentToDelete) return;

    setStudents(prev => prev.filter(s => s.id !== studentId));
    
    // If we're deleting the currently selected student, clear the selection
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
    }
    
    toast.success("学生已删除", {
      description: `${studentToDelete.name} 已从系统中移除`
    });
  };

  // Handle updating a student's avatar
  const handleUpdateAvatar = (studentId: string, newAvatar: string) => {
    setStudents(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            avatar: newAvatar
          };
        }
        return student;
      })
    );
  };

  // Handle adding points to a student
  const handleAddPoints = (studentId: string, amount: number, description: string, category: string = "") => {
    const newPointEntry: PointEntry = {
      id: uuidv4(),
      amount,
      description,
      category: category || "一般活动", // Use category or default if not provided
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
        description: `${student.name}: ${amount > 0 ? '+' : ''}${amount} 分 (${category || "一般活动"})`
      });
    }
  };

  // Handle selecting a student
  const handleSelectStudent = (studentId: string) => {
    // Toggle selection if clicking the same student
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
      return;
    }
    
    setSelectedStudentId(studentId);
    // Show student details on mobile
    if (window.innerWidth < 768) {
      setActiveTab("detail");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="mb-8">
          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
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
                onDeleteStudent={handleDeleteStudent}
                onUpdateAvatar={handleUpdateAvatar}
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

        {/* Desktop View - Only show the avatar grid */}
        <div className="hidden md:block space-y-6 animate-fade-in">
          <StudentList 
            students={students} 
            onSelectStudent={handleSelectStudent} 
            selectedStudentId={selectedStudentId}
            onDeleteStudent={handleDeleteStudent}
            onUpdateAvatar={handleUpdateAvatar}
          />
          
          {/* If a student is selected, show details */}
          {selectedStudent && (
            <div className="grid grid-cols-12 gap-8 mt-8">
              <div className="col-span-12 md:col-span-6 space-y-6 animate-fade-in">
                <AddPointsForm 
                  student={selectedStudent} 
                  onAddPoints={handleAddPoints} 
                />
              </div>
              <div className="col-span-12 md:col-span-6 space-y-6 animate-fade-in">
                <PointsHistory student={selectedStudent} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
