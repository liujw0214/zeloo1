import React from 'react';
import { 
  Play, 
  BrainCircuit, 
  Sparkles, 
  Wrench, 
  Activity, 
  LineChart, 
  Settings, 
  Cpu, 
  DollarSign, 
  Clock, 
  Compass, 
  ChevronRight, 
  Database,
  Unplug
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  systemOnline: boolean;
  systemLatency: number;
  stats: {
    nodeCount: number;
    activeConnections: number;
    agentCount: number;
    taskPercent: number;
    todayCost: number;
    reqPerSecond: number;
  };
}

export default function DashboardView({ 
  setActiveTab, 
  systemOnline, 
  systemLatency,
  stats 
}: DashboardViewProps) {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const summaries = [
    {
      title: 'VAEX 神经知识图谱',
      tab: 'vaex' as ActiveTab,
      desc: 'VAEX 实时的认知图谱演化、实体关系对齐与结构化节点属性配置。',
      metric: `${stats.nodeCount.toLocaleString()} 个节点`,
      tag: `${stats.activeConnections.toLocaleString()} 条活动关系对联`,
      color: 'border-secondary hover:border-secondary-container',
      icon: BrainCircuit,
      iconColor: 'text-secondary'
    },
    {
      title: 'Hermes 智库大模型网关',
      tab: 'hermes' as ActiveTab,
      desc: '多智能体分布式查询记录、各版本推理带宽以及运行成本开销综合看板。',
      metric: `$${stats.todayCost.toFixed(2)} 今日消费`,
      tag: '比昨日上涨约 12%',
      color: 'border-tertiary hover:border-tertiary-container',
      icon: Sparkles,
      iconColor: 'text-tertiary'
    },
    {
      title: 'OpenClaw 智能体分布式代理',
      tab: 'openclaw' as ActiveTab,
      desc: '微秒级多派生任务流、调度中心、以及飞书/网关自动化连接状态。',
      metric: `${stats.reqPerSecond.toLocaleString()} 次请求/秒`,
      tag: '12 个核心引擎正常运转',
      color: 'border-primary hover:border-primary-container',
      icon: Wrench,
      iconColor: 'text-primary'
    },
    {
      title: 'Hub 机械数字孪生',
      tab: 'hub_monitor' as ActiveTab,
      desc: '采用高仿真 3D 机械模型，同步实时监控实体 Panda 机器人集群物理节点。',
      metric: `${stats.agentCount} 个活动熊猫智能体`,
      tag: '100% 同步精度',
      color: 'border-outline hover:border-primary',
      icon: Activity,
      iconColor: 'text-primary'
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Banner / Welcome */}
      <motion.div 
        variants={cardVariants}
        className="glass-panel rounded-xl p-6 neon-border-blue relative overflow-hidden bg-gradient-to-br from-primary-container/10 to-transparent"
      >
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none bg-radial-gradient">
          <Database className="w-96 h-96 -mr-16 -mb-16 text-primary" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-mono rounded font-bold border border-primary/30">
              主内核系统
            </span>
            <span className="text-xs text-outline-variant font-mono">• 当前延迟: {systemLatency}ms</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
            欢迎来到神经内核总指挥官控制台
          </h2>
          <p className="text-on-surface-variant max-w-2xl text-xs leading-relaxed">
            全量监控子系统已正常部署。在3级安全防护防线的最高授权下，您可以重组、连接海量知识实体，动态触发流水线进程，记录多模型开销指标，并在数字孪生框架下实现超凡的跨端操纵权。
          </p>
          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => setActiveTab('vaex')}
              className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-lg hover:shadow-lg hover:shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>探索神经知识图谱</span>
            </button>
            <button 
              onClick={() => setActiveTab('openclaw')}
              className="px-4 py-2 border border-white/10 text-on-surface hover:bg-white/5 font-bold text-xs rounded-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-primary" />
              <span>打开智能代理服务会话</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          variants={cardVariants}
          className="glass-panel rounded-xl p-5 border-t-2 border-secondary hover:translate-y-[-2px] transition-all duration-300"
        >
          <div className="flex justify-between items-center text-outline text-xs font-mono uppercase tracking-widest mb-2">
            <span>图谱节点总数</span>
            <BrainCircuit className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-bold font-mono text-secondary">{stats.nodeCount.toLocaleString()}</div>
          <div className="text-[10px] text-on-surface-variant mt-1.5 flex justify-between">
            <span>活动关系连边</span>
            <span className="text-tertiary">{stats.activeConnections.toLocaleString()}</span>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="glass-panel rounded-xl p-5 border-t-2 border-tertiary hover:translate-y-[-2px] transition-all duration-300"
        >
          <div className="flex justify-between items-center text-outline text-xs font-mono uppercase tracking-widest mb-2">
            <span>网关实时吞吐</span>
            <Sparkles className="w-4 h-4 text-tertiary" />
          </div>
          <div className="text-2xl font-bold font-mono text-tertiary">{stats.reqPerSecond.toLocaleString()} <span className="text-xs text-outline">请求/秒</span></div>
          <div className="text-[10px] text-on-surface-variant mt-1.5 flex justify-between">
            <span>网络往返延时</span>
            <span className="text-primary">{systemLatency} ms</span>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="glass-panel rounded-xl p-5 border-t-2 border-primary hover:translate-y-[-2px] transition-all duration-300"
        >
          <div className="flex justify-between items-center text-outline text-xs font-mono uppercase tracking-widest mb-2">
            <span>今日预计开销</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-primary">${stats.todayCost.toFixed(2)}</div>
          <div className="text-[10px] text-on-surface-variant mt-1.5 flex justify-between">
            <span>对比昨日偏离值</span>
            <span className="text-tertiary">↑ 12.4%</span>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="glass-panel rounded-xl p-5 border-t-2 border-error hover:translate-y-[-2px] transition-all duration-300"
        >
          <div className="flex justify-between items-center text-outline text-xs font-mono uppercase tracking-widest mb-2">
            <span>在线机械熊猫</span>
            <Activity className="w-4 h-4 text-error" />
          </div>
          <div className="text-2xl font-bold font-mono text-error">{stats.agentCount}</div>
          <div className="text-[10px] text-on-surface-variant mt-1.5 flex justify-between">
            <span>数字孪生同步率</span>
            <span className="text-tertiary">100%</span>
          </div>
        </motion.div>
      </div>

      {/* Main Core Modules Navigator */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-lg text-on-surface text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          系统核心功能通道
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaries.map((mod, i) => {
            const ModIcon = mod.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                onClick={() => setActiveTab(mod.tab)}
                className={`glass-panel border-l-4 rounded-xl p-5 ${mod.color} cursor-pointer group active:scale-[0.99] transition-all duration-300 flex justify-between items-start`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ModIcon className={`w-5 h-5 ${mod.iconColor}`} />
                    <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {mod.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-on-surface-variant max-w-md">{mod.desc}</p>
                  
                  <div className="pt-2 flex gap-3 text-xs font-mono">
                    <span className="text-on-surface font-semibold">{mod.metric}</span>
                    <span className="text-outline-variant">|</span>
                    <span className="text-tertiary-container text-[10px] font-bold">{mod.tag}</span>
                  </div>
                </div>

                <div className="rounded-full w-8 h-8 flex items-center justify-center bg-white/5 group-hover:bg-primary-container/20 group-hover:text-primary transition-all duration-300 text-outline-variant shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic state warnings */}
      {!systemOnline && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl border border-error/20 bg-error/5 text-error flex items-center gap-3"
        >
          <Unplug className="w-5 h-5 animate-bounce" />
          <p className="text-xs font-mono">
            <strong>紧急警报:</strong> 系统主引擎当前处于离线离网状态！请点击左侧侧边栏下方的“系统激活”按钮以启动自动模拟线程，从而载入最新的运行拓扑和数字孪生遥测。
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
