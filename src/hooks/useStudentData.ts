
import { useState, useEffect } from "react";
import { Student, PointEntry, DEFAULT_POINT_CATEGORIES, DEFAULT_RECITATION_TEXTS } from "@/types/student";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "student-points-data";
const CATEGORIES_STORAGE_KEY = "student-points-categories";
const RECITATION_TEXTS_STORAGE_KEY = "student-points-recitation-texts";

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [pointCategories, setPointCategories] = useState<string[]>([]);
  const [recitationTexts, setRecitationTexts] = useState<string[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    // Load students
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

    // Load categories
    const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (savedCategories) {
      try {
        setPointCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error("Failed to parse categories:", error);
        setPointCategories([...DEFAULT_POINT_CATEGORIES]);
      }
    } else {
      setPointCategories([...DEFAULT_POINT_CATEGORIES]);
    }

    // Load recitation texts
    const savedTexts = localStorage.getItem(RECITATION_TEXTS_STORAGE_KEY);
    if (savedTexts) {
      try {
        setRecitationTexts(JSON.parse(savedTexts));
      } catch (error) {
        console.error("Failed to parse recitation texts:", error);
        setRecitationTexts([...DEFAULT_RECITATION_TEXTS]);
      }
    } else {
      setRecitationTexts([...DEFAULT_RECITATION_TEXTS]);
    }
  }, []);

  // Save data to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(pointCategories));
  }, [pointCategories]);

  // Save recitation texts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(RECITATION_TEXTS_STORAGE_KEY, JSON.stringify(recitationTexts));
  }, [recitationTexts]);

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

  // Handle adding a new category
  const handleAddCategory = (category: string) => {
    if (category.trim() === "") {
      toast.error("类别名称不能为空");
      return;
    }
    
    if (pointCategories.includes(category)) {
      toast.error("类别已存在", {
        description: "请添加一个不同的类别"
      });
      return;
    }
    
    setPointCategories(prev => [...prev, category]);
    toast.success("添加成功", {
      description: `已添加类别: ${category}`
    });
    return category;
  };

  // Handle deleting a category
  const handleDeleteCategory = (category: string) => {
    // Don't allow deleting if it's used in any student's point history
    const isUsed = students.some(student => 
      student.pointsHistory.some(entry => entry.category === category)
    );
    
    if (isUsed) {
      toast.error("无法删除", {
        description: "此类别已被使用，不能删除"
      });
      return;
    }
    
    setPointCategories(prev => prev.filter(c => c !== category));
    toast.success("已删除类别", {
      description: `类别 ${category} 已删除`
    });
  };

  // Handle adding a new recitation text
  const handleAddRecitationText = (text: string) => {
    if (text.trim() === "") {
      toast.error("篇目名称不能为空");
      return;
    }
    
    // Format with 《》 if not already included
    let formattedText = text.trim();
    if (!formattedText.startsWith("《")) {
      formattedText = `《${formattedText}`;
    }
    if (!formattedText.endsWith("》")) {
      formattedText = `${formattedText}》`;
    }
    
    if (recitationTexts.includes(formattedText)) {
      toast.error("篇目已存在", {
        description: "请添加一个不同的篇目"
      });
      return;
    }
    
    setRecitationTexts(prev => [...prev, formattedText]);
    toast.success("添加成功", {
      description: `已添加篇目: ${formattedText}`
    });
    return formattedText;
  };

  // Handle deleting a recitation text
  const handleDeleteRecitationText = (text: string) => {
    // Don't allow deleting if the text appears in any description
    const isUsed = students.some(student => 
      student.pointsHistory.some(entry => 
        entry.description.includes(text)
      )
    );
    
    if (isUsed) {
      toast.error("无法删除", {
        description: "此篇目已被使用，不能删除"
      });
      return;
    }
    
    setRecitationTexts(prev => prev.filter(t => t !== text));
    toast.success("已删除篇目", {
      description: `篇目 ${text} 已删除`
    });
  };

  return {
    students,
    selectedStudent,
    selectedStudentId,
    pointCategories,
    recitationTexts,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateAvatar,
    handleAddPoints,
    handleSelectStudent,
    handleAddCategory,
    handleDeleteCategory,
    handleAddRecitationText,
    handleDeleteRecitationText
  };
}
