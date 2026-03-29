import type { DevelopmentStage, ResponsibleParty } from '@/types';

export const developmentStages: DevelopmentStage[] = [
  {
    id: 'stage-1',
    name: '项目立项阶段',
    description: '项目可行性研究、投资协议签订、项目公司注册、项目备案等',
    order: 1,
    tasks: [
      {
        id: 'task-1-1',
        stageId: 'stage-1',
        name: '可行性研究报告编制',
        description: '委托有资质的设计单位编制项目可行性研究报告，内容包括项目背景、建设规模、技术方案、投资估算、经济分析等',
        responsibleParty: '设计院',
        estimatedDays: 30,
        dependencies: []
      },
      {
        id: 'task-1-2',
        stageId: 'stage-1',
        name: '可研报告评审',
        description: '组织专家对可研报告进行评审，取得正式的评审意见',
        responsibleParty: '评审机构',
        estimatedDays: 15,
        dependencies: ['task-1-1']
      },
      {
        id: 'task-1-3',
        stageId: 'stage-1',
        name: '投资协议签订',
        description: '与当地政府签订投资框架协议，明确投资规模、建设周期、优惠政策等关键条款',
        responsibleParty: '业主方',
        estimatedDays: 20,
        dependencies: []
      },
      {
        id: 'task-1-4',
        stageId: 'stage-1',
        name: '项目公司注册',
        description: '在当地注册成立项目公司，完成工商登记、银行开户、税务登记等手续',
        responsibleParty: '业主方',
        estimatedDays: 7,
        dependencies: []
      },
      {
        id: 'task-1-5',
        stageId: 'stage-1',
        name: '项目备案',
        description: '向当地发改委提交项目备案申请，取得项目备案证',
        responsibleParty: '发改委',
        estimatedDays: 3,
        dependencies: ['task-1-2', 'task-1-4']
      },
      {
        id: 'task-1-6',
        stageId: 'stage-1',
        name: '纳规申请（如需）',
        description: '将项目上报省能源局，申请纳入省级电力规划，取得纳规批文',
        responsibleParty: '能源局',
        estimatedDays: 60,
        dependencies: ['task-1-5']
      }
    ],
    documents: [
      { id: 'doc-1-1', stageId: 'stage-1', name: '项目备案证', responsibleParty: '发改委', description: '项目合法建设依据', required: true },
      { id: 'doc-1-2', stageId: 'stage-1', name: '纳规批文（如需）', responsibleParty: '能源局', description: '纳入省级电力规划', required: false },
      { id: 'doc-1-3', stageId: 'stage-1', name: '可行性研究报告', responsibleParty: '设计院', description: '技术经济论证', required: true },
      { id: 'doc-1-4', stageId: 'stage-1', name: '可研评审意见', responsibleParty: '评审机构', description: '可研报告认可', required: true },
      { id: 'doc-1-5', stageId: 'stage-1', name: '投资协议', responsibleParty: '政府', description: '投资条件约定', required: true },
      { id: 'doc-1-6', stageId: 'stage-1', name: '营业执照', responsibleParty: '市场监管局', description: '主体资格证明', required: true }
    ],
    outputs: [
      { id: 'out-1-1', stageId: 'stage-1', name: '可行性研究报告', responsibleParty: '设计院', purpose: '项目技术经济可行性论证' },
      { id: 'out-1-2', stageId: 'stage-1', name: '可研评审意见', responsibleParty: '评审机构', purpose: '可研报告通过评审的证明' },
      { id: 'out-1-3', stageId: 'stage-1', name: '投资协议', responsibleParty: '政府', purpose: '明确投资条件和优惠政策' },
      { id: 'out-1-4', stageId: 'stage-1', name: '营业执照', responsibleParty: '市场监管局', purpose: '项目公司合法主体资格' },
      { id: 'out-1-5', stageId: 'stage-1', name: '项目备案证', responsibleParty: '发改委', purpose: '项目合法建设依据' },
      { id: 'out-1-6', stageId: 'stage-1', name: '纳规批文（如需）', responsibleParty: '能源局', purpose: '纳入省级电力规划证明' }
    ]
  },
  {
    id: 'stage-2',
    name: '项目选址阶段',
    description: '地块考察、各项评价报告编制、政府部门选址意见等',
    order: 2,
    tasks: [
      {
        id: 'task-2-1',
        stageId: 'stage-2',
        name: '地块及周边环境考察',
        description: '实地考察交通、道路、水电、人文等条件，评估施工便利性',
        responsibleParty: '业主方',
        estimatedDays: 7,
        dependencies: []
      },
      {
        id: 'task-2-2',
        stageId: 'stage-2',
        name: '接入间隔核实',
        description: '核实拟接入变电站的备用出线间隔、线路通道、节点电价、负荷曲线等',
        responsibleParty: '电网公司',
        estimatedDays: 5,
        dependencies: []
      },
      {
        id: 'task-2-3',
        stageId: 'stage-2',
        name: '送出线路初勘',
        description: '通过卫星地图初步确认送出线路是否有敏感区域，是否涉及铁路、高速、航道等',
        responsibleParty: '设计院',
        estimatedDays: 5,
        dependencies: []
      },
      {
        id: 'task-2-4',
        stageId: 'stage-2',
        name: '环境影响评价',
        description: '编制环评报告，取得环评批复',
        responsibleParty: '环评机构',
        estimatedDays: 60,
        dependencies: []
      },
      {
        id: 'task-2-5',
        stageId: 'stage-2',
        name: '安全预评价',
        description: '编制安全预评价报告，取得备案',
        responsibleParty: '安评机构',
        estimatedDays: 30,
        dependencies: []
      },
      {
        id: 'task-2-6',
        stageId: 'stage-2',
        name: '水土保持方案',
        description: '编制水保方案，取得批复',
        responsibleParty: '水保机构',
        estimatedDays: 30,
        dependencies: []
      },
      {
        id: 'task-2-7',
        stageId: 'stage-2',
        name: '地质灾害评估',
        description: '编制地质灾害危险性评估报告，取得备案',
        responsibleParty: '地灾评估机构',
        estimatedDays: 20,
        dependencies: []
      },
      {
        id: 'task-2-8',
        stageId: 'stage-2',
        name: '八大局选址意见',
        description: '取得自然资源、林业、水利、环保、应急、文旅等部门的选址意见',
        responsibleParty: '各政府部门',
        estimatedDays: 30,
        dependencies: ['task-2-4', 'task-2-5', 'task-2-6']
      }
    ],
    documents: [
      { id: 'doc-2-1', stageId: 'stage-2', name: '项目红线图', responsibleParty: '设计院', description: '用地范围界定', required: true },
      { id: 'doc-2-2', stageId: 'stage-2', name: '用地预审与选址意见书', responsibleParty: '自然资源局', description: '用地合法性审查', required: true },
      { id: 'doc-2-3', stageId: 'stage-2', name: '环评批复', responsibleParty: '生态环境局', description: '环境影响评价批准', required: true },
      { id: 'doc-2-4', stageId: 'stage-2', name: '地质灾害评估备案', responsibleParty: '自然资源局', description: '地质条件评估', required: true },
      { id: 'doc-2-5', stageId: 'stage-2', name: '水土保持批复', responsibleParty: '水利局', description: '水保方案批准', required: true },
      { id: 'doc-2-6', stageId: 'stage-2', name: '八大局选址意见', responsibleParty: '各政府部门', description: '多部门选址认可', required: true },
      { id: 'doc-2-7', stageId: 'stage-2', name: '压覆矿意见', responsibleParty: '自然资源局', description: '无矿产资源压覆证明', required: true },
      { id: 'doc-2-8', stageId: 'stage-2', name: '无军事设施回复函', responsibleParty: '人武部', description: '军事设施审查', required: true },
      { id: 'doc-2-9', stageId: 'stage-2', name: '社会稳定风险评估备案', responsibleParty: '政法委', description: '社会稳定评估', required: true }
    ],
    outputs: [
      { id: 'out-2-1', stageId: 'stage-2', name: '项目红线图', responsibleParty: '设计院', purpose: '项目用地范围界定' },
      { id: 'out-2-2', stageId: 'stage-2', name: '用地预审与选址意见书', responsibleParty: '自然资源局', purpose: '用地合法性审查' },
      { id: 'out-2-3', stageId: 'stage-2', name: '环评批复', responsibleParty: '生态环境局', purpose: '环境影响评价批准' },
      { id: 'out-2-4', stageId: 'stage-2', name: '地质灾害评估备案', responsibleParty: '自然资源局', purpose: '地质条件评估' },
      { id: 'out-2-5', stageId: 'stage-2', name: '水土保持批复', responsibleParty: '水利局', purpose: '水保方案批准' },
      { id: 'out-2-6', stageId: 'stage-2', name: '八大局选址意见', responsibleParty: '各政府部门', purpose: '多部门选址认可' },
      { id: 'out-2-7', stageId: 'stage-2', name: '压覆矿意见', responsibleParty: '自然资源局', purpose: '无矿产资源压覆证明' }
    ]
  },
  {
    id: 'stage-3',
    name: '电网接入可研阶段',
    description: '接入系统设计、电能质量评估、取得电网公司接入批复',
    order: 3,
    tasks: [
      {
        id: 'task-3-1',
        stageId: 'stage-3',
        name: '接入系统设计',
        description: '委托具备资质的设计院编制接入系统方案，确定接入电压等级、接入方式、电气主接线等',
        responsibleParty: '设计院',
        estimatedDays: 30,
        dependencies: []
      },
      {
        id: 'task-3-2',
        stageId: 'stage-3',
        name: '电能质量评估',
        description: '开展电能质量专题研究，评估项目对电网电能质量的影响',
        responsibleParty: '设计院',
        estimatedDays: 15,
        dependencies: ['task-3-1']
      },
      {
        id: 'task-3-3',
        stageId: 'stage-3',
        name: '接入系统评审',
        description: '配合设计单位对接国网经济技术研究院或省电力公司发展策划部，完成接入系统评审',
        responsibleParty: '省电力公司',
        estimatedDays: 20,
        dependencies: ['task-3-2']
      },
      {
        id: 'task-3-4',
        stageId: 'stage-3',
        name: '取得接入批复',
        description: '取得省电力公司出具的接入系统批复意见（并网原则意见函）',
        responsibleParty: '省电力公司',
        estimatedDays: 10,
        dependencies: ['task-3-3']
      }
    ],
    documents: [
      { id: 'doc-3-1', stageId: 'stage-3', name: '电力接入系统设计方案', responsibleParty: '设计院', description: '接入技术方案', required: true },
      { id: 'doc-3-2', stageId: 'stage-3', name: '电能质量专题报告', responsibleParty: '设计院', description: '电能质量评估', required: true },
      { id: 'doc-3-3', stageId: 'stage-3', name: '接入系统评审意见', responsibleParty: '省电力公司', description: '技术方案认可', required: true },
      { id: 'doc-3-4', stageId: 'stage-3', name: '并网原则意见函', responsibleParty: '省电力公司', description: '接入许可证明', required: true }
    ],
    outputs: [
      { id: 'out-3-1', stageId: 'stage-3', name: '电力接入系统设计方案', responsibleParty: '设计院', purpose: '接入技术方案' },
      { id: 'out-3-2', stageId: 'stage-3', name: '电能质量专题报告', responsibleParty: '设计院', purpose: '电能质量评估' },
      { id: 'out-3-3', stageId: 'stage-3', name: '接入系统评审意见', responsibleParty: '省电力公司', purpose: '技术方案认可' },
      { id: 'out-3-4', stageId: 'stage-3', name: '并网原则意见函', responsibleParty: '省电力公司', purpose: '接入许可证明' }
    ]
  },
  {
    id: 'stage-4',
    name: '电力接入批复阶段',
    description: '外线可研、路径选址、线路核准等',
    order: 4,
    tasks: [
      {
        id: 'task-4-1',
        stageId: 'stage-4',
        name: '外线可研编制',
        description: '委托设计院编制外线接入可研报告，确定线路路径、杆塔位置、导线型号等',
        responsibleParty: '设计院',
        estimatedDays: 30,
        dependencies: []
      },
      {
        id: 'task-4-2',
        stageId: 'stage-4',
        name: '路径选址',
        description: '取得沿线各相关部门的选址意见（八大局），协调路径方案',
        responsibleParty: '各政府部门',
        estimatedDays: 30,
        dependencies: ['task-4-1']
      },
      {
        id: 'task-4-3',
        stageId: 'stage-4',
        name: '取得路径红线图',
        description: '向自然资源局申请取得外线路径红线图',
        responsibleParty: '自然资源局',
        estimatedDays: 10,
        dependencies: ['task-4-2']
      },
      {
        id: 'task-4-4',
        stageId: 'stage-4',
        name: '线路核准',
        description: '向行政审批局申请办理220kV线路核准，取得核准批复',
        responsibleParty: '行政审批局',
        estimatedDays: 20,
        dependencies: ['task-4-3']
      }
    ],
    documents: [
      { id: 'doc-4-1', stageId: 'stage-4', name: '外线接入可研及批复', responsibleParty: '设计院/电网', description: '外线技术方案', required: true },
      { id: 'doc-4-2', stageId: 'stage-4', name: '外线路径红线图', responsibleParty: '自然资源局', description: '线路路径规划', required: true },
      { id: 'doc-4-3', stageId: 'stage-4', name: '送出线路核准批复', responsibleParty: '行政审批局', description: '外线建设许可', required: true },
      { id: 'doc-4-4', stageId: 'stage-4', name: '电网接入系统方案批复', responsibleParty: '省电力公司', description: '整体接入许可', required: true }
    ],
    outputs: [
      { id: 'out-4-1', stageId: 'stage-4', name: '外线接入可研及批复', responsibleParty: '设计院/电网', purpose: '外线技术方案' },
      { id: 'out-4-2', stageId: 'stage-4', name: '外线路径红线图', responsibleParty: '自然资源局', purpose: '线路路径规划' },
      { id: 'out-4-3', stageId: 'stage-4', name: '送出线路核准批复', responsibleParty: '行政审批局', purpose: '外线建设许可' },
      { id: 'out-4-4', stageId: 'stage-4', name: '电网接入系统方案批复', responsibleParty: '省电力公司', purpose: '整体接入许可' }
    ]
  },
  {
    id: 'stage-5',
    name: '土地招拍挂阶段',
    description: '土地挂牌交易、签订出让合同、办理土地证等',
    order: 5,
    tasks: [
      {
        id: 'task-5-1',
        stageId: 'stage-5',
        name: '土地挂牌交易',
        description: '参与土地招拍挂，缴纳竞买保证金，完成网上竞价，签订成交确认书',
        responsibleParty: '业主方',
        estimatedDays: 20,
        dependencies: []
      },
      {
        id: 'task-5-2',
        stageId: 'stage-5',
        name: '签订出让合同',
        description: '签订《国有建设用地使用权出让合同》',
        responsibleParty: '自然资源局',
        estimatedDays: 10,
        dependencies: ['task-5-1']
      },
      {
        id: 'task-5-3',
        stageId: 'stage-5',
        name: '缴纳相关税费',
        description: '缴纳契税（3%）、印花税（0.05%）等相关税费',
        responsibleParty: '业主方',
        estimatedDays: 5,
        dependencies: ['task-5-2']
      },
      {
        id: 'task-5-4',
        stageId: 'stage-5',
        name: '办理土地证',
        description: '办理不动产权证（土地证），完成土地权属登记',
        responsibleParty: '自然资源局',
        estimatedDays: 15,
        dependencies: ['task-5-3']
      }
    ],
    documents: [
      { id: 'doc-5-1', stageId: 'stage-5', name: '建设用地出让合同', responsibleParty: '自然资源局', description: '土地使用权取得', required: true },
      { id: 'doc-5-2', stageId: 'stage-5', name: '不动产权证（土地证）', responsibleParty: '自然资源局', description: '土地权属证明', required: true },
      { id: 'doc-5-3', stageId: 'stage-5', name: '建设用地规划许可证', responsibleParty: '自然资源局', description: '用地规划许可', required: true }
    ],
    outputs: [
      { id: 'out-5-1', stageId: 'stage-5', name: '建设用地出让合同', responsibleParty: '自然资源局', purpose: '土地使用权取得' },
      { id: 'out-5-2', stageId: 'stage-5', name: '不动产权证（土地证）', responsibleParty: '自然资源局', purpose: '土地权属证明' },
      { id: 'out-5-3', stageId: 'stage-5', name: '建设用地规划许可证', responsibleParty: '自然资源局', purpose: '用地规划许可' }
    ]
  },
  {
    id: 'stage-6',
    name: '施工许可阶段',
    description: '施工图设计、审查、施工许可办理等',
    order: 6,
    tasks: [
      {
        id: 'task-6-1',
        stageId: 'stage-6',
        name: '施工图设计',
        description: '完成场站和外线工程施工图设计，编制施工组织设计',
        responsibleParty: '设计院',
        estimatedDays: 45,
        dependencies: []
      },
      {
        id: 'task-6-2',
        stageId: 'stage-6',
        name: '施工图审查',
        description: '提交施工图审查，取得施工图审查合格证',
        responsibleParty: '审图机构',
        estimatedDays: 15,
        dependencies: ['task-6-1']
      },
      {
        id: 'task-6-3',
        stageId: 'stage-6',
        name: '建设工程规划许可',
        description: '办理建设工程规划许可证',
        responsibleParty: '自然资源局',
        estimatedDays: 5,
        dependencies: ['task-6-2']
      },
      {
        id: 'task-6-4',
        stageId: 'stage-6',
        name: '消防设计审核',
        description: '申报建设工程消防设计审核（储能场区500kWh以上需特殊审核）',
        responsibleParty: '住建局',
        estimatedDays: 5,
        dependencies: ['task-6-2']
      },
      {
        id: 'task-6-5',
        stageId: 'stage-6',
        name: '质安监督申报',
        description: '向住建局申报建设工程质量安全监督',
        responsibleParty: '住建局',
        estimatedDays: 5,
        dependencies: ['task-6-3', 'task-6-4']
      },
      {
        id: 'task-6-6',
        stageId: 'stage-6',
        name: '施工许可办理',
        description: '办理建筑工程施工许可证',
        responsibleParty: '住建局',
        estimatedDays: 3,
        dependencies: ['task-6-5']
      },
      {
        id: 'task-6-7',
        stageId: 'stage-6',
        name: '电力质监申报',
        description: '向可再生能源发电工程质量监督站申报首次监督检查',
        responsibleParty: '质监站',
        estimatedDays: 10,
        dependencies: ['task-6-6']
      }
    ],
    documents: [
      { id: 'doc-6-1', stageId: 'stage-6', name: '施工图设计文件', responsibleParty: '设计院', description: '施工依据', required: true },
      { id: 'doc-6-2', stageId: 'stage-6', name: '施工图审查合格证', responsibleParty: '审图机构', description: '设计合规证明', required: true },
      { id: 'doc-6-3', stageId: 'stage-6', name: '建设工程规划许可证', responsibleParty: '自然资源局', description: '工程建设许可', required: true },
      { id: 'doc-6-4', stageId: 'stage-6', name: '消防设计审核意见', responsibleParty: '住建局', description: '消防合规证明', required: true },
      { id: 'doc-6-5', stageId: 'stage-6', name: '施工许可证', responsibleParty: '住建局', description: '合法开工依据', required: true },
      { id: 'doc-6-6', stageId: 'stage-6', name: '质监报告', responsibleParty: '质监站', description: '质量监督备案', required: true }
    ],
    outputs: [
      { id: 'out-6-1', stageId: 'stage-6', name: '施工图设计文件', responsibleParty: '设计院', purpose: '施工依据' },
      { id: 'out-6-2', stageId: 'stage-6', name: '施工图审查合格证', responsibleParty: '审图机构', purpose: '设计合规证明' },
      { id: 'out-6-3', stageId: 'stage-6', name: '建设工程规划许可证', responsibleParty: '自然资源局', purpose: '工程建设许可' },
      { id: 'out-6-4', stageId: 'stage-6', name: '消防设计审核意见', responsibleParty: '住建局', purpose: '消防合规证明' },
      { id: 'out-6-5', stageId: 'stage-6', name: '施工许可证', responsibleParty: '住建局', purpose: '合法开工依据' },
      { id: 'out-6-6', stageId: 'stage-6', name: '质监报告', responsibleParty: '质监站', purpose: '质量监督备案' }
    ]
  },
  {
    id: 'stage-7',
    name: '并网验收阶段',
    description: '设备安装调试、各项验收、并网测试、商业运营准备',
    order: 7,
    tasks: [
      {
        id: 'task-7-1',
        stageId: 'stage-7',
        name: '设备安装调试',
        description: '完成储能系统、PCS、主变、GIS、SVG等设备的安装和单体调试',
        responsibleParty: '施工单位',
        estimatedDays: 90,
        dependencies: []
      },
      {
        id: 'task-7-2',
        stageId: 'stage-7',
        name: '系统联调',
        description: '开展储能系统联调，完成保护定值整定、通讯通道开通',
        responsibleParty: '调试单位',
        estimatedDays: 15,
        dependencies: ['task-7-1']
      },
      {
        id: 'task-7-3',
        stageId: 'stage-7',
        name: '涉网试验',
        description: '完成AGC/AVC试验、一次调频及惯量响应测试、电能质量测试、故障穿越能力验证等',
        responsibleParty: '第三方',
        estimatedDays: 20,
        dependencies: ['task-7-2']
      },
      {
        id: 'task-7-4',
        stageId: 'stage-7',
        name: '专项验收',
        description: '完成消防验收、环保验收、水保验收、安全验收、职业卫生验收等',
        responsibleParty: '各政府部门',
        estimatedDays: 30,
        dependencies: ['task-7-3']
      },
      {
        id: 'task-7-5',
        stageId: 'stage-7',
        name: '电网验收',
        description: '通过电网公司技术监督验收、等保测评、并网前整体验收',
        responsibleParty: '供电公司',
        estimatedDays: 15,
        dependencies: ['task-7-4']
      },
      {
        id: 'task-7-6',
        stageId: 'stage-7',
        name: '签订协议',
        description: '签订并网调度协议、购售电合同、高压供用电合同',
        responsibleParty: '电网公司',
        estimatedDays: 10,
        dependencies: ['task-7-5']
      },
      {
        id: 'task-7-7',
        stageId: 'stage-7',
        name: '召开启委会',
        description: '组织召开启动验收委员会，确定并网时间和启动方案',
        responsibleParty: '业主方',
        estimatedDays: 5,
        dependencies: ['task-7-6']
      },
      {
        id: 'task-7-8',
        stageId: 'stage-7',
        name: '并网返送电',
        description: '完成并网返送电，转入商业运营',
        responsibleParty: '电网公司',
        estimatedDays: 3,
        dependencies: ['task-7-7']
      }
    ],
    documents: [
      { id: 'doc-7-1', stageId: 'stage-7', name: '设备安装验收记录', responsibleParty: '施工单位', description: '安装质量证明', required: true },
      { id: 'doc-7-2', stageId: 'stage-7', name: '涉网试验报告', responsibleParty: '第三方', description: '并网性能验证', required: true },
      { id: 'doc-7-3', stageId: 'stage-7', name: '消防验收意见', responsibleParty: '住建局/消防', description: '消防合规', required: true },
      { id: 'doc-7-4', stageId: 'stage-7', name: '环保验收意见', responsibleParty: '生态环境局', description: '环保合规', required: true },
      { id: 'doc-7-5', stageId: 'stage-7', name: '电网验收意见', responsibleParty: '供电公司', description: '并网许可', required: true },
      { id: 'doc-7-6', stageId: 'stage-7', name: '并网调度协议', responsibleParty: '电网公司', description: '调度关系确立', required: true },
      { id: 'doc-7-7', stageId: 'stage-7', name: '购售电合同', responsibleParty: '电网公司', description: '电价结算依据', required: true },
      { id: 'doc-7-8', stageId: 'stage-7', name: '转商运批复', responsibleParty: '电网公司', description: '商业运营许可', required: true }
    ],
    outputs: [
      { id: 'out-7-1', stageId: 'stage-7', name: '设备安装验收记录', responsibleParty: '施工单位', purpose: '安装质量证明' },
      { id: 'out-7-2', stageId: 'stage-7', name: '涉网试验报告', responsibleParty: '第三方', purpose: '并网性能验证' },
      { id: 'out-7-3', stageId: 'stage-7', name: '消防验收意见', responsibleParty: '住建局/消防', purpose: '消防合规' },
      { id: 'out-7-4', stageId: 'stage-7', name: '环保验收意见', responsibleParty: '生态环境局', purpose: '环保合规' },
      { id: 'out-7-5', stageId: 'stage-7', name: '电网验收意见', responsibleParty: '供电公司', purpose: '并网许可' },
      { id: 'out-7-6', stageId: 'stage-7', name: '并网调度协议', responsibleParty: '电网公司', purpose: '调度关系确立' },
      { id: 'out-7-7', stageId: 'stage-7', name: '购售电合同', responsibleParty: '电网公司', purpose: '电价结算依据' },
      { id: 'out-7-8', stageId: 'stage-7', name: '转商运批复', responsibleParty: '电网公司', purpose: '商业运营许可' }
    ]
  }
];

