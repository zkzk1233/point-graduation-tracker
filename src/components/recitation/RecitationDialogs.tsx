
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface AddTextDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newText: string;
  onTextChange: (text: string) => void;
  onAddText: () => void;
}

export const AddTextDialog: React.FC<AddTextDialogProps> = ({
  isOpen,
  onOpenChange,
  newText,
  onTextChange,
  onAddText
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            value={newText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="请输入新篇目"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={onAddText}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newCategory: string;
  onCategoryChange: (category: string) => void;
  onAddCategory: () => void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  newCategory,
  onCategoryChange,
  onAddCategory
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加新类别</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="newCategoryName">类别名称</Label>
          <Input
            id="newCategoryName"
            value={newCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="请输入新类别名称"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={onAddCategory}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
