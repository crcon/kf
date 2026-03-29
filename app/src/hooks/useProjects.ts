import { useState, useEffect, useCallback } from 'react';
import type { Project, Milestone, ProjectTask } from '@/types';
import { developmentStages } from '@/data/developmentStages';

const STORAGE_KEY = 'energy-storage-projects';

// 生成默认里程碑
const generateDefaultMilestones = (projectId: string, startDate: string): Milestone[] => {
  const milestones: Milestone[] = [];
  const baseDate = new Date(startDate);
  
  developmentStages.forEach((stage, index) => {
    const plannedDate = new Date(baseDate);
    plannedDate.setDate(plannedDate.getDate() + (index + 1) * 45); // 每个阶段间隔45天
    
    milestones.push({
      id: `ms-${projectId}-${stage.id}`,
      projectId,
      name: `${stage.name}完成`,
      description: `完成${stage.name}所有工作`,
      plannedDate: plannedDate.toISOString().split('T')[0],
      status: 'pending',
      stageId: stage.id
    });
  });
  
  return milestones;
};

// 生成默认任务
const generateDefaultTasks = (projectId: string, startDate: string): ProjectTask[] => {
  const tasks: ProjectTask[] = [];
  let currentDate = new Date(startDate);
  
  developmentStages.forEach((stage) => {
    stage.tasks.forEach((task) => {
      const plannedStart = new Date(currentDate);
      const plannedEnd = new Date(currentDate);
      plannedEnd.setDate(plannedEnd.getDate() + task.estimatedDays);
      
      tasks.push({
        id: `task-${projectId}-${task.id}`,
        projectId,
        name: task.name,
        description: task.description,
        stageId: stage.id,
        responsibleParty: task.responsibleParty,
        plannedStart: plannedStart.toISOString().split('T')[0],
        plannedEnd: plannedEnd.toISOString().split('T')[0],
        status: 'pending',
        progress: 0,
        dependencies: task.dependencies.map(d => `task-${projectId}-${d}`)
      });
      
      currentDate = plannedEnd;
    });
  });
  
  return tasks;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从localStorage加载项目
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
      } catch (e) {
        console.error('Failed to parse projects:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 保存到localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  // 创建新项目
  const createProject = useCallback((projectData: Omit<Project, 'id' | 'milestones' | 'tasks' | 'progress' | 'currentStage' | 'status'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      status: 'planning',
      progress: 0,
      currentStage: 'stage-1',
      milestones: generateDefaultMilestones(`proj-${Date.now()}`, projectData.startDate),
      tasks: generateDefaultTasks(`proj-${Date.now()}`, projectData.startDate)
    };
    
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  // 更新项目
  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    ));
  }, []);

  // 删除项目
  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);

  // 更新任务状态
  const updateTask = useCallback((projectId: string, taskId: string, updates: Partial<ProjectTask>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const updatedTasks = p.tasks.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      );
      
      // 重新计算项目进度
      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      const progress = Math.round((completedTasks / updatedTasks.length) * 100);
      
      // 确定当前阶段
      const currentStageIndex = developmentStages.findIndex(stage => 
        updatedTasks.some(t => t.stageId === stage.id && t.status !== 'completed')
      );
      const currentStage = currentStageIndex >= 0 
        ? developmentStages[currentStageIndex].id 
        : developmentStages[developmentStages.length - 1].id;
      
      // 确定项目状态
      let status: Project['status'] = p.status;
      if (progress === 100) {
        status = 'completed';
      } else if (progress > 0) {
        status = 'in_progress';
      }
      
      return { ...p, tasks: updatedTasks, progress, currentStage, status };
    }));
  }, []);

  // 更新里程碑
  const updateMilestone = useCallback((projectId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const updatedMilestones = p.milestones.map(m => 
        m.id === milestoneId ? { ...m, ...updates } : m
      );
      
      return { ...p, milestones: updatedMilestones };
    }));
  }, []);

  // 添加里程碑
  const addMilestone = useCallback((projectId: string, milestone: Omit<Milestone, 'id' | 'projectId'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const newMilestone: Milestone = {
        ...milestone,
        id: `ms-${projectId}-${Date.now()}`,
        projectId
      };
      
      return { ...p, milestones: [...p.milestones, newMilestone] };
    }));
  }, []);

  // 添加任务
  const addTask = useCallback((projectId: string, task: Omit<ProjectTask, 'id' | 'projectId'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const newTask: ProjectTask = {
        ...task,
        id: `task-${projectId}-${Date.now()}`,
        projectId
      };
      
      return { ...p, tasks: [...p.tasks, newTask] };
    }));
  }, []);

  // 删除任务
  const deleteTask = useCallback((projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.filter(t => t.id !== taskId) };
    }));
  }, []);

  // 删除里程碑
  const deleteMilestone = useCallback((projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, milestones: p.milestones.filter(m => m.id !== milestoneId) };
    }));
  }, []);

  // 导出项目数据
  const exportProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    
    return {
      ...project,
      exportDate: new Date().toISOString()
    };
  }, [projects]);

  // 导出所有项目
  const exportAllProjects = useCallback(() => {
    return {
      projects,
      exportDate: new Date().toISOString(),
      totalCount: projects.length
    };
  }, [projects]);

  return {
    projects,
    isLoaded,
    createProject,
    updateProject,
    deleteProject,
    updateTask,
    updateMilestone,
    addMilestone,
    addTask,
    deleteTask,
    deleteMilestone,
    exportProject,
    exportAllProjects
  };
}
