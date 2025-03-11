
import React, { useState } from "react";
import { Student, POINT_CATEGORIES } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  ListChecks 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface AddPointsFormProps {
  student: Student;
  onAddPoints: (studentId: string, amount: number, description: string, category: string) => void;
}

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
  const [pointType, setPointType] = useState<"add" | "subtract">("add");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [selectedRecitationText, setSelectedRecitationText] = useState<string | null>(null);
  const [customRecitationText, setCustomRecitationText] = useState("");
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
    }
    
    if (category !== "自定义") {
      // Set standard description for the selected category
      setDescription(`${category}活动`);
    } else {
      setDescription("");
    }
  };

  const handleRecitationTextSelect = (text: string) => {
    setSelectedRecitationText(text);
    
    if (text !== "其他") {
      setDescription(`背诵${text}`);
      setCustomRecitationText("");
    } else {
      setDescription("背诵");
      setCustomRecitationText("");
    }
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
    
    // For recitation with custom text
    if (selectedCategory === "背诵" && selectedRecitationText === "其他" && customRecitationText.trim()) {
      finalDescription = `背诵《${customRecitationText.trim()}》`;
    } else if (selectedCategory === "背诵" && !selectedRecitationText) {
      toast.error("请选择背诵的具体篇目");
      return;
    }
    
    if (!finalDescription) {
      toast.error("请填写获得积分的原因");
      return;
    }

    if (selectedCategory === "自定义" && !customCategory.trim()) {
      toast.error("请填写自定义类别");
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
      setSelectedAmount(null);
      setDescription("");
      setSelectedCategory(null);
      setSelectedRecitationText(null);
      setCustomRecitationText("");
      if (selectedCategory === "自定义") {
        setCustomCategory("");
      }
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="font-medium mb-4">为 {student.name} {pointType === "add" ? "添加" : "扣除"} 积分</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>积分类型</Label>
          <RadioGroup 
            value={pointType} 
            onValueChange={(value) => setPointType(value as "add" | "subtract")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add" className="flex items-center cursor-pointer">
                <Plus className="w-4 h-4 mr-1 text-green-500" />
                添加积分
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subtract" id="subtract" />
              <Label htmlFor="subtract" className="flex items-center cursor-pointer">
                <Minus className="w-4 h-4 mr-1 text-red-500" />
                扣除积分
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>选择积分类别</Label>
          <div className="grid grid-cols-4 gap-2">
            {[...POINT_CATEGORIES].map((category) => (
              <Card 
                key={category}
                className={`p-3 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-1 ${
                  selectedCategory === category ? "ring-2 ring-primary bg-primary/20" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {getCategoryIcon(category)}
                <span className="text-xs text-center">{category}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Show recitation texts if "背诵" is selected */}
        {selectedCategory === "背诵" && (
          <div className="space-y-2">
            <Label>选择背诵篇目</Label>
            <div className="grid grid-cols-3 gap-2">
              {RECITATION_TEXTS.map((text) => (
                <Card 
                  key={text}
                  className={`p-3 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-1 ${
                    selectedRecitationText === text ? "ring-2 ring-primary bg-primary/20" : ""
                  }`}
                  onClick={() => handleRecitationTextSelect(text)}
                >
                  {text === "其他" ? <ListChecks className="w-5 h-5" /> : <BookText className="w-5 h-5" />}
                  <span className="text-xs text-center">{text}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Show custom text input if "其他" is selected for recitation */}
        {selectedCategory === "背诵" && selectedRecitationText === "其他" && (
          <div className="space-y-2">
            <Label htmlFor="customRecitationText">自定义背诵篇目</Label>
            <Input
              id="customRecitationText"
              placeholder="请输入背诵篇目名称"
              value={customRecitationText}
              onChange={(e) => setCustomRecitationText(e.target.value)}
              className="bg-white/50"
            />
          </div>
        )}

        {selectedCategory === "自定义" && (
          <div className="space-y-2">
            <Label htmlFor="customCategory">自定义类别</Label>
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
          <Label>选择积分数量</Label>
          <div className="flex space-x-2">
            {pointValues.map((value) => (
              <Button
                key={value}
                variant="outline"
                size="lg"
                className={`w-full h-16 text-xl ${
                  selectedAmount === value ? "ring-2 ring-primary bg-primary/20" : ""
                }`}
                onClick={() => setSelectedAmount(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        
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
      </div>
      
      <Button 
        type="button"
        onClick={handleSubmit}
        className={pointType === "add" ? "w-full bg-green-600 hover:bg-green-700" : "w-full bg-red-600 hover:bg-red-700"} 
        disabled={isSubmitting || !selectedCategory || !selectedAmount}
      >
        {isSubmitting ? "处理中..." : `${pointType === "add" ? "添加" : "扣除"}积分`}
      </Button>
    </div>
  );
};

export default AddPointsForm;
