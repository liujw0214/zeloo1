import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Workflow, 
  Play, 
  CheckCircle, 
  AlertOctagon, 
  Settings, 
  Activity, 
  ZoomIn, 
  RefreshCw, 
  Layers, 
  UserPlus, 
  HelpCircle,
  Clock,
  ArrowUpRight,
  Database,
  Activity as ActivityIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PandaAgent, OfficeEvent } from '../types';

interface HubProps {
  stats: {
    agentCount: number;
    taskPercent: number;
  };
  setStats: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: string;
}

export default function HubMonitorView({ stats, setStats, searchQuery }: HubProps) {
  
  // Panda Agents in Digital Twin
  const [pandas, setPandas] = useState<PandaAgent[]>([
    { id: 'panda-1', name: 'Panda-A721', status: 'syncing', zone: 'Zone: VAEX Core Node', xOffset: -120, yOffset: -50 },
    { id: 'panda-2', name: 'Panda-Alpha', status: 'querying', zone: 'Zone: Hermes Lib Node', xOffset: 120, yOffset: 60 }
  ]);

  // Office Event logs
  const [events, setEvents] = useState<OfficeEvent[]>([
    { id: 'evt-1', time: '14:22', title: 'Neural Link Established: Panda-A721 ↔ Core', type: 'primary' },
    { id: 'evt-2', time: '14:21', title: 'Memory Synced: Hermes Library repository updated.', type: 'secondary' },
    { id: 'evt-3', time: '14:21', title: 'Resource Scaled: Inference Hub capacity +15%.', type: 'tertiary' },
    { id: 'evt-4', time: '14:20', title: 'Security Protocol: Node Collision Resolved.', type: 'error' }
  ]);

  // Tasks
  const [tasks, setTasks] = useState([
    { id: 'task-1', name: '#982 Neural Mesh Build', progress: 65, assign: 'Panda-A721', priority: 'Critical' },
    { id: 'task-2', name: '#983 Data Vault Audit', progress: 0, assign: 'Panda-Alpha', priority: 'Normal' }
  ]);

  const [isometricRotation, setIsometricRotation] = useState<number>(0); // Rotation angle simulation
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [activeLayers, setActiveLayers] = useState<boolean>(true);
  const [showAddPandaModal, setShowAddPandaModal] = useState<boolean>(false);

  // Form parameters
  const [newPandaName, setNewPandaName] = useState('');
  const [newPandaStatus, setNewPandaStatus] = useState<'syncing' | 'querying' | 'idle'>('syncing');

  // Background random simulator for office logs & progress loops
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment task 1 progress slightly
      setTasks(prev => prev.map(t => {
        if (t.id === 'task-1' && t.progress < 100) {
          const nextProg = t.progress + Math.floor(Math.random() * 4) + 1;
          return { ...t, progress: Math.min(100, nextProg) };
        }
        return t;
      }));

      // Occasionally add random logs
      const sampleLogs = [
        'Cognitive Drift Alignment validated in sector 9.',
        'Data stream integrity test complete on channel B.',
        'Panda node localized inside cluster boundaries.',
        'Core power redistribution successfully synchronized.'
      ];
      
      const rightNow = new Date();
      const timeStr = `${rightNow.getHours().toString().padStart(2, '0')}:${rightNow.getMinutes().toString().padStart(2, '0')}`;
      
      const newEvt: OfficeEvent = {
        id: `evt-${Date.now()}`,
        time: timeStr,
        title: sampleLogs[Math.floor(Math.random() * sampleLogs.length)],
        type: Math.random() > 0.5 ? 'primary' : 'secondary'
      };

      setEvents(prev => [newEvt, ...prev.slice(0, 10)]);

    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleAddNewPanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPandaName.trim()) return;

    const created: PandaAgent = {
      id: `panda-${Date.now()}`,
      name: newPandaName.startsWith('Panda-') ? newPandaName : `Panda-${newPandaName}`,
      status: newPandaStatus,
      zone: newPandaStatus === 'syncing' ? 'Zone: VAEX Core Node' : 'Zone: Hermes Lib Node',
      xOffset: Math.floor(Math.random() * 140 - 70),
      yOffset: Math.floor(Math.random() * 100 - 50)
    };

    setPandas(prev => [...prev, created]);
    setShowAddPandaModal(false);
    setNewPandaName('');
    
    // adjust parent count metrics
    setStats((prev: any) => ({
      ...prev,
      agentCount: prev.agentCount + 1
    }));

    // Trigger log entry
    const rightNow = new Date();
    const timeStr = `${rightNow.getHours().toString().padStart(2, '0')}:${rightNow.getMinutes().toString().padStart(2, '0')}`;
    const newLog: OfficeEvent = {
      id: `evt-${Date.now()}`,
      time: timeStr,
      title: `Office Node Linked: ${created.name} loaded successfully.`,
      type: 'tertiary'
    };
    setEvents(prev => [newLog, ...prev]);

    alert(`智能孪生熊猫 ${created.name} 已编排至虚拟办公室，运行管道处于 ${newPandaStatus} 态。`);
  };

  const filteredPandas = pandas.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.status.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 font-mono text-xs select-none h-[calc(100vh-140px)] overflow-hidden flex flex-col relative">
      
      {/* Title */}
      <div className="flex flex-col shrink-0">
        <h1 className="font-sans font-extrabold text-xl text-on-surface flex items-center gap-2">
          <Tv className="w-5 h-5 text-primary animate-pulse" />
          数字孪生虚拟办公室 | <span className="font-light opacity-65">高仿真监控沙箱</span>
        </h1>
        <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mt-1">
          Real-time Digital Twin Simulation • Level 3 Cybernetic Mesh
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 items-stretch relative pb-4">
        
        {/* Isometric view viewport Background Layer */}
        <div className="absolute inset-0 z-0 bg-surface-container-lowest overflow-hidden rounded-xl border border-white/5 shadow-inner">
          <div className="absolute inset-0 isometric-grid opacity-15 pointer-events-none" />
          
          {/* Spatial Rendering Stage (Centered layout based on perspective) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-[1000px] h-[650px] relative transition-transform duration-500 ease-out"
              style={{
                transform: `rotateX(45deg) rotateZ(${-45 + isometricRotation}deg) scale(${zoomLevel})`,
                transformStyle: 'preserve-3d'
              }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-35">
                {/* Visual spatial laser links */}
                <path d="M250,220 L500,450" fill="none" stroke="#528dff" strokeWidth="1.5" strokeDasharray="8 5" className="animate-pulse" />
                <path d="M750,550 L520,440" fill="none" stroke="#ddb8ff" strokeWidth="1" strokeDasharray="4 4" />
                {activeLayers && (
                  <path d="M120,400 L880,400" fill="none" stroke="rgba(78, 222, 163, 0.2)" strokeWidth="1" />
                )}
              </svg>

              {/* Spatial Panda Nodes */}
              {filteredPandas.map((p, idx) => (
                <div 
                  key={p.id}
                  className="absolute z-10 transition-transform duration-1000 ease-in-out cursor-pointer hover:scale-110"
                  style={{
                    top: `calc(50% + ${p.yOffset}px)`,
                    left: `calc(50% + ${p.xOffset}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                  onClick={() => {
                    alert(`对齐熊猫会话: ${p.name}\n位置: ${p.zone}\n状态: ${p.status.toUpperCase()}`);
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    
                    {/* Glowing coordinate shadow beneath the panda */}
                    <div className="absolute shrink-0 w-16 h-16 bg-primary/20 blur-[28px] rounded-full -bottom-1" />
                    
                    {/* Luminous avatar frame (Using exact image URL from Image 4!) */}
                    <motion.div 
                      className="agent-avatar-sim shrink-0 w-24 h-24 relative"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5 + idx, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLsypaEeB6I_fE1-Z6cVPy2HDFe4luEtDS6LqfkWJ8AmDUdajvu5igE-whe_M_O4wkOY_L3oRSFD7M9PYVfnYZJf9XbuLyzTFKOEAZlJk1BBDXgZK6jdpRkLhv5SccDrQ_HTWKQBXk4FNTJbAtEB1GCLtDl1M-O9B3G-q5NA0wqvazpa5XkApJhAulhK41EFE0U9SeZPCTEwHRUIMUk6XsCUyPVTlAv8KVyCAB0xYz7hPqTKu5AnXScIdPXa" 
                        alt={p.name} 
                        className={`w-full h-full object-contain ${idx % 2 === 1 ? 'scale-x-[-1]' : ''}`}
                      />
                    </motion.div>

                    {/* Spatial floating identity pill */}
                    <div className="absolute -top-12 glass-panel rounded-full px-3 py-1 text-[10px] font-mono font-bold text-primary border border-primary/30 shadow-2xl whitespace-nowrap z-30 tracking-tight flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'syncing' ? 'bg-primary animate-ping' : p.status === 'querying' ? 'bg-secondary animate-pulse' : 'bg-outline'}`} />
                    </div>

                  </div>
                </div>
              ))}

              {/* Blur fields representation */}
              <div className="absolute top-[25%] left-[55%] w-48 h-48 bg-primary/5 border border-primary/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-[25%] left-[25%] w-64 h-64 bg-tertiary/5 border border-tertiary/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* LEFT: Active Agents & Task queue lists (Image 4 Left Panel overlays) */}
        <div className="col-span-4 z-10 flex flex-col gap-6 h-full p-2">
          
          {/* Active Agents list (Image 4 Left panel Widget 1) */}
          <div className="flex-1 glass-panel rounded-xl p-5 border border-white/5 flex flex-col overflow-hidden shadow-2xl">
            <h3 className="font-mono text-outline uppercase tracking-wider text-[10px] font-bold pb-2.5 border-b border-white/5 shrink-0 flex justify-between items-center">
            <span>虚拟办公室活动智能体</span>
            <span className="text-tertiary text-[9px] animate-pulse flex items-center gap-1">
              ● <span className="opacity-75">实时遥测扫描</span>
            </span>
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-3 space-y-2.5">
              {filteredPandas.map((p, idx) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    // center focus simulated
                    alert(`Selected ${p.name}. Shifting Digital Twin camera perspective.`);
                  }}
                  className={`p-3.5 rounded-lg border flex items-center gap-3.5 transition-all cursor-pointer hover:bg-white/5
                    ${p.status === 'syncing' 
                      ? 'bg-primary/10 border-primary/25' 
                      : p.status === 'querying' 
                      ? 'bg-secondary/10 border-secondary/25' 
                      : 'bg-white/5 border-white/5'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center p-0.5 overflow-hidden border
                    ${p.status === 'syncing' ? 'bg-primary/20 border-primary/30' : 'bg-secondary/20 border-secondary/30'}`}>
                    <img 
                      className="w-full h-full object-contain" 
                      src="https://lh3.googleusercontent.com/aida/AP1WRLsypaEeB6I_fE1-Z6cVPy2HDFe4luEtDS6LqfkWJ8AmDUdajvu5igE-whe_M_O4wkOY_L3oRSFD7M9PYVfnYZJf9XbuLyzTFKOEAZlJk1BBDXgZK6jdpRkLhv5SccDrQ_HTWKQBXk4FNTJbAtEB1GCLtDl1M-O9B3G-q5NA0wqvazpa5XkApJhAulhK41EFE0U9SeZPCTEwHRUIMUk6XsCUyPVTlAv8KVyCAB0xYz7hPqTKu5AnXScIdPXa" 
                      alt="avatar" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-on-surface truncate">{p.name}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold
                        ${p.status === 'syncing' ? 'bg-primary/15 text-primary border-primary/20' : 'bg-secondary/15 text-secondary border-secondary/20'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-outline-variant mt-1.5">{p.zone}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowAddPandaModal(true)}
              className="mt-3 py-2 border border-white/10 hover:border-primary/50 text-primary font-bold rounded flex items-center justify-center gap-1 cursor-pointer outline-none shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>部署新智能熊猫 (Organize Agent)</span>
            </button>
          </div>

          {/* Task Queue Checklist list (Image 4 Left panel Widget 2) */}
          <div className="flex-1 glass-panel rounded-xl p-5 border border-white/5 flex flex-col overflow-hidden shadow-2xl">
            <h3 className="font-mono text-outline uppercase tracking-wider text-[10px] font-bold pb-2.5 border-b border-white/5 shrink-0 flex justify-between items-center">
              <span>TASK QUEUE | 任务队列</span>
              <Workflow className="w-3.5 h-3.5 text-outline-variant" />
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-3 space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2.5"
                >
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-secondary-container uppercase tracking-tight font-sans text-primary">{task.name}</span>
                    <span className="text-tertiary">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full shadow-[0_0_8px_#afc6ff] transition-all duration-1000" 
                      style={{ width: `${task.progress}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-outline-variant">
                    <span>Assign: {task.assign}</span>
                    <span>Priority: {task.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Empty middle area to let spatial panda viewport render */}
        <div className="col-span-4 pointer-events-none" />

        {/* RIGHT: Metrics dials & Stream events list (Image 4 Right Panel overlays) */}
        <div className="col-span-4 z-10 flex flex-col gap-6 h-full p-2">
          
          {/* Spatial dials metrics (Image 4 Right Panel Widget 1) */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="glass-panel rounded-xl p-4 border-t-4 border-tertiary flex flex-col items-center justify-center gap-1 shadow-xl">
              <span className="text-[10px] text-outline font-bold uppercase tracking-lighter">OCCUPANCY</span>
              <h4 className="text-2xl font-bold text-tertiary font-sans">85%</h4>
              <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-tertiary h-full w-[85%] rounded-full shadow-[0_0_8px_#4edea3]" />
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-4 border-t-4 border-primary flex flex-col items-center justify-center gap-1 shadow-xl">
              <span className="text-[10px] text-outline font-bold uppercase tracking-lighter">TASK LOAD</span>
              <h4 className="text-2xl font-bold text-primary font-sans">20%</h4>
              <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-primary h-full w-[20%] rounded-full shadow-[0_0_8px_#afc6ff]" />
              </div>
            </div>
          </div>

          {/* Office dynamic Event streams (Image 4 Right Panel Widget 2) */}
          <div className="flex-1 glass-panel rounded-xl p-5 border border-white/5 overflow-hidden flex flex-col shadow-2xl">
            <h3 className="font-mono text-outline uppercase tracking-wider text-[10px] font-bold pb-2.5 border-b border-white/5 shrink-0 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-3.5 h-3.5 text-primary" />
                <span>OFFICE EVENTS | 办公事件</span>
              </div>
              <span className="bg-primary/2 w-fit text-[9px] uppercase tracking-widest text-primary font-bold px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
                Stream
              </span>
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-3 space-y-3">
              <AnimatePresence initial={false}>
                {events.map((evt) => (
                  <motion.div 
                    key={evt.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all font-sans"
                  >
                    <span className="text-secondary font-mono font-bold text-[10px] shrink-0 pt-0.5">
                      [{evt.time}]
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-on-surface-variant font-medium leading-relaxed text-[11px]">
                        {evt.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Isometric viewport floating camera control pills (Image 4 Floating Control) */}
          <div className="glass-panel p-1.5 rounded-full flex gap-3 border-white/15 shadow-2xl self-center shrink-0">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
              className="w-8 h-8 rounded-full bg-white/5 text-primary hover:bg-primary-container/20 flex items-center justify-center transition-all outline-none"
              title="View Box Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsometricRotation(prev => prev + 90)}
              className="w-8 h-8 rounded-full bg-white/5 text-primary hover:bg-primary-container/20 flex items-center justify-center transition-all outline-none"
              title="Camera Rotation 3D Angle"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveLayers(!activeLayers)}
              className={`w-8 h-8 rounded-full text-primary hover:bg-primary-container/20 flex items-center justify-center transition-all outline-none
                ${activeLayers ? 'bg-primary-container/20 text-primary border border-primary/30' : 'bg-white/5 text-outline'}`}
              title="Spatial Layer Filter"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Show Add Panda Modal overlay */}
      <AnimatePresence>
        {showAddPandaModal && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel-heavy p-6 rounded-xl max-w-sm w-full border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  编排部署孪生智能熊猫 (DEPLOY PANDA)
                </h3>
                <button 
                  onClick={() => setShowAddPandaModal(false)}
                  className="p-1 hover:bg-white/5 rounded-md text-outline hover:text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNewPanda} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">智能体熊猫代号 / 识别符 (Panda ID)</label>
                  <input 
                    type="text" 
                    value={newPandaName}
                    onChange={(e) => setNewPandaName(e.target.value)}
                    placeholder="例如: Alpha-05 or Panda-Beta"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">分配初始认知水平 (Cognitive Level)</label>
                  <select 
                    value={newPandaStatus}
                    onChange={(e: any) => setNewPandaStatus(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                  >
                    <option value="syncing">健康同步 (Syncing posture vectors)</option>
                    <option value="querying">深度查询 (Querying semantic database)</option>
                    <option value="idle">暂时休眠 (Idle diagnostic buffer)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg glow-primary hover:bg-primary-container transition-all text-xs outline-none"
                  >
                    启动Pandas空间映射 (Map Panda Agent)
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

function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