export const responsibleParties: ResponsibleParty[] = [
  {
    id: 'party-owner',
    name: '业主方',
    type: 'owner',
    responsibilities: [
      { stage: '项目立项', content: '负责项目可行性研究、投资协议签订、公司注册、项目备案等' },
      { stage: '项目选址', content: '负责地块考察、各项评价报告委托编制、政府部门协调' },
      { stage: '电网接入', content: '负责接入系统设计委托、电网公司对接、接入批复办理' },
      { stage: '电力接入批复', content: '负责外线可研委托、路径协调、核准手续办理' },
      { stage: '土地获取', content: '负责土地招拍挂参与、出让合同签订、土地证办理' },
      { stage: '施工许可', content: '负责施工图设计委托、施工许可手续办理' },
      { stage: '工程建设', content: '负责工程招标、施工管理、设备采购、质量控制' },
      { stage: '并网验收', content: '负责验收组织、协议签订、并网协调、商运准备' }
    ]
  },
  {
    id: 'party-government',
    name: '政府方',
    type: 'government',
    responsibilities: [
      { stage: '发改委', content: '项目备案、节能评估、纳规审批、外线核准' },
      { stage: '能源局', content: '电力规划、纳规审批、政策制定' },
      { stage: '自然资源局', content: '用地预审、土地招拍挂、规划许可、土地证办理' },
      { stage: '生态环境局', content: '环评审批、环保验收' },
      { stage: '住建局', content: '消防审核、施工许可、质安监督、竣工验收' },
      { stage: '水利局', content: '水保审批、洪评审批、水保验收' },
      { stage: '应急管理局', content: '安评备案、安全监督' }
    ]
  },
  {
    id: 'party-grid',
    name: '电网方',
    type: 'grid',
    responsibilities: [
      { stage: '接入系统评审', content: '负责接入系统方案评审、出具评审意见' },
      { stage: '并网批复', content: '出具并网原则意见函、接入系统批复' },
      { stage: '间隔扩建', content: '负责变电站间隔扩建设计审查和施工' },
      { stage: '技术监督', content: '负责并网前技术监督验收' },
      { stage: '并网验收', content: '负责并网前整体验收' },
      { stage: '调度管理', content: '负责调度命名、保护定值、调管范围划分' },
      { stage: '协议签订', content: '负责签订并网调度协议、购售电合同' },
      { stage: '电费结算', content: '负责上网电量计量、电费结算' }
    ]
  },
  {
    id: 'party-design',
    name: '设计院',
    type: 'design',
    responsibilities: [
      { stage: '可研编制', content: '编制项目可行性研究报告' },
      { stage: '接入系统设计', content: '编制电力接入系统设计方案、电能质量专题报告' },
      { stage: '外线可研', content: '编制外线可研报告、核准申请报告' },
      { stage: '勘察设计', content: '编制地勘报告、施工图设计' },
      { stage: '竣工图编制', content: '编制项目竣工图' },
      { stage: '技术交底', content: '负责设计交底、图纸会审' },
      { stage: '设计变更', content: '负责设计变更和现场技术服务' },
      { stage: '质量责任', content: '对设计质量承担终身责任' }
    ]
  },
  {
    id: 'party-third',
    name: '第三方',
    type: 'third',
    responsibilities: [
      { stage: '环评机构', content: '编制环境影响评价报告' },
      { stage: '安评机构', content: '编制安全预评价、验收评价报告' },
      { stage: '水保机构', content: '编制水土保持方案、验收报告' },
      { stage: '地灾评估机构', content: '编制地质灾害危险性评估报告' },
      { stage: '涉网试验机构', content: '完成AGC/AVC、电能质量、故障穿越等涉网试验' },
      { stage: '监理单位', content: '负责工程施工监理、质量控制' },
      { stage: '检测单位', content: '负责设备检测、工程检测' },
      { stage: '审图机构', content: '负责施工图审查' }
    ]
  }
];

