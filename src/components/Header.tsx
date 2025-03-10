
import React from "react";
import { GraduationCap, Award } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center py-4 mb-8">
      <div className="flex items-center">
        <div className="rounded-full bg-primary/10 p-2 mr-3">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">学生积分系统</h1>
          <p className="text-sm text-muted-foreground">
            追踪和管理学生获得的积分
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <Award className="h-5 w-5 text-primary mr-1.5" />
        <span className="text-sm font-medium">积分等级系统</span>
      </div>
    </header>
  );
};

export default Header;
