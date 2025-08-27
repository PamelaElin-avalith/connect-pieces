export type DeveloperType = 
  | 'Frontend'
  | 'Backend'
  | 'Fullstack'
  | 'Mobile'
  | 'DevOps'
  | 'Data Science'
  | 'Machine Learning'
  | 'Game Development'
  | 'Embedded Systems'
  | 'UI/UX Designer'
  | 'Other';

export const DEVELOPER_TYPES: DeveloperType[] = [
  'Frontend',
  'Backend',
  'Fullstack',
  'Mobile',
  'DevOps',
  'Data Science',
  'Machine Learning',
  'Game Development',
  'Embedded Systems',
  'UI/UX Designer',
  'Other'
];

export const DEVELOPER_TYPE_LABELS: Record<DeveloperType, string> = {
  'Frontend': 'Frontend',
  'Backend': 'Backend',
  'Fullstack': 'Fullstack',
  'Mobile': 'Mobile',
  'DevOps': 'DevOps',
  'Data Science': 'Data Science',
  'Machine Learning': 'Machine Learning',
  'Game Development': 'Game Development',
  'Embedded Systems': 'Embedded Systems',
  'UI/UX Designer': 'Diseñador UI/UX',
  'Other': 'Otro'
};

export interface DeveloperProfile {
  id: string;
  name: string;
  email: string;
  skills: string[];
  developer_type?: DeveloperType;
  experience?: number;
  location?: string;
  about?: string;
  github?: string;
  linkedin?: string;
  web_url?: string;
  cv_url?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
