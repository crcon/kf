import { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  Users,
  Zap,
  MapPin,
  Landmark,
  ClipboardCheck,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { developmentStages } from '@/data/developmentStages';
import { cn } from '@/lib/utils';

const stageIcons: Record<string, React.ElementType> = {
  'stage-1': BookOpen,
  'stage-2': MapPin,
  'stage-3': Zap,
  'stage-4': Landmark,
  'stage-5': FileText,
  'stage-6': ClipboardCheck,
  'stage-7': Award
};

const stageColors: Record<string, string> = {
  'stage-1': 'from-blue-500 to-blue-600',
  'stage-2': 'from-teal-500 to-teal-600',
  'stage-3': 'from-amber-500 to-amber-600',
  'stage-4': 'from-emerald-500 to-emerald-600',
  'stage-5': 'from-purple-500 to-purple-600',
  'stage-6': 'from-rose-500 to-rose-600',
  'stage-7': 'from-indigo-500 to-indigo-600'
};

export function ProcessFlow() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<string[]>([]);

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">开发流程图</h1>
        <p className="text-slate-500 mt-1">电网侧独立储能电站开发全流程可视化</p>
      </div>

      {/* Flow Overview */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            开发流程总览
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            {developmentStages.map((stage, index) => {
              const Icon = stageIcons[stage.id];
              return (
                <div key={stage.id} className="flex items-center">
                  <div 
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all",
                      "bg-gradient-to-r text-white shadow-md hover:shadow-lg",
                      stageColors[stage.id]
                    )}
                    onClick={() => setSelectedStage(stage.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{stage.name.slice(0, 4)}</span>
                  </div>
                  {index < developmentStages.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-400 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Flow */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">详细流程</h2>
        
        {developmentStages.map((stage, index) => {
          const Icon = stageIcons[stage.id];
          const isExpanded = expandedStages.includes(stage.id);
          const isSelected = selectedStage === stage.id;
          
          return (
            <Card 
              key={stage.id} 
              className={cn(
                "overflow-hidden transition-all",
                isSelected && "ring-2 ring-blue-500"
              )}
            >
              <div 
                className={cn(
                  "p-4 flex items-center gap-4 cursor-pointer",
                  "bg-gradient-to-r",
                  stageColors[stage.id]
                )}
                onClick={() => toggleStage(stage.id)}
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">阶段 {index + 1}</span>
                    <Badge className="bg-white/20 text-white border-0">
                      {stage.tasks.length} 任务
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-white text-lg">{stage.name}</h3>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </div>

              {isExpanded && (
                <CardContent className="p-6 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tasks Flow */}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        任务流程
                      </h4>
                      <div className="space-y-3">
                        {stage.tasks.map((task, taskIndex) => (
                          <div key={task.id} className="relative">
                            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {taskIndex + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-900">{task.name}</p>
                                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      <Users className="w-3 h-3 mr-1" />
                                      {task.responsibleParty}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {task.estimatedDays} 天
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {taskIndex < stage.tasks.length - 1 && (
                              <div className="flex justify-center my-2">
                                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents & Outputs */}
                    <div className="space-y-6">
                      {/* Required Documents */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-600" />
                          所需文件
                        </h4>
                        <div className="space-y-2">
                          {stage.documents.filter(d => d.required).map((doc) => (
                            <div 
                              key={doc.id} 
                              className="p-3 bg-white rounded-lg border border-amber-200 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-amber-500" />
                              <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900">{doc.name}</p>
                                <p className="text-xs text-slate-500">{doc.responsibleParty}</p>
                              </div>
                              <Badge className="bg-amber-100 text-amber-700 text-xs">必需</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stage Outputs */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-600" />
                          阶段成果
                        </h4>
                        <div className="space-y-2">
                          {stage.outputs.map((output) => (
                            <div 
                              key={output.id} 
                              className="p-3 bg-white rounded-lg border border-emerald-200 flex items-center gap-2"
                            >
                              <Award className="w-4 h-4 text-emerald-500" />
                              <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900">{output.name}</p>
                                <p className="text-xs text-slate-500">{output.purpose}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Stage Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            阶段依赖关系
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex items-center justify-between">
                {developmentStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    <div className="text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2",
                        "bg-gradient-to-br text-white",
                        stageColors[stage.id]
                      )}>
                        <span className="text-2xl font-bold">{index + 1}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 w-20">{stage.name}</p>
                    </div>
                    {index < developmentStages.length - 1 && (
                      <div className="flex items-center mx-2">
                        <div className="w-8 h-0.5 bg-slate-300" />
                        <ArrowRight className="w-4 h-4 text-slate-400 -ml-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
