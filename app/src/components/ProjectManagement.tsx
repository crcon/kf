import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  MapPin, 
  Zap,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Download,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/useProjects';
import { ProjectWizard } from '@/components/ProjectWizard';
import { ExportDialog } from '@/components/ExportDialog';
import { ReportExportDialog } from '@/components/ReportExportDialog';
import { developmentStages } from '@/data/developmentStages';
import type { Project } from '@/types';

export function ProjectManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [exportProject, setExportProject] = useState<Project | null>(null);
  const [reportProject, setReportProject] = useState<Project | null>(null);

  const { 
    projects, 
    createProject, 
    updateProject, 
    deleteProject,
    updateTask,
    updateMilestone,
    addMilestone,
    addTask,
    deleteTask,
    deleteMilestone
  } = useProjects();

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setViewMode('list');
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
  };

  const handleExport = (project?: Project) => {
    setExportProject(project || null);
    setIsExportOpen(true);
  };

  const handleReportExport = (project: Project) => {
    setReportProject(project);
    setIsReportOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('确定要删除这个项目吗？此操作不可恢复。')) {
      deleteProject(projectId);
    }
  };

  if (viewMode === 'detail' && selectedProject) {
    const currentProject = projects.find(p => p.id === selectedProject.id) || selectedProject;
    return (
      <ProjectDetail 
        project={currentProject} 
        onBack={handleBackToList}
        onUpdateProject={updateProject}
        onUpdateTask={updateTask}
        onUpdateMilestone={updateMilestone}
        onAddMilestone={addMilestone}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
        onDeleteMilestone={deleteMilestone}
        onExport={() => handleExport(currentProject)}
        onReportExport={handleReportExport}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">项目管理</h1>
          <p className="text-slate-500 mt-1">管理储能电站开发项目的进度和里程碑</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleExport()}>
            <Download className="w-4 h-4 mr-2" />
            导出全部
          </Button>
          <Button onClick={() => setIsWizardOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新建项目
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">项目总数</p>
                <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">进行中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {projects.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">已完成</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">延期</p>
                <p className="text-2xl font-bold text-red-600">
                  {projects.filter(p => p.status === 'delayed').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="搜索项目名称或地点..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          筛选
        </Button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">暂无项目</h3>
          <p className="text-slate-500 mb-4">点击"新建项目"开始创建您的第一个储能电站项目</p>
          <Button onClick={() => setIsWizardOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新建项目
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.location}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Zap className="w-4 h-4 text-amber-500" />
                        {project.capacity} MWh
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {project.startDate}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">{getStageName(project.currentStage)}</span>
                        <span className="font-medium text-blue-600">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          目标: {project.targetDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleExport(project)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewProject(project)}
                        >
                          查看详情
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProject(project)}>
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(project)}>
                        <Download className="w-4 h-4 mr-2" />
                        导出数据
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReportExport(project)}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        导出汇报
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
        selectedProject={exportProject}
      />

      {/* Report Export Dialog */}
      {reportProject && (
        <ReportExportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          project={reportProject}
        />
      )}
    </div>
  );
}

// Project Detail Component
interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onUpdateTask: (projectId: string, taskId: string, updates: Partial<Project['tasks'][0]>) => void;
  onUpdateMilestone: (projectId: string, milestoneId: string, updates: Partial<Project['milestones'][0]>) => void;
  onAddMilestone: (projectId: string, milestone: Omit<Project['milestones'][0], 'id' | 'projectId'>) => void;
  onAddTask: (projectId: string, task: Omit<Project['tasks'][0], 'id' | 'projectId'>) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
  onDeleteMilestone: (projectId: string, milestoneId: string) => void;
  onExport: () => void;
  onReportExport?: (project: Project) => void;
}

