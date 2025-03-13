
export interface RecitationEntry {
  id: string;
  textId: string;
  status: 'completed' | 'incomplete';
  timestamp: Date;
  notes: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
  recitations: RecitationEntry[];
}

export interface RecitationCategory {
  id: string;
  name: string;
}

export type RecitationText = string;

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

// Default categories
export const DEFAULT_CATEGORIES: RecitationCategory[] = [
  { id: "ancient-poetry", name: "古诗" },
  { id: "modern-poetry", name: "现代诗" },
  { id: "prose", name: "散文" },
  { id: "article", name: "文章" }
];
