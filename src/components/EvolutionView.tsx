import React from 'react';
import { LineChart, Compass, GitCommit, Play, Star, Calendar, ArrowUpRight, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function EvolutionView() {
  
  const milestones = [
    { quarterly: '2026 Q2', title: '自主能隙对齐机制部署 (TriBrain Autonomy Path)', desc: '成功打通 VAEX 记忆核心主拓扑与三区熊猫代理实体的闭环动力，网络连贯指数达到 98%', state: '活跃中' },
    { quarterly: '2026 Q1', title: '分生型 Spawn 会话内核重构', desc: '支持 OpenClaw 异步向多个子进程映射独立感知决策向量。总并发带宽突破 1500 Req/s。', state: '已完成' },
    { quarterly: '2025 Q4', title: 'Hermes 智库与多 API 中继层对齐', desc: '多 LLM 提供者自动分流网关上载，包含自适应成本计算，使得运行损耗下降 34%。', state: '已完成' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-xs font-mono select-none"
    >
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-extrabold text-on-surface font-sans flex items-center gap-2">
          <LineChart className="w-5 h-5 text-tertiary" />
          Neural Core 认知演化监控 (Evolution)
        </h2>
        <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
          追踪底层动态神经网络在不确定性自博弈场景下的宏观认知演化进程。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Growth index visual graph (Col-span 8) */}
        <div className="col-span-12 md:col-span-8 glass-panel rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="font-sans font-bold text-xs text-on-surface">认知整合增长趋势 (Cogni-Net Growth Matrix)</span>
            <span className="text-tertiary font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+38.5% YoY</span>
            </span>
          </div>

          {/* Fully customized, gorgeous, animated responsive SVG growth chart */}
          <div className="h-56 w-full relative pt-4">
            
            {/* Background grid markings */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-white border-dashed w-full" />
              <div className="border-b border-white border-dashed w-full" />
              <div className="border-b border-white border-dashed w-full" />
              <div className="border-b border-white border-dashed w-full" />
            </div>

            {/* Render lines and grid bars using custom graphics */}
            <svg className="w-full h-full overflow-visible z-10 relative">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area path representing growth */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                d="M 50,180 Q 200,120 380,140 T 700,40 L 700,200 L 50,200 Z"
                fill="url(#areaGrad)"
              />

              {/* Luminous line on top of the area */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                className="stroke-tertiary"
                strokeWidth="2.5"
                fill="none"
                d="M 50,180 Q 200,120 380,140 T 700,40"
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Growth points marker labels */}
              <g className="cursor-pointer">
                <circle cx="50" cy="180" r="4.5" className="fill-background stroke-tertiary" strokeWidth="2" />
                <text x="50" y="195" className="fill-outline-variant font-mono text-[9px]" textAnchor="middle">Q3 2025</text>
                
                <circle cx="215" cy="140" r="4.5" className="fill-background stroke-tertiary" strokeWidth="2" />
                <text x="215" y="160" className="fill-outline-variant font-mono text-[9px]" textAnchor="middle">Q4 2025</text>

                <circle cx="395" cy="140" r="4.5" className="fill-background stroke-tertiary" strokeWidth="2" />
                <text x="395" y="160" className="fill-outline-variant font-mono text-[9px]" textAnchor="middle">Q1 2026</text>

                <circle cx="700" cy="40" r="5.5" className="fill-background stroke-tertiary" strokeWidth="2" />
                <text x="700" y="25" className="fill-tertiary font-bold font-mono text-[10px]" textAnchor="middle">Q2 (ACTIVE)</text>
              </g>
            </svg>

          </div>

          <div className="flex justify-between text-[10px] text-outline-variant font-bold border-t border-white/5 pt-2.5">
            <span>底数整合: Q3 2025</span>
            <span>突发演化: Q2 2026 (当前周期)</span>
          </div>
        </div>

        {/* Milestones timeline overview (Col-span 4) */}
        <div className="col-span-12 md:col-span-4 glass-panel rounded-xl p-5 space-y-4 h-full overflow-y-auto">
          <div className="flex items-center gap-2 text-secondary pb-2 border-b border-white/5">
            <Compass className="w-4 h-4" />
            <span className="font-sans font-bold text-xs text-on-surface">演化大事记 Timeline</span>
          </div>

          <div className="space-y-4">
            {milestones.map((mil, idx) => (
              <div 
                key={idx} 
                onClick={() => alert(`追踪大记事: [${mil.quarterly}] ${mil.title}`)}
                className="relative pl-5 border-l border-white/10 space-y-1 cursor-pointer hover:border-primary/50 transition-colors group"
              >
                {/* Luminous indicator dot on timeline */}
                <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full flex items-center justify-center
                  ${mil.state === '活跃中' ? 'bg-error animate-pulse' : 'bg-surface-variant'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${mil.state === '活跃中' ? 'bg-error' : 'bg-primary'}`} />
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold font-mono ${mil.state === '活跃中' ? 'text-error' : 'text-primary'}`}>
                    {mil.quarterly}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold
                    ${mil.state === '活跃中' ? 'bg-error/10 border-error/20 text-error animate-pulse' : 'bg-white/5 border-white/5 text-outline'}`}>
                    {mil.state}
                  </span>
                </div>

                <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{mil.title}</div>
                <div className="text-[10px] text-outline-variant leading-relaxed font-sans">{mil.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
