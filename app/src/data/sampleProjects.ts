import type { Project, Milestone, ProjectTask } from '@/types';

export const sampleProjects: Project[] = [
  {
    id: 'proj-1',
    name: '江苏常州200MW/400MWh储能电站',
    description: '位于常州市武进区，接入220kV变电站，主要服务电网调峰调频',
    capacity: 400,
    location: '江苏省常州市武进区',
    substation: '220kV武进变电站',
    startDate: '2025-06-01',
    targetDate: '2026-12-31',
    status: 'in_progress',
    progress: 35,
    currentStage: 'stage-3',
    milestones: [],
    tasks: []
  },
  {
    id: 'proj-2',
    name: '广东惠州300MW/600MWh储能电站',
    description: '位于惠州市惠阳区，接入500kV变电站，服务粤港澳大湾区电网',
    capacity: 600,
    location: '广东省惠州市惠阳区',
    substation: '500kV惠州变电站',
    startDate: '2025-03-15',
    targetDate: '2026-09-30',
    status: 'in_progress',
    progress: 52,
    currentStage: 'stage-4',
    milestones: [],
    tasks: []
  },
  {
    id: 'proj-3',
    name: '浙江湖州100MW/200MWh储能电站',
    description: '位于湖州市长兴县，接入220kV变电站，服务浙江电网',
    capacity: 200,
    location: '浙江省湖州市长兴县',
    substation: '220kV长兴变电站',
    startDate: '2025-08-01',
    targetDate: '2027-03-31',
    status: 'planning',
    progress: 15,
    currentStage: 'stage-2',
    milestones: [],
    tasks: []
  },
  {
    id: 'proj-4',
    name: '山东青岛400MW/800MWh储能电站',
    description: '位于青岛市即墨区，接入500kV变电站，服务山东电网',
    capacity: 800,
    location: '山东省青岛市即墨区',
    substation: '500kV即墨变电站',
    startDate: '2024-09-01',
    targetDate: '2026-06-30',
    status: 'in_progress',
    progress: 68,
    currentStage: 'stage-6',
    milestones: [],
    tasks: []
  }
];

export const sampleMilestones: Milestone[] = [
  // 江苏常州项目
  {
    id: 'ms-1-1',
    projectId: 'proj-1',
    name: '项目备案完成',
    description: '取得发改委项目备案证',
    plannedDate: '2025-07-15',
    actualDate: '2025-07-10',
    status: 'completed',
    stageId: 'stage-1'
  },
  {
    id: 'ms-1-2',
    projectId: 'proj-1',
    name: '环评批复取得',
    description: '取得生态环境局环评批复',
    plannedDate: '2025-09-30',
    actualDate: '2025-10-05',
    status: 'completed',
    stageId: 'stage-2'
  },
  {
    id: 'ms-1-3',
    projectId: 'proj-1',
    name: '接入系统批复',
    description: '取得省电力公司接入系统批复',
    plannedDate: '2025-12-31',
    status: 'pending',
    stageId: 'stage-3'
  },
  {
    id: 'ms-1-4',
    projectId: 'proj-1',
    name: '土地证办理',
    description: '取得不动产权证（土地证）',
    plannedDate: '2026-03-31',
    status: 'pending',
    stageId: 'stage-4'
  },
  {
    id: 'ms-1-5',
    projectId: 'proj-1',
    name: '线路核准批复',
    description: '取得送出线路核准批复',
    plannedDate: '2026-06-30',
    status: 'pending',
    stageId: 'stage-5'
  },
  {
    id: 'ms-1-6',
    projectId: 'proj-1',
    name: '施工许可取得',
    description: '取得建筑工程施工许可证',
    plannedDate: '2026-08-31',
    status: 'pending',
    stageId: 'stage-6'
  },
  {
    id: 'ms-1-7',
    projectId: 'proj-1',
    name: '项目并网投产',
    description: '完成并网验收，转入商业运营',
    plannedDate: '2026-12-31',
    status: 'pending',
    stageId: 'stage-7'
  },
  
  // 广东惠州项目
  {
    id: 'ms-2-1',
    projectId: 'proj-2',
    name: '项目备案完成',
    description: '取得发改委项目备案证',
    plannedDate: '2025-04-30',
    actualDate: '2025-04-25',
    status: 'completed',
    stageId: 'stage-1'
  },
  {
    id: 'ms-2-2',
    projectId: 'proj-2',
    name: '环评批复取得',
    description: '取得生态环境局环评批复',
    plannedDate: '2025-07-15',
    actualDate: '2025-07-10',
    status: 'completed',
    stageId: 'stage-2'
  },
  {
    id: 'ms-2-3',
    projectId: 'proj-2',
    name: '接入系统批复',
    description: '取得省电力公司接入系统批复',
    plannedDate: '2025-09-30',
    actualDate: '2025-09-28',
    status: 'completed',
    stageId: 'stage-3'
  },
  {
    id: 'ms-2-4',
    projectId: 'proj-2',
    name: '土地证办理',
    description: '取得不动产权证（土地证）',
    plannedDate: '2025-12-31',
    status: 'pending',
    stageId: 'stage-4'
  },
  {
    id: 'ms-2-5',
    projectId: 'proj-2',
    name: '线路核准批复',
    description: '取得送出线路核准批复',
    plannedDate: '2026-03-31',
    status: 'pending',
    stageId: 'stage-5'
  },
  {
    id: 'ms-2-6',
    projectId: 'proj-2',
    name: '施工许可取得',
    description: '取得建筑工程施工许可证',
    plannedDate: '2026-05-31',
    status: 'pending',
    stageId: 'stage-6'
  },
  {
    id: 'ms-2-7',
    projectId: 'proj-2',
    name: '项目并网投产',
    description: '完成并网验收，转入商业运营',
    plannedDate: '2026-09-30',
    status: 'pending',
    stageId: 'stage-7'
  }
];

