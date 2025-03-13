
import React from "react";
import { Button } from "@/components/ui/button";
import { RecitationCategory } from "@/types/student";
import { Tag, ChevronDown, FolderPlus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";

interface CategorySelectorProps {
  categories: RecitationCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategoryClick: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategoryClick
}) => {
  const selectedCategory = selectedCategoryId 
    ? categories.find(c => c.id === selectedCategoryId) 
    : null;
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Tag className="w-4 h-4 mr-1" />
          {selectedCategory ? selectedCategory.name : "所有类别"}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end">
        <DropdownMenuItem 
          onClick={() => onSelectCategory(null)}
          className={selectedCategoryId === null ? "bg-primary/10" : ""}
        >
          所有类别
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {categories.map(category => (
          <DropdownMenuItem 
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={selectedCategoryId === category.id ? "bg-primary/10" : ""}
          >
            {category.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onAddCategoryClick}>
          <FolderPlus className="w-4 h-4 mr-2" />
          添加新类别
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategorySelector;
