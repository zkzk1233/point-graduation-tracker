
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
