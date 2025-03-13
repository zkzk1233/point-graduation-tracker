
import { useState, useEffect } from "react";
import { Student, RecitationEntry, DEFAULT_RECITATION_TEXTS, DEFAULT_CATEGORIES, RecitationCategory } from "@/types/student";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "student-recitation-data";
const RECITATION_TEXTS_STORAGE_KEY = "student-recitation-texts";
const RECITATION_CATEGORIES_STORAGE_KEY = "student-recitation-categories";

export interface RecitationTextWithCategory {
  id: string;
  text: string;
  categoryId: string;
}

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [recitationTexts, setRecitationTexts] = useState<RecitationTextWithCategory[]>([]);
  const [categories, setCategories] = useState<RecitationCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
          recitations: student.recitations 
            ? student.recitations.map((entry: any) => ({
                ...entry,
                timestamp: new Date(entry.timestamp)
              }))
            : []
        }));
        setStudents(studentsWithDates);
      } catch (error) {
        console.error("Failed to parse saved data:", error);
      }
    }

    // Load categories
    const savedCategories = localStorage.getItem(RECITATION_CATEGORIES_STORAGE_KEY);
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error("Failed to parse categories:", error);
        setCategories([...DEFAULT_CATEGORIES]);
      }
    } else {
      setCategories([...DEFAULT_CATEGORIES]);
    }

    // Load recitation texts with categories
    const savedTexts = localStorage.getItem(RECITATION_TEXTS_STORAGE_KEY);
    if (savedTexts) {
      try {
        const parsedTexts = JSON.parse(savedTexts);
        // Convert old format (string[]) to new format (RecitationTextWithCategory[])
        if (Array.isArray(parsedTexts) && parsedTexts.length > 0 && typeof parsedTexts[0] === 'string') {
          // Convert old format to new format
          const defaultCategoryId = DEFAULT_CATEGORIES[0].id;
          const convertedTexts = parsedTexts.map((text: string) => ({
            id: uuidv4(),
            text,
            categoryId: defaultCategoryId
          }));
          setRecitationTexts(convertedTexts);
        } else {
          // Already in new format
          setRecitationTexts(parsedTexts);
        }
      } catch (error) {
        console.error("Failed to parse recitation texts:", error);
        // Initialize with default texts
        const defaultTexts = DEFAULT_RECITATION_TEXTS.map(text => ({
          id: uuidv4(),
          text,
          categoryId: DEFAULT_CATEGORIES[0].id
        }));
        setRecitationTexts(defaultTexts);
      }
    } else {
      // Initialize with default texts
      const defaultTexts = DEFAULT_RECITATION_TEXTS.map(text => ({
        id: uuidv4(),
        text,
        categoryId: DEFAULT_CATEGORIES[0].id
      }));
      setRecitationTexts(defaultTexts);
    }
  }, []);

  // Save data to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Save recitation texts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(RECITATION_TEXTS_STORAGE_KEY, JSON.stringify(recitationTexts));
  }, [recitationTexts]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(RECITATION_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  // Find the selected student
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Get filtered texts by category
  const getFilteredTexts = () => {
    if (!selectedCategoryId) return recitationTexts;
    return recitationTexts.filter(t => t.categoryId === selectedCategoryId);
  };

  // Get texts as string array (for backwards compatibility)
  const getTextsAsStringArray = () => {
    return getFilteredTexts().map(t => t.text);
  };

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
      recitations: []
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

  // Handle recording a recitation
  const handleRecordRecitation = (
    studentId: string, 
    textId: string, 
    status: 'completed' | 'incomplete',
    notes: string = ""
  ) => {
    const newRecitationEntry: RecitationEntry = {
      id: uuidv4(),
      textId,
      status,
      notes,
      timestamp: new Date()
    };

    setStudents(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          // Update existing recitation or add new one
          const existingIndex = student.recitations.findIndex(r => r.textId === textId);
          let newRecitations = [...student.recitations];
          
          if (existingIndex >= 0) {
            // Update existing recitation
            newRecitations[existingIndex] = newRecitationEntry;
          } else {
            // Add new recitation
            newRecitations = [newRecitationEntry, ...newRecitations];
          }
          
          return {
            ...student,
            recitations: newRecitations
          };
        }
        return student;
      })
    );
    
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`背诵记录已更新`, {
        description: `${student.name}: ${textId} - ${status === 'completed' ? '已完成' : '未完成'}`
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

  // Handle adding a new recitation text
  const handleAddRecitationText = (text: string, categoryId: string = selectedCategoryId || categories[0].id) => {
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
    
    if (recitationTexts.some(t => t.text === formattedText)) {
      toast.error("篇目已存在", {
        description: "请添加一个不同的篇目"
      });
      return;
    }
    
    const newText = {
      id: uuidv4(),
      text: formattedText,
      categoryId
    };
    
    setRecitationTexts(prev => [...prev, newText]);
    toast.success("添加成功", {
      description: `已添加篇目: ${formattedText}`
    });
    return formattedText;
  };

  // Handle deleting a recitation text
  const handleDeleteRecitationText = (text: string) => {
    // Don't allow deleting if the text appears in any student recitations
    const isUsed = students.some(student => 
      student.recitations.some(entry => entry.textId === text)
    );
    
    if (isUsed) {
      toast.error("无法删除", {
        description: "此篇目已被使用，不能删除"
      });
      return;
    }
    
    setRecitationTexts(prev => prev.filter(t => t.text !== text));
    toast.success("已删除篇目", {
      description: `篇目 ${text} 已删除`
    });
  };

  // Handle adding a new category
  const handleAddCategory = (name: string) => {
    if (!name.trim()) {
      toast.error("类别名称不能为空");
      return;
    }

    if (categories.some(c => c.name === name.trim())) {
      toast.error("类别已存在", {
        description: "请添加一个不同的类别"
      });
      return;
    }

    const newCategory = {
      id: uuidv4(),
      name: name.trim()
    };
    
    setCategories(prev => [...prev, newCategory]);
    setSelectedCategoryId(newCategory.id);
    
    toast.success("添加成功", {
      description: `已添加类别: ${name}`
    });
    
    return newCategory;
  };

  // Handle deleting a category
  const handleDeleteCategory = (categoryId: string) => {
    // Don't allow deleting if any texts use this category
    const isUsed = recitationTexts.some(text => text.categoryId === categoryId);
    if (isUsed) {
      toast.error("无法删除", {
        description: "此类别已被使用，不能删除"
      });
      return;
    }
    
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    
    // If we're deleting the currently selected category, clear the selection
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    }
    
    toast.success("已删除类别");
  };

  // Handle selecting a category
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return {
    students,
    selectedStudent,
    selectedStudentId,
    categories,
    selectedCategoryId,
    recitationTexts: getTextsAsStringArray(),
    allRecitationTexts: recitationTexts,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateAvatar,
    handleSelectStudent,
    handleAddRecitationText,
    handleDeleteRecitationText,
    handleAddCategory,
    handleDeleteCategory,
    handleSelectCategory,
    handleRecordRecitation
  };
}