export const sampleTasks: ProjectTask[] = [
  // 江苏常州项目任务
  {
    id: 'ptask-1-1',
    projectId: 'proj-1',
    name: '可行性研究报告编制',
    description: '委托有资质的设计单位编制项目可行性研究报告',
    stageId: 'stage-1',
    responsibleParty: '设计院',
    plannedStart: '2025-06-01',
    plannedEnd: '2025-06-30',
    actualStart: '2025-06-01',
    actualEnd: '2025-06-28',
    status: 'completed',
    progress: 100,
    dependencies: []
  },
  {
    id: 'ptask-1-2',
    projectId: 'proj-1',
    name: '项目备案',
    description: '向当地发改委提交项目备案申请',
    stageId: 'stage-1',
    responsibleParty: '发改委',
    plannedStart: '2025-07-01',
    plannedEnd: '2025-07-15',
    actualStart: '2025-07-01',
    actualEnd: '2025-07-10',
    status: 'completed',
    progress: 100,
    dependencies: ['ptask-1-1']
  },
  {
    id: 'ptask-1-3',
    projectId: 'proj-1',
    name: '环境影响评价',
    description: '编制环评报告，取得环评批复',
    stageId: 'stage-2',
    responsibleParty: '环评机构',
    plannedStart: '2025-07-15',
    plannedEnd: '2025-09-30',
    actualStart: '2025-07-15',
    actualEnd: '2025-10-05',
    status: 'completed',
    progress: 100,
    dependencies: ['ptask-1-2']
  },
  {
    id: 'ptask-1-4',
    projectId: 'proj-1',
    name: '接入系统设计',
    description: '委托具备资质的设计院编制接入系统方案',
    stageId: 'stage-3',
    responsibleParty: '设计院',
    plannedStart: '2025-10-01',
    plannedEnd: '2025-10-30',
    actualStart: '2025-10-10',
    status: 'in_progress',
    progress: 65,
    dependencies: ['ptask-1-3']
  },
  {
    id: 'ptask-1-5',
    projectId: 'proj-1',
    name: '接入系统评审',
    description: '完成接入系统评审',
    stageId: 'stage-3',
    responsibleParty: '省电力公司',
    plannedStart: '2025-11-01',
    plannedEnd: '2025-11-20',
    status: 'pending',
    progress: 0,
    dependencies: ['ptask-1-4']
  },
  
  // 广东惠州项目任务
  {
    id: 'ptask-2-1',
    projectId: 'proj-2',
    name: '可行性研究报告编制',
    description: '委托有资质的设计单位编制项目可行性研究报告',
    stageId: 'stage-1',
    responsibleParty: '设计院',
    plannedStart: '2025-03-15',
    plannedEnd: '2025-04-14',
    actualStart: '2025-03-15',
    actualEnd: '2025-04-10',
    status: 'completed',
    progress: 100,
    dependencies: []
  },
  {
    id: 'ptask-2-2',
    projectId: 'proj-2',
    name: '项目备案',
    description: '向当地发改委提交项目备案申请',
    stageId: 'stage-1',
    responsibleParty: '发改委',
    plannedStart: '2025-04-15',
    plannedEnd: '2025-04-30',
    actualStart: '2025-04-15',
    actualEnd: '2025-04-25',
    status: 'completed',
    progress: 100,
    dependencies: ['ptask-2-1']
  },
  {
    id: 'ptask-2-3',
    projectId: 'proj-2',
    name: '环境影响评价',
    description: '编制环评报告，取得环评批复',
    stageId: 'stage-2',
    responsibleParty: '环评机构',
    plannedStart: '2025-05-01',
    plannedEnd: '2025-07-15',
    actualStart: '2025-05-01',
    actualEnd: '2025-07-10',
    status: 'completed',
    progress: 100,
    dependencies: ['ptask-2-2']
  },
  {
    id: 'ptask-2-4',
    projectId: 'proj-2',
    name: '接入系统设计',
    description: '委托具备资质的设计院编制接入系统方案',
    stageId: 'stage-3',
    responsibleParty: '设计院',
    plannedStart: '2025-07-15',
    plannedEnd: '2025-08-14',
    actualStart: '2025-07-15',
    actualEnd: '2025-08-10',
    status: 'completed',
    progress: 100,
    dependencies: ['ptask-2-3']
  },
  {
    id: 'ptask-2-5',
    projectId: 'proj-2',
    name: '接入系统评审',
    description: '完成接入系统评审',
    stageId: 'stage-3',
    responsibleParty: '省电力公司',
    plannedStart: '2025-08-15',
    plannedEnd: '2025-09-30',
    actualStart: '2025-08-15',
    actualEnd: '2025-09-28',
    status: 'completed',
    progress: 100,
    dependencies: ['ptask-2-4']
  },
  {
    id: 'ptask-2-6',
    projectId: 'proj-2',
    name: '土地挂牌交易',
    description: '参与土地招拍挂，签订成交确认书',
    stageId: 'stage-4',
    responsibleParty: '业主方',
    plannedStart: '2025-10-01',
    plannedEnd: '2025-10-20',
    actualStart: '2025-10-05',
    status: 'in_progress',
    progress: 45,
    dependencies: ['ptask-2-5']
  }
];
