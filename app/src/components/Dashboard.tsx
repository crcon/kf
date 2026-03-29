import { useState, useMemo } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  FolderKanban,
  Plus,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { ProjectWizard } from '@/components/ProjectWizard';
import { ExportDialog } from '@/components/ExportDialog';
import { developmentStages } from '@/data/developmentStages';
import type { Project } from '@/types';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

export function Dashboard({ onTabChange }: DashboardProps) {
  const { projects, createProject } = useProjects();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalCapacity = projects.reduce((sum, p) => sum + p.capacity, 0);
    const avgProgress = totalProjects > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
      : 0;
    
    const allMilestones = projects.flatMap(p => p.milestones);
    const completedMilestones = allMilestones.filter(m => m.status === 'completed').length;
    
    const allTasks = projects.flatMap(p => p.tasks);
    const pendingTasks = allTasks.filter(t => t.status === 'pending').length;
    const delayedTasks = allTasks.filter(t => t.status === 'delayed').length;

    return {
      totalProjects,
      totalCapacity,
      avgProgress,
      completedMilestones,
      pendingTasks,
      delayedTasks
    };
  }, [projects]);

  const upcomingMilestones = useMemo(() => {
    const allMilestones = projects.flatMap(p => 
      p.milestones.map(m => ({ ...m, project: p }))
    );
    return allMilestones
      .filter(m => m.status === 'pending')
      .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime())
      .slice(0, 5);
  }, [projects]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 4);
  }, [projects]);

  const getStatusBadge = (status: Project['status']) => {
    const config = {
      planning: { label: '规划中', className: 'bg-slate-100 text-slate-700' },
      in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
      completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
      delayed: { label: '延期', className: 'bg-red-100 text-red-700' }
    };
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };

  const getStageName = (stageId: string) => {
    const stage = developmentStages.find(s => s.id === stageId);
    return stage?.name || '未知阶段';
  };

  const handleCreateProject = (projectData: {
    name: string;
    description: string;
    capacity: number;
    location: string;
    substation: string;
    startDate: string;
    targetDate: string;
  }) => {
    createProject(projectData);
    setIsWizardOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">项目总览</h1>
          <p className="text-slate-500 mt-1">电网侧独立储能电站开发管理平台</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button onClick={() => setIsWizardOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新建项目
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">项目总数</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600">总装机容量</p>
                <p className="text-3xl font-bold text-teal-900 mt-1">{stats.totalCapacity}</p>
                <p className="text-xs text-teal-600">MWh</p>
              </div>
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">平均进度</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{stats.avgProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <Progress value={stats.avgProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">已完成里程碑</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">{stats.completedMilestones}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              最近项目
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FolderKanban className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">暂无项目，点击"新建项目"开始创建</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => onTabChange('projects')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{project.name}</h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{project.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {project.capacity} MWh
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {project.startDate}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600">{getStageName(project.currentStage)}</span>
                            <span className="font-medium text-blue-600">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Milestones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                即将到期里程碑
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMilestones.length === 0 ? (
                <p className="text-center text-slate-500 py-4">暂无待办里程碑</p>
              ) : (
                <div className="space-y-3">
                  {upcomingMilestones.map((milestone) => {
                    const daysLeft = Math.ceil((new Date(milestone.plannedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={milestone.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${daysLeft < 30 ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">{milestone.name}</p>
                          <p className="text-xs text-slate-500 truncate">{milestone.project?.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-600">{milestone.plannedDate}</span>
                            <Badge variant={daysLeft < 30 ? 'destructive' : 'secondary'} className="text-xs">
                              {daysLeft < 0 ? '已逾期' : `${daysLeft}天后`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Task Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                任务状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-700">已完成任务</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'completed').length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-slate-700">进行中任务</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'in_progress').length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-slate-700">待处理任务</span>
                  </div>
                  <span className="font-semibold text-red-600">{stats.pendingTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Wizard */}
      <ProjectWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projects={projects}
      />
    </div>
  );
}
