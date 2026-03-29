import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building2, 
  Zap, 
  Calendar, 
  MapPin,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { developmentStages } from '@/data/developmentStages';
import { cn } from '@/lib/utils';

interface ProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: {
    name: string;
    description: string;
    capacity: number;
    location: string;
    substation: string;
    startDate: string;
    targetDate: string;
  }) => void;
}

const steps = [
  { id: 'basic', name: '基本信息', icon: Building2 },
  { id: 'location', name: '选址信息', icon: MapPin },
  { id: 'technical', name: '技术参数', icon: Zap },
  { id: 'schedule', name: '项目计划', icon: Calendar },
  { id: 'review', name: '确认创建', icon: ClipboardCheck }
];

export function ProjectWizard({ isOpen, onClose, onCreate }: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 400,
    location: '',
    substation: '',
    voltageLevel: '220kV',
    landArea: 35,
    startDate: '',
    targetDate: '',
    projectManager: '',
    contactPhone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0:
        if (!formData.name.trim()) newErrors.name = '请输入项目名称';
        if (!formData.description.trim()) newErrors.description = '请输入项目描述';
        break;
      case 1:
        if (!formData.location.trim()) newErrors.location = '请输入项目地点';
        if (!formData.landArea || formData.landArea < 1) newErrors.landArea = '请输入有效的用地面积';
        break;
      case 2:
        if (!formData.capacity || formData.capacity < 1) newErrors.capacity = '请输入有效的装机容量';
        if (!formData.substation.trim()) newErrors.substation = '请输入接入变电站';
        break;
      case 3:
        if (!formData.startDate) newErrors.startDate = '请选择计划开工日期';
        if (!formData.targetDate) newErrors.targetDate = '请选择计划投产日期';
        if (formData.startDate && formData.targetDate && formData.startDate >= formData.targetDate) {
          newErrors.targetDate = '投产日期必须晚于开工日期';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    onCreate({
      name: formData.name,
      description: formData.description,
      capacity: formData.capacity,
      location: formData.location,
      substation: `${formData.voltageLevel} ${formData.substation}`,
      startDate: formData.startDate,
      targetDate: formData.targetDate
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      capacity: 400,
      location: '',
      substation: '',
      voltageLevel: '220kV',
      landArea: 35,
      startDate: '',
      targetDate: '',
      projectManager: '',
      contactPhone: ''
    });
    setCurrentStep(0);
    onClose();
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const CurrentIcon = steps[currentStep].icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CurrentIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">新建项目</h2>
                <p className="text-white/80 text-sm">步骤 {currentStep + 1} / {steps.length}: {steps[currentStep].name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
          <Progress value={progress} className="mt-4 h-1 bg-white/20" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 p-4 bg-slate-50 border-b">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
                    isActive && "bg-blue-100 text-blue-700 font-medium",
                    isCompleted && "bg-green-100 text-green-700",
                    !isActive && !isCompleted && "text-slate-400"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                    isActive && "bg-blue-600 text-white",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-slate-200 text-slate-500"
                  )}>
                    {isCompleted ? <Check className="w-3 h-3" /> : <StepIcon className="w-3 h-3" />}
                  </div>
                  <span className="hidden sm:inline">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">项目名称 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="例如：江苏常州200MW/400MWh储能电站"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">项目描述 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="描述项目的基本情况、建设目的等"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={cn(errors.description && "border-red-500", "min-h-[100px]")}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectManager">项目负责人</Label>
                  <Input
                    id="projectManager"
                    placeholder="请输入负责人姓名"
                    value={formData.projectManager}
                    onChange={(e) => updateField('projectManager', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input
                    id="contactPhone"
                    placeholder="请输入联系电话"
                    value={formData.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">项目地点 <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  placeholder="例如：江苏省常州市武进区"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className={cn(errors.location && "border-red-500")}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <Label htmlFor="landArea">用地面积（亩）</Label>
                <Input
                  id="landArea"
                  type="number"
                  placeholder="35"
                  value={formData.landArea}
                  onChange={(e) => updateField('landArea', parseInt(e.target.value) || 0)}
                  className={cn(errors.landArea && "border-red-500")}
                />
                <p className="text-sm text-slate-500 mt-1">
                  参考：400MWh约需35亩，800MWh约需60亩
                </p>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    选址要求
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 距离接入变电站0-5公里范围内</li>
                    <li>• 土地性质为工业用地或公用设施用地</li>
                    <li>• 无军事设施、文物遗址、生态红线</li>
                    <li>• 不占用基本农田</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Technical */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="capacity">装机容量（MWh）<span className="text-red-500">*</span></Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="400"
                  value={formData.capacity}
                  onChange={(e) => updateField('capacity', parseInt(e.target.value) || 0)}
                  className={cn(errors.capacity && "border-red-500")}
                />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voltageLevel">接入电压等级</Label>
                  <select
                    id="voltageLevel"
                    value={formData.voltageLevel}
                    onChange={(e) => updateField('voltageLevel', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="110kV">110kV</option>
                    <option value="220kV">220kV</option>
                    <option value="500kV">500kV</option>
                    <option value="750kV">750kV</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="substation">接入变电站 <span className="text-red-500">*</span></Label>
                  <Input
                    id="substation"
                    placeholder="例如：武进变电站"
                    value={formData.substation}
                    onChange={(e) => updateField('substation', e.target.value)}
                    className={cn(errors.substation && "border-red-500")}
                  />
                  {errors.substation && <p className="text-red-500 text-sm mt-1">{errors.substation}</p>}
                </div>
              </div>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    电网接入要点
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• 优先选择220kV及以上变电站接入</li>
                    <li>• 确保有足够空余间隔</li>
                    <li>• 送出线路尽量架空，控制在5公里以内</li>
                    <li>• 避免跨越高速、国道、铁路、河道</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">计划开工日期 <span className="text-red-500">*</span></Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className={cn(errors.startDate && "border-red-500")}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <Label htmlFor="targetDate">计划投产日期 <span className="text-red-500">*</span></Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => updateField('targetDate', e.target.value)}
                    className={cn(errors.targetDate && "border-red-500")}
                  />
                  {errors.targetDate && <p className="text-red-500 text-sm mt-1">{errors.targetDate}</p>}
                </div>
              </div>

              {formData.startDate && formData.targetDate && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      项目周期预览
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">项目周期：</span>
                        <span className="font-medium text-green-900">
                          {Math.ceil((new Date(formData.targetDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                        </span>
                      </div>
                      <div className="text-sm text-green-700">
                        系统将自动为您生成7个开发阶段的里程碑和任务计划
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">预计开发阶段</h4>
                <div className="space-y-2">
                  {developmentStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-700">{stage.name}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {stage.tasks.length} 个任务
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">请确认项目信息</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">项目名称</p>
                  <p className="font-medium text-slate-900">{formData.name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">项目地点</p>
                  <p className="font-medium text-slate-900">{formData.location}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">装机容量</p>
                  <p className="font-medium text-slate-900">{formData.capacity} MWh</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">接入变电站</p>
                  <p className="font-medium text-slate-900">{formData.voltageLevel} {formData.substation}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">计划开工</p>
                  <p className="font-medium text-slate-900">{formData.startDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">计划投产</p>
                  <p className="font-medium text-slate-900">{formData.targetDate}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">项目描述</p>
                <p className="text-sm text-slate-700 mt-1">{formData.description}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>提示：</strong> 创建项目后，系统将自动生成7个开发阶段的里程碑和任务计划，您可以在项目管理页面进行详细管理。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onClose : handlePrev}
          >
            {currentStep === 0 ? '取消' : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一步
              </>
            )}
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              下一步
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1" />
              创建项目
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
