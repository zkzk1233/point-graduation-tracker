
export interface PointEntry {
  id: string;
  amount: number;
  description: string;
  timestamp: Date;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  avatar?: string;
  totalPoints: number;
  pointsHistory: PointEntry[];
}

export type Rank = {
  name: string;
  minPoints: number;
  color: string;
  textColor: string;
};