function ProjectDetail({ 
  project, 
  onBack, 
  onUpdateTask, 
  onUpdateMilestone,
  onAddMilestone,
  onDeleteMilestone,
  onExport,
  onReportExport
}: ProjectDetailProps) {
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const getTaskStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: '待开始', className: 'bg-slate-100 text-slate-700' },
      in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
      completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
      delayed: { label: '延期', className: 'bg-red-100 text-red-700' }
    };
    const { label, className } = config[status] || config.pending;
    return <Badge className={className}>{label}</Badge>;
  };

  const getMilestoneStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: '待完成', className: 'bg-slate-100 text-slate-700' },
      completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
      delayed: { label: '延期', className: 'bg-red-100 text-red-700' }
    };
    const { label, className } = config[status] || config.pending;
    return <Badge className={className}>{label}</Badge>;
  };

  const handleAddMilestone = () => {
    if (newMilestoneName && newMilestoneDate) {
      onAddMilestone(project.id, {
        name: newMilestoneName,
        description: '',
        plannedDate: newMilestoneDate,
        status: 'pending',
        stageId: project.currentStage
      });
      setNewMilestoneName('');
      setNewMilestoneDate('');
    }
  };

  const handleToggleMilestone = (milestoneId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    onUpdateMilestone(project.id, milestoneId, {
      status: newStatus,
      actualDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const newProgress = newStatus === 'completed' ? 100 : 0;
    onUpdateTask(project.id, taskId, {
      status: newStatus,
      progress: newProgress,
      actualEnd: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
          返回
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          {onReportExport && (
            <Button 
              variant="default" 
              onClick={() => onReportExport(project)}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              导出汇报
            </Button>
          )}
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">装机容量</p>
            <p className="text-2xl font-bold text-slate-900">{project.capacity} <span className="text-sm font-normal">MWh</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">当前进度</p>
            <p className="text-2xl font-bold text-blue-600">{project.progress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">计划开工</p>
            <p className="text-lg font-semibold text-slate-900">{project.startDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">目标投产</p>
            <p className="text-lg font-semibold text-slate-900">{project.targetDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-slate-900">项目总进度</span>
            <span className="text-blue-600 font-semibold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />
          <div className="flex justify-between mt-4 text-sm text-slate-500">
            {developmentStages.map((stage, index) => (
              <div key={stage.id} className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mb-1 ${
                  project.progress >= (index + 1) * 15 
                    ? 'bg-green-500' 
                    : project.progress >= index * 15 
                      ? 'bg-blue-500' 
                      : 'bg-slate-300'
                }`} />
                <span className="text-xs">{stage.name.slice(0, 4)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="milestones">里程碑</TabsTrigger>
          <TabsTrigger value="tasks">任务管理</TabsTrigger>
          <TabsTrigger value="timeline">时间线</TabsTrigger>
        </TabsList>

        {/* Milestones */}
        <TabsContent value="milestones" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">项目里程碑</h3>
          </div>
          
          {/* Add Milestone */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <Input
              placeholder="里程碑名称"
              value={newMilestoneName}
              onChange={(e) => setNewMilestoneName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={newMilestoneDate}
              onChange={(e) => setNewMilestoneDate(e.target.value)}
              className="w-40"
            />
            <Button onClick={handleAddMilestone} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加
            </Button>
          </div>

          <div className="space-y-3">
            {project.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleMilestone(milestone.id, milestone.status)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          milestone.status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : 'border-2 border-slate-300 hover:border-blue-500'
                        }`}
                      >
                        {milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <p className={`font-medium ${milestone.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-sm text-slate-500">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">计划: {milestone.plannedDate}</p>
                        {milestone.actualDate && (
                          <p className="text-sm text-green-600">实际: {milestone.actualDate}</p>
                        )}
                      </div>
                      {getMilestoneStatusBadge(milestone.status)}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteMilestone(project.id, milestone.id)}
                      >
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tasks */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">任务列表</h3>
          </div>
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : 'border-2 border-slate-300 hover:border-blue-500'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.name}
                        </p>
                        <p className="text-sm text-slate-500">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {developmentStages.find(s => s.id === task.stageId)?.name}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.responsibleParty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p className="text-slate-600">{task.plannedStart} ~ {task.plannedEnd}</p>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                <div className="space-y-6">
                  {developmentStages.map((stage) => {
                    const stageMilestones = project.milestones.filter(m => m.stageId === stage.id);
                    const stageTasks = project.tasks.filter(t => t.stageId === stage.id);
                    const completedTasks = stageTasks.filter(t => t.status === 'completed').length;
                    const isCompleted = completedTasks === stageTasks.length && stageTasks.length > 0;
                    const isCurrent = project.currentStage === stage.id;
                    
                    return (
                      <div key={stage.id} className="relative pl-10">
                        <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500' 
                            : isCurrent 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'bg-white border-slate-300'
                        }`} />
                        <div className="pb-4">
                          <h4 className={`font-semibold ${
                            isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-slate-500'
                          }`}>
                            {stage.name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {completedTasks}/{stageTasks.length} 任务完成
                          </p>
                          {stageMilestones.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {stageMilestones.map(m => (
                                <div key={m.id} className="flex items-center gap-2 text-sm">
                                  {m.status === 'completed' ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-slate-400" />
                                  )}
                                  <span className={m.status === 'completed' ? 'text-green-700' : 'text-slate-600'}>
                                    {m.name}
                                  </span>
                                  <span className="text-slate-400">({m.plannedDate})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
