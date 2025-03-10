
import { useState, useEffect } from "react";
import { Student, PointEntry } from "@/types/student";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "student-points-data";

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

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
    
    toast.success("学生添加成功", {
      description: `${name} (${studentId}) 已添加到系统`
    });
    
    return newStudent;
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
  };

  return {
    students,
    selectedStudent,
    selectedStudentId,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateAvatar,
    handleAddPoints,
    handleSelectStudent,
  };
}
