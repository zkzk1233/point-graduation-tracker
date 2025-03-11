
import React, { useState } from "react";
import { Student, POINT_CATEGORIES } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Minus, 
  BookOpen, 
  Languages, 
  FileText, 
  BookMarked, 
  GraduationCap, 
  PenTool, 
  Pencil,
  BookText,
  BookA,
  ListChecks,
  ArrowLeft,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AddPointsFormProps {
  student: Student;
  onAddPoints: (studentId: string, amount: number, description: string, category: string) => void;
}

// Define step types
type Step = "pointType" | "category" | "recitationText" | "customText" | "pointAmount" | "description" | "confirmation";

const pointValues = [1, 2, 3];

// Define recitation subcategories
const RECITATION_TEXTS = [
  "《回延安》",
  "《桃花源记》",
  "《小石潭记》",
  "《关雎》",
  "《蒹葭》",
  "《式微》",
  "《子衿》",
  "《送杜少府之任蜀州》",
  "《望洞庭湖赠张丞相》",
  "其他" // Option to add more
];

const AddPointsForm: React.FC<AddPointsFormProps> = ({ student, onAddPoints }) => {
  // Current step in the workflow
  const [currentStep, setCurrentStep] = useState<Step>("pointType");
  
  // Form state
  const [pointType, setPointType] = useState<"add" | "subtract">("add");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecitationText, setSelectedRecitationText] = useState<string | null>(null);
  const [customRecitationText, setCustomRecitationText] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "背诵": return <BookOpen className="w-5 h-5" />;
      case "翻译": return <Languages className="w-5 h-5" />;
      case "主题归纳": return <FileText className="w-5 h-5" />;
      case "诗词鉴赏": return <BookMarked className="w-5 h-5" />;
      case "名著过关": return <GraduationCap className="w-5 h-5" />;
      case "课堂小测": return <PenTool className="w-5 h-5" />;
      case "自定义": return <Pencil className="w-5 h-5" />;
      default: return null;
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Reset recitation text selection when changing categories
    if (category !== "背诵") {
      setSelectedRecitationText(null);
      setCustomRecitationText("");
      // Set standard description for the selected category
      setDescription(`${category}活动`);
      setCurrentStep("pointAmount");
    } else {
      setCurrentStep("recitationText");
    }
    
    if (category === "自定义") {
      setDescription("");
      setCurrentStep("description");
    }
  };

  const handleRecitationTextSelect = (text: string) => {
    setSelectedRecitationText(text);
    
    if (text !== "其他") {
      setDescription(`背诵${text}`);
      setCustomRecitationText("");
      setCurrentStep("pointAmount");
    } else {
      setDescription("背诵");
      setCustomRecitationText("");
      setCurrentStep("customText");
    }
  };

  const handlePointTypeSelect = (type: "add" | "subtract") => {
    setPointType(type);
    setCurrentStep("category");
  };

  const handlePointAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    
    // If it's not background recitation or custom category, go to confirmation
    if (
      (selectedCategory !== "背诵" && selectedCategory !== "自定义") || 
      (selectedCategory === "背诵" && selectedRecitationText && selectedRecitationText !== "其他")
    ) {
      setCurrentStep("confirmation");
    } else if (selectedCategory === "自定义") {
      // For custom category, we need the description
      setCurrentStep("description");
    } else {
      // For other cases, go to description
      setCurrentStep("description");
    }
  };

  const handleCustomTextSubmit = () => {
    if (customRecitationText.trim()) {
      setDescription(`背诵《${customRecitationText.trim()}》`);
      setCurrentStep("pointAmount");
    } else {
      toast.error("请输入背诵篇目");
    }
  };

  const handleDescriptionSubmit = () => {
    if (description.trim()) {
      setCurrentStep("confirmation");
    } else {
      toast.error("请填写获得积分的原因");
    }
  };

  const handleBackButton = () => {
    // Logic to go back to the previous step
    if (currentStep === "category") {
      setCurrentStep("pointType");
    } else if (currentStep === "recitationText") {
      setCurrentStep("category");
    } else if (currentStep === "customText") {
      setCurrentStep("recitationText");
    } else if (currentStep === "pointAmount") {
      if (selectedCategory === "背诵") {
        if (selectedRecitationText === "其他") {
          setCurrentStep("customText");
        } else {
          setCurrentStep("recitationText");
        }
      } else {
        setCurrentStep("category");
      }
    } else if (currentStep === "description") {
      if (selectedCategory === "自定义") {
        setCurrentStep("pointAmount");
      } else if (selectedCategory === "背诵" && selectedRecitationText === "其他") {
        setCurrentStep("customText");
      } else {
        setCurrentStep("pointAmount");
      }
    } else if (currentStep === "confirmation") {
      if (selectedCategory === "自定义" || (selectedCategory === "背诵" && selectedRecitationText === "其他")) {
        setCurrentStep("description");
      } else {
        setCurrentStep("pointAmount");
      }
    }
  };

  const handleReset = () => {
    // Reset all states to initial values
    setCurrentStep("pointType");
    setPointType("add");
    setSelectedCategory(null);
    setSelectedRecitationText(null);
    setCustomRecitationText("");
    setCustomCategory("");
    setSelectedAmount(null);
    setDescription("");
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      toast.error("请选择积分类别");
      return;
    }
    
    if (!selectedAmount) {
      toast.error("请选择积分数量");
      return;
    }
    
    let finalDescription = description.trim();
    let finalCategory = selectedCategory === "自定义" ? customCategory.trim() : selectedCategory;
    
    if (selectedCategory === "自定义" && !customCategory.trim()) {
      toast.error("请填写自定义类别");
      return;
    }
    
    if (!finalDescription) {
      toast.error("请填写获得积分的原因");
      return;
    }
    
    setIsSubmitting(true);
    
    // Calculate the actual amount (positive or negative)
    const actualAmount = pointType === "add" ? selectedAmount : -selectedAmount;
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onAddPoints(student.id, actualAmount, finalDescription, finalCategory);
      
      toast.success(`${student.name} ${pointType === "add" ? "获得" : "扣除"} ${selectedAmount} 积分`);
      
      // Reset form
      handleReset();
      setIsSubmitting(false);
    }, 300);
  };

  // Render different views based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "pointType":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">选择积分操作</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`p-6 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-4 ${
                  pointType === "add" ? "ring-2 ring-primary bg-primary/20" : ""
                }`}
                onClick={() => handlePointTypeSelect("add")}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-lg font-medium">添加积分</span>
              </Card>
              
              <Card 
                className={`p-6 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-4 ${
                  pointType === "subtract" ? "ring-2 ring-primary bg-primary/20" : ""
                }`}
                onClick={() => handlePointTypeSelect("subtract")}
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Minus className="w-8 h-8 text-red-600" />
                </div>
                <span className="text-lg font-medium">扣除积分</span>
              </Card>
            </div>
          </div>
        );
        
      case "category":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackButton}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold">选择积分类别</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[...POINT_CATEGORIES].map((category) => (
                <Card 
                  key={category}
                  className={`p-4 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-2 ${
                    selectedCategory === category ? "ring-2 ring-primary bg-primary/20" : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="text-center font-medium">{category}</span>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case "recitationText":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackButton}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold">选择背诵篇目</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {RECITATION_TEXTS.map((text) => (
                <Card 
                  key={text}
                  className={`p-4 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-2 ${
                    selectedRecitationText === text ? "ring-2 ring-primary bg-primary/20" : ""
                  }`}
                  onClick={() => handleRecitationTextSelect(text)}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    {text === "其他" ? <ListChecks className="w-5 h-5" /> : <BookText className="w-5 h-5" />}
                  </div>
                  <span className="text-center text-sm font-medium">{text}</span>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case "customText":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackButton}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold">自定义背诵篇目</h2>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="customRecitationText">请输入背诵篇目名称</Label>
              <Input
                id="customRecitationText"
                placeholder="例如：离骚"
                value={customRecitationText}
                onChange={(e) => setCustomRecitationText(e.target.value)}
                className="bg-white/50"
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCustomTextSubmit}
                  disabled={!customRecitationText.trim()}
                >
                  确认
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "pointAmount":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackButton}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold">选择积分数量</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {pointValues.map((value) => (
                <Card
                  key={value}
                  className={`p-6 cursor-pointer hover:bg-primary/10 transition-colors flex items-center justify-center ${
                    selectedAmount === value ? "ring-2 ring-primary bg-primary/20" : ""
                  }`}
                  onClick={() => handlePointAmountSelect(value)}
                >
                  <span className="text-3xl font-bold">{value}</span>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case "description":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackButton}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold">
                {selectedCategory === "自定义" ? "自定义类别" : "积分原因"}
              </h2>
            </div>
            
            <div className="space-y-4">
              {selectedCategory === "自定义" && (
                <div className="space-y-2">
                  <Label htmlFor="customCategory">类别名称</Label>
                  <Input
                    id="customCategory"
                    placeholder="请输入自定义类别"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="bg-white/50"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">积分原因</Label>
                <Textarea
                  id="description"
                  placeholder={`请输入${pointType === "add" ? "获得" : "扣除"}积分的原因`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/50 resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleDescriptionSubmit}
                  disabled={
                    !description.trim() || 
                    (selectedCategory === "自定义" && !customCategory.trim())
                  }
                >
                  确认
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "confirmation":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackButton}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold">确认积分信息</h2>
            </div>
            
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">学生姓名</span>
                <span className="font-medium">{student.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">操作类型</span>
                <span className={`font-medium ${pointType === "add" ? "text-green-600" : "text-red-600"}`}>
                  {pointType === "add" ? "添加积分" : "扣除积分"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">积分类别</span>
                <span className="font-medium">
                  {selectedCategory === "自定义" ? customCategory : selectedCategory}
                </span>
              </div>
              {selectedCategory === "背诵" && selectedRecitationText && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">背诵篇目</span>
                  <span className="font-medium">
                    {selectedRecitationText === "其他" ? `《${customRecitationText}》` : selectedRecitationText}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">积分数量</span>
                <span className="font-medium">{selectedAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">积分原因</span>
                <span className="font-medium">{description}</span>
              </div>
            </Card>
            
            <Button 
              onClick={handleSubmit}
              className={`w-full ${
                pointType === "add" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "处理中..." : "确认提交"}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="font-medium mb-4">为 {student.name} {pointType === "add" ? "添加" : "扣除"} 积分</h3>
      
      {renderStepContent()}
    </div>
  );
};

export default AddPointsForm;
