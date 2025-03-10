
import { Rank, Student } from "@/types/student";

export const ranks: Rank[] = [
  {
    name: "初学者",
    minPoints: 0,
    color: "bg-slate-200",
    textColor: "text-slate-700"
  },
  {
    name: "铜牌",
    minPoints: 100,
    color: "bg-amber-200",
    textColor: "text-amber-800"
  },
  {
    name: "银牌",
    minPoints: 300,
    color: "bg-slate-300",
    textColor: "text-slate-800"
  },
  {
    name: "金牌",
    minPoints: 600,
    color: "bg-yellow-200",
    textColor: "text-yellow-800"
  },
  {
    name: "白金",
    minPoints: 1000,
    color: "bg-blue-200",
    textColor: "text-blue-800"
  },
  {
    name: "钻石",
    minPoints: 1500,
    color: "bg-sky-200",
    textColor: "text-sky-800"
  },
  {
    name: "大师",
    minPoints: 2000,
    color: "bg-purple-200",
    textColor: "text-purple-800"
  },
  {
    name: "专家",
    minPoints: 3000,
    color: "bg-emerald-200",
    textColor: "text-emerald-800"
  }
];

export const getRank = (points: number): Rank => {
  // Find the highest rank that the student qualifies for
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (points >= ranks[i].minPoints) {
      return ranks[i];
    }
  }
  
  // Default to the lowest rank if no match (should never happen)
  return ranks[0];
};

export const getNextRank = (student: Student): Rank | null => {
  const currentRank = getRank(student.totalPoints);
  const currentRankIndex = ranks.findIndex(r => r.name === currentRank.name);
  
  if (currentRankIndex < ranks.length - 1) {
    return ranks[currentRankIndex + 1];
  }
  
  return null; // Student has reached the highest rank
};

export const getPointsToNextRank = (student: Student): number => {
  const nextRank = getNextRank(student);
  if (!nextRank) return 0;
  
  return nextRank.minPoints - student.totalPoints;
};

export const getProgressToNextRank = (student: Student): number => {
  const currentRank = getRank(student.totalPoints);
  const nextRank = getNextRank(student);
  
  if (!nextRank) return 100; // Already at max rank
  
  const rangeSize = nextRank.minPoints - currentRank.minPoints;
  const progress = student.totalPoints - currentRank.minPoints;
  
  return Math.floor((progress / rangeSize) * 100);
};
