
export interface PointEntry {
  id: string;
  amount: number;
  description: string;
  category: string;  // Add category field to track what type of activity earned points
  timestamp: Date;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  avatar: string;  // Required field for student avatar
  totalPoints: number;
  pointsHistory: PointEntry[];
}

export type Rank = {
  name: string;
  minPoints: number;
  color: string;
  textColor: string;
};

// Default point categories
export const DEFAULT_POINT_CATEGORIES = [
  "背诵",      // Recitation
  "翻译",      // Translation
  "主题归纳",   // Theme summarization
  "诗词鉴赏",   // Poetry appreciation
  "名著过关",   // Classic literature passing
  "课堂小测",   // Classroom quiz
  "自定义",     // Custom
] as const;

// Default recitation texts
export const DEFAULT_RECITATION_TEXTS = [
  "《回延安》",
  "《桃花源记》",
  "《小石潭记》",
  "《关雎》",
  "《蒹葭》",
  "《式微》",
  "《子衿》",
  "《送杜少府之任蜀州》",
  "《望洞庭湖赠张丞相》"
] as const;

export type PointCategory = string;
export type RecitationText = string;
