import { useState } from 'react';
import { 
  Users, 
  Building2, 
  Zap, 
  PenTool, 
  ClipboardList,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { responsibleParties, developmentStages } from '@/data/developmentStages';
import { cn } from '@/lib/utils';

const partyIcons: Record<string, React.ElementType> = {
  owner: Building2,
  government: Users,
  grid: Zap,
  design: PenTool,
  third: ClipboardList
};

const partyColors: Record<string, string> = {
  owner: 'bg-blue-500',
  government: 'bg-emerald-500',
  grid: 'bg-amber-500',
  design: 'bg-purple-500',
  third: 'bg-slate-500'
};

const partyBgColors: Record<string, string> = {
  owner: 'bg-blue-50 border-blue-200',
  government: 'bg-emerald-50 border-emerald-200',
  grid: 'bg-amber-50 border-amber-200',
  design: 'bg-purple-50 border-purple-200',
  third: 'bg-slate-50 border-slate-200'
};

export function ResponsibilityMatrix() {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">责任边界</h1>
        <p className="text-slate-500 mt-1">明确各方在项目开发中的责任分工</p>
      </div>

      {/* Party Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {responsibleParties.map((party) => {
          const Icon = partyIcons[party.type];
          return (
            <Card 
              key={party.id} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedParty === party.id && "ring-2 ring-blue-500"
              )}
              onClick={() => setSelectedParty(selectedParty === party.id ? null : party.id)}
            >
              <CardContent className="p-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                  partyColors[party.type]
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">{party.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {party.responsibilities.length} 项职责
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="byParty" className="space-y-4">
        <TabsList>
          <TabsTrigger value="byParty">按责任方查看</TabsTrigger>
          <TabsTrigger value="byStage">按阶段查看</TabsTrigger>
          <TabsTrigger value="matrix">责任矩阵</TabsTrigger>
        </TabsList>

        {/* By Party */}
        <TabsContent value="byParty" className="space-y-4">
          {responsibleParties.map((party) => {
            const Icon = partyIcons[party.type];
            const isSelected = selectedParty === null || selectedParty === party.id;
            
            if (!isSelected) return null;
            
            return (
              <Card key={party.id}>
                <CardHeader className={cn("pb-3", partyBgColors[party.type])}>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", partyColors[party.type])}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {party.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {party.responsibilities.map((resp, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "p-3 rounded-lg border flex items-start gap-3",
                          partyBgColors[party.type]
                        )}
                      >
                        <CheckCircle2 className={cn(
                          "w-5 h-5 flex-shrink-0 mt-0.5",
                          party.type === 'owner' && "text-blue-600",
                          party.type === 'government' && "text-emerald-600",
                          party.type === 'grid' && "text-amber-600",
                          party.type === 'design' && "text-purple-600",
                          party.type === 'third' && "text-slate-600"
                        )} />
                        <div>
                          <p className="font-medium text-slate-900">{resp.stage}</p>
                          <p className="text-sm text-slate-600 mt-1">{resp.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* By Stage */}
        <TabsContent value="byStage" className="space-y-4">
          {developmentStages.map((stage) => (
            <Card key={stage.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  {stage.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {responsibleParties.map((party) => {
                    const stageResps = party.responsibilities.filter(r => 
                      r.stage.includes(stage.name) || 
                      stage.name.includes(r.stage) ||
                      r.stage === stage.tasks[0]?.responsibleParty
                    );
                    
                    if (stageResps.length === 0) {
                      // Find responsibilities that might relate to this stage
                      const relatedResp = party.responsibilities.find(r => {
                        const stageKeywords = stage.name.split('');
                        return stageKeywords.some(k => r.stage.includes(k));
                      });
                      if (!relatedResp) return null;
                    }
                    
                    const Icon = partyIcons[party.type];
                    return (
                      <div 
                        key={party.id} 
                        className={cn(
                          "p-3 rounded-lg border",
                          partyBgColors[party.type]
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", partyColors[party.type])}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-sm text-slate-900">{party.name}</span>
                        </div>
                        <ul className="space-y-1">
                          {(stageResps.length > 0 ? stageResps : party.responsibilities.slice(0, 1)).map((resp, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-1">
                              <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                              {resp.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Matrix */}
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">责任矩阵</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">开发阶段</th>
                      {responsibleParties.map((party) => (
                        <th key={party.id} className="text-center py-3 px-4 font-semibold text-slate-900">
                          <div className="flex flex-col items-center gap-1">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", partyColors[party.type])}>
                              {(() => {
                                const Icon = partyIcons[party.type];
                                return <Icon className="w-4 h-4 text-white" />;
                              })()}
                            </div>
                            <span className="text-xs">{party.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {developmentStages.map((stage) => (
                      <tr key={stage.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900">{stage.name}</p>
                          <p className="text-xs text-slate-500">{stage.tasks.length} 个任务</p>
                        </td>
                        {responsibleParties.map((party) => {
                          const hasResponsibility = party.responsibilities.some(r => 
                            r.stage.includes(stage.name) || 
                            stage.name.includes(r.stage) ||
                            stage.tasks.some(t => t.responsibleParty === party.name || 
                              party.responsibilities.some(pr => pr.stage === t.name))
                          );
                          
                          return (
                            <td key={party.id} className="text-center py-3 px-4">
                              {hasResponsibility ? (
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                                  partyColors[party.type]
                                )}>
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                                  <span className="text-slate-300">-</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">图例说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {responsibleParties.map((party) => {
              const Icon = partyIcons[party.type];
              return (
                <div key={party.id} className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", partyColors[party.type])}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-600">{party.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
