import React, { useState } from 'react';
import { 
  Cpu, 
  Workflow, 
  Play, 
  Pause, 
  Trash2, 
  Clock, 
  Activity, 
  MessageSquare, 
  Send, 
  Terminal, 
  Plus, 
  X,
  RefreshCw,
  Search,
  Eye,
  CheckSquare,
  ChevronsRight,
  Database,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OpenClawSession, CronTask, MessageChannel } from '../types';

interface OpenClawViewProps {
  stats: {
    reqPerSecond: number;
  };
  setStats: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: string;
}

export default function OpenClawView({ stats, setStats, searchQuery }: OpenClawViewProps) {
  
  // Active session kernels
  const [sessions, setSessions] = useState<OpenClawSession[]>([
    { id: 'SPAWN-A721', name: 'SPAWN-A721', status: 'active', delay: 12, load: 75, subtext: 'ID: 0x4F...E1A', type: 'robot' },
    { id: 'SPAWN-B104', name: 'SPAWN-B104', status: 'active', delay: 24, load: 25, subtext: 'ID: 0x8C...B2F', type: 'toy' },
    { id: 'SPAWN-D902', name: 'SPAWN-D902', status: 'suspended', delay: 0, load: 0, subtext: 'ID: 0x11...88C | 挂起中', type: 'pause' },
    { id: 'SPAWN-EXEC-9', name: 'SPAWN-EXEC-9', status: 'injecting', delay: 8, load: 88, subtext: 'ID: 0x99...Z01', type: 'deployed' }
  ]);

  // Cron schedule active list
  const [cronTasks, setCronTasks] = useState<CronTask[]>([
    { id: 'task-1', name: '数据库自动索引', nextRun: '下次运行: 04:00 AM', active: true, borderType: 'primary' },
    { id: 'task-2', name: '代理健康巡检', nextRun: '下次运行: 5 分钟后', active: true, borderType: 'tertiary' }
  ]);

  // Lark/Telegram status presets
  const [channels, setChannels] = useState<MessageChannel[]>([
    { id: 'feishu', name: '飞书 (Lark)', status: 'ok', node: 'Cluster-A', latencyText: 'WebHook 节点: Cluster-A', type: 'feishu' },
    { id: 'telegram', name: 'Telegram Bot', status: 'delay', node: 'Proxy Gate x2', latencyText: '代理响应: 4500ms', type: 'telegram' }
  ]);

  const [cronPreset, setCronPreset] = useState<'hourly' | 'daily' | 'weekly' | 'custom'>('hourly');
  const [showAddSessionModal, setShowAddSessionModal] = useState<boolean>(false);
  const [showAddCronModal, setShowAddCronModal] = useState<boolean>(false);

  // Form controls
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionType, setNewSessionType] = useState<any>('robot');
  
  const [newCronName, setNewCronName] = useState('');
  const [newCronTime, setNewCronTime] = useState('每30分钟一轮');

  const handleToggleSession = (id: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'active' || s.status === 'injecting' ? 'suspended' : 'active';
        return {
          ...s,
          status: nextStatus,
          load: nextStatus === 'active' ? Math.floor(Math.random() * 60) + 15 : 0,
          delay: nextStatus === 'active' ? Math.floor(Math.random() * 20) + 4 : 0
        };
      }
      return s;
    }));
  };

  const handleDeleteSession = (id: string) => {
    if (confirm(`确认销毁子代理会话 ${id} 吗？`)) {
      setSessions(prev => prev.filter(s => s.id !== id));
      alert(`会话 ${id} 已被回收。内核能效已重算。`);
    }
  };

  const handleToggleCron = (id: string) => {
    setCronTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, active: !t.active };
      }
      return t;
    }));
  };

  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    const cleanId = newSessionName.toUpperCase().replace(/\s+/g, '-');
    const created: OpenClawSession = {
      id: cleanId,
      name: `SPAWN-${cleanId}`,
      status: 'active',
      delay: Math.floor(Math.random() * 15) + 5,
      load: Math.floor(Math.random() * 40) + 30,
      subtext: `ID: 0x${Math.floor(Math.random() * 1000).toString(16).toUpperCase()}...Z${Math.floor(Math.random() * 99)}`,
      type: newSessionType
    };

    setSessions(prev => [...prev, created]);
    setShowAddSessionModal(false);
    setNewSessionName('');
    
    // adjust requests per second bandwidth summary
    setStats((prev: any) => ({
      ...prev,
      reqPerSecond: prev.reqPerSecond + 85
    }));

    alert(`子代理会话 ${created.name} 已生成，加入当前神经网络并行管道。`);
  };

  const handleAddCronSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCronName.trim()) return;

    const created: CronTask = {
      id: `task-${Date.now()}`,
      name: newCronName,
      nextRun: `下次运行: ${newCronTime}`,
      active: true,
      borderType: Math.random() > 0.5 ? 'primary' : 'tertiary'
    };

    setCronTasks(prev => [...prev, created]);
    setShowAddCronModal(false);
    setNewCronName('');
    alert(`Cron 调度任务 ${newCronName} 配置就绪，状态：待命。`);
  };

  const filteredSessions = sessions.filter(s => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.subtext.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      
      {/* Page Description Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-on-surface font-sans flex items-center gap-2">
            <Workflow className="w-6 h-6 text-primary animate-pulse" />
            OpenClaw 主宰者管控台
          </h2>
          <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
            分布式子代理会话与自动化调度管理中心 • Parallel Kernels Supervisor
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-outline uppercase tracking-wider font-bold">实时总吞吐量</span>
          <span className="text-lg font-bold text-primary font-sans">{stats.reqPerSecond.toLocaleString()} Req/s</span>
        </div>
      </div>

      {/* Bento Grid Layout ( sessions list Left vs Scheduler/Channels Right) */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Spawn Sessions List panel (Left Grid of Image 2) */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-xl neon-border-blue overflow-hidden flex flex-col min-h-[480px]">
          
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container/50">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <span className="font-extrabold text-sm text-on-surface">Spawn 子代理会话</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded border border-primary/20 font-bold">
                活跃: {sessions.filter(s => s.status === 'active' || s.status === 'injecting').length}
              </span>
              <span className="px-2.5 py-0.5 bg-tertiary/10 text-tertiary text-[10px] rounded border border-tertiary/20 font-bold">
                就绪: 48
              </span>
              <button 
                onClick={() => setShowAddSessionModal(true)}
                className="ml-2 px-2 py-0.5 bg-primary hover:bg-primary-container text-on-primary font-bold rounded flex items-center gap-0.5 cursor-pointer outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[380px] custom-scrollbar">
            <AnimatePresence initial={false}>
              {filteredSessions.map((s) => {
                const isActive = s.status === 'active';
                const isInjecting = s.status === 'injecting';
                const isSuspended = s.status === 'suspended';

                return (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group flex items-center justify-between p-4 rounded-lg border transition-all duration-300
                      ${isInjecting 
                        ? 'bg-primary-container/10 border-primary/20 hover:bg-primary-container/15' 
                        : isSuspended 
                        ? 'bg-surface-container-low/20 border-white/5 opacity-50' 
                        : 'bg-surface-container-low/40 border-white/5 hover:bg-surface-container-highest/30'}`}
                  >
                    
                    {/* Session Name and Brand info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all
                        ${isInjecting ? 'bg-primary/20 border-primary/40 text-primary' : ''}
                        ${isActive ? 'bg-primary-container/20 border-primary/30 text-primary' : ''}
                        ${isSuspended ? 'bg-surface-variant/20 border-white/10 text-on-surface-variant' : ''}
                      `}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isSuspended ? 'text-on-surface-variant' : 'text-on-surface'}`}>{s.name}</span>
                          {isInjecting ? (
                            <span className="px-2 py-0.5 bg-tertiary/20 text-tertiary text-[9px] rounded font-mono font-bold animate-pulse">正在注入代码</span>
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-tertiary animate-pulse' : 'bg-outline-variant'}`} />
                          )}
                        </div>
                        <div className="text-[10px] text-on-surface-variant mt-1">
                          {s.subtext} {isActive && `| 延迟: ${s.delay}ms`}
                        </div>
                      </div>
                    </div>

                    {/* Progress slider computation load (Image 2) */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 px-4">
                      <div className="w-32 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.load}%` }}
                          className={`h-full rounded-full ${isInjecting ? 'bg-tertiary shadow-[0_0_8px_#4edea3]' : 'bg-primary shadow-[0_0_8px_#afc6ff]'}`}
                        />
                      </div>
                      <span className="text-[9px] text-outline uppercase font-bold tracking-wider">
                        {isInjecting ? '内存占用' : '计算负载'}: {s.load}%
                      </span>
                    </div>

                    {/* Action toggles */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleSession(s.id)}
                        className={`p-2 hover:bg-white/5 rounded-lg transition-colors outline-none cursor-pointer
                          ${isSuspended ? 'text-tertiary hover:text-tertiary-container' : 'text-outline hover:text-primary'}`}
                        title={isSuspended ? "激活启动 (LAUNCH)" : "挂起挂账 (SUSPEND)"}
                      >
                        {isSuspended ? <Play className="w-4 h-4 text-tertiary" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteSession(s.id)}
                        className="p-2 text-outline hover:text-error hover:bg-white/5 rounded-lg transition-colors outline-none cursor-pointer"
                        title="销毁内核 (TERMINATE)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="p-3 bg-surface-container-lowest/80 border-t border-white/5 flex justify-center shrink-0">
            <button 
              onClick={() => alert(`当前仅列出最新活跃子会话。全部 124 个分布式进程汇报状态: 良好 (Nominal).`)}
              className="text-[10px] text-outline hover:text-primary transition-all flex items-center gap-1 cursor-pointer outline-none font-bold"
            >
              <span>查看全部 124 个会话</span>
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Stack: Cron scheduler & Lark indicators info (Right stack of Image 2) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Cron Timed scheduler (Image 2 Right Widget 1) */}
          <div className="glass-panel rounded-xl neon-border-blue p-5 space-y-4 flex flex-col">
            <div className="flex justify-between items-center bg-white/5 -m-5 p-5 border-b border-white/5 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-extrabold text-sm text-on-surface">Cron 定时任务</span>
              </div>
              <button 
                onClick={() => setShowAddCronModal(true)}
                className="text-[10px] text-primary hover:glow-sm font-bold cursor-pointer outline-none"
              >
                + 新增任务
              </button>
            </div>

            {/* Visual Selector matrix */}
            <div className="bg-background/60 p-3.5 rounded-lg border border-white/5 space-y-3 mt-4">
              <div className="flex justify-between items-center text-[10px] text-outline uppercase font-bold tracking-wider">
                <span>周期预设 Preset</span>
                <span className="text-primary font-mono">{cronPreset === 'hourly' ? '0 0 * * *' : '* * * * *'}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                {[
                  { id: 'hourly', label: '每小时' },
                  { id: 'daily', label: '每天' },
                  { id: 'weekly', label: '每周' },
                  { id: 'custom', label: '自定义' }
                ].map((item) => {
                  const isSel = cronPreset === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCronPreset(item.id as any)}
                      className={`py-1.5 px-1 rounded hover:border-primary/50 text-[10px] font-sans border cursor-pointer outline-none
                        ${isSel 
                          ? 'bg-primary/20 text-primary border-primary/40 font-bold' 
                          : 'bg-surface-variant/40 text-on-surface-variant border-white/5'}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Time matrix indicators */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between text-[9px] text-outline font-bold uppercase tracking-wider mb-1">
                  <span>分 Min</span>
                  <span>时 Hr</span>
                  <span>日 Day</span>
                  <span>月 Mon</span>
                  <span>周 Wk</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2 rounded text-xs font-mono text-primary font-bold">
                  <span>0</span>
                  <span className="text-outline-variant">/</span>
                  <span>0</span>
                  <span className="text-outline-variant">/</span>
                  <span>*</span>
                  <span className="text-outline-variant">/</span>
                  <span>*</span>
                  <span className="text-outline-variant">/</span>
                  <span>*</span>
                </div>
              </div>
            </div>

            {/* Active task list */}
            <div className="space-y-2">
              <div className="text-[10px] text-outline uppercase font-bold tracking-wider pb-1">
                活跃队列 (Active Workloads)
              </div>
              {cronTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => handleToggleCron(task.id)}
                  className={`p-3 bg-surface-container-low/40 rounded border-l-2 flex justify-between items-center cursor-pointer transition-all hover:bg-surface-container/50
                    ${task.active ? 'opacity-100 border-primary' : 'opacity-45 border-outline-variant'}`}
                >
                  <div>
                    <div className="text-xs font-bold text-on-surface">{task.name}</div>
                    <div className="text-[10px] text-outline mt-0.5">{task.nextRun}</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={task.active}
                    onChange={() => {}} // toggled by parent div
                    className={`rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer w-3.5 h-3.5`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Message Status Channels (Image 2 Right Widget 2) */}
          <div className="glass-panel rounded-xl neon-border-blue p-5 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="font-extrabold text-sm text-on-surface">消息渠道状态</span>
            </div>
            
            <div className="space-y-3">
              {channels.map((chan) => {
                const isLark = chan.type === 'feishu';
                const isOk = chan.status === 'ok';

                return (
                  <div 
                    key={chan.id}
                    onClick={() => alert(`渠道: ${chan.name}\n${chan.latencyText}\n状态: ${isOk ? '对齐正常' : '网络高延迟'}`)}
                    className="flex items-center gap-3.5 p-3 bg-surface-container-low/60 rounded-lg border border-white/5 hover:border-primary/20 cursor-pointer transition-all"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                      ${isLark 
                        ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' 
                        : 'bg-sky-500/10 border-sky-400/20 text-sky-400'}`}>
                      {isLark ? <MessageSquare className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-on-surface">{chan.name}</span>
                        <span className={`text-[10px] font-bold flex items-center gap-1
                          ${isOk ? 'text-tertiary' : 'text-error animate-pulse'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-tertiary' : 'bg-error'}`} />
                          {isOk ? '正常' : '延迟'}
                        </span>
                      </div>
                      <div className="text-[10px] text-on-surface-variant truncate mt-1">
                        {chan.latencyText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Network Storage Data Volume Graph (Image 2 Bottom Section) */}
      <div className="glass-panel rounded-xl p-5 relative overflow-hidden h-32 flex flex-col justify-between">
        <div className="relative z-10 flex flex-col justify-center h-full">
          <span className="text-[10px] text-outline uppercase font-bold tracking-wider mb-1">
            神经集群数据流 throughput
          </span>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-primary font-sans">8.4 PB</span>
            <span className="text-tertiary font-bold text-xs font-mono">+12.4% vs 上月</span>
          </div>
          <div className="mt-4 flex gap-1.5 h-6 overflow-hidden items-end">
            {[20, 45, 30, 65, 50, 80, 40, 95, 30, 60, 45, 75, 55, 90, 35, 70].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-primary/20 hover:bg-primary rounded-t transition-colors cursor-pointer"
                transition={{ delay: i * 0.02, duration: 0.6 }}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(82,141,255,0.4),transparent)]" />
      </div>

      {/* Show Add Session Modal */}
      <AnimatePresence>
        {showAddSessionModal && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel-heavy p-6 rounded-xl max-w-sm w-full border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  创建部署新智能体微内核 (SPAWN NEW KERNEL)
                </h3>
                <button 
                  onClick={() => setShowAddSessionModal(false)}
                  className="p-1 hover:bg-white/5 rounded-md text-outline hover:text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSessionSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">会话英文名称 / 识别符 (Spawn ID)</label>
                  <input 
                    type="text" 
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="例如: EXEC-12 or CORE-H4"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">智能体微内核模板选用 (Agent Kernel Template)</label>
                  <select 
                    value={newSessionType}
                    onChange={(e: any) => setNewSessionType(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                  >
                    <option value="robot">SPAWN-ROBOT-CORE</option>
                    <option value="toy">SPAWN-SMART-TOY</option>
                    <option value="deployed">SPAWN-EXEC-CODE</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg glow-primary hover:bg-primary-container transition-all text-xs outline-none"
                  >
                    分生并激活子内核会话 (Spawn Session)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Show Add Cron modal */}
      <AnimatePresence>
        {showAddCronModal && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel-heavy p-6 rounded-xl max-w-sm w-full border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  创建自动化 Cron 流水线时钟 (NEW CRON PIPELINE)
                </h3>
                <button 
                  onClick={() => setShowAddCronModal(false)}
                  className="p-1 hover:bg-white/5 rounded-md text-outline hover:text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCronSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">定时任务名称 (Cron Task Name)</label>
                  <input 
                    type="text" 
                    value={newCronName}
                    onChange={(e) => setNewCronName(e.target.value)}
                    placeholder="例如: 备份全量关联、冷热存储对齐"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">调度周期预估 / Interval</label>
                  <input 
                    type="text" 
                    value={newCronTime}
                    onChange={(e) => setNewCronTime(e.target.value)}
                    placeholder="例如: 每小时、每日Q3时、5分钟一轮"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg glow-primary hover:bg-primary-container transition-all text-xs outline-none"
                  >
                    启用任务守候机制 (Deploys Cron)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
