import React from 'react';
import { Settings, Shield, Sliders, Volume2, Database, Power, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsProps {
  systemOnline: boolean;
  setSystemOnline: (online: boolean) => void;
  systemLatency: number;
  setSystemLatency: (latency: number) => void;
  mode: 'standard' | 'overclocked' | 'stealth';
  setMode: (mode: 'standard' | 'overclocked' | 'stealth') => void;
  stats: any;
  setStats: any;
}

export default function SettingsView({
  systemOnline,
  setSystemOnline,
  systemLatency,
  setSystemLatency,
  mode,
  setMode,
  stats,
  setStats
}: SettingsProps) {
  
  const handleReboot = () => {
    if (confirm("重启神经计算引擎？这会清除部分瞬态会话并对齐网络延迟。")) {
      setSystemOnline(false);
      setTimeout(() => {
        setSystemOnline(true);
        setSystemLatency(12);
        setStats((prev: any) => ({
          ...prev,
          reqPerSecond: 1204
        }));
        alert("系统引擎重启就绪。延迟对齐完毕。");
      }, 1000);
    }
  };

  const handleOverclockToggle = () => {
    if (mode !== 'overclocked') {
      setMode('overclocked');
      setSystemLatency(6);
      setStats((prev: any) => ({
        ...prev,
        reqPerSecond: 1650
      }));
      alert("[警告] 系统已切换至 OVERCLOCKED 超频模式。网络吞吐大幅度提升，注意散热指数与认知漂移值。");
    } else {
      setMode('standard');
      setSystemLatency(24);
      setStats((prev: any) => ({
        ...prev,
        reqPerSecond: 1204
      }));
      alert("系统已恢复至常用标准工作模式。");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-xs font-mono select-none"
    >
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-extrabold text-on-surface font-sans flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary" />
          系统引擎参数配置 (Settings)
        </h2>
        <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
          调整系统反应能效等级、配置网关阻抗阻尼、并执行核心逻辑层校准。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hardware Control block */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-primary pb-2 border-b border-white/5">
            <Sliders className="w-4 h-4" />
            <h3 className="font-sans font-bold text-sm text-on-surface">动力层调平 (Performance Level)</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-outline">系统反应延迟 (System Latency)</span>
                <span className="text-primary font-bold">{systemLatency} ms</span>
              </div>
              <input 
                type="range"
                min="4"
                max="240"
                value={systemLatency}
                onChange={(e) => setSystemLatency(parseInt(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <p className="text-[10px] text-outline-variant max-w-sm">值越小代表物理通道刷新率越高；在多线程并发场景下会略微加重系统 CPU 开负荷。</p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-outline">工作状态选择 Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: '标准模式', desc: '延迟 24ms 正常散热' },
                  { id: 'overclocked', label: '超频模式', desc: '超强吞吐 量子失稳' },
                  { id: 'stealth', label: '隐密模式', desc: '数据审计 日志不上报' }
                ].map((m) => {
                  const isSel = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMode(m.id as any);
                        if (m.id === 'overclocked') setSystemLatency(8);
                        if (m.id === 'stealth') setSystemLatency(35);
                      }}
                      className={`p-3.5 rounded-lg border text-left flex flex-col justify-between cursor-pointer outline-none transition-all
                        ${isSel 
                          ? 'bg-secondary-container/20 border-secondary text-secondary glow-purple' 
                          : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/10'}`}
                    >
                      <span className="font-bold text-xs">{m.label}</span>
                      <span className="text-[9px] text-outline-variant mt-1.5 leading-tight">{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Action utilities */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-tertiary pb-2 border-b border-white/5">
            <Shield className="w-4 h-4" />
            <h3 className="font-sans font-bold text-sm text-on-surface">安全网闸与引擎维护</h3>
          </div>

          <div className="space-y-4.5">
            <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-lg border border-white/5">
              <div>
                <div className="font-bold text-xs text-on-surface">系统挂起点 (Suspend Engine)</div>
                <div className="text-[10px] text-outline-variant mt-1">挂起当前所有活跃的熊猫智能实体和推理。</div>
              </div>
              <button 
                onClick={() => setSystemOnline(!systemOnline)}
                className={`py-1.5 px-3 rounded text-[10px] uppercase font-bold tracking-wider outline-none cursor-pointer transition-all
                  ${systemOnline ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-outline'}`}
              >
                {systemOnline ? '运行中' : '已挂起'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-lg border border-white/5">
              <div>
                <div className="font-bold text-xs text-on-surface">系统硬重置 (Engine Cold Reboot)</div>
                <div className="text-[10px] text-outline-variant mt-1">清空瞬时会话缓存，重新校准时钟。</div>
              </div>
              <button 
                onClick={handleReboot}
                className="py-1.5 px-3 bg-error text-on-error hover:bg-error-container hover:text-on-error-container hover:shadow-lg transition-all rounded text-[10px] uppercase font-bold tracking-wider outline-none cursor-pointer flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>立即重启</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-lg border border-white/5">
              <div>
                <div className="font-bold text-xs text-on-surface">高热告警 (Cooling system check)</div>
                <div className="text-[10px] text-outline-variant mt-1">开启声音蜂鸣，检测异常发热区域。</div>
              </div>
              <button 
                onClick={() => handleOverclockToggle()}
                className={`py-1.5 px-3 font-bold rounded text-[10px] uppercase outline-none cursor-pointer transition-all
                  ${mode === 'overclocked' ? 'bg-error text-on-error' : 'border border-white/10 hover:border-white/25 text-on-surface-variant'}`}
              >
                {mode === 'overclocked' ? '超频开启中' : '标准功率模式'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
