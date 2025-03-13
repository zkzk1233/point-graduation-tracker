
import React from "react";

// Define the Rank type directly since it's no longer in student.ts
interface Rank {
  name: string;
  color: string;
  textColor: string;
}

interface RankBadgeProps {
  rank: Rank;
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, className = "" }) => {
  return (
    <span 
      className={`rank-badge px-2.5 py-0.5 ${rank.color} ${rank.textColor} ${className}`}
    >
      {rank.name}
    </span>
  );
};

export default RankBadge;