export const keyPoints = {
  siteSelection: [
    '优先选择220kV及以上变电站接入，确保有足够空余间隔',
    '送出线路尽量架空，控制在5公里以内',
    '避免跨越高速、国道、铁路、河道，降低协调难度和成本',
    '确认土地在"三区三线"范围内，确保可开发利用',
    '核实土地性质为工业用地或公用设施用地，容积率1.0以下',
    '确认无军事设施、文物遗址、生态红线、基本农田等限制'
  ],
  gridConnection: [
    '尽早启动接入系统设计，与电网公司保持密切沟通',
    '接入系统评审前完成可研评审和纳规（如需）',
    '外线路径方案需经属地政府确认后再开展详细勘察',
    '外线核准需提前准备社会稳定风险评估报告'
  ],
  landAcquisition: [
    '提前获取CA证书，确保可参与网上挂牌交易',
    '保证金需提前缴纳，避免错过交易时间',
    '在当地开通基本户，便于缴纳土地尾款和税费',
    '签订出让合同后30日内缴清成交价款'
  ],
  construction: [
    '提前1个月通知责任单位准备质安监督申报资料',
    '储能场区500kWh以上需申报特殊工程消防设计审核',
    '省外企业需在广东省建设行业数据开放平台备案',
    '总包单位需落实工伤保险、安全责任险和"两制"材料'
  ],
  gridAcceptance: [
    '涉网试验需在并网前完成，包括AGC/AVC、电能质量、故障穿越等',
    '消防验收、环保验收、水保验收等专项验收需提前规划',
    '电网公司技术监督验收需提前预约，合理安排时间',
    '保护定值、调度命名、调管范围需提前与调度部门沟通确认',
    '购售电合同、并网调度协议需在并网前签订完成'
  ]
};
