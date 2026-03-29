// 项目类型定义

// 开发阶段
export interface DevelopmentStage {
  id: string;
  name: string;
  description: string;
  order: number;
  tasks: Task[];
  documents: Document[];
  outputs: Output[];
}

// 任务
export interface Task {
  id: string;
  stageId: string;
  name: string;
  description: string;
  responsibleParty: string;
  estimatedDays: number;
  dependencies: string[];
}

// 文档
export interface Document {
  id: string;
  stageId: string;
  name: string;
  responsibleParty: string;
  description: string;
  required: boolean;
}

// 阶段输出
export interface Output {
  id: string;
  stageId: string;
  name: string;
  responsibleParty: string;
  purpose: string;
}

// 责任方
export interface ResponsibleParty {
  id: string;
  name: string;
  type: 'owner' | 'government' | 'grid' | 'design' | 'third';
  responsibilities: Responsibility[];
}

export interface Responsibility {
  stage: string;
  content: string;
}

// 项目
export interface Project {
  id: string;
  name: string;
  description: string;
  capacity: number; // MWh
  location: string;
  substation: string;
  startDate: string;
  targetDate: string;
  status: 'planning' | 'in_progress' | 'completed' | 'delayed';
  progress: number; // 0-100
  currentStage: string;
  milestones: Milestone[];
  tasks: ProjectTask[];
}

// 里程碑
export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  plannedDate: string;
  actualDate?: string;
  status: 'pending' | 'completed' | 'delayed';
  stageId: string;
}

// 项目任务
export interface ProjectTask {
  id: string;
  projectId: string;
  name: string;
  description: string;
  stageId: string;
  responsibleParty: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  dependencies: string[];
}

// 导航项
export interface NavItem {
  id: string;
  name: string;
  icon: string;
  path: string;
}
