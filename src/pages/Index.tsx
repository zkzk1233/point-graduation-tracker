
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import StudentList from "@/components/StudentList";
import AddStudentForm from "@/components/AddStudentForm";
import AddPointsForm from "@/components/AddPointsForm";
import PointsHistory from "@/components/PointsHistory";
import { Student, PointEntry } from "@/types/student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Award } from "lucide-react";

// Add uuid dependency
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = "student-points-data";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("list");

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        const studentsWithDates = parsedData.map((student: any) => ({
          ...student,
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

    const newStudent: Student = {
      id: uuidv4(),
      name,
      studentId,
      totalPoints: 0,
      pointsHistory: []
    };

    setStudents(prev => [...prev, newStudent]);
    setSelectedStudentId(newStudent.id);
    setActiveTab("list");
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
  };

  // Handle selecting a student
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  // Responsive layout adjustments
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

  // If we're on mobile and a student is selected, show their details
  useEffect(() => {
    if (isMobileView && selectedStudentId) {
      setActiveTab("detail");
    }
  }, [selectedStudentId, isMobileView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Mobile View Tabs */}
        <div className="md:hidden mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="list">学生列表</TabsTrigger>
              <TabsTrigger value="detail" disabled={!selectedStudentId}>
                学生详情
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-4 space-y-6 animate-fade-in">
              <AddStudentForm onAddStudent={handleAddStudent} />
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
          <div className="col-span-12 lg:col-span-4 space-y-6 animate-fade-in">
            <AddStudentForm onAddStudent={handleAddStudent} />
            <StudentList 
              students={students} 
              onSelectStudent={handleSelectStudent} 
              selectedStudentId={selectedStudentId} 
            />
          </div>
          
          <div className="col-span-12 lg:col-span-8 space-y-6">
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
                    从左侧列表中选择一名学生，或添加新学生来开始记录积分
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
