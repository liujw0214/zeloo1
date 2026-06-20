import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Share2, 
  Filter, 
  ChevronRight, 
  PlusCircle, 
  X, 
  RefreshCw, 
  Zap,
  HelpCircle,
  Database,
  BrainCircuit,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VaexNode, AssociatedEntity } from '../types';

interface VaexProps {
  stats: {
    nodeCount: number;
    activeConnections: number;
  };
  setStats: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: string;
}

export default function VaexView({ stats, setStats, searchQuery }: VaexProps) {
  // Preset list of cognitive nodes in state
  const [nodes, setNodes] = useState<VaexNode[]>([
    {
      id: 'VAEX_CORE_PRIME',
      label: 'VAEX CORE PRIME',
      group: 'core',
      description: '神经枢纽核心主节点，负责管理全系统所有短期与长期记忆块的并发调度。支持自学习动态拓扑剪枝。',
      stability: 99.8,
      cognition: 95.0,
      x: 350,
      y: 250,
      r: 14,
      connections: ['Memory_Fragment_091', 'User_Entity_Theta', 'Protocol_Alpha']
    },
    {
      id: 'Memory_Fragment_091',
      label: 'Memory_Fragment_091',
      group: 'memory',
      description: '该节点包含2026年Q2（最新同步）期间关于自主神经系统的模拟演化数据。关联权重高，显示出强认知的强耦合关系。',
      stability: 98.4,
      cognition: 82.1,
      x: 520,
      y: 340,
      r: 8,
      connections: ['VAEX_CORE_PRIME']
    },
    {
      id: 'User_Entity_Theta',
      label: 'User_Entity_Theta',
      group: 'user',
      description: '深度学习授权账户383248258的自适应记忆层，包含多维度系统级调试和高级运维交互轨迹。',
      stability: 96.1,
      cognition: 88.5,
      x: 210,
      y: 180,
      r: 8,
      connections: ['VAEX_CORE_PRIME']
    },
    {
      id: 'Protocol_Alpha',
      label: 'Protocol_Alpha',
      group: 'logic',
      description: '全系统灾备与安全连接逻辑序列。如果发生深度认知漂移或阻抗冲突，负责平滑隔离神经微区。',
      stability: 94.7,
      cognition: 74.2,
      x: 580,
      y: 190,
      r: 9,
      connections: ['VAEX_CORE_PRIME']
    },
    {
      id: 'VAEX-77-DELTA',
      label: '深度学习记忆碎片 (VAEX-77-DELTA)',
      group: 'memory',
      description: '由于数据膨胀引发的隔离缓存微区。存放着多轮高阶神经网络在不确定性场景下的博弈矩阵。',
      stability: 97.2,
      cognition: 81.3,
      x: 330,
      y: 120,
      r: 7,
      connections: ['VAEX_CORE_PRIME', 'Protocol_Alpha']
    }
  ]);

  // Selected node state
  const [selectedNodeId, setSelectedNodeId] = useState<string>('Memory_Fragment_091');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // New Node Form
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodeGroup, setNewNodeGroup] = useState<'memory' | 'logic' | 'breakpoint' | 'user'>('memory');
  const [newNodeStability, setNewNodeStability] = useState(90);
  const [newNodeCognition, setNewNodeCognition] = useState(85);

  const [isRestructuring, setIsRestructuring] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Associated Entities preset
  const associatedEntitiesPresets: Record<string, AssociatedEntity[]> = {
    'VAEX_CORE_PRIME': [
      { name: 'Neural_Path_04', type: 'psychology', strength: 0.99 },
      { name: 'Logic_Bridge_Gamma', type: 'hub', strength: 0.88 },
      { name: 'LTM_Storage_Block', type: 'database', strength: 0.95 }
    ],
    'Memory_Fragment_091': [
      { name: 'Neural_Path_04', type: 'psychology', strength: 0.95 },
      { name: 'LTM_Storage_Block', type: 'database', strength: 0.72 },
      { name: 'Logic_Bridge_Gamma', type: 'hub', strength: 0.68 }
    ],
    'User_Entity_Theta': [
      { name: 'Neural_Path_04', type: 'psychology', strength: 0.85 },
      { name: 'Logic_Bridge_Gamma', type: 'hub', strength: 0.92 }
    ],
    'Protocol_Alpha': [
      { name: 'Logic_Bridge_Gamma', type: 'hub', strength: 0.90 },
      { name: 'LTM_Storage_Block', type: 'database', strength: 0.65 }
    ],
    'VAEX-77-DELTA': [
      { name: 'Neural_Path_04', type: 'psychology', strength: 0.77 },
      { name: 'Logic_Bridge_Gamma', type: 'hub', strength: 0.61 }
    ]
  };

  const getActiveNode = (): VaexNode => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  };

  // Canvas Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // only drag on canvas trigger, not children
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-container') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const cleanId = newNodeName.toUpperCase().replace(/\s+/g, '_');
    const created: VaexNode = {
      id: cleanId,
      label: newNodeName,
      group: newNodeGroup,
      description: newNodeDesc || '通过控制平面动态加载的记忆拓扑结构层。包含自主优化数据。',
      stability: parseFloat(newNodeStability.toFixed(1)),
      cognition: parseFloat(newNodeCognition.toFixed(1)),
      x: 300 + Math.random() * 200,
      y: 150 + Math.random() * 150,
      r: 8,
      connections: ['VAEX_CORE_PRIME']
    };

    setNodes(prev => [...prev, created]);
    setSelectedNodeId(cleanId);
    setShowAddModal(false);
    
    // Increment global nodes stats
    setStats((prev: any) => ({
      ...prev,
      nodeCount: prev.nodeCount + 1,
      activeConnections: prev.activeConnections + 2
    }));

    // Clear form
    setNewNodeName('');
    setNewNodeDesc('');
    setNewNodeStability(95);
    setNewNodeCognition(80);
    
    alert(`节点 ${newNodeName} 注入成功，链接 VAEX_CORE_PRIME 已生成。`);
  };

  const runRestructure = () => {
    setIsRestructuring(true);
    setTimeout(() => {
      setIsRestructuring(false);
      // Randomly update stability & cognition a bit
      const active = getActiveNode();
      setNodes(prev => prev.map(n => {
        if (n.id === active.id) {
          return {
            ...n,
            stability: Math.min(100, parseFloat((n.stability + (Math.random() * 1.5 - 0.5)).toFixed(1))),
            cognition: Math.min(100, parseFloat((n.cognition + (Math.random() * 2 - 0.5)).toFixed(1)))
          };
        }
        return n;
      }));
      // trigger small connection multiplier
      setStats((prev: any) => ({
        ...prev,
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 5 + 1)
      }));
      alert(`节点 ${active.label} 重构与能量对齐已执行完毕。神经网络稳定性提升。`);
    }, 1500);
  };

  const filteredNodes = nodes.filter(n => {
    // Category Filter
    if (activeCategoryFilter !== 'all') {
      if (activeCategoryFilter === 'memory' && n.group !== 'memory') return false;
      if (activeCategoryFilter === 'logic' && n.group !== 'logic') return false;
      if (activeCategoryFilter === 'breakpoint' && n.group !== 'breakpoint') return false;
      if (activeCategoryFilter === 'user' && n.group !== 'user' && n.group !== 'core') return false;
    }
    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
    }
    return true;
  });

  const getGroupColor = (group: string, isActive: boolean) => {
    if (group === 'core') return isActive ? 'fill-secondary' : 'fill-secondary-container';
    if (group === 'memory') return isActive ? 'fill-primary' : 'fill-primary/60';
    if (group === 'logic') return isActive ? 'fill-tertiary shadow-[0_0_8px_#4edea3]' : 'fill-tertiary-container/80';
    return 'fill-outline-variant';
  };

  const activeNode = getActiveNode();

  return (
    <div className="relative w-full h-[calc(100vh-140px)] select-none">
      
      {/* 2D Canvas Graph Visualization Engine */}
      <div 
        id="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`absolute inset-0 z-10 overflow-hidden text-clip rounded-xl cursor-grab ${isDraggingCanvas ? 'cursor-grabbing' : ''}`}
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1f2e 0%, #10131b 100%)'
        }}
      >
        <svg 
          className="w-full h-full pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
            transformOrigin: '50% 50%',
            transition: isDraggingCanvas ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Edge connections */}
          {nodes.map((node) => {
            return node.connections.map((targetId, idx) => {
              const targetNode = nodes.find(n => n.id === targetId);
              if (!targetNode) return null;
              return (
                <line 
                  key={`${node.id}-${targetId}-${idx}`}
                  x1={node.x} 
                  y1={node.y} 
                  x2={targetNode.x} 
                  y2={targetNode.y}
                  stroke="rgba(124, 3, 211, 0.25)" 
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              );
            });
          })}

          {/* Render program Nodes */}
          {filteredNodes.map((n) => {
            const isSelected = n.id === selectedNodeId;
            return (
              <g 
                key={n.id}
                className="cursor-pointer pointer-events-auto group"
                transform={`translate(${n.x}, ${n.y})`}
                onClick={() => setSelectedNodeId(n.id)}
              >
                {/* Radial Glow on select */}
                {isSelected ? (
                  <>
                    <circle className="fill-none stroke-secondary/40 animate-ping" r={n.r + 8} strokeWidth="1" />
                    <circle className="fill-none stroke-secondary" r={n.r + 4} strokeWidth="1.5" />
                  </>
                ) : (
                  <circle className="fill-none stroke-outline/20 group-hover:stroke-primary/40 transition-all duration-300" r={n.r + 4} strokeWidth="1" />
                )}

                <circle 
                  className={`transition-all duration-300 ${getGroupColor(n.group, isSelected)}`} 
                  r={n.r} 
                />

                {/* Text Labels */}
                <text 
                  className={`font-mono text-[9px] select-none pointer-events-none transition-colors duration-300 font-bold
                    ${isSelected ? 'fill-secondary' : 'fill-on-surface-variant group-hover:fill-on-surface'}`}
                  dy={n.r + 14} 
                  textAnchor="middle"
                >
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic stars on background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
      </div>

      {/* Floating UI Overlays: Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-4">
        <div className="glass-panel p-1 rounded-xl flex flex-col gap-1.5 shadow-xl border-white/5">
          <button 
            onClick={() => setZoomScale(prev => Math.min(prev + 0.1, 1.8))}
            className="p-2 hover:bg-primary-container/20 hover:text-primary rounded-lg transition-colors group text-outline-variant outline-none"
            title="放大 (ZOOM IN)"
          >
            <ZoomIn className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setZoomScale(prev => Math.max(prev - 0.1, 0.6))}
            className="p-2 hover:bg-primary-container/20 hover:text-primary rounded-lg transition-colors group text-outline-variant outline-none"
            title="缩小 (ZOOM OUT)"
          >
            <ZoomOut className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="h-px bg-white/10 mx-2" />
          
          <button 
            onClick={() => { setZoomScale(1.0); setPanOffset({ x: 0, y: 0 }); }}
            className="p-2 hover:bg-primary-container/20 hover:text-primary rounded-lg transition-colors group text-outline-variant outline-none"
            title="还原视图 (RESET CANVAS)"
          >
            <Maximize className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={() => alert(`Synchronized: ${nodes.length} nodes connected successfully over TriBrain protocol.`)}
            className="p-2 hover:bg-primary-container/20 hover:text-primary rounded-lg transition-colors group text-outline-variant outline-none"
            title="网络分享 (SHARE STATUS)"
          >
            <Share2 className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Local node statistics readout */}
        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-4 text-xs font-mono border-white/5 shadow-xl">
          <span className="text-on-surface-variant flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            节点总数: <span className="text-tertiary font-bold">{stats.nodeCount.toLocaleString()}</span>
          </span>
          <span className="text-outline-variant">|</span>
          <span className="text-on-surface-variant flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            活跃连接: <span className="text-primary font-bold">{stats.activeConnections.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Upper Category Filters (Contextual overlay bar) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass-panel px-4 py-2 rounded-full flex items-center gap-4 min-w-[500px] border-white/10 shadow-2xl justify-between">
        <div className="flex items-center gap-2 text-secondary shrink-0">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase font-mono">图谱分类过滤</span>
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: '所有类别' },
            { id: 'memory', label: '记忆单元' },
            { id: 'logic', label: '逻辑实体' },
            { id: 'breakpoint', label: '异常断点' }
          ].map((cat) => {
            const isSelected = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-300 outline-none cursor-pointer
                  ${isSelected 
                    ? 'bg-secondary-container/40 border border-secondary/50 text-secondary font-bold' 
                    : 'bg-surface-variant/40 border border-white/5 text-on-surface-variant hover:border-primary/50 text-[11px]'}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => {
            alert("高级滤波器选项已载入，支持自适应激活权重切分。");
          }}
          className="flex items-center gap-1.5 text-primary text-[11px] font-bold hover:glow-sm transition-all shrink-0 cursor-pointer outline-none"
        >
          <span>高级筛选</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Side Drawer: Selected Node Details */}
      <AnimatePresence>
        <motion.aside 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", stiffness: 220, damping: 25 }}
          className="absolute right-0 top-0 bottom-0 w-80 glass-panel border-l border-white/10 z-30 overflow-y-auto"
        >
          <div className="p-5 space-y-6">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="font-sans font-bold text-lg text-primary tracking-tight select-none flex items-center gap-1.5">
                <BrainCircuit className="w-5 h-5 text-secondary animate-pulse" />
                节点详情
              </h2>
              <button 
                onClick={() => alert("请在主背景画布上点击选择其他神经元节点来查看详细认知属性。")}
                className="p-1 text-outline hover:text-on-surface hover:bg-white/5 rounded-md transition-colors outline-none"
                title="节点系统信息"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Core Node Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#7c03d3]" />
                <span className="font-mono text-xs text-secondary tracking-widest uppercase font-bold">
                  ID: {activeNode.id}
                </span>
              </div>
              <h3 className="font-sans font-extrabold text-lg text-on-surface mb-1">
                {activeNode.group === 'core' ? '核心枢纽 (Hub)' : activeNode.group === 'memory' ? '深度学习记忆碎片' : '神经网络策略块'}
              </h3>
              <p className="text-on-surface-variant text-xs leading-relaxed font-sans">
                {activeNode.description}
              </p>
            </div>

            {/* Active Node Progress Stats (luminous cyberpunk effect) */}
            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline text-[11px] uppercase tracking-wider font-medium">激活稳定性</span>
                  <span className="font-bold text-tertiary">{activeNode.stability}%</span>
                </div>
                <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeNode.stability}%` }}
                    className="h-full bg-tertiary shadow-[0_0_10px_#4edea3]"
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-outline text-[11px] uppercase tracking-wider font-medium">认知相关性</span>
                  <span className="font-bold text-primary">{activeNode.cognition}%</span>
                </div>
                <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeNode.cognition}%` }}
                    className="h-full bg-primary shadow-[0_0_10px_#afc6ff]"
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>

            {/* Associated Entities List */}
            <div className="space-y-3 pt-4">
              <h4 className="font-mono text-xs text-outline-variant font-bold mb-2 border-b border-white/5 pb-1 uppercase tracking-wider">
                关联实体与神经网络邻近度 / Inter-mesh Entities
              </h4>
              <div className="space-y-2">
                {(associatedEntitiesPresets[activeNode.id] || associatedEntitiesPresets['Memory_Fragment_091']).map((ent, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      alert(`正在追踪内部相关关联结构: ${ent.name} [强度: ${ent.strength}]`);
                    }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center text-primary group-hover:text-secondary group-hover:bg-primary-container/20 transition-all">
                      {idx === 0 ? <PlusCircle className="w-4 h-4 text-primary" /> : idx === 1 ? <Database className="w-4 h-4 text-tertiary" /> : <Workflow className="w-4 h-4 text-secondary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{ent.name}</p>
                      <p className="text-[10px] text-outline font-mono">强度: {ent.strength}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reconstruct Control Trigger */}
            <div className="pt-2">
              <button 
                onClick={runRestructure}
                disabled={isRestructuring}
                className="w-full py-3 rounded-lg border border-secondary text-secondary hover:text-on-secondary hover:bg-secondary transition-all font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {isRestructuring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-secondary" />
                    <span>自动重构与能隙对齐中...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-secondary" />
                    <span>对齐与重构该节点 (Restructure Node)</span>
                  </>
                )}
              </button>
            </div>
            
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Floating Action Button (FAB) at bottom */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-primary hover:bg-primary-container text-on-primary px-8 py-3 rounded-full flex items-center gap-2 font-bold text-xs shadow-lg glow-primary active:scale-95 transition-all outline-none cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        <span>安全注入新记忆节点 (New Node)</span>
      </button>

      {/* Show Add Node Modal overlay */}
      <AnimatePresence>
        {showAddModal && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel-heavy p-6 rounded-xl max-w-md w-full border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-mono">
                  深空神经节点特征注入器 (NODE INJECTOR)
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-white/5 rounded-md text-outline hover:text-on-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNode} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">节点识别符 (Node ID / Name)</label>
                  <input 
                    type="text" 
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    placeholder="例如: User_Session_Matrix"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">节点类别 (Class Group)</label>
                  <select 
                    value={newNodeGroup}
                    onChange={(e: any) => setNewNodeGroup(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface"
                  >
                    <option value="memory">记忆单元 (Memory segment)</option>
                    <option value="logic">逻辑序列 (Logic protocol)</option>
                    <option value="breakpoint">异常断点 (Breakpoint trap)</option>
                    <option value="user">调试实体 (Admin terminal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">节点长短记忆演化说明 (Description)</label>
                  <textarea 
                    value={newNodeDesc}
                    onChange={(e) => setNewNodeDesc(e.target.value)}
                    placeholder="输入数据节点的背景说明描述..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 h-20 outline-none focus:border-primary text-on-surface resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-outline uppercase text-[10px]">稳定性 ({newNodeStability}%)</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={newNodeStability}
                      onChange={(e) => setNewNodeStability(parseInt(e.target.value))}
                      className="w-full accent-tertiary cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-outline uppercase text-[10px]">相关性 ({newNodeCognition}%)</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={newNodeCognition}
                      onChange={(e) => setNewNodeCognition(parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg glow-primary hover:bg-primary-container transition-all text-xs"
                  >
                    安全注入全景网络 (Inject Node)
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
