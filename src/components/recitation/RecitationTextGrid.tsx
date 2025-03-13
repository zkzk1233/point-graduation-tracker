
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCheck, BookX, Trash2 } from "lucide-react";

interface RecitationTextGridProps {
  recitationTexts: string[];
  selectedText: string | null;
  getTextStatus: (text: string) => 'completed' | 'incomplete' | null;
  onTextSelect: (text: string) => void;
  onDeleteText: (text: string) => void;
}

const RecitationTextGrid: React.FC<RecitationTextGridProps> = ({
  recitationTexts,
  selectedText,
  getTextStatus,
  onTextSelect,
  onDeleteText
}) => {
  return (
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
                  onDeleteText(text);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div 
              className="flex flex-col items-center justify-center flex-1 w-full"
              onClick={() => onTextSelect(text)}
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
  );
};

export default RecitationTextGrid;
