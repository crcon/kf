import { useState } from 'react';
import { 
  Download, 
  FileText, 
  X, 
  Check, 
  Calendar,
  CheckCircle2,
  BarChart3,
  FileBarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';
import type { Project } from '@/types';
import { developmentStages } from '@/data/developmentStages';

interface ReportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

type ReportType = 'weekly' | 'monthly' | 'stage' | 'summary';

export function ReportExportDialog({ isOpen, onClose, project }: ReportExportDialogProps) {
  const [reportType, setReportType] = useState<ReportType>('weekly');
  const [reportTitle, setReportTitle] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [includeOptions, setIncludeOptions] = useState({
    progress: true,
    milestones: true,
    tasks: true,
    risks: true,
    nextPlan: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const getReportTypeName = (type: ReportType) => {
    const names: Record<ReportType, string> = {
      weekly: '周报',
      monthly: '月报',
      stage: '阶段汇报',
      summary: '项目总览'
    };
    return names[type];
  };

  const generateWeeklyReport = () => {
    const workbook = XLSX.utils.book_new();
    
    // 封面
    const coverData = [
      [''],
      [''],
      [''],
      ['项目进度周报'],
      [''],
      [`项目名称：${project.name}`],
      [`汇报周期：${reportPeriod || '本周'}`],
      [`汇报日期：${new Date().toLocaleDateString('zh-CN')}`],
      [''],
      [''],
      ['储能电站开发管理平台'],
      ['']
    ];
    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
    XLSX.utils.book_append_sheet(workbook, coverSheet, '封面');

    // 项目概况
    const overviewData = [
      ['一、项目概况'],
      [''],
      ['项目名称', project.name],
      ['项目地点', project.location],
      ['装机容量', `${project.capacity} MWh`],
      ['接入变电站', project.substation],
      ['计划开工', project.startDate],
      ['目标投产', project.targetDate],
      ['当前进度', `${project.progress}%`],
      ['项目状态', project.status === 'planning' ? '规划中' : project.status === 'in_progress' ? '进行中' : project.status === 'completed' ? '已完成' : '延期'],
      ['当前阶段', developmentStages.find(s => s.id === project.currentStage)?.name || '未知'],
      ['']
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, '项目概况');

    // 本周进展
    if (includeOptions.progress) {
      const completedTasks = project.tasks.filter(t => t.status === 'completed');
      const inProgressTasks = project.tasks.filter(t => t.status === 'in_progress');
      
      const progressData = [
        ['二、本周进展'],
        [''],
        ['1. 总体进度'],
        [`本周完成进度：${project.progress}%`],
        [`已完成任务数：${completedTasks.length} 个`],
        [`进行中任务数：${inProgressTasks.length} 个`],
        [''],
        ['2. 各阶段进度'],
        ['阶段名称', '任务总数', '已完成', '完成率'],
        ...developmentStages.map(stage => {
          const stageTasks = project.tasks.filter(t => t.stageId === stage.id);
          const completed = stageTasks.filter(t => t.status === 'completed').length;
          const rate = stageTasks.length > 0 ? Math.round((completed / stageTasks.length) * 100) : 0;
          return [stage.name, stageTasks.length, completed, `${rate}%`];
        }),
        ['']
      ];
      const progressSheet = XLSX.utils.aoa_to_sheet(progressData);
      XLSX.utils.book_append_sheet(workbook, progressSheet, '本周进展');
    }

    // 里程碑完成情况
    if (includeOptions.milestones) {
      const milestonesData = [
        ['三、里程碑完成情况'],
        [''],
        ['序号', '里程碑名称', '计划日期', '实际日期', '状态', '备注'],
        ...project.milestones.map((m, idx) => [
          idx + 1,
          m.name,
          m.plannedDate,
          m.actualDate || '-',
          m.status === 'completed' ? '已完成' : m.status === 'delayed' ? '延期' : '待完成',
          ''
        ]),
        ['']
      ];
      const milestonesSheet = XLSX.utils.aoa_to_sheet(milestonesData);
      XLSX.utils.book_append_sheet(workbook, milestonesSheet, '里程碑');
    }

    // 任务完成情况
    if (includeOptions.tasks) {
      const tasksData = [
        ['四、任务完成情况'],
        [''],
        ['序号', '任务名称', '所属阶段', '责任方', '计划时间', '实际时间', '状态', '进度'],
        ...project.tasks.map((t, idx) => [
          idx + 1,
          t.name,
          developmentStages.find(s => s.id === t.stageId)?.name || '未知',
          t.responsibleParty,
          `${t.plannedStart} ~ ${t.plannedEnd}`,
          t.actualEnd ? `${t.plannedStart} ~ ${t.actualEnd}` : '-',
          t.status === 'completed' ? '已完成' : t.status === 'in_progress' ? '进行中' : t.status === 'delayed' ? '延期' : '待开始',
          `${t.progress}%`
        ]),
        ['']
      ];
      const tasksSheet = XLSX.utils.aoa_to_sheet(tasksData);
      XLSX.utils.book_append_sheet(workbook, tasksSheet, '任务列表');
    }

    // 风险与问题
    if (includeOptions.risks) {
      const risksData = [
        ['五、风险与问题'],
        [''],
        ['序号', '风险/问题描述', '影响程度', '应对措施', '责任人', '状态'],
        ['1', '', '高/中/低', '', '', '待处理/处理中/已解决'],
        ['2', '', '高/中/低', '', '', '待处理/处理中/已解决'],
        ['3', '', '高/中/低', '', '', '待处理/处理中/已解决'],
        [''],
        ['备注：请根据实际情况填写风险与问题'],
        ['']
      ];
      const risksSheet = XLSX.utils.aoa_to_sheet(risksData);
      XLSX.utils.book_append_sheet(workbook, risksSheet, '风险与问题');
    }

    // 下周计划
    if (includeOptions.nextPlan) {
      const nextPlanData = [
        ['六、下周计划'],
        [''],
        ['序号', '计划事项', '责任方', '计划完成时间', '备注'],
        ['1', '', '', '', ''],
        ['2', '', '', '', ''],
        ['3', '', '', '', ''],
        [''],
        ['备注：请根据实际情况填写下周工作计划'],
        ['']
      ];
      const nextPlanSheet = XLSX.utils.aoa_to_sheet(nextPlanData);
      XLSX.utils.book_append_sheet(workbook, nextPlanSheet, '下周计划');
    }

    return workbook;
  };

  const generateMonthlyReport = () => {
    const workbook = XLSX.utils.book_new();
    
    // 封面
    const coverData = [
      [''],
      [''],
      [''],
      ['项目进度月报'],
      [''],
      [`项目名称：${project.name}`],
      [`汇报月份：${reportPeriod || '本月'}`],
      [`汇报日期：${new Date().toLocaleDateString('zh-CN')}`],
      [''],
      [''],
      ['储能电站开发管理平台'],
      ['']
    ];
    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
    XLSX.utils.book_append_sheet(workbook, coverSheet, '封面');

    // 月度总结
    const completedTasks = project.tasks.filter(t => t.status === 'completed');
    const completedMilestones = project.milestones.filter(m => m.status === 'completed');
    
    const summaryData = [
      ['一、月度工作总结'],
      [''],
      ['1. 总体完成情况'],
      [`项目总进度：${project.progress}%`],
      [`本月完成任务：${completedTasks.length} 个`],
      [`本月完成里程碑：${completedMilestones.length} 个`],
      [''],
      ['2. 关键成果'],
      ['-'],
      ['-'],
      ['-'],
      [''],
      ['3. 存在问题'],
      ['-'],
      ['-'],
      ['']
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '月度总结');

    // 进度分析
    const progressData = [
      ['二、进度分析'],
      [''],
      ['阶段名称', '计划进度', '实际进度', '偏差', '状态'],
      ...developmentStages.map(stage => {
        const stageTasks = project.tasks.filter(t => t.stageId === stage.id);
        const completed = stageTasks.filter(t => t.status === 'completed').length;
        const actual = stageTasks.length > 0 ? Math.round((completed / stageTasks.length) * 100) : 0;
        const planned = 100;
        const diff = actual - planned;
        return [
          stage.name,
          `${planned}%`,
          `${actual}%`,
          `${diff}%`,
          diff >= 0 ? '正常' : '滞后'
        ];
      }),
      ['']
    ];
    const progressSheet = XLSX.utils.aoa_to_sheet(progressData);
    XLSX.utils.book_append_sheet(workbook, progressSheet, '进度分析');

    // 里程碑完成情况
    const milestonesData = [
      ['三、里程碑完成情况'],
      [''],
      ['序号', '里程碑名称', '计划日期', '实际日期', '偏差天数', '状态'],
      ...project.milestones.map((m, idx) => {
        const planned = new Date(m.plannedDate);
        const actual = m.actualDate ? new Date(m.actualDate) : null;
        const diff = actual ? Math.round((actual.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        return [
          idx + 1,
          m.name,
          m.plannedDate,
          m.actualDate || '-',
          actual ? (diff > 0 ? `+${diff}` : diff) : '-',
          m.status === 'completed' ? '已完成' : m.status === 'delayed' ? '延期' : '待完成'
        ];
      }),
      ['']
    ];
    const milestonesSheet = XLSX.utils.aoa_to_sheet(milestonesData);
    XLSX.utils.book_append_sheet(workbook, milestonesSheet, '里程碑');

    // 下月计划
    const nextMonthData = [
      ['四、下月工作计划'],
      [''],
      ['序号', '计划事项', '责任方', '计划完成时间', '预期成果'],
      ['1', '', '', '', ''],
      ['2', '', '', '', ''],
      ['3', '', '', '', ''],
      ['']
    ];
    const nextMonthSheet = XLSX.utils.aoa_to_sheet(nextMonthData);
    XLSX.utils.book_append_sheet(workbook, nextMonthSheet, '下月计划');

    return workbook;
  };

  const generateStageReport = () => {
    const workbook = XLSX.utils.book_new();
    const currentStage = developmentStages.find(s => s.id === project.currentStage);
    
    // 封面
    const coverData = [
      [''],
      [''],
      [''],
      ['阶段工作汇报'],
      [''],
      [`项目名称：${project.name}`],
      [`汇报阶段：${currentStage?.name || '当前阶段'}`],
      [`汇报日期：${new Date().toLocaleDateString('zh-CN')}`],
      [''],
      [''],
      ['储能电站开发管理平台'],
      ['']
    ];
    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
    XLSX.utils.book_append_sheet(workbook, coverSheet, '封面');

    // 阶段概述
    const stageTasks = project.tasks.filter(t => t.stageId === project.currentStage);
    const completedStageTasks = stageTasks.filter(t => t.status === 'completed');
    
    const overviewData = [
      ['一、阶段概述'],
      [''],
      ['阶段名称', currentStage?.name || '未知'],
      ['阶段描述', currentStage?.description || ''],
      ['任务总数', stageTasks.length],
      ['已完成任务', completedStageTasks.length],
      ['完成率', `${stageTasks.length > 0 ? Math.round((completedStageTasks.length / stageTasks.length) * 100) : 0}%`],
      ['']
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, '阶段概述');

    // 工作完成情况
    const workData = [
      ['二、工作完成情况'],
      [''],
      ['序号', '工作内容', '责任方', '计划时间', '实际时间', '完成情况', '备注'],
      ...stageTasks.map((t, idx) => [
        idx + 1,
        t.name,
        t.responsibleParty,
        `${t.plannedStart} ~ ${t.plannedEnd}`,
        t.actualEnd || '-',
        t.status === 'completed' ? '已完成' : t.status === 'in_progress' ? '进行中' : '待开始',
        ''
      ]),
      ['']
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(workData);
    XLSX.utils.book_append_sheet(workbook, workSheet, '工作完成情况');

    // 阶段成果
    const outputsData = [
      ['三、阶段成果'],
      [''],
      ['序号', '成果名称', '责任方', '成果形式', '备注'],
      ...(currentStage?.outputs.map((o, idx) => [
        idx + 1,
        o.name,
        o.responsibleParty,
        '文件',
        o.purpose
      ]) || []),
      ['']
    ];
    const outputsSheet = XLSX.utils.aoa_to_sheet(outputsData);
    XLSX.utils.book_append_sheet(workbook, outputsSheet, '阶段成果');

    // 存在问题
    const issuesData = [
      ['四、存在问题及建议'],
      [''],
      ['序号', '问题描述', '影响', '建议措施'],
      ['1', '', '', ''],
      ['2', '', '', ''],
      ['']
    ];
    const issuesSheet = XLSX.utils.aoa_to_sheet(issuesData);
    XLSX.utils.book_append_sheet(workbook, issuesSheet, '存在问题');

    return workbook;
  };

  const generateSummaryReport = () => {
    const workbook = XLSX.utils.book_new();
    
    // 封面
    const coverData = [
      [''],
      [''],
      [''],
      ['项目总览报告'],
      [''],
      [`项目名称：${project.name}`],
      [`生成日期：${new Date().toLocaleDateString('zh-CN')}`],
      [''],
      [''],
      ['储能电站开发管理平台'],
      ['']
    ];
    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
    XLSX.utils.book_append_sheet(workbook, coverSheet, '封面');

    // 项目基本信息
    const basicData = [
      ['一、项目基本信息'],
      [''],
      ['项目名称', project.name],
      ['项目描述', project.description],
      ['项目地点', project.location],
      ['装机容量', `${project.capacity} MWh`],
      ['接入变电站', project.substation],
      ['计划开工日期', project.startDate],
      ['计划投产日期', project.targetDate],
      ['当前进度', `${project.progress}%`],
      ['项目状态', project.status === 'planning' ? '规划中' : project.status === 'in_progress' ? '进行中' : project.status === 'completed' ? '已完成' : '延期'],
      ['当前阶段', developmentStages.find(s => s.id === project.currentStage)?.name || '未知'],
      ['']
    ];
    const basicSheet = XLSX.utils.aoa_to_sheet(basicData);
    XLSX.utils.book_append_sheet(workbook, basicSheet, '基本信息');

    // 进度总览
    const progressData = [
      ['二、进度总览'],
      [''],
      ['阶段', '任务数', '已完成', '进行中', '待开始', '完成率'],
      ...developmentStages.map(stage => {
        const stageTasks = project.tasks.filter(t => t.stageId === stage.id);
        const completed = stageTasks.filter(t => t.status === 'completed').length;
        const inProgress = stageTasks.filter(t => t.status === 'in_progress').length;
        const pending = stageTasks.filter(t => t.status === 'pending').length;
        const rate = stageTasks.length > 0 ? Math.round((completed / stageTasks.length) * 100) : 0;
        return [stage.name, stageTasks.length, completed, inProgress, pending, `${rate}%`];
      }),
      [''],
      ['合计', project.tasks.length, 
        project.tasks.filter(t => t.status === 'completed').length,
        project.tasks.filter(t => t.status === 'in_progress').length,
        project.tasks.filter(t => t.status === 'pending').length,
        `${project.progress}%`
      ],
      ['']
    ];
    const progressSheet = XLSX.utils.aoa_to_sheet(progressData);
    XLSX.utils.book_append_sheet(workbook, progressSheet, '进度总览');

    // 里程碑汇总
    const milestonesData = [
      ['三、里程碑汇总'],
      [''],
      ['序号', '里程碑名称', '所属阶段', '计划日期', '实际日期', '状态'],
      ...project.milestones.map((m, idx) => [
        idx + 1,
        m.name,
        developmentStages.find(s => s.id === m.stageId)?.name || '未知',
        m.plannedDate,
        m.actualDate || '-',
        m.status === 'completed' ? '已完成' : m.status === 'delayed' ? '延期' : '待完成'
      ]),
      [''],
      ['完成率', '', '', '', '', `${Math.round((project.milestones.filter(m => m.status === 'completed').length / project.milestones.length) * 100)}%`],
      ['']
    ];
    const milestonesSheet = XLSX.utils.aoa_to_sheet(milestonesData);
    XLSX.utils.book_append_sheet(workbook, milestonesSheet, '里程碑汇总');

    return workbook;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let workbook;
      switch (reportType) {
        case 'weekly':
          workbook = generateWeeklyReport();
          break;
        case 'monthly':
          workbook = generateMonthlyReport();
          break;
        case 'stage':
          workbook = generateStageReport();
          break;
        case 'summary':
          workbook = generateSummaryReport();
          break;
        default:
          workbook = generateWeeklyReport();
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${project.name}_${getReportTypeName(reportType)}_${timestamp}.xlsx`;
      
      XLSX.writeFile(workbook, filename);

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">导出汇报文件</h2>
                <p className="text-white/80 text-sm">{project.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <Label className="text-base font-medium mb-3 block">汇报类型</Label>
            <Tabs value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="weekly" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">周报</span>
                </TabsTrigger>
                <TabsTrigger value="monthly" className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">月报</span>
                </TabsTrigger>
                <TabsTrigger value="stage" className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">阶段汇报</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">项目总览</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="mt-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-900 mb-2">周报内容</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 项目概况</li>
                      <li>• 本周进展（总体进度、各阶段进度）</li>
                      <li>• 里程碑完成情况</li>
                      <li>• 任务完成情况</li>
                      <li>• 风险与问题</li>
                      <li>• 下周计划</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monthly" className="mt-4">
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-emerald-900 mb-2">月报内容</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• 月度工作总结</li>
                      <li>• 进度分析（计划vs实际）</li>
                      <li>• 里程碑完成情况</li>
                      <li>• 下月工作计划</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stage" className="mt-4">
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-amber-900 mb-2">阶段汇报内容</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• 阶段概述</li>
                      <li>• 工作完成情况</li>
                      <li>• 阶段成果</li>
                      <li>• 存在问题及建议</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-purple-900 mb-2">项目总览内容</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• 项目基本信息</li>
                      <li>• 进度总览（各阶段统计）</li>
                      <li>• 里程碑汇总</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Report Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">汇报标题（可选）</Label>
              <Input
                placeholder={`${project.name} - ${getReportTypeName(reportType)}`}
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2 block">汇报周期（可选）</Label>
              <Input
                placeholder={reportType === 'weekly' ? '第X周 (2026.03.01-03.07)' : reportType === 'monthly' ? '2026年3月' : ''}
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
              />
            </div>
          </div>

          {/* Include Options */}
          {(reportType === 'weekly' || reportType === 'monthly') && (
            <div>
              <Label className="text-base font-medium mb-3 block">导出内容</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="progress" 
                    checked={includeOptions.progress}
                    onCheckedChange={(checked) => 
                      setIncludeOptions(prev => ({ ...prev, progress: checked as boolean }))
                    }
                  />
                  <Label htmlFor="progress" className="cursor-pointer">进度情况</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="milestones" 
                    checked={includeOptions.milestones}
                    onCheckedChange={(checked) => 
                      setIncludeOptions(prev => ({ ...prev, milestones: checked as boolean }))
                    }
                  />
                  <Label htmlFor="milestones" className="cursor-pointer">里程碑</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tasks" 
                    checked={includeOptions.tasks}
                    onCheckedChange={(checked) => 
                      setIncludeOptions(prev => ({ ...prev, tasks: checked as boolean }))
                    }
                  />
                  <Label htmlFor="tasks" className="cursor-pointer">任务列表</Label>
                </div>
                {reportType === 'weekly' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="risks" 
                        checked={includeOptions.risks}
                        onCheckedChange={(checked) => 
                          setIncludeOptions(prev => ({ ...prev, risks: checked as boolean }))
                        }
                      />
                      <Label htmlFor="risks" className="cursor-pointer">风险与问题</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="nextPlan" 
                        checked={includeOptions.nextPlan}
                        onCheckedChange={(checked) => 
                          setIncludeOptions(prev => ({ ...prev, nextPlan: checked as boolean }))
                        }
                      />
                      <Label htmlFor="nextPlan" className="cursor-pointer">下周计划</Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              将导出 <strong>{project.name}</strong> 的
              <strong> {getReportTypeName(reportType)}</strong>，
              格式为 Excel (.xlsx)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || exportSuccess}
            className={exportSuccess ? 'bg-green-600' : ''}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                生成中...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                导出成功
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                导出汇报
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
