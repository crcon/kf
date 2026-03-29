import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import type { Project } from '@/types';
import { developmentStages } from '@/data/developmentStages';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  selectedProject?: Project | null;
}

export function ExportDialog({ isOpen, onClose, projects, selectedProject }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel');
  const [includeOptions, setIncludeOptions] = useState({
    basicInfo: true,
    milestones: true,
    tasks: true,
    progress: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const projectsToExport = selectedProject ? [selectedProject] : projects;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const workbook = XLSX.utils.book_new();
      
      // Sheet 1: 项目基本信息
      if (includeOptions.basicInfo) {
        const basicData = projectsToExport.map(p => ({
          '项目名称': p.name,
          '项目描述': p.description,
          '装机容量(MWh)': p.capacity,
          '项目地点': p.location,
          '接入变电站': p.substation,
          '计划开工日期': p.startDate,
          '计划投产日期': p.targetDate,
          '当前进度': `${p.progress}%`,
          '项目状态': p.status === 'planning' ? '规划中' : 
                      p.status === 'in_progress' ? '进行中' : 
                      p.status === 'completed' ? '已完成' : '延期',
          '当前阶段': developmentStages.find(s => s.id === p.currentStage)?.name || '未知'
        }));
        
        const basicSheet = XLSX.utils.json_to_sheet(basicData);
        XLSX.utils.book_append_sheet(workbook, basicSheet, '项目基本信息');
      }

      // Sheet 2: 里程碑
      if (includeOptions.milestones) {
        const milestoneData: Record<string, string | number>[] = [];
        projectsToExport.forEach(p => {
          p.milestones.forEach(m => {
            milestoneData.push({
              '项目名称': p.name,
              '里程碑名称': m.name,
              '描述': m.description,
              '计划日期': m.plannedDate,
              '实际日期': m.actualDate || '-',
              '状态': m.status === 'completed' ? '已完成' : 
                      m.status === 'delayed' ? '延期' : '待完成',
              '所属阶段': developmentStages.find(s => s.id === m.stageId)?.name || '未知'
            });
          });
        });
        
        if (milestoneData.length > 0) {
          const milestoneSheet = XLSX.utils.json_to_sheet(milestoneData);
          XLSX.utils.book_append_sheet(workbook, milestoneSheet, '里程碑');
        }
      }

      // Sheet 3: 任务
      if (includeOptions.tasks) {
        const taskData: Record<string, string | number>[] = [];
        projectsToExport.forEach(p => {
          p.tasks.forEach(t => {
            taskData.push({
              '项目名称': p.name,
              '任务名称': t.name,
              '描述': t.description,
              '所属阶段': developmentStages.find(s => s.id === t.stageId)?.name || '未知',
              '责任方': t.responsibleParty,
              '计划开始': t.plannedStart,
              '计划结束': t.plannedEnd,
              '实际开始': t.actualStart || '-',
              '实际结束': t.actualEnd || '-',
              '进度': `${t.progress}%`,
              '状态': t.status === 'completed' ? '已完成' : 
                      t.status === 'in_progress' ? '进行中' : 
                      t.status === 'delayed' ? '延期' : '待开始'
            });
          });
        });
        
        if (taskData.length > 0) {
          const taskSheet = XLSX.utils.json_to_sheet(taskData);
          XLSX.utils.book_append_sheet(workbook, taskSheet, '任务列表');
        }
      }

      // Sheet 4: 进度汇总
      if (includeOptions.progress) {
        const progressData = projectsToExport.map(p => {
          const stageProgress: Record<string, string | number> = {
            '项目名称': p.name,
            '总进度': `${p.progress}%`
          };
          
          developmentStages.forEach(stage => {
            const stageTasks = p.tasks.filter(t => t.stageId === stage.id);
            const completedTasks = stageTasks.filter(t => t.status === 'completed').length;
            const stagePct = stageTasks.length > 0 
              ? Math.round((completedTasks / stageTasks.length) * 100) 
              : 0;
            stageProgress[stage.name] = `${stagePct}%`;
          });
          
          return stageProgress;
        });
        
        const progressSheet = XLSX.utils.json_to_sheet(progressData);
        XLSX.utils.book_append_sheet(workbook, progressSheet, '进度汇总');
      }

      // 生成文件名
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = selectedProject 
        ? `${selectedProject.name}_进度导出_${timestamp}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`
        : `项目进度汇总_${timestamp}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`;

      // 导出文件
      if (exportFormat === 'excel') {
        XLSX.writeFile(workbook, filename);
      } else {
        // CSV格式只导出第一个sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(firstSheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      }

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
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">导出进度</h2>
                <p className="text-white/80 text-sm">
                  {selectedProject ? `导出: ${selectedProject.name}` : `导出全部 ${projects.length} 个项目`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <Label className="text-base font-medium mb-3 block">导出格式</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${
                  exportFormat === 'excel' 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => setExportFormat('excel')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    exportFormat === 'excel' ? 'bg-green-500' : 'bg-slate-200'
                  }`}>
                    <FileSpreadsheet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Excel格式</p>
                    <p className="text-xs text-slate-500">.xlsx 多工作表</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  exportFormat === 'csv' 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => setExportFormat('csv')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    exportFormat === 'csv' ? 'bg-blue-500' : 'bg-slate-200'
                  }`}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">CSV格式</p>
                    <p className="text-xs text-slate-500">.csv 纯文本</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Include Options */}
          <div>
            <Label className="text-base font-medium mb-3 block">导出内容</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="basicInfo" 
                  checked={includeOptions.basicInfo}
                  onCheckedChange={(checked) => 
                    setIncludeOptions(prev => ({ ...prev, basicInfo: checked as boolean }))
                  }
                />
                <Label htmlFor="basicInfo" className="cursor-pointer">
                  项目基本信息
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="milestones" 
                  checked={includeOptions.milestones}
                  onCheckedChange={(checked) => 
                    setIncludeOptions(prev => ({ ...prev, milestones: checked as boolean }))
                  }
                />
                <Label htmlFor="milestones" className="cursor-pointer">
                  里程碑列表
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tasks" 
                  checked={includeOptions.tasks}
                  onCheckedChange={(checked) => 
                    setIncludeOptions(prev => ({ ...prev, tasks: checked as boolean }))
                  }
                />
                <Label htmlFor="tasks" className="cursor-pointer">
                  任务列表
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="progress" 
                  checked={includeOptions.progress}
                  onCheckedChange={(checked) => 
                    setIncludeOptions(prev => ({ ...prev, progress: checked as boolean }))
                  }
                />
                <Label htmlFor="progress" className="cursor-pointer">
                  进度汇总
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              将导出 <strong>{projectsToExport.length}</strong> 个项目的
              <strong>
                {Object.values(includeOptions).filter(v => v).length}
              </strong> 类数据
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
                导出中...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                导出成功
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                导出
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
