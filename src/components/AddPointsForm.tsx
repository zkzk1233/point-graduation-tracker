
import React, { useState } from "react";
import { Student, POINT_CATEGORIES } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus, BookOpen, Languages, FileText, BookMarked, GraduationCap, PenTool } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AddPointsFormProps {
  student: Student;
  onAddPoints: (studentId: string, amount: number, description: string, category: string) => void;
}

const AddPointsForm: React.FC<AddPointsFormProps> = ({ student, onAddPoints }) => {
  const [pointType, setPointType] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(POINT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value !== "自定义") {
      // If it's a predefined category, set some standard text for that category
      setDescription(`${value}活动`);
    } else {
      setDescription("");
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "背诵": return <BookOpen className="w-4 h-4" />;
      case "翻译": return <Languages className="w-4 h-4" />;
      case "主题归纳": return <FileText className="w-4 h-4" />;
      case "诗词鉴赏": return <BookMarked className="w-4 h-4" />;
      case "名著过关": return <GraduationCap className="w-4 h-4" />;
      case "课堂小测": return <PenTool className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseInt(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "无效的积分数量",
        description: "请输入大于0的积分数量",
        variant: "destructive",
      });
      return;
    }
    
    let finalDescription = description.trim();
    const finalCategory = category === "自定义" ? customCategory.trim() : category;
    
    if (!finalDescription) {
      toast({
        title: "请填写获得积分的原因",
        description: "积分原因不能为空",
        variant: "destructive",
      });
      return;
    }

    if (category === "自定义" && !customCategory.trim()) {
      toast({
        title: "请填写自定义类别",
        description: "自定义类别不能为空",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Calculate the actual amount (positive or negative)
    const actualAmount = pointType === "add" ? numAmount : -numAmount;
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onAddPoints(student.id, actualAmount, finalDescription, finalCategory);
      
      toast({
        title: "积分更新成功",
        description: `${student.name} ${pointType === "add" ? "获得" : "扣除"} ${numAmount} 积分`,
      });
      
      // Reset form
      setAmount("");
      setDescription("");
      if (category === "自定义") {
        setCustomCategory("");
      }
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-4 space-y-4">
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
          <Label htmlFor="category">积分类别</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="选择积分类别" />
            </SelectTrigger>
            <SelectContent>
              {POINT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="flex items-center">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {category === "自定义" && (
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
          <Label htmlFor="amount">积分数量</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            placeholder="请输入积分数量"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white/50"
          />
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
        type="submit" 
        className={pointType === "add" ? "w-full bg-green-600 hover:bg-green-700" : "w-full bg-red-600 hover:bg-red-700"} 
        disabled={isSubmitting}
      >
        {isSubmitting ? "处理中..." : `${pointType === "add" ? "添加" : "扣除"}积分`}
      </Button>
    </form>
  );
};

export default AddPointsForm;
