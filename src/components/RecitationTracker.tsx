
import React, { useState } from "react";
import { Student, RecitationEntry } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, BookCheck, BookX, ArrowLeft, Check, X, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RecitationTrackerProps {
  student: Student;
  recitationTexts: string[];
  onAddRecitationText: (text: string) => string | undefined;
  onDeleteRecitationText: (text: string) => void;
  onRecordRecitation: (
    studentId: string,
    textId: string,
    status: 'completed' | 'incomplete',
    points: number,
    notes: string
  ) => void;
}

const RecitationTracker: React.FC<RecitationTrackerProps> = ({
  student,
  recitationTexts,
  onAddRecitationText,
  onDeleteRecitationText,
  onRecordRecitation
}) => {
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false);
  const [newRecitationText, setNewRecitationText] = useState("");
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [status, setStatus] = useState<'completed' | 'incomplete'>('completed');
  const [points, setPoints] = useState(1);
  const [notes, setNotes] = useState("");
  const [isDetailMode, setIsDetailMode] = useState(false);

  const handleAddNewText = () => {
    if (newRecitationText.trim()) {
      onAddRecitationText(newRecitationText.trim());
      setNewRecitationText("");
      setIsTextDialogOpen(false);
    } else {
      toast.error("篇目名称不能为空");
    }
  };

  const handleTextSelect = (text: string) => {
    setSelectedText(text);
    
    // Check if student already has a record for this text
    const existingRecord = student.recitations.find(r => r.textId === text);
    if (existingRecord) {
      setStatus(existingRecord.status);
      setPoints(existingRecord.points);
      setNotes(existingRecord.notes);
    } else {
      // Default values for new record
      setStatus('completed');
      setPoints(1);
      setNotes("");
    }
    
    setIsDetailMode(true);
  };

  const handleSubmit = () => {
    if (!selectedText) return;
    
    onRecordRecitation(
      student.id,
      selectedText,
      status,
      status === 'completed' ? points : 0,
      notes
    );
    
    // Return to text selection
    setIsDetailMode(false);
    setSelectedText(null);
  };

  const handleBackButton = () => {
    setIsDetailMode(false);
    setSelectedText(null);
  };

  // Get recitation status for a specific text
  const getTextStatus = (text: string) => {
    return student.recitations.find(r => r.textId === text)?.status || null;
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="font-medium mb-4">
        {isDetailMode ? `${student.name} - ${selectedText}` : `${student.name} - 背诵记录`}
      </h3>

      {!isDetailMode ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">选择篇目</h2>
            <Dialog open={isTextDialogOpen} onOpenChange={setIsTextDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  添加篇目
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新篇目</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="newRecitationText">篇目名称</Label>
                  <Input
                    id="newRecitationText"
                    value={newRecitationText}
                    onChange={(e) => setNewRecitationText(e.target.value)}
                    placeholder="请输入新篇目"
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button onClick={handleAddNewText}>添加</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recitationTexts.map((text) => {
              const status = getTextStatus(text);
              return (
                <Card 
                  key={text}
                  className={`p-4 cursor-pointer hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-2 ${
                    selectedText === text ? "ring-2 ring-primary bg-primary/20" : ""
                  }`}
                >
                  <div className="flex w-full justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecitationText(text);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div 
                    className="flex flex-col items-center justify-center flex-1 w-full"
                    onClick={() => handleTextSelect(text)}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      {status === 'completed' ? (
                        <BookCheck className="w-5 h-5 text-green-600" />
                      ) : status === 'incomplete' ? (
                        <BookX className="w-5 h-5 text-red-600" />
                      ) : (
                        <BookX className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <span className="text-center text-sm font-medium mt-2">{text}</span>
                    {status && (
                      <Badge className={status === 'completed' ? "bg-green-500" : "bg-red-500"}>
                        {status === 'completed' ? '已完成' : '未完成'}
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
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
            <h2 className="text-xl font-bold">背诵状态</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button
                variant={status === 'completed' ? "default" : "outline"}
                className={status === 'completed' ? "bg-green-600" : ""}
                onClick={() => setStatus('completed')}
              >
                <Check className="w-5 h-5 mr-2" />
                已完成
              </Button>
              <Button
                variant={status === 'incomplete' ? "default" : "outline"}
                className={status === 'incomplete' ? "bg-red-600" : ""}
                onClick={() => setStatus('incomplete')}
              >
                <X className="w-5 h-5 mr-2" />
                未完成
              </Button>
            </div>

            {status === 'completed' && (
              <div className="space-y-2">
                <Label htmlFor="points">积分奖励</Label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(value => (
                    <Button
                      key={value}
                      type="button"
                      variant={points === value ? "default" : "outline"}
                      onClick={() => setPoints(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">备注</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="添加备注信息..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSubmit}
              className={`w-full ${status === 'completed' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              保存
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecitationTracker;
