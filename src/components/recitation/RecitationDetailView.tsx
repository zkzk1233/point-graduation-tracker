
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, X } from "lucide-react";

interface RecitationDetailViewProps {
  selectedText: string | null;
  status: 'completed' | 'incomplete';
  notes: string;
  onStatusChange: (status: 'completed' | 'incomplete') => void;
  onNotesChange: (notes: string) => void;
  onBack: () => void;
  onSave: () => void;
}

const RecitationDetailView: React.FC<RecitationDetailViewProps> = ({
  selectedText,
  status,
  notes,
  onStatusChange,
  onNotesChange,
  onBack,
  onSave
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
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
            onClick={() => onStatusChange('completed')}
          >
            <Check className="w-5 h-5 mr-2" />
            已完成
          </Button>
          <Button
            variant={status === 'incomplete' ? "default" : "outline"}
            className={status === 'incomplete' ? "bg-red-600" : ""}
            onClick={() => onStatusChange('incomplete')}
          >
            <X className="w-5 h-5 mr-2" />
            未完成
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">备注</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="添加备注信息..."
            rows={3}
          />
        </div>

        <Button 
          onClick={onSave}
          className={`w-full ${status === 'completed' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default RecitationDetailView;
