import { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  CheckCircle2,
  Users,
  Lightbulb,
  MapPin,
  Zap,
  Landmark,
  ClipboardCheck,
  Settings,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { developmentStages, responsibleParties, keyPoints } from '@/data/developmentStages';
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

// Party colors for responsibility parties (used in responsibility view)

export function Handbook() {
  const [expandedStage, setExpandedStage] = useState<string | null>('stage-1');

  const toggleStage = (stageId: string) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">开发手册</h1>
        <p className="text-slate-500 mt-1">电网侧独立储能电站开发全流程指南</p>
      </div>

      <Tabs defaultValue="stages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="stages">开发阶段</TabsTrigger>
          <TabsTrigger value="documents">文件清单</TabsTrigger>
          <TabsTrigger value="parties">责任边界</TabsTrigger>
          <TabsTrigger value="keypoints">关键要点</TabsTrigger>
        </TabsList>

        {/* Development Stages */}
        <TabsContent value="stages" className="space-y-4">
          {developmentStages.map((stage, index) => {
            const Icon = stageIcons[stage.id] || BookOpen;
            const isExpanded = expandedStage === stage.id;
            
            return (
              <Card key={stage.id} className="overflow-hidden">
                <div 
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleStage(stage.id)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500">阶段 {index + 1}</span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.tasks.length} 个任务
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900">{stage.name}</h3>
                    <p className="text-sm text-slate-500">{stage.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {isExpanded && (
                  <CardContent className="border-t bg-slate-50/50">
                    <div className="space-y-6">
                      {/* Tasks */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          主要工作内容
                        </h4>
                        <div className="space-y-2">
                          {stage.tasks.map((task, taskIndex) => (
                            <div 
                              key={task.id} 
                              className="p-3 bg-white rounded-lg border border-slate-200"
                            >
                              <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {taskIndex + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-900">{task.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {task.responsibleParty}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    预计工期: {task.estimatedDays} 天
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outputs */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          阶段输出成果
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {stage.outputs.map((output) => (
                            <div 
                              key={output.id} 
                              className="p-3 bg-white rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="font-medium text-slate-900">{output.name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {output.responsibleParty}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{output.purpose}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          {developmentStages.map((stage) => (
            <Card key={stage.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {stage.name} - 所需文件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stage.documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className={cn(
                        "p-3 rounded-lg border",
                        doc.required 
                          ? "bg-blue-50 border-blue-200" 
                          : "bg-slate-50 border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className={cn(
                          "w-4 h-4",
                          doc.required ? "text-blue-600" : "text-slate-400"
                        )} />
                        <span className={cn(
                          "font-medium text-sm",
                          doc.required ? "text-blue-900" : "text-slate-700"
                        )}>
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.responsibleParty}
                        </Badge>
                        {doc.required && (
                          <Badge className="text-xs bg-blue-600">必需</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{doc.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Responsible Parties */}
        <TabsContent value="parties" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {responsibleParties.map((party) => (
              <Card key={party.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    {party.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {party.responsibilities.map((resp, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span className="font-medium text-sm text-slate-900">{resp.stage}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1 ml-3.5">{resp.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Key Points */}
        <TabsContent value="keypoints" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                选址阶段要点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyPoints.siteSelection.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                电网接入要点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyPoints.gridConnection.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-600" />
                土地获取要点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyPoints.landAcquisition.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                施工许可要点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyPoints.construction.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                并网验收要点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyPoints.gridAcceptance.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Handbook component - Development manual for energy storage projects
